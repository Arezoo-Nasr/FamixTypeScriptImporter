import { Importer } from '../src/analyze';
import { Method } from "../src/lib/famix/src/model/famix/method";
import { Variable } from "../src/lib/famix/src/model/famix/variable";
import { Invocation } from "../src/lib/famix/src/model/famix/invocation";
import { Project } from 'ts-morph';

const importer = new Importer();
const project = new Project();

project.createSourceFile("invocationWithVariable.ts",
`class AAA {
    public method(): void {}
}

const x1 = new AAA();
x1.method();
`);

const fmxRep = importer.famixRepFromProject(project);

describe('Tests for invocation with variable', () => {
    
    it("should contain a variable 'x1' instance of 'AAA'", () => {
        const pList = Array.from(fmxRep._getAllEntitiesWithType("Variable") as Set<Variable>);
        expect(pList).toBeTruthy();
        const x1 = pList.find(p => p.getName() === "x1");
        expect(x1).toBeTruthy();
        expect(x1?.getDeclaredType().getName()).toBe("AAA");
    });
    
    const theMethod = fmxRep._getFamixMethod("method") as Method;
    const invocations = Array.from(fmxRep._getAllEntitiesWithType("Invocation"));
    
    it("should contain one invocation", () => {
        expect(invocations).toBeTruthy();
        expect(invocations.length).toBe(1);
    });

    it("should contain an invocation for 'method'", () => {
        expect((invocations[0] as Invocation).getCandidates().has(theMethod));
    });

    it("should contain an invocation with a sender 'invocationWithVariable.ts'", () => {
        expect((invocations[0] as Invocation).getSender()).toBe(fmxRep._getFamixFile("invocationWithVariable.ts"));
    });

    it("should contain an invocation with a receiver 'AAA'", () => {
        expect((invocations[0] as Invocation).getReceiver()).toBe(fmxRep._getFamixClass("AAA"));
    });
});
