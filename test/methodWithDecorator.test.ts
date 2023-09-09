import { Project } from 'ts-morph';
import { Importer } from '../src/analyze';
import { Decorator } from '../src/lib/famix/src/model/famix/decorator';

const importer = new Importer();
const project = new Project();

project.createSourceFile("methodWithDecorator.ts",
`function first() {
    console.log("first(): factory evaluated");
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("first(): called");
    };
}

class ExampleClass {
    @first()
    method() {}
}
`);

const fmxRep = importer.famixRepFromProject(project);

describe('Tests for method with decorator', () => {
    
    it("should contain one class", () => {
        expect(fmxRep._getAllEntitiesWithType("Class").size).toBe(1);
    });

    it("should contain a method 'method'", () => {
        expect(fmxRep._getAllEntitiesWithType("Method").size).toBe(1);
        const theMethod = fmxRep._getFamixMethod("method");
        expect(theMethod).toBeTruthy();
    });

    it("should contain one decorator", () => {
        expect(fmxRep._getAllEntitiesWithType("Decorator").size).toBe(1);
    });

    const theMethod = fmxRep._getFamixMethod("method");
    const d = (Array.from(fmxRep._getAllEntitiesWithType("Decorator")) as Array<Decorator>).find((d) => d.getName() === "@first");

    it("should contain a method with one decorator", () => {
        expect(theMethod?.getDecorators().size).toBe(1);
        expect(d?.getDecoratedEntity()).toBe(theMethod);
        expect(d?.getDecoratorExpression()).toBe("first()");
    });
});
