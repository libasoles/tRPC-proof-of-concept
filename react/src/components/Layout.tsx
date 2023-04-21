import { NavLink, Outlet } from "react-router-dom";
import "./Layout.css"

export const Layout = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/candidates">Candidates</NavLink>
                    </li>
                </ul>
            </nav>
            <hr />
            <Outlet />
        </>
    );
};
