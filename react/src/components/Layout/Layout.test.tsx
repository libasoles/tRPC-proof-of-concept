import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import userEvent from "@testing-library/user-event";
import Paths from "@/paths";
import { act } from "react-dom/test-utils";

describe("Layout", () => {
    test("renders navigation links", () => {
        render(
            <BrowserRouter>
                <Layout />
            </BrowserRouter>
        );

        const homeLink = screen.getByRole("link", { name: /home/i });
        const candidatesLink = screen.getByRole("link", { name: /candidates/i });

        expect(homeLink).toBeInTheDocument();
        expect(candidatesLink).toBeInTheDocument();
    });

    test("renders Outlet component", () => {
        render(
            <BrowserRouter>
                <Layout />
            </BrowserRouter>
        );

        const outlet = screen.getByRole("main");

        expect(outlet).toBeInTheDocument();
    });

    test("navigates to correct routes", async () => {

        render(
            <BrowserRouter>
                <Routes>
                    <Route path={Paths.Home} element={<Layout />}>
                        <Route
                            index
                            element={<h1>Assignment Page</h1>}
                        />
                        <Route
                            path={Paths.Candidates}
                            element={<h1>Candidates Page</h1>}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        );

        const homeLink = await screen.findByRole("link", { name: /home/i });
        const candidatesLink = screen.getByRole("link", { name: /candidates/i });

        // eslint-disable-next-line testing-library/no-unnecessary-act
        act(() => userEvent.click(homeLink));
        expect(await screen.findByText("Assignment Page")).toBeInTheDocument();

        // eslint-disable-next-line testing-library/no-unnecessary-act
        act(() => userEvent.click(candidatesLink));
        expect(await screen.findByText("Candidates Page")).toBeInTheDocument();
    });
});
