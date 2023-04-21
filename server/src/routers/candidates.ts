import candidateService from "../candidates/candidate.service";
import { t } from "../trpc";
import { z } from "zod";

function validateInput() {
  return z
    .object({
      requestedFields: z.array(z.string()).optional(),
      pageNumber: z.number().optional(),
    })
    .optional();
}
const candidateRouter = t.router({
  // TODO: inject service
  all: t.procedure.input(validateInput()).query(({ input }) => {
    const { pageNumber, requestedFields } = input || {};

    return candidateService.all({
      // @ts-ignore
      requestedFields: requestedFields,
      offset: pageNumber,
    });
  }),
});

export default candidateRouter;
