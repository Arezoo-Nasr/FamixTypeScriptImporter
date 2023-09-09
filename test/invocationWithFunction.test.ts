import { Importer } from '../src/analyze';
import { Function as FamixFunctionEntity } from "../src/lib/famix/src/model/famix/function";
import { Variable } from "../src/lib/famix/src/model/famix/variable";
import { Invocation } from "../src/lib/famix/src/model/famix/invocation";
import { Project } from 'ts-morph';

const importer = new Importer();

const project = new Project();
project.createSourceFile("invocationWithFunction.ts", 
`function func(): void {}
const x1 = func();`);

const fmxRep = importer.famixRepFromProject(project);

describe('tests for project containing the source file', () => {
    it("should contain one source file", () => {
        expect(project.getSourceFiles().length).toBe(1);
    });
    it("should contain a source file 'invocationWithFunction.ts'", () => {
        expect(project.getSourceFiles()[0].getFilePath().endsWith("invocationWithFunction.ts")).toBe(true);
    });
});

describe('Tests for invocation with function', () => {
    it("should contain one function", () => {
        expect(fmxRep._getAllEntitiesWithType("Function").size).toBe(1);
    });
    it("should contain a variable 'x1'", () => {
        const pList = Array.from(fmxRep._getAllEntitiesWithType("Variable") as Set<Variable>);
        expect(pList).toBeTruthy();
        const x1 = pList.find(p => p.getName() === "x1");
        expect(x1).toBeTruthy();
    });
    
    const theFunction = fmxRep._getFamixFunction("func") as FamixFunctionEntity;
    const invocations = Array.from(fmxRep._getAllEntitiesWithType("Invocation"));
    
    it("should contain one invocation", () => {
        expect(invocations).toBeTruthy();
        expect(invocations.length).toBe(1);
    });

    it("should contain an invocation for 'func'", () => {
        expect((invocations[0] as Invocation).getCandidates().has(theFunction));
    });

    it("should contain an invocation with a sender 'invocationWithFunction.ts'", () => {
        expect((invocations[0] as Invocation).getSender()).toBe(fmxRep._getFamixFile("invocationWithFunction.ts"));
    });

    it("should contain an invocation with a receiver 'invocationWithFunction.ts'", () => {
        expect((invocations[0] as Invocation).getReceiver()).toBe(fmxRep._getFamixFile("invocationWithFunction.ts"));
    });
});
