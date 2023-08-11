import { Importer } from '../src/analyze';
import { Comment } from '../src/lib/famix/src/model/famix/comment';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("abstractClassWithComment", 
    'abstract class MyAbstractClass {} // a comment\n\
');

describe('Tests for abstract class with comment', () => {
    
    it("should contain one class", () => {
        expect(fmxRep._getAllEntitiesWithType("Class").size).toBe(1);
    });

    const theAbstractClass = fmxRep._getFamixClass("MyAbstractClass");
    it("should contain an abstract class MyAbstractClass", () => {
        expect(theAbstractClass).toBeTruthy();
        if (theAbstractClass) {
            expect(theAbstractClass.getIsAbstract()).toBe(true);
        }
    });

    const theComment = Array.from(fmxRep._getAllEntitiesWithType("Comment"))[0] as Comment;
    it("should contain a comment", () => {
        expect(theAbstractClass?.getComments().size).toBe(1);
        expect(theComment?.getContent()).toBe("// a comment");
        expect(theComment?.getContainer()).toBe(theAbstractClass);
    });
});
