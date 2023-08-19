import { Importer } from '../src/analyze';
import { Comment } from '../src/lib/famix/src/model/famix/comment';
import { JSDoc } from '../src/lib/famix/src/model/famix/js_doc';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("jsDoc", 
    '/**\n\
* Gets the name.\n\
* @param person - Person to get the name from.\n\
*/\n\
function getName(person: string) {}\n\
');

describe('Tests for JS doc', () => {
    
    it("should contain one function, one JS doc and one comment", () => {
        expect(fmxRep._getAllEntitiesWithType("Function").size).toBe(1);
        expect(fmxRep._getAllEntitiesWithType("JSDoc").size).toBe(1);
        expect(fmxRep._getAllEntitiesWithType("Comment").size).toBe(1);
    });

    const theFunction = fmxRep._getFamixFunction("getName");
    const theJSDoc = Array.from(fmxRep._getAllEntitiesWithType("JSDoc") as Set<JSDoc>)[0];
    const theComment = Array.from(fmxRep._getAllEntitiesWithType("Comment") as Set<Comment>)[0];

    it("should have one JS doc and one comment with same content for the function", () => {
        expect(theFunction?.getJSDocs().size).toBe(1);
        expect(theFunction?.getComments().size).toBe(1);
        expect(theFunction?.getJSDocs().has(theJSDoc)).toBe(true);
        expect(theFunction?.getComments().has(theComment)).toBe(true);
        expect(theJSDoc?.getContent()).toBe("/**\n* Gets the name.\n* @param person - Person to get the name from.\n*/");
        expect(theJSDoc?.getContent()).toBe(theComment?.getContent());
        expect(theJSDoc?.getContainer()).toBe(theFunction);
        expect(theJSDoc?.getContainer()).toBe(theComment?.getContainer());
        expect(theJSDoc?.getDescription()).toBe("Gets the name.");
    });
});
