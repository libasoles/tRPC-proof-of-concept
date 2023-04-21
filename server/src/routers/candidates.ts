import candidateService from "../candidates/candidate.service";
import { t } from "../trpc";
import { z } from "zod";

function validateListParameters() {
  return z
    .object({
      requestedFields: z.array(z.string()).optional(),
      pageNumber: z.number().optional(),
    })
    .optional();
}

function validateRejectParameters() {
  return z.object({
    candidateId: z.string(),
    reasonIds: z.array(z.number()),
  });
}

const candidateRouter = t.router({
  // TODO: inject service
  all: t.procedure
    .input(validateListParameters())
    // @ts-ignore
    .query(({ input }) => candidateService.all(input)),
  updateReasons: t.procedure
    .input(validateRejectParameters())
    .mutation(({ input }) => candidateService.updateReasons(input)),
});

export default candidateRouter;
