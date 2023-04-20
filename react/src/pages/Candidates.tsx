import { Candidate } from "../../../server/src/types";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "../../../server/src/server";
import { useState, useEffect } from "react";

// TODO: move this to a shared file
const client = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: "http://localhost:3001/trpc" })],
});

export const Candidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      const candidates = await client.all.query();
      setCandidates(candidates);
    };

    fetchCandidates();
  }, []);

  return (
    <div>
      <table>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.id}>
              {Object.values(candidate).map((field, index) => (
                <td key={index}>{field}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
