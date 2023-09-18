import { Project } from "ts-morph";
import { Importer } from "../src/analyze";
import { ImportClause, Module, NamedEntity } from "../src/lib/famix/src/model/famix";

const importer = new Importer();
const project = new Project();

project.createSourceFile("oneClassExporter.ts",
    `export class ExportedClass {}`);

project.createSourceFile("oneClassImporter.ts",
    `import {ExportedClass} from "./oneClassExport";`);

project.createSourceFile("complexClassModule.ts",
    `class ClassZ {}
class ClassY {}
export class ClassX {}

export { ClassZ, ClassY };
export { Importer } from '../src/analyze';

export default class ClassW {}

export namespace Nsp {}
`);

project.createSourceFile("defaultImporterModule.ts",
    `import * as test from "./sampleForModule.ts";`);

const fmxRep = importer.famixRepFromProject(project);

describe('Tests for import clauses', () => {
    it("should have four modules", () => {
        const moduleList = Array.from(fmxRep._getAllEntitiesWithType('Module')) as Array<Module>;
        expect(moduleList?.length).toBe(4);
        const exporterModule = moduleList.find(e => e.getName() === 'oneClassExporter.ts');
        expect(exporterModule).toBeTruthy();
        const importerModule = moduleList.find(e => e.getName() === 'oneClassImporter.ts');
        expect(importerModule).toBeTruthy();
        const complexModule = moduleList.find(e => e.getName() === 'complexClassModule.ts');
        expect(complexModule).toBeTruthy();
    });

    it("should have a default import clause for test", () => {
        const importClauses = Array.from(fmxRep._getAllEntitiesWithType("ImportClause")) as Array<ImportClause>;
        expect(importClauses).toBeTruthy();
        expect(importClauses.length).toBe(2);
        // find the import clause for ClassW
        const importClause = importClauses.find(e => e.getImportedEntity()?.getName() === 'test');
        expect(importClause).toBeTruthy();
        // importing entity is complexClassModule.ts
        expect(importClause?.getImportingEntity()).toBeTruthy();
        expect(importClause?.getImportingEntity()?.getName()).toBe("defaultImporterModule.ts");
    });

    it("should contain an import clause for ExportedClass", () => {
        const importClauses = Array.from(fmxRep._getAllEntitiesWithType("ImportClause")) as Array<ImportClause>;
        expect(importClauses).toBeTruthy();
        expect(importClauses.length).toBe(2);
        const importClause = importClauses.find(e => e.getImportedEntity()?.getName() === 'test');
        expect(importClause).toBeTruthy();
        // importing entity is oneClassImporter.ts
        expect(importClause?.getImportingEntity()).toBeTruthy();
        expect(importClause?.getImportingEntity()?.getName()).toBe("defaultImporterModule.ts");
    });

    it("should contain one outgoingImports element for module oneClassImporter.ts", () => {
        const moduleList = Array.from(fmxRep._getAllEntitiesWithType('Module')) as Array<Module>;
        const importerModule = moduleList.find(e => e.getName() === 'oneClassImporter.ts');
        expect(importerModule).toBeTruthy();
        expect(importerModule?.getOutgoingImports()).toBeTruthy();
        expect(importerModule?.getOutgoingImports()?.size).toBe(1);
        expect(importerModule?.getOutgoingImports()?.values().next().value.getImportedEntity()?.getName()).toBe("ExportedClass");
    });

    it("should contain one imports element for module oneClassExporter.ts", () => {
        const entityList = Array.from(fmxRep._getAllEntitiesWithType('NamedEntity')) as Array<NamedEntity>;
        const exportedEntity = entityList.find(e => e.getName() === 'ExportedClass');
        expect(exportedEntity).toBeTruthy();
        expect(exportedEntity?.getIncomingImports()).toBeTruthy();
        expect(exportedEntity?.getIncomingImports()?.size).toBe(1);
        expect(exportedEntity?.getIncomingImports()?.values().next().value.getImportingEntity()?.getName()).toBe("oneClassImporter.ts");
    });
});