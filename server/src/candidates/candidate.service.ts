import container from "../dependencyInjectionContainer";
import { transform, transformAll } from "./candidate.transformer";
import { CandidateRequestedFields } from "./candidate.types";

// TODO: move to config file or receive it from the client
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

    const { candidateRepository } = container.cradle;

    const { results, numberOfRecords } = candidateRepository.all(
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
    const { candidateRepository } = container.cradle;

    const candidate = candidateRepository.updateReasons(candidateId, reasonIds);

    return transform(candidate);
  }
}
