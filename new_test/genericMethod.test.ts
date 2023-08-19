import { Importer } from '../src/analyze';
import { Class } from "../src/lib/famix/src/model/famix/class";
import { Method } from "../src/lib/famix/src/model/famix/method";
import { Parameter } from "../src/lib/famix/src/model/famix/parameter";

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("genericMethod", 
    'class AA {\n\
    public i<T> (j: T): void {}\n\
}\n\
');

describe('Tests for generics', () => {

    const theClass = fmxRep._getFamixClass("AA");

    it("should parse generics", () => {
        expect(fmxRep).toBeTruthy();
    });
    
    it("should contain one class", () => {
        expect(fmxRep._getAllEntitiesWithType("Class").size).toBe(1);
    });

    it("should contain a class AA", () => {
        const listOfNames = Array.from(fmxRep._getAllEntitiesWithType("Class")).map(e => (e as Class).getName());
        expect(listOfNames).toContain("AA");
    });

    it("should not be an abstract class", () => {
        expect(theClass).toBeTruthy();
        if (theClass) expect(theClass.getIsAbstract()).toBe(false);
    });

    it("should contain a generic method i for class AA with type parameter T", () => {
        const cList = Array.from(fmxRep._getAllEntitiesWithType("Class") as Set<Class>);
        expect(cList).toBeTruthy();
        const AA = cList.find(c => c.getName() === "AA");
        const mList = Array.from(AA?.getMethods() as Set<Method>);
        const i = mList?.find(m => m.getName() === "i");
        expect(i).toBeTruthy();
        expect(i?.getDeclaredType().getName()).toBe("void");
        expect(i?.getParameters().size).toBe(1);
        const pList = Array.from(i?.getParameters() as Set<Parameter>);
        const j = pList?.find(p => p.getName() === "j");
        expect(j).toBeTruthy();
        expect(j?.getDeclaredType().getName()).toBe("T");
    });

    it("should contain a public method i", () => {
        const pList = Array.from(fmxRep._getAllEntitiesWithType("Method") as Set<Method>);
        expect(pList).toBeTruthy();
        const i = pList.find(p => p.getName() === "i");
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
});
