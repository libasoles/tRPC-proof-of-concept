import * as awilix from "awilix";
import { Candidates } from "./testData";

const container = awilix.createContainer();

container.loadModules(["**/*.service.ts", "**/*.repository.ts"], {
  formatName: "camelCase",
});

container.register({
  candidates: awilix.asFunction(() => new Candidates()).singleton(),
});

export default container;
