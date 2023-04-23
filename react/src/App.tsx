import "./App.css";
import { Routes, Route } from "react-router-dom";
import Candidates from "./pages/Candidates";
import Assignment from "./pages/Assignment";
import Layout from "./components/Layout";
import Paths from "@/paths";
import { enabledColumns } from "./config";

export default function App() {
  return (
    <Routes>
      <Route path={Paths.Home} element={<Layout />}>
        <Route
          index
          element={<Assignment />}
        />
        <Route
          path={Paths.Candidates}
          element={<Candidates enabledColumns={enabledColumns} />}
        />
      </Route>
    </Routes>
  );
}
