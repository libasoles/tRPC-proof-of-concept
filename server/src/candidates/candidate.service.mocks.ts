import * as awilix from "awilix";
import container from "../dependencyInjectionContainer";
import { Candidate, Candidates } from "@/testData";

function createCandidate(data: Partial<Candidate> = {}) {
  return {
    id: Math.random().toString(36).substring(7),
    name: "Roger W. Mccoy",
    document: 26888437,
    cv_zonajobs:
      "https://www.zonajobs.com.ar/empresas/postulaciones/cvDetailsNewTab?idPostulacion=288288001&idCv=2292352&idAviso=1787875&mostrarSalarioPretendido=false",
    cv_bumeran: "",
    phone: "(603) 379-4036",
    email: "bulinad@ewgatna.org",
    date: " 2017-12-05 19:21:27.555000",
    age: 26,
    has_university: true,
    career: "moreInfo",
    graduated: "Sigo cursando",
    courses_approved: "16 a 21",
    location: "Ituzaingó, Buenos Aires Province, Argentina",
    accepts_working_hours: true,
    desired_salary: 12000,
    had_interview: false,
    reason: [1, 4, 6],
    ...data,
  };
}
const mockCandidates = [
  createCandidate({ id: "1" }),
  createCandidate({ id: "2" }),
  createCandidate({ id: "3" }),
  createCandidate({ id: "4" }),
  createCandidate({ id: "5" }),
  createCandidate({ id: "6" }),
  createCandidate({ id: "7" }),
  createCandidate({ id: "8" }),
  createCandidate({ id: "9" }),
  createCandidate({ id: "10" }),
  createCandidate({ id: "11" }),
];

container.register({
  candidates: awilix
    .asFunction(() => new Candidates(mockCandidates))
    .singleton(),
});
