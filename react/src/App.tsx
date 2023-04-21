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
          element={<Candidates enabledColumns={enabledColumns} />}
        />
      </Route>
    </Routes>
  );
}

// TODO: move to a config file or somewhere else
export const enabledColumns = {
  id: true,
  name: true,
  document: true,
  cv_zonajobs: true,
  cv_bumeran: false,
  phone: true,
  email: true,
  date: true,
  age: true,
  has_university: false,
  career: true,
  graduated: false,
  courses_approved: true,
  location: true,
  accepts_working_hours: false,
  desired_salary: true,
  had_interview: false,
  reason: true,
};