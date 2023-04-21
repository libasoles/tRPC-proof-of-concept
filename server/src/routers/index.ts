import { t } from "../trpc";
import candidateRouter from "./candidates";

const appRouter = t.router({
  candidates: candidateRouter,
});

export default appRouter;
