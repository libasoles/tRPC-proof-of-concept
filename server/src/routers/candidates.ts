import { candidates } from "../testData";
import { t } from "../trpc";

const candidateRouter = t.router({
  // TODO: move to service layer
  all: t.procedure.query(() => {
    // TODO: paginate results
    return candidates.map((candidate) => ({
      ...candidate,
      reason: candidate.reason.split(","),
    }));
  }),
});

export default candidateRouter;
