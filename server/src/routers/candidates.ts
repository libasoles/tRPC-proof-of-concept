import container from "../dependencyInjectionContainer";
import { t } from "../trpc";
import { z } from "zod";

function validateListParameters() {
  return z
    .object({
      filters: z.object({
        onlyApproved: z.boolean().optional(),
        search: z.string().optional(),
      }),
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
  all: t.procedure
    .input(validateListParameters())
    // @ts-ignore
    .query(({ input }) => container.cradle.candidateService.all(input)),
  updateReasons: t.procedure
    .input(validateRejectParameters())
    .mutation(({ input }) =>
      container.cradle.candidateService.updateReasons(input)
    ),
});

export default candidateRouter;
