import { Candidate, Reason } from "#/types";
import container from "../dependencyInjectionContainer";
import { Candidate as PersistedCandidate, reasons } from "../testData";
import { CandidateRequestedFields } from "./candidate.types";

// TODO: move to config file
const numberOfRecordsPerPage = 10;

type QueryAllParams = {
  filters: {
    onlyApproved: boolean;
    search: string;
  };
  requestedFields?: CandidateRequestedFields;
  pageNumber?: number;
};

type RejectParams = {
  candidateId: string;
  reasonIds: number[];
};

export default class CandidateService {
  all({ filters, requestedFields, pageNumber = 1 }: QueryAllParams) {
    const offset = pageNumber - 1;

    const { results, numberOfRecords } =
      container.cradle.candidateRepository.all(
        filters,
        requestedFields,
        offset,
        numberOfRecordsPerPage
      );

    return {
      candidates: transformAll(results),
      numberOfRecords,
    };
  }

  updateReasons({ candidateId, reasonIds }: RejectParams) {
    const candidate = container.cradle.candidateRepository.updateReasons(
      candidateId,
      reasonIds
    );

    return transform(candidate);
  }
}

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
