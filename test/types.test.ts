import { Project } from 'ts-morph';
import { Importer } from '../src/analyze';
import { ParameterizedType } from '../src/lib/famix/src/model/famix/parameterized_type';
import { PrimitiveType } from '../src/lib/famix/src/model/famix/primitive_type';
import { Type } from '../src/lib/famix/src/model/famix/type';
import { IndexedFileAnchor } from '../src/lib/famix/src/model/famix';

const importer = new Importer();
const project = new Project();
project.createSourceFile("types.ts",
`const aString: string = "one";
const aBoolean: boolean = false;
const aNumber: number = 3;
const aNull: null = null;
const anUnknown: unknown = 5;
const anAny: any = 6;
declare const aUniqueSymbol: unique symbol = Symbol("seven");
let aNever: never; // note that const eight: never cannot happen as we cannot instantiate a never
// See Theo Despoudis. TypeScript 4 Design Patterns and Best Practices (Kindle Locations 514-520). Packt Publishing Pvt Ltd.
const aBigint: bigint = 9n;
const aVoid: void = undefined;
const aSymbol: symbol = Symbol("ten");
const anUndefined: undefined = undefined;
class A {};
let a = new A();
let b: Map<any, boolean>;
`);

const fmxRep = importer.famixRepFromProject(project);

describe('Tests for types', () => {

    const types = Array.from(fmxRep._getAllEntitiesWithType("Type") as Set<Type>);
    const primitiveTypes = Array.from(fmxRep._getAllEntitiesWithType("PrimitiveType") as Set<PrimitiveType>);
    const parameterizedTypes = Array.from(fmxRep._getAllEntitiesWithType("ParameterizedType") as Set<ParameterizedType>);
    const theParameterizedType = parameterizedTypes.find(t => t.getName() === "Map<any, boolean>");
    const theBaseType = types.find(t => t.getName() === "Map");
    const theFile = fmxRep._getFamixFile("types.ts");
    const theAnyType = primitiveTypes.find(t => t.getName() === "any");
    const theBooleanType = primitiveTypes.find(t => t.getName() === "boolean");
    const theStringType = primitiveTypes.find(t => t.getName() === "string");
    const theNumberType = primitiveTypes.find(t => t.getName() === "number");
    const theNullType = primitiveTypes.find(t => t.getName() === "null");
    const theUndefinedType = primitiveTypes.find(t => t.getName() === "undefined");
    const theUnknownType = primitiveTypes.find(t => t.getName() === "unknown");
    const theNeverType = primitiveTypes.find(t => t.getName() === "never");
    const theUniqueType = primitiveTypes.find(t => t.getName() === "unique symbol"); // can't find this, it's just "symbol" normally, despite https://www.typescriptlang.org/docs/handbook/symbols.html#unique-symbol
    const theBigintType = primitiveTypes.find(t => t.getName() === "bigint");
    const theVoidType = primitiveTypes.find(t => t.getName() === "void");
    const theSymbolType = primitiveTypes.find(t => t.getName() === "symbol");

    it("should contain all the primitive types: string, boolean, void, number, null, undefined, unknown, never, symbol, (not unique symbol), bigint, any", () => {
        primitiveTypes.forEach(t => {console.info(t.getName());});
        expect(primitiveTypes.length).toBe(11); // not 12, because unique symbol is not found
        expect(theStringType).toBeTruthy();
        expect(theBooleanType).toBeTruthy();
        expect(theVoidType).toBeTruthy();
        expect(theNumberType).toBeTruthy();
        expect(theNullType).toBeTruthy();
        expect(theUndefinedType).toBeTruthy();
        expect(theUnknownType).toBeTruthy();
        expect(theNeverType).toBeTruthy();
        // below fails in ts-morph 19.0.0, see https://github.com/dsherret/ts-morph/issues/1453
        expect(theUniqueType).toBeFalsy(); // this should be true, but it's not found
        expect(theBigintType).toBeTruthy();
        expect(theAnyType).toBeTruthy();
        expect(theSymbolType).toBeTruthy();
    });

    it("should contain a variable 'a' of type 'A'", () => {
        const aVariable = fmxRep._getFamixVariable("a");
        expect(aVariable).toBeTruthy();
        expect(aVariable?.getDeclaredType()).toBeTruthy();
        expect(aVariable?.getDeclaredType()?.getName()).toBe("A");
    });

    it("should contain a parameterized type", () => {
        expect(parameterizedTypes.length).toBe(1);
        expect(parameterizedTypes.find(t => t.getName() === "Map<any, boolean>")).toBeTruthy();
    });

    it("should have Map for base type of Map<any, boolean>", () => {
        expect(theParameterizedType?.getBaseType()).toBe(theBaseType);
    });

    it("should have any and boolean for arguments of Map<any, boolean>", () => {
        expect(theParameterizedType?.getArguments().size).toBe(2);
        expect(Array.from(theParameterizedType?.getArguments() as Set<Type>)[0]).toBe(theAnyType);
        expect(Array.from(theParameterizedType?.getArguments() as Set<Type>)[1]).toBe(theBooleanType);
    });

    it("should have types.ts for container", () => {
        expect(types[0].getContainer()).toBe(theFile);
    });

    it("should have an IndexedFileAnchor with a filename of 'types.ts' for Map<any, boolean>", () => {
        const indexedFileAnchor = theParameterizedType?.getSourceAnchor();
        expect(indexedFileAnchor).toBeTruthy();
        expect((indexedFileAnchor as IndexedFileAnchor).getFileName().endsWith("types.ts")).toBe(true);
    });

});
