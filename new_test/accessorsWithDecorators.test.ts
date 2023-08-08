import { Importer } from '../src/analyze';
import { Decorator } from '../src/lib/famix/src/model/famix/decorator';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("accessorsWithDecorators",
    'function configurable(value: boolean) {\n\
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {\n\
        descriptor.configurable = value;\n\
    };\n\
}\n\
\n\
var b = function() {\n\
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {};\n\
};\n\
\n\
var x = b();\n\
\n\
class Point {\n\
    private _x: number;\n\
    private _y: number;\n\
    \n\
    constructor(x: number, y: number) {\n\
        this._x = x;\n\
        this._y = y;\n\
    }\n\
    \n\
    @x\n\
    @b()\n\
    @configurable(false)\n\
    get x() {\n\
        return this._x;\n\
    }\n\
    \n\
    @x\n\
    @b()\n\
    @configurable(false)\n\
    set y(y: number) {\n\
        this._y = y;\n\
    }\n\
}\n\
');

describe('Tests for accessors with decorators', () => {
    
    it("should contain one class", () => {
        expect(fmxRep._getAllEntitiesWithType("Class").size).toBe(1);
    });

    it("should contain six decorators", () => {
        expect(fmxRep._getAllEntitiesWithType("Decorator").size).toBe(6);
    });

    const theMethod1 = fmxRep._getFamixMethod("x");
    const theMethod2 = fmxRep._getFamixMethod("y");
    const d1 = (Array.from(fmxRep._getAllEntitiesWithType("Decorator")) as Array<Decorator>).filter((d) => d.getName() === "x");
    const d2 = (Array.from(fmxRep._getAllEntitiesWithType("Decorator")) as Array<Decorator>).filter((d) => d.getName() === "b");
    const d3 = (Array.from(fmxRep._getAllEntitiesWithType("Decorator")) as Array<Decorator>).filter((d) => d.getName() === "configurable");

    it("should contain two accessors with three decorators for each one", () => {
        expect(theMethod1?.getDecorators().size).toBe(3);
        expect(d1[0]?.getDecoratedEntity()).toBe(theMethod1);
        expect(d2[0]?.getDecoratedEntity()).toBe(theMethod1);
        expect(d3[0]?.getDecoratedEntity()).toBe(theMethod1);

        expect(theMethod2?.getDecorators().size).toBe(3);
        expect(d1[1]?.getDecoratedEntity()).toBe(theMethod2);
        expect(d2[1]?.getDecoratedEntity()).toBe(theMethod2);
        expect(d3[1]?.getDecoratedEntity()).toBe(theMethod2);
    });
});
