import { Candidate, candidates } from "../testData";
import { t } from "../trpc";
import { z } from "zod";

type CandidateField = keyof Candidate;
type CandidateRequestedFields = (keyof Partial<Candidate>)[];

function validateInput() {
  return z
    .object({
      requiredFields: z.array(z.string()).optional(),
    })
    .optional();
}

const candidateRouter = t.router({
  // TODO: move to service layer
  all: t.procedure
    .input(validateInput())
    // TODO: paginate results
    .query(({ input }) => {
      // @ts-ignore
      const { requiredFields } = input;

      return (
        candidates
          // @ts-ignore
          .map((candidate) => using(requiredFields).reduce(candidate))
          .map((candidate: Partial<Candidate>) => ({
            ...candidate,
            reason: candidate.reason?.split(","),
          }))
      );
    }),
});

function using(requiredFields: CandidateRequestedFields) {
  return {
    reduce: (candidate: Candidate) =>
      Object.fromEntries(
        Object.entries(candidate).filter(([key]) =>
          requiredFields?.includes(key as CandidateField)
        )
      ),
  };
}

export default candidateRouter;
