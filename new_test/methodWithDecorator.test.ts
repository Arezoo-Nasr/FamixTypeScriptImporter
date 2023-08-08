import { Importer } from '../src/analyze';
import { Decorator } from '../src/lib/famix/src/model/famix/decorator';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("methodWithDecorator",
    'function first() {\n\
    console.log("first(): factory evaluated");\n\
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {\n\
        console.log("first(): called");\n\
    };\n\
}\n\
\n\
class ExampleClass {\n\
    @first()\n\
    method() {}\n\
}\n\
');

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
    const d = (Array.from(fmxRep._getAllEntitiesWithType("Decorator")) as Array<Decorator>).find((d) => d.getName() === "first");

    it("should contain a method with one decorator", () => {
        expect(theMethod?.getDecorators().size).toBe(1);
        expect(d?.getDecoratedEntity()).toBe(theMethod);
    });
});
