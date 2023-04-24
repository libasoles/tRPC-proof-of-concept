import { Candidates, candidates } from "../testData";
import type { CandidateRequestedFields } from "./candidate.types";
import type { Candidate, CandidateField } from "#/types";

type Filters = {
  onlyApproved: boolean;
  search: string;
};

export default class CandidateRepository {
  all(
    filters: Filters,
    requestedFields?: CandidateRequestedFields,
    offset = 0,
    limit = 10
  ) {
    const start = offset * limit;

    const results = setup(candidates, filters)
      .slice(start, limit)
      // @ts-ignore
      .map((candidate) => using(requestedFields).reduce(candidate));

    return {
      results,
      numberOfRecords: setup(candidates, filters).list().length,
    };
  }

  updateReasons(candidateId: string, reasonIds: number[]) {
    const candidate = candidates.get(candidateId);

    if (!candidate) {
      throw new Error("Candidate not found");
    }

    candidate.reason = reasonIds;

    candidates.update(candidate);

    return candidate;
  }
}

const setup = (candidates: Candidates, filters: Filters) => {
  const { onlyApproved, search } = filters;

  return candidates
    .filter((candidate) => {
      if (!onlyApproved) return true;

      return candidate.reason.length === 0;
    })
    .filter((candidate) => {
      if (search.trim() === "") return true;

      return candidate.name.toLowerCase().includes(search.toLowerCase());
    });
};

const using = (requestedFields: CandidateRequestedFields) => ({
  reduce: (candidate: Candidate) =>
    Object.fromEntries(
      Object.entries(candidate).filter(([key]) =>
        requestedFields?.includes(key as CandidateField)
      )
    ),
});
