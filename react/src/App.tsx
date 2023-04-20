import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Candidates } from "./pages/Candidates";
import { Assignment } from "./pages/Assignment";
import { Layout } from "./components/Layout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={<Assignment />}
        />
        <Route
          path="candidates"
          element={<Candidates />}
        />
      </Route>
    </Routes>
  );
}
