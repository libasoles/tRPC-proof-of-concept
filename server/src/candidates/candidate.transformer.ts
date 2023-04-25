import type { PartialCandidate, Reason } from "#/types";
import { PersistedCandidate as PersistedCandidate, reasons } from "../testData";

export function transformAll(candidates: Partial<PersistedCandidate>[]) {
  return candidates.map(transform);
}

export function transform(candidate: Partial<PersistedCandidate>) {
  const reasons = mapReason(candidate.reason || []);

  return {
    ...candidate,
    reason: reasons,
  } as PartialCandidate;
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
