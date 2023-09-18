import { Project } from "ts-morph";
import { Importer } from "../src/analyze";
import { ImportClause, Module, NamedEntity, Type } from "../src/lib/famix/src/model/famix";

const importer = new Importer();
const project = new Project();

project.createSourceFile("oneClassExporter.ts",
    `export class ExportedClass {}`);

project.createSourceFile("oneClassImporter.ts",
    `import {ExportedClass} from "./oneClassExport";`);

const fmxRep = importer.famixRepFromProject(project);

describe('Tests for import clauses', () => {
    it("should contain an import clause for ExportedClass", () => {
        const importClauses = Array.from(fmxRep._getAllEntitiesWithType("ImportClause"));
        expect(importClauses).toBeTruthy();
        expect(importClauses.length).toBe(1);
        const importClause = importClauses[0] as ImportClause;
        expect(importClause).toBeTruthy();
        expect(importClause.getImportedEntity()).toBeTruthy();
        expect(importClause.getImportedEntity()?.getName()).toBe("ExportedClass");
        // importing entity is oneClassImporter.ts
        expect(importClause.getImportingEntity()).toBeTruthy();
        expect(importClause.getImportingEntity()?.getName()).toBe("oneClassImporter.ts");
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
        expect(exportedEntity?.getIncomingImports()?.values().next().value.getImportingEntity()?.getName()).toBe("oneClassImporter.ts");    }); 
});