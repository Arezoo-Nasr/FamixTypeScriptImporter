//import { TS2Famix } from '../src/ts2famix-clean-version';
import * as parser from '../src/new-parsing-strategy/analyze';

const filePaths = ["new_test_src/namespaces_and_classes.ts"];
//const importer = new TS2Famix();

//const fmxRep2 = importer.famixRepFromPath(filePaths);
const fmxRep2 = parser.famixRepFromPath(filePaths);
const theClass = fmxRep2._getFamixClass("EntityClass");
const theClass2 = fmxRep2._getFamixClass("class2");
const theClass3 = fmxRep2._getFamixClass("clsInNsp3");
const theClass4 = fmxRep2._getFamixClass("clsOutNsp");

describe('Tests for namespaces and classes', () => {
    
    it("should contain three namespaces", () => {
        expect(fmxRep2._getFamixNamespaces().size).toBe(2);
    });

    it("should contain a namespace MyNamespace", () => {
        expect(fmxRep2._getFamixNamespace("MyNamespace")).toBeTruthy();
    });

    it("should contain a namespace Nsp3", () => {
        expect(fmxRep2._getFamixNamespace("Nsp3")).toBeTruthy();
    });

    it("should contain four classes", () => {
        expect(fmxRep2._getAllEntitiesWithType("Class").size).toBe(4);
    });

    it("should contain a class EntityClass", () => {
        expect(theClass).toBeTruthy();
    });

    it("should contain a class class2", () => {
        expect(theClass2).toBeTruthy();
    });

    it("should contain a class clsInNsp3", () => {
        expect(theClass3).toBeTruthy();
    });

    it("should contain a class clsOutNsp", () => {
        expect(theClass4).toBeTruthy();
    });
});
