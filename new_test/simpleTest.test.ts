import { Importer } from '../src/analyze';
import { ScriptEntity } from '../src/lib/famix/src/model/famix/script_entity';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("simpleTest", 
    'console.log("Hello");\n\
');

describe('Tests for simple test', () => {
    
    const scriptEntityList = Array.from(fmxRep._getAllEntitiesWithType('ScriptEntity')) as Array<ScriptEntity>;
    const theFile = scriptEntityList.find(e => e.getName() === 'simpleTest.ts');
    it("should have one file", () => {
        expect(scriptEntityList?.length).toBe(1);
        expect(theFile).toBeTruthy();
    });
});
