import { Candidate } from "../testData";
import candidateRepository from "./candidate.repository";
import { CandidateRequestedFields } from "./candidate.types";

// TODO: move to config file or retrieve from frontend
const numberOfRecordsPerPage = 10;

type Params = {
  requestedFields?: CandidateRequestedFields;
  offset?: number;
};

export default {
  all: ({ requestedFields, offset }: Params) => {
    // TODO: inject repository
    const { results, numberOfRecords } = candidateRepository.all(
      requestedFields,
      offset,
      numberOfRecordsPerPage
    );

    return {
      candidates: transform(results),
      numberOfRecords,
    };
  },
};

function transform(candidates: Partial<Candidate>[]) {
  return candidates.map((candidate) => ({
    ...candidate,
    reason: candidate.reason?.split(","),
  }));
}
