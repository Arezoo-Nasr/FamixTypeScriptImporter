//import { TS2Famix } from '../src/ts2famix-clean-version';
import * as parser from '../src/new-parsing-strategy/analyze'
import { ParameterizableClass } from "../src/lib/famix/src/model/famix/parameterizable_class";
import { Method } from "../src/lib/famix/src/model/famix/method";
import { Parameter } from "../src/lib/famix/src/model/famix/parameter";
import { LocalVariable } from "../src/lib/famix/src/model/famix/local_variable";

const filePaths = ["new_test_src/testGenerics.ts"];
//const importer = new TS2Famix();

//const fmxRep2 = importer.famixRepFromPath(filePaths);
const fmxRep2 = parser.famixRepFromPath(filePaths);
const theClass = fmxRep2.getFamixClass("AA");

describe('Tests for testGenerics', () => {

    it("should parse generics", () => {
        expect(fmxRep2).toBeTruthy()
    });
    
    it("should contain one generic class", () => {
        expect(fmxRep2.getAllEntitiesWithType("ParameterizableClass").size).toBe(1);
    });

    it("should contain a generic class AA", () => {
        const listOfNames = Array.from(fmxRep2.getAllEntitiesWithType("ParameterizableClass")).map(e => (e as ParameterizableClass).getName());
        expect(listOfNames).toContain("AA");
    });

    it("should contain a generic class AA with no parameter type", () => {
        const pList = Array.from(fmxRep2.getAllEntitiesWithType("ParameterizableClass") as Set<ParameterizableClass>);
        expect(pList).toBeTruthy();
        const AA = pList.find(p => p.getName() == "AA");
        expect(AA).toBeTruthy();
        expect(AA?.getParameterTypes().size).toBe(0);
    });

    it("should not be an abstract class", () => {
        expect(theClass).toBeTruthy();
        if (theClass) expect(theClass.getIsAbstract()).toBe(false);
    });

    it("should not be an interface", () => {
        expect(theClass).toBeTruthy();
        if (theClass) expect(theClass.getIsInterface()).toBe(false);
    });

    it("should contain a generic method i for class AA with parameter type T", () => {
        const cList = Array.from(fmxRep2.getAllEntitiesWithType("ParameterizableClass") as Set<ParameterizableClass>);
        expect(cList).toBeTruthy();
        const AA = cList.find(c => c.getName() == "AA");
        const mList = Array.from(AA?.getMethods() as Set<Method>);
        const i = mList?.find(m => m.getName() == "i");
        expect(i).toBeTruthy();
        expect(i?.getDeclaredType().getName()).toBe("void");
        expect(i?.getParameters().size).toBe(1);
        const pList = Array.from(i?.getParameters() as Set<Parameter>);
        const j = pList?.find(p => p.getName() == "j");
        expect(j).toBeTruthy();
        expect(j?.getDeclaredType().getName()).toBe("T");
    });

    it("should contain a public method i", () => {
        const pList = Array.from(fmxRep2.getAllEntitiesWithType("Method") as Set<Method>);
        expect(pList).toBeTruthy();
        const i = pList.find(p => p.getName() == "i");
        expect(i).toBeTruthy();
        if (i) {
            expect(i.getIsAbstract()).toBe(false);
            expect(i.getIsConstructor()).toBe(false);
            expect(i.getIsClassSide()).toBe(false);
            expect(i.getIsPrivate()).toBe(false);
            expect(i.getIsProtected()).toBe(false);
            expect(i.getIsPublic()).toBe(true);
        }
    });

    it("should contain a variable x", () => {
        const pList = Array.from(fmxRep2.getAllEntitiesWithType("LocalVariable") as Set<LocalVariable>);
        expect(pList).toBeTruthy();
        const x = pList.find(p => p.getName() == "x");
        expect(x).toBeTruthy();
        expect(x?.getDeclaredType().getName()).toBe("AA");
    });    
});
