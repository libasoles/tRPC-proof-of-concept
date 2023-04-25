import { render, screen, within } from "@testing-library/react";
import { trpc } from "@/api";
import RejectionReasons from "./RejectionReasons";
import userEvent from "@testing-library/user-event";

const noAction = () => { };

jest.mock("@/api", () => ({
    trpc: {
        rejectionReasons: {
            all: {
                useQuery: jest.fn(),
            },
        },
    },
}));

const reasons = [
    { id: 1, description: "Reason 1" },
    { id: 2, description: "Reason 2" },
    { id: 3, description: "Reason 3" },
];

describe("RejectionReasons", () => {
    beforeEach(() => {
        // @ts-ignore
        trpc.rejectionReasons.all.useQuery.mockReturnValue({ data: reasons });
    });

    afterEach(() => {
        jest.clearAllMocks()
    });

    it("renders the list of reasons", () => {
        render(
            <RejectionReasons
                preselectedReasons={[1]}
                onSelectReason={noAction}
                onClose={noAction}
            />
        );

        const reason1 = screen.getByText("Reason 1");
        const reason2 = screen.getByText("Reason 2");
        const reason3 = screen.getByText("Reason 3");

        expect(reason1).toBeInTheDocument();
        expect(reason2).toBeInTheDocument();
        expect(reason3).toBeInTheDocument();
    });

    it("calls onSelectReason when a reason is selected", () => {
        const onSelectReason = jest.fn();

        render(
            <RejectionReasons
                preselectedReasons={[1]}
                onSelectReason={onSelectReason}
                onClose={noAction}
            />
        );

        const reason2 = screen.getByText("Reason 2");
        const reasonCheckbox = within(reason2).getByRole('checkbox') as HTMLInputElement;

        userEvent.click(reasonCheckbox);

        expect(onSelectReason).toHaveBeenCalledWith(expect.any(Object));
    });

    it("calls onClose when the close modal button is clicked", () => {
        const onClose = jest.fn();

        render(
            <RejectionReasons
                preselectedReasons={[1]}
                onSelectReason={noAction}
                onClose={onClose}
            />
        );

        const overlay = screen.getByRole("button", { name: "close" });

        userEvent.click(overlay);

        expect(onClose).toHaveBeenCalled();
    });

    it('preselects the reasons passed in', () => {
        render(
            <RejectionReasons
                preselectedReasons={[1, 3]}
                onSelectReason={noAction}
                onClose={noAction}
            />
        );

        const reason1 = screen.getByText("Reason 1");
        const reason2 = screen.getByText("Reason 2");
        const reason3 = screen.getByText("Reason 3");

        const reason1Checkbox = within(reason1).getByRole('checkbox') as HTMLInputElement;
        const reason2Checkbox = within(reason2).getByRole('checkbox') as HTMLInputElement;
        const reason3Checkbox = within(reason3).getByRole('checkbox') as HTMLInputElement;

        expect(reason1Checkbox.checked).toBe(true);
        expect(reason2Checkbox.checked).toBe(false);
        expect(reason3Checkbox.checked).toBe(true);
    });
});
