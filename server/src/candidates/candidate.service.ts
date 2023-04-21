import { Candidate } from "../testData";
import candidateRepository from "./candidate.repository";
import { CandidateRequestedFields } from "./candidate.types";

type Params = {
  requestedFields?: CandidateRequestedFields;
};

export default {
  all: ({ requestedFields }: Params) => {
    // TODO: inject repository
    const candidates = candidateRepository.all(requestedFields);

    return transform(candidates);
  },
};

function transform(candidates: Partial<Candidate>[]) {
  return candidates.map((candidate) => ({
    ...candidate,
    reason: candidate.reason?.split(","),
  }));
}
