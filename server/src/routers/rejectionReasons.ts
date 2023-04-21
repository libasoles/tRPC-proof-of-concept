import { t } from "../trpc";
import rejectionReasonService from "../candidates/rejectionReason.service";

const rejectionReasonsRouter = t.router({
  // TODO: inject service
  all: t.procedure.query(() => {
    return rejectionReasonService.all();
  }),
});

export default rejectionReasonsRouter;
