import { ClassDeclaration, ConstructorDeclaration, FunctionDeclaration, Identifier, InterfaceDeclaration, MethodDeclaration, SourceFile, GetAccessorDeclaration, SetAccessorDeclaration, Node, ImportSpecifier, SyntaxKind, FunctionExpression, ExpressionWithTypeArguments } from "ts-morph";
import * as Famix from "../lib/famix/src/model/famix";
import { FamixRepository } from "../lib/famix/src/famix_repository";
import { FQNFunctions } from "../fqn";
import { FamixFunctionsIndex } from "./famix_functions_index";

/**
 * This class is used to build a Famix model for the associations
 */
export class FamixFunctionsAssociations {

    private famixRep: FamixRepository; // The Famix repository
    private FQNFunctions = new FQNFunctions(); // The fully qualified name functions
    private famixClasses: Map<string, Famix.Class | Famix.ParameterizableClass>; // Maps the class names to their Famix model
    private famixInterfaces: Map<string, Famix.Interface | Famix.ParameterizableInterface>; // Maps the interface names to their Famix model
    private famixFunctionsIndex: FamixFunctionsIndex; // FamixFunctionsIndex object, it contains all the functions needed to create Famix index file anchors

    /**
     * Initializes the FamixFunctionsAssociations object
     * @param famixRep The Famix repository
     * @param fmxClasses The map of the class names and their Famix model
     * @param fmxInterfaces The map of the interface names and their Famix model
     */
    constructor(famixRep: FamixRepository, fmxClasses: Map<string, Famix.Class | Famix.ParameterizableClass>, fmxInterfaces: Map<string, Famix.Interface | Famix.ParameterizableInterface>) {
        this.famixRep = famixRep;
        this.famixClasses = fmxClasses;
        this.famixInterfaces = fmxInterfaces;
        this.famixFunctionsIndex = new FamixFunctionsIndex(famixRep);
    }

    /**
     * Creates a Famix access
     * @param node A node
     * @param id An id of a parameter, a variable, a property or an enum member
     */
    public createFamixAccess(node: Identifier, id: number): void {
        const fmxVar = this.famixRep.getFamixEntityById(id) as Famix.StructuralEntity;
        const nodeReferenceAncestor = this.findAncestor(node);
        const ancestorFullyQualifiedName = this.FQNFunctions.getFQN(nodeReferenceAncestor);
        const accessor = this.getFamixEntityByFullyQualifiedName(ancestorFullyQualifiedName) as Famix.ContainerEntity;

        const fmxAccess = new Famix.Access(this.famixRep);
        fmxAccess.setAccessor(accessor);
        fmxAccess.setVariable(fmxVar);

        this.famixFunctionsIndex.makeFamixIndexFileAnchor(node, fmxAccess);
    }

    /**
     * Creates a Famix invocation
     * @param node A node
     * @param m A method or a function
     * @param id The id of the method or the function
     */
    public createFamixInvocation(node: Identifier, m: MethodDeclaration | ConstructorDeclaration | GetAccessorDeclaration | SetAccessorDeclaration | FunctionDeclaration | FunctionExpression, id: number): void {
        const fmxMethodOrFunction = this.getFamixEntityById(id) as Famix.BehavioralEntity;
        const nodeReferenceAncestor = this.findAncestor(node);
        const ancestorFullyQualifiedName = this.FQNFunctions.getFQN(nodeReferenceAncestor);
        const sender = this.getFamixEntityByFullyQualifiedName(ancestorFullyQualifiedName) as Famix.ContainerEntity;
        const receiverFullyQualifiedName = this.FQNFunctions.getFQN(m.getParent());
        const receiver = this.getFamixEntityByFullyQualifiedName(receiverFullyQualifiedName) as Famix.NamedEntity;

        const fmxInvocation = new Famix.Invocation(this.famixRep);
        fmxInvocation.setSender(sender);
        fmxInvocation.setReceiver(receiver);
        fmxInvocation.addCandidate(fmxMethodOrFunction);
        fmxInvocation.setSignature(fmxMethodOrFunction.getSignature());

        this.famixFunctionsIndex.makeFamixIndexFileAnchor(node, fmxInvocation);
    }

