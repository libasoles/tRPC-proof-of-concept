import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../trpc/types";
import { createTRPCReact } from "@trpc/react-query";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: "http://localhost:3001/trpc" })],
});
