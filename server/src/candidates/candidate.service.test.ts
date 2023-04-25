import { CandidateField } from "#/types";
import CandidateService from "./candidate.service";
import "./candidate.service.mocks";

describe("CandidateService", () => {
  let candidateService: CandidateService;

  const defaultFilters = {
    onlyApproved: false,
    search: "",
  };

  const requestedFields = ["name", "email", "reason"] as CandidateField[];
  const pageNumber = 1;

  beforeEach(() => {
    candidateService = new CandidateService();
  });

  describe("get all candidates", () => {
    it("should return a list of candidates", () => {
      const result = candidateService.all({
        filters: defaultFilters,
        requestedFields,
        pageNumber,
      });

      expect(result.candidates.length).toBe(10);
      expect(result.numberOfRecords).toBe(11);
    });

    it("should return a list of approved candidates only ", () => {
      const filters = {
        onlyApproved: true,
        search: "",
      };

      const result = candidateService.all({
        filters,
        requestedFields,
        pageNumber,
      });

      expect(result.candidates.length).toBe(1);
      expect(result.numberOfRecords).toBe(1);
    });

    it("should return a list of candidates filtered by search", () => {
      const filters = {
        onlyApproved: false,
        search: "Roberts",
      };

      const result = candidateService.all({
        filters,
        requestedFields,
        pageNumber,
      });

      expect(result.candidates.length).toBe(1);
      expect(result.numberOfRecords).toBe(1);
    });

    it('should format the "reason" field', () => {
      const filters = {
        onlyApproved: false,
        search: "Roberts",
      };

      const result = candidateService.all({
        filters,
        requestedFields,
        pageNumber,
      });

      const firstCandidate = result.candidates[0];

      expect(firstCandidate.reason).toEqual([
        {
          id: 1,
          description: "Cantidad de materias aprobadas fuera de lo deseado",
        },
        {
          description: "No estudia/o carreras deseadas",
          id: 4,
        },
        {
          description: "Edad fuera de rango",
          id: 6,
        },
      ]);
    });

    it("should return only the requested fields", () => {
      const filters = {
        onlyApproved: false,
        search: "Clarington",
      };

      const result = candidateService.all({
        filters,
        requestedFields,
        pageNumber,
      });

      const firstCandidate = result.candidates[0];

      expect(firstCandidate).toEqual({
        id: "7",
        name: "Pat Clarington",
        email: "bulinad@ewgatna.org",
        reason: [
          {
            id: 1,
            description: "Cantidad de materias aprobadas fuera de lo deseado",
          },
        ],
      });
    });

    it("always returns the id field", () => {
      const requestedFields = ["email"] as CandidateField[];

      const result = candidateService.all({
        filters: defaultFilters,
        requestedFields,
        pageNumber,
      });

      const firstCandidate = result.candidates[0];

      expect(firstCandidate).toHaveProperty("id");
    });

    it('should return "reason" as an empty array if the candidate is approved', () => {
      const filters = {
        onlyApproved: true,
        search: "",
      };

      const result = candidateService.all({
        filters,
        requestedFields,
        pageNumber,
      });

      const firstCandidate = result.candidates[0];

      expect(firstCandidate.reason).toEqual([]);
    });

    it("should return an empty array if there are no candidates", () => {
      const filters = {
        onlyApproved: false,
        search: "Julien Smith",
      };

      const result = candidateService.all({
        filters,
        requestedFields,
        pageNumber,
      });

      expect(result.candidates).toEqual([]);
    });

    it("should return results for the second page only", () => {
      const result = candidateService.all({
        filters: defaultFilters,
        requestedFields,
        pageNumber: 2,
      });

      expect(result.candidates.length).toBe(1);
      expect(result.numberOfRecords).toBe(11);
    });

    it("should return an empty array if there are no candidates for a page", () => {
      const result = candidateService.all({
        filters: defaultFilters,
        requestedFields,
        pageNumber: 33,
      });

      expect(result.candidates).toEqual([]);
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

      expect(result.reason).toMatchObject(expectedReasons);
    });

    it("should throw an error if the reason does not exist", () => {
      const candidateId = "3";
      const reasonIds = [1, 2, 3, 29];

      expect(() =>
        candidateService.updateReasons({ candidateId, reasonIds })
      ).toThrowError("Reason not found");
    });
  });
});
