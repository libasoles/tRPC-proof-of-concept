import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from "msw/node";
import { QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient, queryClient } from "@/api";
import { notAGoodFit, notInterested } from '@/mocks/mock.data';
import { handlers } from '@/mocks/trpc.handlers';
import { fakeServer } from '@/mocks/fake.server';
import Candidates from './Candidates';

export const enabledColumns = {
  name: true,
  date: true,
  cv_zonajobs: true,
  had_interview: true,
  email: false,
  reason: true,
};

export const server = setupServer(...handlers);

const firstRow = 0;

jest.mock('@/config', () => ({
  ...jest.requireActual('@/config'),
  debounceTime: 0,
}));

describe('Candidates', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());

  afterEach(() => {
    server.resetHandlers()
    queryClient.clear();
    fakeServer.reset()
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

  it('renders a loading message that then dissapears', async () => {
    renderComponent()

    const loading = await screen.findByText(/Cargando.../i);

    expect(loading).toBeInTheDocument();

    await waitFor(() => {
      expect(loading).not.toBeInTheDocument();
    })
  });

  it('displays an error message when the request fails', async () => {
    queryClient.setDefaultOptions({
      queries: {
        retry: false,
      },
    })

    renderComponent();

    write('fail')

    await waitFor(() => {
      const errorMessage = screen.getByText(/Hubo un error cargando el listado/i);
      expect(errorMessage).toBeInTheDocument();
    })
  })

  describe("Filters", () => {
    test('filters candidates by name', async () => {
      renderComponent();

      await assertTableHasNumberOfRows(10)

      write('Armstrong')

      await assertTableHasNumberOfRows(1)

      assertCandidateIsListed('Armstrong');
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

    it('displays a message when there are no results', async () => {
      renderComponent();

      write('Nobody')

      await assertTableIsEmpty()

      await waitFor(() => {
        const message = screen.getByText(/No hay resultados de busqueda./i);
        expect(message).toBeInTheDocument();
      })
    });
  })

  describe("Table", () => {
    test('table headers requested by user are rendered, and other headers are ignored', () => {
      renderComponent()

      const nameHeader = screen.getByRole('columnheader', { name: /Nombre/i });
      const interviewedHeader = screen.getByRole('columnheader', { name: /Fue entrevistado/i });
      const reasonHeader = screen.getByRole('columnheader', { name: /Razones/i });

      expect(nameHeader).toBeInTheDocument();
      expect(interviewedHeader).toBeInTheDocument();
      expect(reasonHeader).toBeInTheDocument();

      const emailHeader = screen.queryByRole('columnheader', { name: /Email/i });
      expect(emailHeader).not.toBeInTheDocument();
    })

    it('renders 10 rows based on rows per page limit', async () => {
      renderComponent()

      await assertTableHasNumberOfRows(10)
    });

    it("formats the boolean values correctly", async () => {
      renderComponent();

      await waitUntilResultsRender()

      const aRow = getRow(firstRow)
      const yes = within(aRow).getByText(/^Si$/i);
      expect(yes).toBeInTheDocument();

      write("Harold")

      await assertTableHasNumberOfRows(1)

      const updatedRow = getRow(firstRow)
      const no = await within(updatedRow).findByText(/^No$/i);
      expect(no).toBeInTheDocument();
    });

    it("formats the date values correctly", async () => {
      renderComponent();

      await waitUntilResultsRender()

      write("Armstrong")

      await assertTableHasNumberOfRows(1)

      const aRow = getRow(firstRow)
      const date = within(aRow).getByText(/^01\/01\/2021$/i);

      expect(date).toBeInTheDocument();
    });

    it('formats the link values correctly', async () => {
      renderComponent();

      await waitUntilResultsRender()

      write("Armstrong")

      await assertTableHasNumberOfRows(1)

      const aRow = getRow(firstRow)
      const link = within(aRow).getByRole('link', { name: /Ver CV$/i });

      expect(link).toBeInTheDocument();
    });
  })

  describe("Pagination", () => {
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

      await assertTableHasNumberOfRows(10)

      navigateToPage(2)

      await assertTableHasNumberOfRows(2)
    });
  })

  describe('Reason Modal', () => {
    test('renders a modal with the reasons when clicking on the reasons button', async () => {
      renderComponent();

      filterOnlyApprovedCandidates()

      await waitUntilResultsRender()

      clickEditReasonsButtonForRow(firstRow)

      const modal = await screen.findByRole('dialog');
      const reasons = await within(modal).findByText(/Not a good fit/i);

      expect(modal).toBeInTheDocument();
      expect(reasons).toBeInTheDocument();
    });

    test('updates the reasons in the table when the modal is closed', async () => {
      renderComponent();

      write('Armstrong')

      await waitUntilResultsRender()

      assertNumberOfRejectionReasonsForRowIs(firstRow, 1)

      clickEditReasonsButtonForRow(firstRow)

      const modal = await screen.findByRole('dialog');
      const reasonCheckbox = await within(modal).findByLabelText(notInterested.description);

      // eslint-disable-next-line testing-library/no-unnecessary-act
      act(() => userEvent.click(reasonCheckbox))

      await waitFor(() => { expect(reasonCheckbox).toBeChecked() })

      assertNumberOfRejectionReasonsForRowIs(firstRow, 1)

      closeModal()

      await waitFor(() => {
        assertNumberOfRejectionReasonsForRowIs(firstRow, 2)
        assertCandidateHasReason(firstRow, notAGoodFit.description)
        assertCandidateHasReason(firstRow, notInterested.description)
      })
    })
  })
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

function getRow(row: number) {
  const tbodyElement = screen.getByTestId('table-body');
  const rows = within(tbodyElement).getAllByRole('row');

  return rows[row];
}

async function waitUntilResultsRender() {
  const loading = await screen.findByText(/Cargando.../i);
  expect(loading).toBeInTheDocument();

  await waitFor(() => {
    expect(loading).not.toBeInTheDocument();
  })

  return waitFor(() => {
    const tbodyElement = screen.getByTestId('table-body');
    const rows = within(tbodyElement).getAllByRole('row');
    expect(rows.length).toBeGreaterThan(0);
  })
}

async function assertTableHasNumberOfRows(expected: number) {
  const tbodyElement = await screen.findByTestId('table-body');
  const rows = await within(tbodyElement).findAllByRole('row');
  expect(rows).toHaveLength(expected);
}

async function assertTableIsEmpty() {
  const tbodyElement = await screen.findByTestId('table-body');
  await waitFor(() => {
    const rows = within(tbodyElement).queryAllByRole('row');
    expect(rows).toHaveLength(0);
  })
}

function assertCandidateIsListed(name: string) {
  const regex = new RegExp(name, 'i');
  const match = screen.getByText(regex);
  expect(match).toBeInTheDocument();
}

function closeModal() {
  const modal = screen.getByRole('dialog');
  const closeButton = within(modal).getByRole('button');

  // eslint-disable-next-line testing-library/no-unnecessary-act
  act(() => userEvent.click(closeButton));
}

function getRejectionReasons(rowNumber: number) {
  const aRow = getRow(rowNumber);

  return within(aRow).getAllByTestId('rejection-reason')
}

function assertCandidateHasReason(row: number, reason: string) {
  const reasons = getRejectionReasons(row);
  const hasReason = reasons.some((reasonElement) => reasonElement.textContent === reason)

  expect(hasReason).toBe(true);
}

function assertNumberOfRejectionReasonsForRowIs(rowNumber: number, expected: number) {
  const reasons = getRejectionReasons(rowNumber)

  expect(reasons).toHaveLength(expected);
}

function clickEditReasonsButtonForRow(row: number) {
  const aRow = getRow(row);
  const reasonsButton = within(aRow).getByTestId('edit-reasons-button');

  // eslint-disable-next-line testing-library/no-unnecessary-act
  act(() => userEvent.click(reasonsButton));
}