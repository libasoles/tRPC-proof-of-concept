import { t } from "../trpc";
import container from "../dependencyInjectionContainer";
import { Reason } from "#/types";

const rejectionReasonsRouter = t.router({
  all: t.procedure.query(() => {
    const { rejectionReasonService } = container.cradle;
    return rejectionReasonService.all() as Reason[];
  }),
});

export default rejectionReasonsRouter;
