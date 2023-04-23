import { createTRPCMsw } from "msw-trpc";
import { AppRouter } from "#/types";
import {
  aRejectedCandidate,
  anApprovedCandidate,
  createCandidates,
} from "./testFactory";
import { rowsPerPage } from "@/config";

export const trpcMsw = createTRPCMsw<AppRouter>();

const mockResponse = {
  candidates: createCandidates(rowsPerPage),
  numberOfRecords: 10,
};

const mockErrorResponse = {
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

export const handlers = [
  trpcMsw.candidates.all.query((req, res, ctx) => {
    const { filters, pageNumber } = req.getInput() || {};
    const { search, onlyApproved } = filters || {};

    if (search === "lots") {
      if (pageNumber === 2) {
        return res(
          ctx.status(200),
          ctx.data({
            candidates: createCandidates(2),
            numberOfRecords: 12,
          })
        );
      }

      return res(
        ctx.status(200),
        ctx.data({
          ...mockResponse,
          numberOfRecords: 12,
        })
      );
    }

    if (search === "Armstrong") {
      return res(
        ctx.status(200),
        ctx.data({
          candidates: [aRejectedCandidate],
          numberOfRecords: 1,
        })
      );
    }

    if (search === "fail")
      return res(ctx.status(500), ctx.json(mockErrorResponse));

    if (onlyApproved) {
      return res(
        ctx.status(200),
        ctx.data({
          candidates: [anApprovedCandidate],
          numberOfRecords: 1,
        })
      );
    }

    return res(ctx.status(200), ctx.data(mockResponse));
  }),
];
