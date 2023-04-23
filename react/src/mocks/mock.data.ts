import { Reason } from "#/types";
import { createCandidate } from "./data.factory";

export const notAGoodFit: Reason = {
  id: 1,
  description: "Not a good fit",
};

export const notInterested = {
  id: 2,
  description: "Not interested",
};

export const location = {
  id: 3,
  description: "Location",
};
export const doesntStudyDesiredCareers = {
  id: 4,
  description: "Doesn't study desired careers",
};

export const rejectionReasons = [
  notAGoodFit,
  notInterested,
  location,
  doesntStudyDesiredCareers,
];

export const aRejectedCandidate = createCandidate({
  id: "5a271a1368adf47eb31fe683",
  name: "Aiden Armstrong",
});

export const anApprovedCandidate = createCandidate({
  id: "59865cf7c976ad2b78023669",
  name: "Aiden Moss",
  reason: [],
});
