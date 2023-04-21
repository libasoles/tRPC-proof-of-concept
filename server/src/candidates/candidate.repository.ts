import { Candidate, candidates } from "../testData";
import type { CandidateRequestedFields } from "./candidate.types";
import type { CandidateField } from "../../../trpc/types";

const using = (requestedFields: CandidateRequestedFields) => ({
  reduce: (candidate: Candidate) =>
    Object.fromEntries(
      Object.entries(candidate).filter(([key]) =>
        requestedFields?.includes(key as CandidateField)
      )
    ),
});

export default {
  all: (requestedFields?: CandidateRequestedFields, offset = 0, limit = 10) => {
    const start = offset * limit;

    const results = candidates
      .slice(start, start + 10)
      // @ts-ignore
      .map((candidate) => using(requestedFields).reduce(candidate));

    return {
      results,
      numberOfRecords: candidates.length,
    };
  },
};
