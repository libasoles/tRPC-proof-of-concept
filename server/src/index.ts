import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import cors from "cors";
import appRouter from "./routers";
import { createContext } from "./trpc";

const app = express();

app.use(cors({ origin: "http://localhost:3000" })); // TODO: move whitelist to a config file
app.options("*", cors());
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(3001);
