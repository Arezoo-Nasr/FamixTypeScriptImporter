import { Importer } from '../src/analyze';
import { ParameterizedType } from '../src/lib/famix/src/model/famix/parameterized_type';
import { PrimitiveType } from '../src/lib/famix/src/model/famix/primitive_type';
import { Type } from '../src/lib/famix/src/model/famix/type';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("types", 
    'let a: string;\n\
let b: number;\n\
let c: Map<any, boolean>;\n\
class A {}\n\
let d = new A();\n\
');

describe('Tests for types', () => {
    
    it("should contain one class", () => {
        expect(fmxRep._getAllEntitiesWithType("Class").size).toBe(1);
        expect(fmxRep._getFamixClass("A")).toBeTruthy();
    });

    it("should contain three types, three primitive types and one parameterized type", () => {
        expect(fmxRep._getAllEntitiesWithType("Type").size).toBe(3);
        expect(Array.from(fmxRep._getAllEntitiesWithType("Type") as Set<Type>).find(t => t.getName() === "Map")).toBeTruthy();
        expect(Array.from(fmxRep._getAllEntitiesWithType("Type") as Set<Type>).find(t => t.getName() === "any")).toBeTruthy();
        expect(Array.from(fmxRep._getAllEntitiesWithType("Type") as Set<Type>).find(t => t.getName() === "A")).toBeTruthy();
        expect(fmxRep._getAllEntitiesWithType("PrimitiveType").size).toBe(3);
        expect(Array.from(fmxRep._getAllEntitiesWithType("PrimitiveType") as Set<PrimitiveType>).find(t => t.getName() === "string")).toBeTruthy();
        expect(Array.from(fmxRep._getAllEntitiesWithType("PrimitiveType") as Set<PrimitiveType>).find(t => t.getName() === "number")).toBeTruthy();
        expect(Array.from(fmxRep._getAllEntitiesWithType("PrimitiveType") as Set<PrimitiveType>).find(t => t.getName() === "boolean")).toBeTruthy();
        expect(Array.from(fmxRep._getAllEntitiesWithType("PrimitiveType") as Set<PrimitiveType>).find(t => t.getName() === "string")?.getIsStub()).toBe(true);
        expect(Array.from(fmxRep._getAllEntitiesWithType("PrimitiveType") as Set<PrimitiveType>).find(t => t.getName() === "number")?.getIsStub()).toBe(true);
        expect(Array.from(fmxRep._getAllEntitiesWithType("PrimitiveType") as Set<PrimitiveType>).find(t => t.getName() === "boolean")?.getIsStub()).toBe(true);
        expect(fmxRep._getAllEntitiesWithType("ParameterizedType").size).toBe(1);
        expect(Array.from(fmxRep._getAllEntitiesWithType("ParameterizedType") as Set<ParameterizedType>).find(t => t.getName() === "Map<any, boolean>")).toBeTruthy();
    });

    it("should have types.ts for container", () => {
        const theFile = fmxRep._getFamixFile("types.ts");
        expect(Array.from(fmxRep._getAllEntitiesWithType("Type") as Set<Type>)[0].getContainer()).toBe(theFile);
    });

    it("should have Map for base type of Map<any, boolean>", () => {
        const theBaseType = Array.from(fmxRep._getAllEntitiesWithType("Type") as Set<Type>).find(t => t.getName() === "Map");
        const theParameterizedType = Array.from(fmxRep._getAllEntitiesWithType("ParameterizedType") as Set<ParameterizedType>).find(t => t.getName() === "Map<any, boolean>");
        expect(theParameterizedType?.getBaseType()).toBe(theBaseType);
    });

    it("should have any and boolean for arguments of Map<any, boolean>", () => {
        const theAnyType = Array.from(fmxRep._getAllEntitiesWithType("Type") as Set<Type>).find(t => t.getName() === "any");
        const theBooleanType = Array.from(fmxRep._getAllEntitiesWithType("PrimitiveType") as Set<PrimitiveType>).find(t => t.getName() === "boolean");
        const theParameterizedType = Array.from(fmxRep._getAllEntitiesWithType("ParameterizedType") as Set<ParameterizedType>).find(t => t.getName() === "Map<any, boolean>");
        expect(theParameterizedType?.getArguments().size).toBe(2);
        expect(Array.from(theParameterizedType?.getArguments() as Set<Type>)[0]).toBe(theAnyType);
        expect(Array.from(theParameterizedType?.getArguments() as Set<Type>)[1]).toBe(theBooleanType);
    });
});
