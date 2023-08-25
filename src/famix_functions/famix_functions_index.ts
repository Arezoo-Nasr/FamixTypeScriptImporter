import { ClassDeclaration, ConstructorDeclaration, FunctionDeclaration, Identifier, InterfaceDeclaration, MethodDeclaration, MethodSignature, ModuleDeclaration, PropertyDeclaration, PropertySignature, SourceFile, TypeParameterDeclaration, VariableDeclaration, ParameterDeclaration, Decorator, GetAccessorDeclaration, SetAccessorDeclaration, ImportSpecifier, CommentRange, EnumDeclaration, EnumMember, TypeAliasDeclaration } from "ts-morph";
import * as Famix from "../lib/famix/src/model/famix";
import { FamixRepository } from "../lib/famix/src/famix_repository";
import { FQNFunctions } from "../fqn";

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
    public makeFamixIndexFileAnchor(sourceElement: SourceFile | ModuleDeclaration | ClassDeclaration | InterfaceDeclaration | MethodDeclaration | ConstructorDeclaration | MethodSignature | FunctionDeclaration | ParameterDeclaration | VariableDeclaration | PropertyDeclaration | PropertySignature | TypeParameterDeclaration | Identifier | Decorator | GetAccessorDeclaration | SetAccessorDeclaration | ImportSpecifier | CommentRange | EnumDeclaration | EnumMember | TypeAliasDeclaration, famixElement: Famix.SourcedEntity): void {
        const fmxIndexFileAnchor = new Famix.IndexedFileAnchor(this.famixRep);
        fmxIndexFileAnchor.setElement(famixElement);

        if (sourceElement !== null) {
            fmxIndexFileAnchor.setFileName(sourceElement.getSourceFile().getFilePath());
            
            if (!(sourceElement instanceof CommentRange)) {
                fmxIndexFileAnchor.setStartPos(sourceElement.getStart());
                fmxIndexFileAnchor.setEndPos(sourceElement.getEnd());
            }

            if (!(famixElement instanceof Famix.Association) && !(famixElement instanceof Famix.Comment) && !(sourceElement instanceof CommentRange) && !(sourceElement instanceof Identifier) && !(sourceElement instanceof ImportSpecifier)) {
                (famixElement as Famix.NamedEntity).setFullyQualifiedName(this.FQNFunctions.getFQN(sourceElement));
            }
        }
    }
}
