import { Candidate } from "#/types";

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
    ...values,
  };
}

export const aRejectedCandidate = createCandidate({
  id: "5a271a1368adf47eb31fe683",
  name: "Aiden Armstrong",
});

export const anApprovedCandidate = createCandidate({
  id: "59865cf7c976ad2b78023669",
  name: "Aiden Moss",
  reason: [],
});

export const createCandidates = (number: number) => {
  return Array.from({ length: number }, (_) => createCandidate());
};
