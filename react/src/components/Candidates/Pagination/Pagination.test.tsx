import { render, screen } from "@testing-library/react";
import Pagination from "./Pagination";
import userEvent from '@testing-library/user-event'
import { rowsPerPage } from "@/config";

const noAction = () => { };

describe("Pagination", () => {
    it('renders the correct number of pages', () => {
        render(<Pagination currentPage={1} totalRows={50} rowsPerPage={rowsPerPage} setCurrentPage={noAction} />);
        const buttons = screen.getAllByRole('button');
        const pageButtons = screen.getAllByTestId('pageButton');

        expect(buttons).toHaveLength(7);
        expect(pageButtons).toHaveLength(5);
    });

    test('the current page is highlighted', () => {
        render(<Pagination currentPage={3} setCurrentPage={noAction} totalRows={50} rowsPerPage={rowsPerPage} />);
        const pageButtons = screen.getAllByTestId('pageButton');

        expect(pageButtons[2]).toHaveClass('activePage');
    });

    test('clicking a page button updates the current page', () => {
        const setCurrentPage = jest.fn();
        render(<Pagination currentPage={1} setCurrentPage={setCurrentPage} totalRows={50} rowsPerPage={rowsPerPage} />);

        userEvent.click(screen.getByText('3'));

        expect(setCurrentPage).toHaveBeenCalledWith(3);
    });

    test('the "Previous" button is disabled when on the first page', () => {
        render(<Pagination currentPage={1} setCurrentPage={noAction} totalRows={50} rowsPerPage={rowsPerPage} />);
        const prevButton = screen.getByText('‹');

        expect(prevButton).toBeDisabled();
    });

    test('the "Next" button is disabled when on the last page', () => {
        render(<Pagination currentPage={5} setCurrentPage={noAction} totalRows={50} rowsPerPage={rowsPerPage} />);
        const nextButton = screen.getByText('›');

        expect(nextButton).toBeDisabled();
    });

    test('"Previous" and "Next" buttons are enabled for middle pages', () => {
        render(<Pagination currentPage={2} setCurrentPage={noAction} totalRows={50} rowsPerPage={rowsPerPage} />);
        const prevButton = screen.getByText('‹');
        const nextButton = screen.getByText('›');

        expect(prevButton).toBeEnabled();
        expect(nextButton).toBeEnabled();
    });

    test('clicking the "Next" button updates the current page', () => {
        const setCurrentPage = jest.fn();
        render(<Pagination currentPage={1} setCurrentPage={setCurrentPage} totalRows={50} rowsPerPage={rowsPerPage} />);

        userEvent.click(screen.getByText('›'));

        expect(setCurrentPage).toHaveBeenCalledWith(2);
    });

    test('clicking the "Previous" button updates the current page', () => {
        const setCurrentPage = jest.fn();
        render(<Pagination currentPage={2} setCurrentPage={setCurrentPage} totalRows={50} rowsPerPage={rowsPerPage} />);

        userEvent.click(screen.getByText('‹'));

        expect(setCurrentPage).toHaveBeenCalledWith(1);
    });
})