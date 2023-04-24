import { Candidate, Reason } from "#/types";
import { Candidate as PersistedCandidate, reasons } from "../testData";

export function transformAll(
  candidates: Partial<PersistedCandidate>[]
): Partial<Candidate>[] {
  return candidates.map(transform);
}

export function transform(
  candidate: Partial<PersistedCandidate>
): Partial<Candidate> {
  const reasons = mapReason(candidate.reason || []);

  return {
    ...candidate,
    reason: reasons,
  };
}

function mapReason(reasonIds: number[]): Reason[] {
  return reasonIds.map((id) => {
    const reason = reasons.find((reason) => reason.id === id);

    if (!reason) {
      throw new Error("Reason not found");
    }

    return reason;
  });
}
