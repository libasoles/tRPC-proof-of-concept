import { createTRPCMsw } from "msw-trpc";
import { AppRouter, Reason } from "#/types";
import { createCandidates } from "./data.factory";
import {
  aCandidateThatWasntInterviewed,
  aRejectedCandidate,
  anApprovedCandidate,
  rejectionReasons,
} from "./mock.data";
import { fakeServer } from "./fake.server";

export const trpcMsw = createTRPCMsw<AppRouter>();

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
          ...fakeServer.mockResponse,
          numberOfRecords: 12,
        })
      );
    }

    if (search === "Armstrong") {
      return res(
        ctx.status(200),
        ctx.data({
          candidates: [fakeServer.candidate(aRejectedCandidate.id)],
          numberOfRecords: 1,
        })
      );
    }

    if (search === "Harold") {
      return res(
        ctx.status(200),
        ctx.data({
          candidates: [fakeServer.candidate(aCandidateThatWasntInterviewed.id)],
          numberOfRecords: 1,
        })
      );
    }

    if (search === "fail")
      return res(ctx.status(500), ctx.json(fakeServer.mockErrorResponse));

    if (onlyApproved) {
      return res(
        ctx.status(200),
        ctx.data({
          candidates: [fakeServer.candidate(anApprovedCandidate.id)],
          numberOfRecords: 1,
        })
      );
    }

    return res(ctx.status(200), ctx.data(fakeServer.mockResponse));
  }),

  trpcMsw.rejectionReasons.all.query((req, res, ctx) => {
    return res(ctx.status(200), ctx.data(rejectionReasons));
  }),

  trpcMsw.candidates.updateReasons.mutation((req, res, ctx) => {
    const reasons = req.body.reasonIds.map((id: number) =>
      rejectionReasons.find((reason) => reason.id === id)
    );

    const updatedCandidate = {
      ...aRejectedCandidate,
      reason: reasons as Reason[],
    };

    fakeServer.updateCandidate(updatedCandidate);

    return res(ctx.status(200), ctx.data(updatedCandidate));
  }),
];
