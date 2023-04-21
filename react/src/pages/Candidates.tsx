import { Candidate } from "../../../server/src/types";
import { useState, useEffect } from "react";
import api from "../api";

export const Candidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      const candidates = await api.candidates.all.query();
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
