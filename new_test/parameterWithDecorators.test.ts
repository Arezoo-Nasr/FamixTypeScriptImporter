import { Importer } from '../src/analyze';
import { Decorator } from '../src/lib/famix/src/model/famix/decorator';
import { Parameter } from '../src/lib/famix/src/model/famix/parameter';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("parameterWithDecorators",
    'function deco2(bo: boolean) {\n\
    return function(target: Object, propertyKey: string, parameterIndex: number) {\n\
        console.log(bo);\n\
    };\n\
}\n\
\n\
var tes = deco2(false);\n\
\n\
class BugReport2 {\n\
    type = "report";\n\
    title: string;\n\
    \n\
    constructor(t: string) {\n\
        this.title = t;\n\
    }\n\
    \n\
    print(@tes @deco2(true) verbose: boolean) {\n\
        if (verbose) {\n\
            return `type: ${this.type}, title: ${this.title}`;\n\
        }\n\
        else {\n\
            return this.title;\n\
        }\n\
    }\n\
}\n\
');

describe('Tests for parameter with decorators', () => {
    
    it("should contain one class", () => {
        expect(fmxRep._getAllEntitiesWithType("Class").size).toBe(1);
    });

    it("should contain two decorators", () => {
        expect(fmxRep._getAllEntitiesWithType("Decorator").size).toBe(2);
    });

    const theParam = (Array.from(fmxRep._getFamixMethod("print")?.getParameters() as Set<Parameter>) as Array<Parameter>).find((f) => f.getName() === "verbose");
    const d1 = (Array.from(fmxRep._getAllEntitiesWithType("Decorator")) as Array<Decorator>).find((d) => d.getName() === "tes");
    const d2 = (Array.from(fmxRep._getAllEntitiesWithType("Decorator")) as Array<Decorator>).find((d) => d.getName() === "deco2");

    it("should contain a parameter with two decorators", () => {
        expect(theParam?.getDecorators().size).toBe(2);
        expect(d1?.getDecoratedEntity()).toBe(theParam);
        expect(d2?.getDecoratedEntity()).toBe(theParam);
    });
});
