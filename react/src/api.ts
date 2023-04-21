import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "../../trpc/types";

const apiClient = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: "http://localhost:3001/trpc" })],
});

export default apiClient;
