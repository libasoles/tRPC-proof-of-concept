import { candidates } from "../testData";
import type { CandidateRequestedFields } from "./candidate.types";
import type { Candidate, CandidateField, Reason } from "../../../trpc/types";

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
      .slice(start, start + limit)
      // @ts-ignore
      .map((candidate) => using(requestedFields).reduce(candidate));

    return {
      results,
      numberOfRecords: candidates.list().length,
    };
  },
  updateReasons: (candidateId: string, reasonIds: number[]) => {
    const candidate = candidates.get(candidateId);

    if (!candidate) {
      throw new Error("Candidate not found");
    }

    candidate.reason = reasonIds;

    candidates.update(candidate);

    return candidate;
  },
};
