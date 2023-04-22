import { NavLink, Outlet } from "react-router-dom";
import "./Layout.css"
import { Paths } from "@/paths";

type Props = {
    paths?: typeof Paths
};

export const Layout = ({ paths = Paths }: Props) => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <NavLink to={paths.Home}>Home</NavLink>
                    </li>
                    <li>
                        <NavLink to={paths.Candidates}>Candidates</NavLink>
                    </li>
                </ul>
            </nav>
            <hr />
            <main>
                <Outlet />
            </main>
        </>
    );
};