    /**
     * Creates a Famix inheritance
     * @param cls A class or an interface (subclass)
     * @param inhClass The inherited class or interface (superclass)
     */
    public createFamixInheritance(cls: ClassDeclaration | InterfaceDeclaration, inhClass: ClassDeclaration | InterfaceDeclaration | ExpressionWithTypeArguments): void {
        const fmxInheritance = new Famix.Inheritance(this.famixRep);
        const clsName = cls.getName();
        
        let subClass: Famix.Class | Famix.Interface;
        if (cls instanceof ClassDeclaration) {
            subClass = this.famixClasses.get(clsName);
        }
        else {
            subClass = this.famixInterfaces.get(clsName);
        }
        
        let inhClassName: string;
        let superClass: Famix.Class | Famix.Interface;
        if (inhClass instanceof ClassDeclaration || inhClass instanceof InterfaceDeclaration) {
            inhClassName = inhClass.getName();
            if (inhClass instanceof ClassDeclaration) {
                superClass = this.famixClasses.get(inhClassName);
            }
            else {
                superClass = this.famixInterfaces.get(inhClassName);
            }
        }
        else {
            inhClassName = inhClass.getExpression().getText();
        }

        if (superClass === undefined) {
            if (inhClass instanceof ClassDeclaration) {
                superClass = new Famix.Class(this.famixRep);
                this.famixClasses.set(inhClassName, superClass);
            }
            else {
                superClass = new Famix.Interface(this.famixRep);
                this.famixInterfaces.set(inhClassName, superClass);
            }

            superClass.setName(inhClassName);
            superClass.setIsStub(true);

            this.famixFunctionsIndex.makeFamixIndexFileAnchor(inhClass, superClass);
        }

        fmxInheritance.setSubclass(subClass);
        fmxInheritance.setSuperclass(superClass);

        this.famixFunctionsIndex.makeFamixIndexFileAnchor(null, fmxInheritance);
    }

    /**
     * Creates a Famix import clause
     * @param importer A source file which is a module
     * @param moduleSpecifier The name of the module where the export declaration is
     * @param moduleSpecifierFilePath The path of the module where the export declaration is
     * @param importElement The imported entity
     * @param isInExports A boolean indicating if the imported entity is in the exports
     * @param isDefaultExport A boolean indicating if the imported entity is a default export
     */
    public createFamixImportClause(importer: SourceFile, moduleSpecifier: string, moduleSpecifierFilePath: string, importElement: ImportSpecifier | Identifier, isInExports: boolean, isDefaultExport: boolean): void {
        const fmxImportClause = new Famix.ImportClause(this.famixRep);

        let importedEntity: Famix.NamedEntity;
        let importedEntityName: string;
        let pathName = "\"" + moduleSpecifierFilePath + "\".";
        if (importElement instanceof ImportSpecifier) {
            importedEntityName = importElement.getName();
            pathName = pathName + importedEntityName;
            if (isInExports) {
                importedEntity = this.getFamixEntityByFullyQualifiedName(pathName) as Famix.NamedEntity;
            }
            if (importedEntity === undefined) {
                importedEntity = new Famix.NamedEntity(this.famixRep);
                importedEntity.setName(importedEntityName);
                if (!isInExports) {
                    importedEntity.setIsStub(true);
                }
                this.famixFunctionsIndex.makeFamixIndexFileAnchor(importElement, importedEntity);
                importedEntity.setFullyQualifiedName(pathName);
            }
        }
        else {
            importedEntityName = importElement.getText();
            if (isDefaultExport) {
                pathName = pathName + "defaultExport";
            }
            else {
                pathName = pathName + "namespaceExport";
            }
            importedEntity = new Famix.NamedEntity(this.famixRep);
            importedEntity.setName(importedEntityName);
            this.famixFunctionsIndex.makeFamixIndexFileAnchor(importElement, importedEntity);
            importedEntity.setFullyQualifiedName(pathName);
        }

        const importerFullyQualifiedName = this.FQNFunctions.getFQN(importer);
        const fmxImporter = this.getFamixEntityByFullyQualifiedName(importerFullyQualifiedName) as Famix.Module;
        fmxImportClause.setImporter(fmxImporter);
        fmxImportClause.setImportedEntity(importedEntity);
        fmxImportClause.setModuleSpecifier(moduleSpecifier);

        this.famixFunctionsIndex.makeFamixIndexFileAnchor(null, fmxImportClause);

        fmxImporter.addImportClause(fmxImportClause);
    }

    /**
     * Gets a Famix entity by id
     * @param famixId An id of a Famix entity
     * @returns The Famix entity corresponding to the id
     */
    private getFamixEntityById(famixId: number): Famix.Entity {
        return this.famixRep.getFamixEntityById(famixId) as Famix.Entity;
    }

    /**
     * Gets a Famix entity by fully qualified name
     * @param fullyQualifiedName A fully qualified name
     * @returns The Famix entity corresponding to the fully qualified name
     */
    private getFamixEntityByFullyQualifiedName(fullyQualifiedName: string): Famix.Entity {
        return this.famixRep.getFamixEntityByFullyQualifiedName(fullyQualifiedName) as Famix.Entity;
    }
    
    /**
     * Finds the ancestor of a node
     * @param node A node
     * @returns The ancestor of the node
     */
    private findAncestor(node: Identifier): Node {
        return node.getAncestors().find(a => a.getKind() === SyntaxKind.MethodDeclaration || a.getKind() === SyntaxKind.Constructor || a.getKind() === SyntaxKind.FunctionDeclaration || a.getKind() === SyntaxKind.FunctionExpression || a.getKind() === SyntaxKind.ModuleDeclaration || a.getKind() === SyntaxKind.SourceFile || a.getKindName() === "GetAccessor" || a.getKindName() === "SetAccessor" || a.getKind() === SyntaxKind.ClassDeclaration);
    }
}
