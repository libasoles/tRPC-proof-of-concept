import { createTRPCMsw } from "msw-trpc";
import { AppRouter } from "#/types";

export const trpcMsw = createTRPCMsw<AppRouter>();

const aRejectedCandidate = {
  id: "5a271a1368adf47eb31fe683",
  name: "Aiden Armstrong",
  document: 26888437,
  cv_zonajobs:
    "https://www.zonajobs.com.ar/empresas/postulaciones/cvDetailsNewTab?idPostulacion=288288001&idCv=2292352&idAviso=1787875&mostrarSalarioPretendido=false",
  phone: "(603) 379-4036",
  email: "bulinad@ewgatna.org",
  date: " 2017-12-05 19:21:27.555000",
  age: 26,
  career: "moreInfo",
  courses_approved: "16 a 21",
  location: "Ituzaingó, Buenos Aires Province, Argentina",
  desired_salary: 12000,
  reason: [
    { id: 4, description: "No estudia/o carreras deseadas" },
    { id: 6, description: "Edad fuera de rango" },
    { id: 3, description: "Ubicación" },
  ],
};

const anApprovedCandidate = {
  id: "59865cf7c976ad2b78023669",
  name: "Aiden Moss",
  document: 12982074,
  cv_zonajobs: "",
  phone: "(215) 798-2902",
  email: "nisaho@matugse.org",
  date: " 2017-12-05 20:16:25.327000",
  age: 53,
  career: "Adm. de empresas",
  courses_approved: "13 a 15",
  location: "Salta 3643, B1754IRM San Justo, Buenos Aires, Argentina",
  desired_salary: 9000,
  reason: [],
};

const mockResponse = {
  candidates: [aRejectedCandidate, anApprovedCandidate],
  numberOfRecords: 2,
};

const mockErrorResponse = {
  error: {
    code: 400,
    message: "Bad Request",
  },
};

export const handlers = [
  trpcMsw.candidates.all.query((req, res, ctx) => {
    // {
    //   '0': {
    //     filters: { onlyApproved: false, search: '' },
    //     requestedFields: [ 'name', 'had_interview', 'reason' ],
    //     pageNumber: 1
    //   }
    // }
    // @ts-ignore
    const { search } = req.getInput()?.["0"].filters;
    if (search === "fail")
      return res(ctx.status(400), ctx.data(mockErrorResponse));

    if (search === "Armstrong") {
      return res(
        ctx.status(200),
        ctx.data({
          candidates: [aRejectedCandidate],
          numberOfRecords: 1,
        })
      );
    }

    return res(ctx.status(200), ctx.data(mockResponse));
  }),
];
