import * as awilix from "awilix";

const container = awilix.createContainer();

container.loadModules(["**/*.service.ts", "**/*.repository.ts"], {
  formatName: "camelCase",
});

export default container;
