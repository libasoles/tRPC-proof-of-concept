import { candidates } from "../testData";
import { t } from "../trpc";

const candidateRouter = t.router({
  all: t.procedure.query(() => candidates),
});

export default candidateRouter;
