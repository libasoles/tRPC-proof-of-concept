import { Candidates, Candidate as PersistentCandidate } from "../testData";
import type { CandidateRequestedFields } from "./candidate.types";
import type { CandidateField } from "#/types";
import container from "../dependencyInjectionContainer";

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

    const onlyRequestedFields = (candidate: PersistentCandidate) =>
      using(requestedFields || []).reduceFields(candidate);

    const candidateDatabase = container.cradle.candidates;

    const results = setup(candidateDatabase, filters)
      .slice(start, limit)
      .map(onlyRequestedFields);

    return {
      results,
      numberOfRecords: setup(candidateDatabase, filters).list().length,
    };
  }

  updateReasons(candidateId: string, reasonIds: number[]) {
    const candidateDatabase = container.cradle.candidates;

    const candidate = candidateDatabase.get(candidateId);

    if (!candidate) {
      throw new Error("Candidate not found");
    }

    candidate.reason = reasonIds;

    candidateDatabase.update(candidate);

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
  reduceFields: (candidate: PersistentCandidate) =>
    Object.fromEntries(
      Object.entries(candidate).filter(([key]) =>
        requestedFields?.includes(key as CandidateField)
      )
    ),
});
