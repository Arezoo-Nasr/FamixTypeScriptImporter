import { Project } from "ts-morph";
import { Importer } from "../src/analyze";
import { ImportClause, Module, NamedEntity } from "../src/lib/famix/src/model/famix";

const importer = new Importer();
const project = new Project();

project.createSourceFile("oneClassExporter.ts",
    `export class ExportedClass {}`);

project.createSourceFile("oneClassImporter.ts",
    `import {ExportedClass} from "./oneClassExport";`);

project.createSourceFile("complexExportModule.ts",
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

project.createSourceFile("multipleClassImporterModule.ts",
    `import { ClassZ } from "./complexExportModule.ts";`);

const fmxRep = importer.famixRepFromProject(project);
const NUMBER_OF_MODULES = 5, NUMBER_OF_IMPORT_CLAUSES = 3;

const importClauses = Array.from(fmxRep._getAllEntitiesWithType("ImportClause")) as Array<ImportClause>;
const moduleList = Array.from(fmxRep._getAllEntitiesWithType('Module')) as Array<Module>;
const entityList = Array.from(fmxRep._getAllEntitiesWithType('NamedEntity')) as Array<NamedEntity>;

describe('Tests for import clauses', () => {

    it("should import ClassZ from module complexExporterModule.ts", () => {
        expect(importClauses).toBeTruthy();
        expect(importClauses.length).toBe(NUMBER_OF_IMPORT_CLAUSES);
        // find the import clause for ClassZ
        const importClause = importClauses.find(e => e.getImportedEntity()?.getName() === 'ClassZ');
        expect(importClause).toBeTruthy();
        // importing entity is multipleClassImporterModule.ts
        expect(importClause?.getImportingEntity()).toBeTruthy();
        expect(importClause?.getImportingEntity()?.getName()).toBe("multipleClassImporterModule.ts");
    });

    it(`should have ${NUMBER_OF_MODULES} modules`, () => {
        expect(moduleList?.length).toBe(NUMBER_OF_MODULES);
        const exporterModule = moduleList.find(e => e.getName() === 'oneClassExporter.ts');
        expect(exporterModule).toBeTruthy();
        const importerModule = moduleList.find(e => e.getName() === 'oneClassImporter.ts');
        expect(importerModule).toBeTruthy();
        const complexModule = moduleList.find(e => e.getName() === 'complexExportModule.ts');
        expect(complexModule).toBeTruthy();
    });

    it("should have a default import clause for test", () => {
        expect(importClauses).toBeTruthy();
        expect(importClauses.length).toBe(NUMBER_OF_IMPORT_CLAUSES);
        // find the import clause for ClassW
        const importClause = importClauses.find(e => e.getImportedEntity()?.getName() === 'test');
        expect(importClause).toBeTruthy();
        // importing entity is complexExportModule.ts
        expect(importClause?.getImportingEntity()).toBeTruthy();
        expect(importClause?.getImportingEntity()?.getName()).toBe("defaultImporterModule.ts");
    });

    it("should contain an import clause for ExportedClass", () => {
        expect(importClauses).toBeTruthy();
        expect(importClauses.length).toBe(NUMBER_OF_IMPORT_CLAUSES);
        const importClause = importClauses.find(e => e.getImportedEntity()?.getName() === 'test');
        expect(importClause).toBeTruthy();
        // importing entity is oneClassImporter.ts
        expect(importClause?.getImportingEntity()).toBeTruthy();
        expect(importClause?.getImportingEntity()?.getName()).toBe("defaultImporterModule.ts");
    });

    it("should contain one outgoingImports element for module oneClassImporter.ts", () => {
        const importerModule = moduleList.find(e => e.getName() === 'oneClassImporter.ts');
        expect(importerModule).toBeTruthy();
        expect(importerModule?.getOutgoingImports()).toBeTruthy();
        expect(importerModule?.getOutgoingImports()?.size).toBe(1);
        expect(importerModule?.getOutgoingImports()?.values().next().value.getImportedEntity()?.getName()).toBe("ExportedClass");
    });

    it("should contain one imports element for module oneClassExporter.ts", () => {
        const exportedEntity = entityList.find(e => e.getName() === 'ExportedClass');
        expect(exportedEntity).toBeTruthy();
        expect(exportedEntity?.getIncomingImports()).toBeTruthy();
        expect(exportedEntity?.getIncomingImports()?.size).toBe(1);
        expect(exportedEntity?.getIncomingImports()?.values().next().value.getImportingEntity()?.getName()).toBe("oneClassImporter.ts");
    });
});