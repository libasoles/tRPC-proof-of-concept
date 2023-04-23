import { Candidate } from "#/types";
import { createCandidates } from "./data.factory";
import { rowsPerPage } from "@/config";
import {
  aRejectedCandidate,
  anApprovedCandidate,
  aCandidateThatWasntInterviewed,
} from "./mock.data";

const specialCandidates = [
  anApprovedCandidate,
  aRejectedCandidate,
  aCandidateThatWasntInterviewed,
];

const candidates = [
  ...createCandidates(rowsPerPage - specialCandidates.length),
  ...specialCandidates,
];

class FakeServer {
  private pristineMockResponse = {
    candidates,
    numberOfRecords: 10,
  };

  mockResponse = { ...this.pristineMockResponse };

  mockErrorResponse = {
    error: {
      message: "Ups",
      code: -32603,
      data: {
        code: "INTERNAL_SERVER_ERROR",
        httpStatus: 500,
        stack: "Error: Ups",
        path: "candidates.all",
      },
    },
  };

  candidate(id: string) {
    return this.mockResponse.candidates.find(
      (candidate) => candidate.id === id
    );
  }

  updateCandidate(candidate: Candidate) {
    this.mockResponse.candidates = this.mockResponse.candidates.map(
      (aCandidate) => (aCandidate.id === candidate.id ? candidate : aCandidate)
    );
  }

  reset() {
    this.mockResponse = { ...this.pristineMockResponse };
  }
}

export const fakeServer = new FakeServer();
