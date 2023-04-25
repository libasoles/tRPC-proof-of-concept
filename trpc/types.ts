import appRouter from "../server/src/routers";

export type AppRouter = typeof appRouter;

export type Reason = {
  id: number;
  description: string;
};

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
  has_university: boolean;
  career: string;
  graduated: string;
  courses_approved: string;
  location: string;
  accepts_working_hours: boolean;
  desired_salary: number;
  had_interview: boolean;
  reason: Reason[];
};

export type PartialCandidate = Partial<Candidate> & { id: string };

export type CandidateField = keyof Candidate;
