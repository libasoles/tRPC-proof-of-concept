import { NavLink, Outlet } from "react-router-dom";
import Paths from "@/paths";
import "./Layout.css"

type Props = {
    paths?: typeof Paths
};

const Layout = ({ paths = Paths }: Props) => {
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

export default Layout;
