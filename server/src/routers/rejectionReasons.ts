import { t } from "../trpc";
import container from "../dependencyInjectionContainer";

const rejectionReasonsRouter = t.router({
  all: t.procedure.query(() => {
    const { rejectionReasonService } = container.cradle;

    return rejectionReasonService.all();
  }),
});

export default rejectionReasonsRouter;
