import { ClassDeclaration, ConstructorDeclaration, FunctionDeclaration, Identifier, InterfaceDeclaration, MethodDeclaration, MethodSignature, ModuleDeclaration, PropertyDeclaration, PropertySignature, SourceFile, TypeParameterDeclaration, VariableDeclaration, ParameterDeclaration, Decorator, GetAccessorDeclaration, SetAccessorDeclaration, ImportSpecifier, CommentRange, EnumDeclaration, EnumMember, TypeAliasDeclaration, FunctionExpression, ExpressionWithTypeArguments } from "ts-morph";
import * as Famix from "../lib/famix/src/model/famix";
import { FamixRepository } from "../lib/famix/src/famix_repository";
import { FQNFunctions } from "../fqn";
import GraphemeSplitter from "grapheme-splitter";
import { config } from "../analyze";

/**
 * This class is used to build a Famix model for the index file anchors
 */
export class FamixFunctionsIndex {

    private famixRep: FamixRepository; // The Famix repository
    private FQNFunctions = new FQNFunctions(); // The fully qualified name functions

    /**
     * Initializes the FamixFunctionsIndex object
     * @param famixRep The Famix repository
     */
    constructor(famixRep: FamixRepository) {
        this.famixRep = famixRep;
    }

    /**
     * Makes a Famix index file anchor
     * @param sourceElement A source element
     * @param famixElement The Famix model of the source element
     */
    public makeFamixIndexFileAnchor(sourceElement: SourceFile | ModuleDeclaration | ClassDeclaration | InterfaceDeclaration | MethodDeclaration | ConstructorDeclaration | MethodSignature | FunctionDeclaration | FunctionExpression | ParameterDeclaration | VariableDeclaration | PropertyDeclaration | PropertySignature | TypeParameterDeclaration | Identifier | Decorator | GetAccessorDeclaration | SetAccessorDeclaration | ImportSpecifier | CommentRange | EnumDeclaration | EnumMember | TypeAliasDeclaration | ExpressionWithTypeArguments, famixElement: Famix.SourcedEntity): void {
        const fmxIndexFileAnchor = new Famix.IndexedFileAnchor(this.famixRep);
        fmxIndexFileAnchor.setElement(famixElement);

        if (sourceElement !== null) {
            fmxIndexFileAnchor.setFileName(sourceElement.getSourceFile().getFilePath());
            if (!(sourceElement instanceof CommentRange)) {
                if (config.expectGraphemes) {
                    /**
                     * The following logic handles the case of multi-code point characters (e.g. emoji) in the source text.
                     * This is needed because Pharo/Smalltalk treats multi-code point characters as a single character, 
                     * but JavaScript treats them as multiple characters. This means that the start and end positions
                     * of a source element in Pharo/Smalltalk will be different than the start and end positions of the
                     * same source element in JavaScript. This logic finds the start and end positions of the source
                     * element in JavaScript and then uses those positions to set the start and end positions of the
                     * Famix index file anchor.
                     * It depends on code in the 'grapheme-splitter' package in npm.
                     */
                    const splitter = new GraphemeSplitter();
                    const sourceFileText = sourceElement.getSourceFile().getFullText();
                    const hasGraphemeClusters = splitter.countGraphemes(sourceFileText) > 1;
                    if (hasGraphemeClusters) {
                        const sourceElementText = sourceFileText.substring(sourceElement.getStart(), sourceElement.getEnd());
                        const sourceElementTextGraphemes = splitter.splitGraphemes(sourceElementText);
                        const sourceFileTextGraphemes = splitter.splitGraphemes(sourceFileText);
                        const start = sourceElement.getStart();
                        const numberOfGraphemeClustersBeforeStart = splitter.countGraphemes(sourceFileText.substring(0, start));
        
                        // find the start of the sourceElementTextGraphemes array in the sourceFileTextGraphemes array
                        const newStart = indexOfSplitArray({searchArray: sourceFileTextGraphemes, 
                                                            targetArray: sourceElementTextGraphemes, 
                                                            start: start - numberOfGraphemeClustersBeforeStart});
                        const newEnd = newStart + sourceElementTextGraphemes.length;

                        // note: the +1 is because the source anchor is 1-based, but ts-morph is 0-based
                        fmxIndexFileAnchor.setStartPos(newStart + 1);
                        fmxIndexFileAnchor.setEndPos(newEnd + 1);
                    } else {
                        // note: the +1 is because the source anchor is 1-based, but ts-morph is 0-based
                        fmxIndexFileAnchor.setStartPos(sourceElement.getStart() + 1);
                        fmxIndexFileAnchor.setEndPos(sourceElement.getEnd() + 1);
                    }
                }
            }
            if (!(famixElement instanceof Famix.Association) && !(famixElement instanceof Famix.Comment) && !(sourceElement instanceof CommentRange) && !(sourceElement instanceof Identifier) && !(sourceElement instanceof ImportSpecifier) && !(sourceElement instanceof ExpressionWithTypeArguments)) {
                (famixElement as Famix.NamedEntity).setFullyQualifiedName(this.FQNFunctions.getFQN(sourceElement));
            }
        }
    }
}


interface SearchParameters {
    searchArray: string[];
    targetArray: string[];
    start?: number;
}
/**
 * This function works like indexOf, but it works with arrays of grapheme clusters.
 * @param targetArray
 */
function indexOfSplitArray(params: SearchParameters): number {
    const {searchArray, targetArray, start = 0} = params;
    for (let i = start; i <= searchArray.length - targetArray.length; i++) {
        let found = true;
        for (let j = 0; j < targetArray.length; j++) {
            if (searchArray[i + j] !== targetArray[j]) {
                found = false;
                break;
            }
        }
        if (found) {
            return i; // Return the index where the target array was found
        }
    }
    return -1; // Return -1 if the target array was not found in the search array
}
