import { Importer } from '../src/analyze';
import { Comment } from '../src/lib/famix/src/model/famix/comment';

const importer = new Importer();

const fmxRep = importer.famixRepFromSource("abstractClassWithComments", 
    '// before\n\
abstract class MyAbstractClass {} // a comment\n\
// after\n\
/* test */\n\
/**\n\
 * test2\n\
 */\n\
function tst() {}\n\
');

describe('Tests for abstract class with comments', () => {
    
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

    it("should have two comments for the abstract class", () => {
        expect(theAbstractClass?.getComments().size).toBe(2);
        const comments = Array.from(theAbstractClass?.getComments() as Set<Comment>);
        expect(comments[0]?.getContent()).toBe("// before");
        expect(comments[0]?.getContainer()).toBe(theAbstractClass);
        expect(comments[1]?.getContent()).toBe("// a comment");
        expect(comments[1]?.getContainer()).toBe(theAbstractClass);
    });

    it("should contain one function", () => {
        expect(fmxRep._getAllEntitiesWithType("Function").size).toBe(1);
    });

    const theFunction = fmxRep._getFamixFunction("tst");
    it("should have three comments for the function", () => {
        expect(theFunction?.getComments().size).toBe(3);
        const comments = Array.from(theFunction?.getComments() as Set<Comment>);
        expect(comments[0]?.getContent()).toBe("// after");
        expect(comments[0]?.getContainer()).toBe(theFunction);
        expect(comments[0]?.getIsJSDoc()).toBe(false);
        expect(comments[1]?.getContent()).toBe("/* test */");
        expect(comments[1]?.getContainer()).toBe(theFunction);
        expect(comments[1]?.getIsJSDoc()).toBe(false);
        expect(comments[2]?.getContent()).toBe("/**\n * test2\n */");
        expect(comments[2]?.getContainer()).toBe(theFunction); 
        expect(comments[2]?.getIsJSDoc()).toBe(true);
    });
});
