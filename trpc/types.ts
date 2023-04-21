import appRouter from "../server/src/routers";

export type AppRouter = typeof appRouter;

export type Candidate = {
  id: string;
  name: string;
  document: number;
  cv_zonajobs: string;
  cv_bumeran: string;
  phone: string;
  email: string;
  date: string;
  age: number;
  has_university: string;
  career: string;
  graduated: string;
  courses_approved: string;
  location: string;
  accepts_working_hours: string;
  desired_salary: string; // TODO: handle this as a number
  had_interview: string;
  reason: string[];
};
