//import { TS2Famix } from '../src/ts2famix-clean-version';
import * as parser from '../src/new-parsing-strategy/analyze'
import { ParameterizableClass } from "../src/lib/famix/src/model/famix/parameterizable_class";
import { Method } from "../src/lib/famix/src/model/famix/method";

const filePaths = ["new_test_src/testInvoc.ts"];
//const importer = new TS2Famix();

//const fmxRep2 = importer.famixRepFromPath(filePaths);
const fmxRep2 = parser.famixRepFromPath(filePaths);
const theClass = fmxRep2.getFamixClass("A");
const theClass2 = fmxRep2.getFamixClass("B");

describe('Tests for testGenerics', () => {
    //console.log(fmxRep2.getAllEntities());
    it("should parse generics", () => {
        expect(fmxRep2).toBeTruthy()
    });
    
    it("should contain two generic class", () => {
        expect(fmxRep2.getAllEntitiesWithType("ParameterizableClass").size).toBe(2);
    });

    it("should contain a generic class A and a generic class B", () => {
        const listOfNames = Array.from(fmxRep2.getAllEntitiesWithType("ParameterizableClass")).map(e => (e as ParameterizableClass).getName());
        expect(listOfNames).toContain("A");
        expect(listOfNames).toContain("B");
    });

    it("should contain a generic method x for class A", () => {
        const cList = Array.from(fmxRep2.getAllEntitiesWithType("ParameterizableClass") as Set<ParameterizableClass>);
        expect(cList).toBeTruthy();
        const A = cList.find(c => c.getName() === "A");
        const mList = Array.from(A?.getMethods() as Set<Method>);
        const x = mList?.find(m => m.getName() === "x");
        expect(x).toBeTruthy();
        expect(x?.getDeclaredType().getName()).toBe("void");
        expect(x?.getParameters().size).toBe(0);
    });

    it("should contain a generic method y for class B", () => {
        const cList = Array.from(fmxRep2.getAllEntitiesWithType("ParameterizableClass") as Set<ParameterizableClass>);
        expect(cList).toBeTruthy();
        const B = cList.find(c => c.getName() === "B");
        const mList = Array.from(B?.getMethods() as Set<Method>);
        const y = mList?.find(m => m.getName() === "y");
        expect(y).toBeTruthy();
        expect(y?.getDeclaredType().getName()).toBe("void");
        expect(y?.getParameters().size).toBe(0);
    });

    // Test de l'invocation
    // it("should contain a variable x", () => {
    //     const pList = Array.from(fmxRep2.getAllEntitiesWithType("LocalVariable") as Set<LocalVariable>);
    //     expect(pList).toBeTruthy();
    //     const x = pList.find(p => p.getName() === "x");
    //     expect(x).toBeTruthy();
    //     expect(x?.getDeclaredType().getName()).toBe("AA");
    // });    
});
