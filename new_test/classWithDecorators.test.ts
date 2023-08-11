import { Importer } from '../src/analyze';
import { Decorator } from '../src/lib/famix/src/model/famix/decorator';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("classWithDecorators", 
    'function sealed(constructor: Function) { // function can\'t take other parameters with constructor\n\
    Object.seal(constructor);\n\
    Object.seal(constructor.prototype);\n\
}\n\
\n\
function reportableClassDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {\n\
    return class extends constructor {\n\
        reportingURL = "http://www...";\n\
    };\n\
}\n\
\n\
// the signature is different from the one of the other decorators\n\
var d = function decoratorWithParameter(parameter: string) {\n\
    return function (target: Function) {\n\
        // use parameter in decorator behavior\n\
        console.log("Decorator parameter :", parameter);\n\
    };\n\
};\n\
\n\
var c = d("param2");\n\
\n\
@c\n\
@d("param")\n\
@sealed\n\
@reportableClassDecorator\n\
class BugReport {\n\
    type = "report";\n\
    title: string;\n\
    \n\
    constructor(t: string) {\n\
        this.title = t;\n\
    }\n\
}\n\
');

describe('Tests for class with decorators', () => {
    
    it("should contain one class", () => {
        expect(fmxRep._getAllEntitiesWithType("Class").size).toBe(1);
    });

    it("should contain four decorators", () => {
        expect(fmxRep._getAllEntitiesWithType("Decorator").size).toBe(4);
    });

    const theClass = fmxRep._getFamixClass("BugReport");
    const d1 = (Array.from(fmxRep._getAllEntitiesWithType("Decorator")) as Array<Decorator>).find((d) => d.getName() === "@c");
    const d2 = (Array.from(fmxRep._getAllEntitiesWithType("Decorator")) as Array<Decorator>).find((d) => d.getName() === "@d");
    const d3 = (Array.from(fmxRep._getAllEntitiesWithType("Decorator")) as Array<Decorator>).find((d) => d.getName() === "@sealed");
    const d4 = (Array.from(fmxRep._getAllEntitiesWithType("Decorator")) as Array<Decorator>).find((d) => d.getName() === "@reportableClassDecorator");

    it("should contain a class with four decorators", () => {
        expect(theClass?.getDecorators().size).toBe(4);
        expect(d1?.getDecoratedEntity()).toBe(theClass);
        expect(d2?.getDecoratedEntity()).toBe(theClass);
        expect(d3?.getDecoratedEntity()).toBe(theClass);
        expect(d4?.getDecoratedEntity()).toBe(theClass);
    });
});
