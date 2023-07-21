//import { TS2Famix } from '../src/ts2famix-clean-version';
//import * as parser from '../src/new-parsing-strategy/analyze';
import { Importer } from '../src/new-parsing-strategy/analyze-class';

const filePaths = ["new_test_src/namespaces_and_classes.ts"];
//const importer = new TS2Famix();
const importer = new Importer();

//const fmxRep = importer.famixRepFromPath(filePaths);
//const fmxRep = parser.famixRepFromPath(filePaths);
const fmxRep = importer.famixRepFromPath(filePaths);

const theClass = fmxRep._getFamixClass("EntityClass");
const theClass2 = fmxRep._getFamixClass("class2");
const theClass3 = fmxRep._getFamixClass("clsInNsp3");
const theClass4 = fmxRep._getFamixClass("clsOutNsp");

describe('Tests for namespaces and classes', () => {
    
    it("should contain three namespaces", () => {
        expect(fmxRep._getFamixNamespaces().size).toBe(2);
    });

    it("should contain a namespace MyNamespace", () => {
        expect(fmxRep._getFamixNamespace("MyNamespace")).toBeTruthy();
    });

    it("should contain a namespace Nsp3", () => {
        expect(fmxRep._getFamixNamespace("Nsp3")).toBeTruthy();
    });

    it("should contain four classes", () => {
        expect(fmxRep._getAllEntitiesWithType("Class").size).toBe(4);
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
