import CandidateService from "./candidate.service";
import "./candidate.service.mocks";

describe("CandidateService", () => {
  let candidateService: CandidateService;

  const requestedFields = ["name", "email"];
  const pageNumber = 1;

  beforeEach(() => {
    candidateService = new CandidateService();
  });

  describe("get all candidates", () => {
    it("should return a list of candidates", () => {
      const filters = {
        onlyApproved: false,
        search: "",
      };

      const result = candidateService.all({
        filters,
        // @ts-ignore
        requestedFields,
        pageNumber,
      });

      expect(result.candidates).toBeDefined();
      expect(result.numberOfRecords).toBeDefined();
      expect(result.candidates.length).toBe(10);
      expect(result.numberOfRecords).toBe(11);
    });
  });

  describe("update rejection reasons", () => {
    it("should return the candidate with mapped reasons", () => {
      const candidateId = "3";
      const reasonIds = [1, 2, 3];

      const expectedReasons = [
        {
          id: 1,
          description: "Cantidad de materias aprobadas fuera de lo deseado",
        },
        { id: 2, description: "Salario pretendido fuera de rango" },
        { id: 3, description: "Ubicación" },
      ];

      const result = candidateService.updateReasons({
        candidateId,
        reasonIds,
      });

      expect(result).toBeDefined();
      expect(result.reason).toMatchObject(expectedReasons);
    });
  });
});
