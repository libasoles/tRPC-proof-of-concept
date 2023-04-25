import { reasons } from "../testData";

export default class RejectionReasonService {
  all() {
    return reasons; // no need for a repository here
  }
}
