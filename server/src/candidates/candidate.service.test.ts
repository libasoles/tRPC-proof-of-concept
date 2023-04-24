import CandidateService from "./candidate.service";

describe("CandidateService", () => {
  let candidateService: CandidateService;

  beforeEach(() => {
    candidateService = new CandidateService();
  });

  describe("all", () => {
    // TODO: setup a list of candidates
    it("should return a list of candidates", () => {
      const filters = {
        onlyApproved: false,
        search: "",
      };
      const requestedFields = ["name", "email"];
      const pageNumber = 2;

      const result = candidateService.all({
        filters,
        // @ts-ignore
        requestedFields,
        pageNumber,
      });

      expect(result.candidates).toBeDefined();
      expect(result.numberOfRecords).toBeDefined();
      expect(result.candidates.length).toBe(10);
      expect(result.numberOfRecords).toBe(66);
    });
  });

  describe("updateReasons", () => {
    it("should return transformed candidate", () => {
      const candidateId = "5a272e9068adf47eb31fe789";
      const reasonIds = [1, 2, 3];

      const result = candidateService.updateReasons({
        candidateId,
        reasonIds,
      });

      expect(result).toBeDefined();
    });
  });
});
