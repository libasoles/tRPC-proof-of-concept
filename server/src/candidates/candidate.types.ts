import { Candidate } from "../testData";

export type CandidateRequestedFields = (keyof Partial<Candidate>)[];
