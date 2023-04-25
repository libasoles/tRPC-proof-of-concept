import RejectionReasonService from "./rejectionReason.service";

describe("get all rejectino reasons", () => {
  it("should return a list of rejection reasons", () => {
    const rejectionReasonService = new RejectionReasonService();

    const result = rejectionReasonService.all();

    expect(result.length).toBe(8);
  });

  it("should return rejection reasons with the expected fields", () => {
    const rejectionReasonService = new RejectionReasonService();

    const result = rejectionReasonService.all();

    expect(result[0]).toEqual({
      id: 1,
      description: "Cantidad de materias aprobadas fuera de lo deseado",
    });
  });
});
