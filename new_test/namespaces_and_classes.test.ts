import { TS2Famix } from '../src/ts2famix-clean-version';

const filePaths = ["new_test_src/namespaces_and_classes.ts"];
const importer = new TS2Famix();

const fmxRep2 = importer.famixRepFromPath(filePaths);
const theClass = fmxRep2.getFamixClass("EntityClass");
const theClass2 = fmxRep2.getFamixClass("class2");
const theClass3 = fmxRep2.getFamixClass("clsInNsp3");
const theClass4 = fmxRep2.getFamixClass("clsOutNsp");

describe('Tests for namespaces and classes', () => {
    
    it("should parse generics", () => {
        expect(fmxRep2).toBeTruthy()
    });
    
    it("should contain two namespaces", () => {
        expect(fmxRep2.getFamixNamespaces().size).toBe(2);
    });

    it("should contain a namespace MyNamespace", () => {
        expect(fmxRep2.getFamixNamespace("MyNamespace")).toBeTruthy();
    });

    it("should contain a namespace Nsp3", () => {
        expect(fmxRep2.getFamixNamespace("Nsp3")).toBeTruthy();
    });

    it("should contain three generic classes", () => {
        expect(fmxRep2.getAllEntitiesWithType("ParameterizableClass").size).toBe(3);
    });

    it("should contain a class EntityClass", () => {
        expect(theClass).toBeTruthy();
    })

    it("should contain a class class2", () => {
        expect(theClass2).toBeTruthy();
    })

    it("should contain a class clsInNsp3", () => {
        expect(theClass3).toBeTruthy();
    })

    it("should not contain a class clsOutNsp", () => { // -> desired behavior ???
        expect(theClass4).toBeUndefined();
    })
});
