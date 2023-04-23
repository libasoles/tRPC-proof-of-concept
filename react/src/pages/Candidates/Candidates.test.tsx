import { act, render, screen, waitFor, within } from '@testing-library/react';
import Candidates from './Candidates';
import { setupServer } from "msw/node";
import { handlers } from '@/mocks/trpc.handlers';
import { trpc, trpcClient, queryClient } from "@/api";
import { QueryClientProvider } from "@tanstack/react-query";
import userEvent from '@testing-library/user-event';

export const enabledColumns = {
  name: true,
  had_interview: true,
  email: false,
  reason: true,
};

export const server = setupServer(...handlers);

describe('Candidates', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());

  afterEach(() => {
    server.resetHandlers()
  });

  function renderComponent() {
    render(
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Candidates enabledColumns={enabledColumns} />
        </QueryClientProvider>
      </trpc.Provider>
    );
  }

  test('renders page components', async () => {
    renderComponent()

    const header = screen.getByRole('heading', { name: /Candidatos/i });
    const searchInput = screen.getByPlaceholderText('Buscar por nombre...');
    const onlyApprovedFilter = screen.getByRole('checkbox', { name: /Solo aprobados/i });
    const table = screen.getByRole('table');
    const content = screen.getByTestId('candidates-page');
    const pagination = within(content).queryByRole('navigation');

    expect(header).toBeInTheDocument();
    expect(searchInput).toBeInTheDocument();
    expect(onlyApprovedFilter).toBeInTheDocument();
    expect(table).toBeInTheDocument();
    expect(pagination).not.toBeInTheDocument();
  });

  test('table headers requested by user are rendered, and other headers are ignored', () => {
    renderComponent()

    const nameHeader = screen.getByRole('columnheader', { name: /Nombre/i });
    const interviewedHeader = screen.getByRole('columnheader', { name: /Fue entrevistado/i });
    const reasonHeader = screen.getByRole('columnheader', { name: /Razones/i });
    const emailHeader = screen.queryByRole('columnheader', { name: /Email/i });

    expect(nameHeader).toBeInTheDocument();
    expect(interviewedHeader).toBeInTheDocument();
    expect(reasonHeader).toBeInTheDocument();
    expect(emailHeader).not.toBeInTheDocument();
  })

  it('renders a loading message that then dissapears', async () => {
    renderComponent()

    const loading = await screen.findByText(/Cargando.../i);

    expect(loading).toBeInTheDocument();

    await waitFor(() => {
      expect(loading).not.toBeInTheDocument();
    })
  });

  it('renders 10 rows based on rows per page limit', async () => {
    renderComponent()

    const tbodyElement = await screen.findByTestId('table-body');

    await waitFor(() => {
      const rows = within(tbodyElement).getAllByRole('row');
      expect(rows).toHaveLength(10);
    })
  });

  test('filters candidates by name', async () => {
    renderComponent();
    const tbodyElement = await screen.findByTestId('table-body');
    const rows = within(tbodyElement).getAllByRole('row');

    await waitFor(() => {
      expect(rows).toHaveLength(10);
    })

    write('Armstrong')

    await waitFor(() => {
      const rows = within(tbodyElement).getAllByRole('row');
      expect(rows).toHaveLength(1);
    })

    const match = screen.getByText(/Armstrong/i);
    expect(match).toBeInTheDocument();
  });

  test('filters candidates by status', async () => {
    renderComponent();

    filterOnlyApprovedCandidates()

    await waitFor(() => {
      const tbodyElement = screen.getByTestId('table-body');
      const rows = within(tbodyElement).getAllByRole('row');
      expect(rows).toHaveLength(1);
    })

    const match = screen.getByText(/Moss/i);
    expect(match).toBeInTheDocument();
  });

  test("renders pagination when there are more than 10 rows", async () => {
    renderComponent();

    write('lots')

    const content = await screen.findByTestId('candidates-page');
    await waitFor(() => {
      const pagination = within(content).getByRole('navigation');
      expect(pagination).toBeInTheDocument();
    })
  });

  test("renders the correct number of rows when changing page", async () => {
    renderComponent();

    write('lots')

    const tbodyElement = await screen.findByTestId('table-body');
    const rows = await within(tbodyElement).findAllByRole('row');
    expect(rows).toHaveLength(10);

    navigateToPage(2)

    await waitFor(() => {
      const rows = within(tbodyElement).getAllByRole('row');
      expect(rows).toHaveLength(2);
    })
  });


  // it.only('displays an error message when the request fails', async () => {
  //   renderComponent();

  //   write('fail')

  //   await waitFor(() => {
  //     const errorMessage = screen.getByText(/Hubo un error cargando el listado/i);
  //     expect(errorMessage).toBeInTheDocument();
  //   })
  // })
})

function write(text: string) {
  const searchInput = screen.getByPlaceholderText('Buscar por nombre...');
  // eslint-disable-next-line testing-library/no-unnecessary-act
  act(() => userEvent.type(searchInput, text));
}

function navigateToPage(number: number) {
  const page = screen.getByRole('button', { name: String(number) });
  // eslint-disable-next-line testing-library/no-unnecessary-act
  act(() => userEvent.click(page));
}

function filterOnlyApprovedCandidates() {
  const statusCheckbox = screen.getByLabelText(/solo aprobados/i);
  // eslint-disable-next-line testing-library/no-unnecessary-act
  act(() => userEvent.click(statusCheckbox));
}
