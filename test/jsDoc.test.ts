import { Importer } from '../src/analyze';
import { Comment } from '../src/lib/famix/src/model/famix/comment';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("jsDoc", 
    '/**\n\
* Gets the name.\n\
* @param person - Person to get the name from.\n\
*/\n\
function getName(person: string) {}\n\
');

describe('Tests for JS doc', () => {
    
    it("should contain one function and one comment", () => {
        expect(fmxRep._getAllEntitiesWithType("Function").size).toBe(1);
        expect(fmxRep._getAllEntitiesWithType("Comment").size).toBe(1);
    });

    const theFunction = fmxRep._getFamixFunction("getName");
    const theJSDoc = Array.from(fmxRep._getAllEntitiesWithType("Comment") as Set<Comment>)[0];

    it("should have one comment for the function", () => {
        expect(theFunction?.getComments().size).toBe(1);
        expect(theFunction?.getComments().has(theJSDoc)).toBe(true);
        expect(theJSDoc?.getContent()).toBe("/**\n* Gets the name.\n* @param person - Person to get the name from.\n*/");
        expect(theJSDoc?.getContainer()).toBe(theFunction);
        expect(theJSDoc?.getIsJSDoc()).toBe(true);
    });
});
