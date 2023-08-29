import { Importer } from '../src/analyze';
import { Access } from '../src/lib/famix/src/model/famix/access';
import { Parameter } from '../src/lib/famix/src/model/famix/parameter';
import { Variable } from '../src/lib/famix/src/model/famix/variable';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("accesses",
    'var b = 2;\n\
\n\
var x = b;\n\
\n\
class P {\n\
    m(param) {\n\
        var z = param;\n\
    }\n\
}\n\
');

describe('Tests for accesses', () => {
    
    it("should contain one class", () => {
        expect(fmxRep._getAllEntitiesWithType("Class").size).toBe(1);
    });

    const theFile = fmxRep._getFamixFile("accesses.ts");
    const theMethod = fmxRep._getFamixMethod("m");

    it("should contain one access to 'b'", () => {
        const theVariable = Array.from(fmxRep._getAllEntitiesWithType("Variable") as Set<Variable>).find(v => v.getName() === "b");
        const theAccess = Array.from(fmxRep._getAllEntitiesWithType("Access") as Set<Access>).find(a => a.getVariable() === theVariable && a.getAccessor() === theFile);
        expect(theAccess).toBeTruthy();
        expect(theAccess?.getIsWrite()).toBe(undefined);
    });

    it("should contain one access to 'param'", () => {
        const theParam = Array.from(fmxRep._getAllEntitiesWithType("Parameter") as Set<Parameter>).find(v => v.getName() === "param");
        const theAccess = Array.from(fmxRep._getAllEntitiesWithType("Access") as Set<Access>).find(a => a.getVariable() === theParam && a.getAccessor() === theMethod);
        expect(theAccess).toBeTruthy();
        expect(theAccess?.getIsWrite()).toBe(undefined);
    });
});
