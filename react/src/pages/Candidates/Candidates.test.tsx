import { act, render, screen, waitFor, within } from '@testing-library/react';
import Candidates from './Candidates';
import { setupServer } from "msw/node";
import { handlers } from '@/trpc.handlers';
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

  test('renders Candidates component', () => {
    renderComponent()

    const header = screen.getByRole('heading', { name: /Candidatos/i });

    expect(header).toBeInTheDocument();
  });

  test('table headers are rendered', () => {
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

  it('renders a loading state (and then dissapears)', async () => {
    renderComponent()

    const loading = screen.getByText(/Cargando.../i);

    expect(loading).toBeInTheDocument();

    await waitFor(() => {
      expect(loading).not.toBeInTheDocument();
    })
  });

  it('renders two rows', async () => {
    renderComponent()

    const tbodyElement = await screen.findByTestId('table-body');

    await waitFor(() => {
      const rows = within(tbodyElement).getAllByRole('row');
      expect(rows).toHaveLength(2);
    })
  });

  // test('filters candidates by name', async () => {
  //   renderComponent();

  //   const searchInput = screen.getByPlaceholderText('Buscar por nombre...');

  //   // eslint ignore next line
  //   act(() => userEvent.type(searchInput, 'Arm')); // strong

  //   const tbodyElement = await screen.findByTestId('table-body');

  //   await waitFor(() => {
  //     const rows = within(tbodyElement).getAllByRole('row');
  //     expect(rows).toHaveLength(1);
  //   })

  //   const match = screen.getByText(/Armstrong/i);
  //   expect(match).toBeInTheDocument();
  // });

  // test('filters candidates by status', () => {
  //   render(<Candidates enabledColumns={enabledColumns} />);
  //   const statusCheckbox = screen.getByLabelText(/solo aprobados/i);

  //   userEvent.click(statusCheckbox);

  // });
})