import candidateService from "../candidates/candidate.service";
import { t } from "../trpc";
import { z } from "zod";

function validateInput() {
  return z
    .object({
      requestedFields: z.array(z.string()).optional(),
    })
    .optional();
}
const candidateRouter = t.router({
  // TODO: inject service
  all: t.procedure.input(validateInput()).query(({ input }) =>
    // @ts-ignore
    candidateService.all({ requestedFields: input?.requestedFields })
  ),
});

export default candidateRouter;
