import { Importer } from '../src/analyze';
import { ImportClause } from '../src/lib/famix/src/model/famix/import_clause';
import { Module } from '../src/lib/famix/src/model/famix/module';

const importer = new Importer();

let filePaths = new Array<string>();
filePaths.push("test_src/sampleForModule.ts");
filePaths.push("test_src/sampleForModule2.ts");

const fmxRep = importer.famixRepFromPaths(filePaths);

describe('Tests for module', () => {
    
    const moduleList = Array.from(fmxRep._getAllEntitiesWithType('Module')) as Array<Module>;
    const theFile = moduleList.find(e => e.getName() === 'sampleForModule.ts');
    const theFile2 = moduleList.find(e => e.getName() === 'sampleForModule2.ts');
    it("should have two modules", () => {
        expect(moduleList?.length).toBe(2);
        expect(theFile).toBeTruthy();
        expect(theFile2).toBeTruthy();
    });

    const theClass = fmxRep._getFamixClass('ClassZ');
    const importClauseList = Array.from(fmxRep._getAllEntitiesWithType('ImportClause')) as Array<ImportClause>;
    it("should have four import clauses", () => {
        expect(importClauseList?.length).toBe(4);

        const theImportClause = importClauseList.find(e => e.getImporter().getName() === 'sampleForModule2.ts' && e.getImportedEntity().getName() === 'ClassDeclaration' && e.getModuleSpecifier() === 'ts-morph');
        expect(theImportClause).toBeTruthy();

        const theImportClause2 = importClauseList.find(e => e.getImporter().getName() === 'sampleForModule2.ts' && e.getImportedEntity().getName() === 'ConstructorDeclaration' && e.getModuleSpecifier() === 'ts-morph');
        expect(theImportClause2).toBeTruthy();

        const theImportClause3 = importClauseList.find(e => e.getImporter().getName() === 'sampleForModule2.ts' && e.getImportedEntity().getName() === 'Importer' && e.getModuleSpecifier() === '../src/analyze');
        expect(theImportClause3).toBeTruthy();

        const theImportClause4 = importClauseList.find(e => e.getImporter().getName() === 'sampleForModule2.ts' && e.getImportedEntity().getName() === 'ClassZ' && e.getModuleSpecifier() === '../test_src/sampleForModule');
        expect(theImportClause4).toBeTruthy();
        expect(theImportClause4?.getImportedEntity()).toBe(theClass);
    });
});
