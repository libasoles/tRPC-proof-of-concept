import { Candidate, Reason } from "../../../trpc/types";
import { Candidate as PersistedCandidate, reasons } from "../testData";
import candidateRepository from "./candidate.repository";
import { CandidateRequestedFields } from "./candidate.types";

// TODO: move to config file or retrieve from frontend
const numberOfRecordsPerPage = 10;

type QueryAllParams = {
  requestedFields?: CandidateRequestedFields;
  offset?: number;
};

type RejectParams = {
  candidateId: string;
  reasonIds: number[];
};

export default {
  all: ({ requestedFields, offset }: QueryAllParams) => {
    // TODO: inject repository
    const { results, numberOfRecords } = candidateRepository.all(
      requestedFields,
      offset,
      numberOfRecordsPerPage
    );

    return {
      candidates: transformAll(results),
      numberOfRecords,
    };
  },
  updateReasons: ({ candidateId, reasonIds }: RejectParams) => {
    const candidate = candidateRepository.updateReasons(candidateId, reasonIds);

    return transform(candidate);
  },
};

// TODO: move transformers to separate file?
function transformAll(
  candidates: Partial<PersistedCandidate>[]
): Partial<Candidate>[] {
  return candidates.map(transform);
}

function transform(candidate: Partial<PersistedCandidate>): Partial<Candidate> {
  const reasons = mapReason(candidate.reason || []);

  return {
    ...candidate,
    reason: reasons,
  };
}

function mapReason(reasonIds: number[]): Reason[] {
  return reasonIds.map((id) => {
    const reason = reasons.find((reason) => reason.id === id);

    if (!reason) {
      throw new Error("Reason not found");
    }

    return reason;
  });
}
