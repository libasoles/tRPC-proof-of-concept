import { Candidate } from "#/types";
import { notAGoodFit } from "./mock.data";

function generateRandomId() {
  return Math.random().toString(36).substr(2, 10);
}

export function createCandidate(values?: Partial<Candidate>) {
  return {
    id: generateRandomId(),
    name: "Aiden Armstrong",
    document: 26888437,
    cv_zonajobs:
      "https://www.zonajobs.com.ar/empresas/postulaciones/cvDetailsNewTab?idPostulacion=288288001&idCv=2292352&idAviso=1787875&mostrarSalarioPretendido=false",
    phone: "(603) 379-4036",
    email: "bulinad@ewgatna.org",
    date: "2017-12-05 19:21:27.555000",
    age: 26,
    career: "moreInfo",
    courses_approved: "16 a 21",
    had_interview: true,
    location: "Ituzaingó, Buenos Aires Province, Argentina",
    desired_salary: 12000,
    reason: [
      {
        id: 1,
        description: "Not a good fit",
      },
    ],
    ...values,
  } as Candidate;
}

export const createCandidates = (number: number) => {
  return Array.from({ length: number }, (_) => createCandidate());
};
