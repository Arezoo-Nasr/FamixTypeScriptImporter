import { Project } from "ts-morph";
import { Importer } from "../src/analyze";
import { IndexedFileAnchor, Method, Module } from "../src/lib/famix/src/model/famix";

const importer = new Importer();
const project = new Project();

project.createSourceFile("test_src/simple.ts",
    `let a: number = 1;
export class A {
    public b: string = "💷💷💷💷";
    /**
     * Sends the current player back the number of spaces.
     * @param numberOfSpaces The number of spaces to move back.
     * @throws Error if the number of spaces is greater than the current square index.
     */
    public moveBack(numberOfSpaces: number) {
        let currentSquareIndex = this.board.indexOf(this.currentPlayer.currentSquare);
    }
`, { overwrite: true }).saveSync();

const fmxRep = importer.famixRepFromProject(project);

describe('Tests for source text', () => {
    it("should have a Variable 'a' with the proper source text", () => {
        const theFile = Array.from(fmxRep._getAllEntitiesWithType("Module") as Set<Module>)[0];
        const theVariable = Array.from(theFile.getVariables())[0];
        const sourceAnchor = theVariable.getSourceAnchor() as IndexedFileAnchor;
        expect(sourceAnchor.getStartPos()).toBe(4);
        expect(sourceAnchor.getEndPos()).toBe(17);
        expect(sourceAnchor.getFileName().endsWith("simple.ts")).toBe(true);
        expect(project.getSourceFileOrThrow(
            sourceAnchor.getFileName()).getFullText().substring(
                sourceAnchor.getStartPos(), sourceAnchor.getEndPos()))
                .toBe("a: number = 1");
    });
    it("should have a Variable 'currentSquareIndex' with the proper source text", () => {
        const theMethod = Array.from(fmxRep._getAllEntitiesWithType("Method") as Set<Method>)[0];
        const theVariable = Array.from(theMethod.getVariables())[0];
        const sourceAnchor = theVariable.getSourceAnchor() as IndexedFileAnchor;
        expect(sourceAnchor.getStartPos()).toBe(355);
        expect(sourceAnchor.getEndPos()).toBe(428);
        expect(sourceAnchor.getFileName().endsWith("simple.ts")).toBe(true);
        expect(project.getSourceFileOrThrow(
            sourceAnchor.getFileName()).getFullText().substring(
                sourceAnchor.getStartPos(), sourceAnchor.getEndPos()))
                .toBe("currentSquareIndex = this.board.indexOf(this.currentPlayer.currentSquare)");
    });
});