import { t } from "../trpc";
import candidateRouter from "./candidates";
import rejectionReasonsRouter from "./rejectionReasons";

const appRouter = t.router({
  candidates: candidateRouter,
  rejectionReasons: rejectionReasonsRouter,
});

export default appRouter;
