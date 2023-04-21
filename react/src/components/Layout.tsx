import { Link, Outlet } from "react-router-dom";
import "./Layout.css"

export const Layout = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/candidates">Candidates</Link>
                    </li>
                </ul>
            </nav>
            <hr />
            <Outlet />
        </>
    );
};
