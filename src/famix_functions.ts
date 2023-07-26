import { ClassDeclaration, ConstructorDeclaration, FunctionDeclaration, Identifier, InterfaceDeclaration, MethodDeclaration, MethodSignature, ModuleDeclaration, PropertyDeclaration, PropertySignature, SourceFile, TypeParameterDeclaration, VariableDeclaration, ParameterDeclaration, ExpressionWithTypeArguments } from "ts-morph";
import * as Famix from "./lib/famix/src/model/famix";
import * as FamixFile from "./lib/famix/src/model/file";
import { FamixRepository } from "./lib/famix/src/famix_repository";
import { SyntaxKind } from "@ts-morph/common";
import { FQNFunctions } from "./new-parsing-strategy/fqn";
// -> enlever les try catch ???

/**
 * This class contains all the functions needed to create Famix entities
 */
export class FamixFunctions {

    private fmxRep = new FamixRepository(); // The Famix repository
    private FQNFunctions = new FQNFunctions(); // The fully qualified name functions
    private fmxTypes = new Map<string, Famix.Type>(); // Maps the type names to their Famix model
    private fmxClasses = new Map<string, Famix.Class | Famix.ParameterizableClass>(); // Maps the classes and interfaces names to their Famix model
    private fmxNamespaces = new Map<string, Famix.Namespace>(); // Maps the namespaces names to their Famix model
    private fmxFiles = new Map<string, FamixFile.File>(); // Maps the source files names to their Famix model
    private UNKNOWN_VALUE = '(unknown due to parsing error)'; // The value to use when a name is not usable -> utile tant qu'il y a des try catch

    /**
     * Gets the Famix repository
     * @returns The Famix repository
     */
    public getFamixRepository(): FamixRepository {
        return this.fmxRep;
    }

    /**
     * Makes a Famix index file anchor
     * @param sourceElement A source element
     * @param famixElement The Famix model of the source element
     */
    private makeFamixIndexFileAnchor(sourceElement: SourceFile | ModuleDeclaration | ClassDeclaration | InterfaceDeclaration | MethodDeclaration | ConstructorDeclaration | MethodSignature | FunctionDeclaration | ParameterDeclaration | VariableDeclaration | PropertyDeclaration | PropertySignature | Identifier, famixElement: Famix.SourcedEntity): void {
        const fmxIndexFileAnchor = new Famix.IndexedFileAnchor(this.fmxRep);
        fmxIndexFileAnchor.setFileName(sourceElement.getSourceFile().getFilePath());
        fmxIndexFileAnchor.setStartPos(sourceElement.getStart());
        fmxIndexFileAnchor.setEndPos(sourceElement.getEnd());
        fmxIndexFileAnchor.setElement(famixElement);

        if (!(famixElement instanceof Famix.Access) && !(famixElement instanceof Famix.Invocation) && !(famixElement instanceof Famix.Inheritance)) {
            famixElement.setFullyQualifiedName(this.FQNFunctions.getFQN(sourceElement));
        }
    }

    /**
     * Creates or gets a Famix file
     * @param f A source file
     * @returns The Famix model of the source file
     */
    public createOrGetFile(f: SourceFile): FamixFile.File {
        let fmxFile: FamixFile.File;
        const fileName = f.getBaseName();
        if (!this.fmxFiles.has(fileName)) {
            fmxFile = new FamixFile.File(this.fmxRep);
            fmxFile.setName(fileName);
            fmxFile.setNumberOfLinesOfText(f.getEndLineNumber() - f.getStartLineNumber());
            fmxFile.setNumberOfEmptyLinesOfText(f.getFullText().split('\n').filter(x => x.trim() === '').length);
            fmxFile.setNumberOfCharacters(f.getFullText().length);
            fmxFile.setNumberOfKiloBytes(f.getFullText().length / 1024);
            fmxFile.setNumberOfInternalClones(0);
            fmxFile.setNumberOfDuplicatedFiles(0);
            fmxFile.setTotalNumberOfLinesOfText(f.getFullText().split('\n').length);

            this.makeFamixIndexFileAnchor(f, fmxFile);

            this.fmxFiles.set(fileName, fmxFile);
        }
        else {
            fmxFile = this.fmxFiles.get(fileName);
        }
        return fmxFile;
    }

    /**
     * Creates or gets a Famix namespace
     * @param m A module
     * @param parentScope The Famix model of the module's parent (the parent can be a source file or a module)
     * @returns The Famix model of the module
     */
    public createOrGetFamixNamespace(m: ModuleDeclaration, parentScope: FamixFile.File | Famix.Namespace): Famix.Namespace {
        let fmxNamespace: Famix.Namespace;
        const namespaceName = m.getName();
        if (!this.fmxNamespaces.has(namespaceName)) {
            fmxNamespace = new Famix.Namespace(this.fmxRep);
            fmxNamespace.setName(namespaceName);
            fmxNamespace.setParentScope(parentScope);

            this.makeFamixIndexFileAnchor(m, fmxNamespace);

            this.fmxNamespaces.set(namespaceName, fmxNamespace);
        }
        else {
            fmxNamespace = this.fmxNamespaces.get(namespaceName);
        }
        return fmxNamespace;
    }

    /**
     * Creates or gets a Famix class or parameterizable class
     * @param cls A class or an interface
     * @param isAbstract A boolean indicating if the class is abstract
     * @returns The Famix model of the class
     */
    public createOrGetFamixClassOrInterface(cls: ClassDeclaration | InterfaceDeclaration, isAbstract = false): Famix.Class | Famix.ParameterizableClass {
        let fmxClass: Famix.Class | Famix.ParameterizableClass;
        const isInterface = cls instanceof InterfaceDeclaration;
        const clsName = cls.getName();
        if (!this.fmxClasses.has(clsName)) {
            const isGenerics = cls.getTypeParameters().length;
            if (isGenerics) {
                fmxClass = new Famix.ParameterizableClass(this.fmxRep);
                cls.getTypeParameters().forEach(tp => {
                    const fmxParameterType = this.createFamixParameterType(tp);
                    (fmxClass as Famix.ParameterizableClass).addParameterType(fmxParameterType);
                });
            }
            else {
                fmxClass = new Famix.Class(this.fmxRep);
            }

            fmxClass.setName(clsName);
            fmxClass.setIsInterface(isInterface);
            fmxClass.setIsAbstract(isAbstract);

            this.makeFamixIndexFileAnchor(cls, fmxClass);

            this.fmxClasses.set(clsName, fmxClass);
        }
        else {
            fmxClass = this.fmxClasses.get(clsName) as (Famix.Class | Famix.ParameterizableClass);
        }
        return fmxClass;
    }

    /**
     * Creates a Famix method
     * @param method A method
     * @param currentCC The cyclomatic complexity metrics of the current source file
     * @param isAbstract A boolean indicating if the method is abstract
     * @param isStatic A boolean indicating if the method is static
     * @returns The Famix model of the method
     */
    public createFamixMethod(method: MethodDeclaration | ConstructorDeclaration | MethodSignature, currentCC: any, isAbstract = false, isStatic = false): Famix.Method {
        const fmxMethod = new Famix.Method(this.fmxRep);
        const isConstructor = method instanceof ConstructorDeclaration;
        const isSignature = method instanceof MethodSignature;
        fmxMethod.setIsAbstract(isAbstract);
        fmxMethod.setIsConstructor(isConstructor);
        fmxMethod.setIsClassSide(isStatic);
        fmxMethod.setIsPrivate(method instanceof MethodDeclaration ? (method.getModifiers().find(x => x.getText() === 'private')) !== undefined : false);
        fmxMethod.setIsProtected(method instanceof MethodDeclaration ? (method.getModifiers().find(x => x.getText() === 'protected')) !== undefined : false);
        if (!fmxMethod.getIsPrivate() && !fmxMethod.getIsProtected()) {
            fmxMethod.setIsPublic(true);    
        }
        fmxMethod.setSignature(this.computeSignature(method.getText()));

        let methodName: string;
        if (isConstructor) {
            methodName = "constructor";
        }
        else {
            methodName = (method as MethodDeclaration | MethodSignature ).getName();
        }
        fmxMethod.setName(methodName);

        if (!isSignature) {
            fmxMethod.setCyclomaticComplexity(currentCC[fmxMethod.getName()]);
        }
        else {
            fmxMethod.setCyclomaticComplexity(0);
        }

        let methodTypeName = this.UNKNOWN_VALUE; 
        try {
            methodTypeName = method.getReturnType().getText().trim();            
        } catch (error) {
            console.error(`> WARNING: got exception ${error}. Failed to get usable name for return type of method: ${fmxMethod.getName()}. Continuing...`);
        }

        const fmxType = this.createOrGetFamixType(methodTypeName);
        fmxMethod.setDeclaredType(fmxType);
        fmxMethod.setKind(method.getKindName());
        fmxMethod.setNumberOfLinesOfCode(method.getEndLineNumber() - method.getStartLineNumber());
        const parameters = method.getParameters();
        fmxMethod.setNumberOfParameters(parameters.length);
        
        if (!isSignature) {
            fmxMethod.setNumberOfStatements(method.getStatements().length);
        }
        else {
            fmxMethod.setNumberOfStatements(0);
        }
        
        this.makeFamixIndexFileAnchor(method, fmxMethod);

        return fmxMethod;
    }

    /**
     * Creates a Famix function
     * @param func A function
     * @returns The Famix model of the function
     */
    public createFamixFunction(func: FunctionDeclaration): Famix.Function {
        const fmxFunction = new Famix.Function(this.fmxRep);
        fmxFunction.setName(func.getName());
        fmxFunction.setSignature(this.computeSignature(func.getText()));

        let functionTypeName = this.UNKNOWN_VALUE;
        try {
            functionTypeName = func.getReturnType().getText().trim();
        } catch (error) {
            console.error(`> WARNING: got exception ${error}. Failed to get usable name for return type of function: ${func.getName()}. Continuing...`);
        }

        const fmxType = this.createOrGetFamixType(functionTypeName);
        fmxFunction.setDeclaredType(fmxType);
        fmxFunction.setNumberOfLinesOfCode(func.getEndLineNumber() - func.getStartLineNumber());
        const parameters = func.getParameters();
        fmxFunction.setNumberOfParameters(parameters.length);
        fmxFunction.setNumberOfStatements(func.getStatements().length);

        this.makeFamixIndexFileAnchor(func, fmxFunction);

        return fmxFunction;
    }

    /**
     * Creates a Famix parameter
     * @param param A parameter
     * @returns The Famix model of the parameter
     */
    public createFamixParameter(param: ParameterDeclaration): Famix.Parameter {
        const fmxParam = new Famix.Parameter(this.fmxRep);

        let paramTypeName = this.UNKNOWN_VALUE;
        try {
            paramTypeName = param.getType().getText().trim();
        } catch (error) {
            console.error(`> WARNING: got exception ${error}. Failed to get usable name for parameter: ${param.getName()}. Continuing...`);
        }

        const fmxType = this.createOrGetFamixType(paramTypeName);
        fmxParam.setDeclaredType(fmxType);
        fmxParam.setName(param.getName());

        this.makeFamixIndexFileAnchor(param, fmxParam);

        return fmxParam;
    }

    /**
     * Creates a Famix local or global variable
     * @param variable A variable
     * @param isGlobal A boolean indicating if the variable is global
     * @returns The Famix model of the variable
     */
    public createFamixVariable(variable: VariableDeclaration, isGlobal = false): Famix.LocalVariable | Famix.GlobalVariable {
        let fmxVariable: Famix.LocalVariable | Famix.GlobalVariable;
        if (isGlobal) {
            fmxVariable = new Famix.GlobalVariable(this.fmxRep);
        }
        else {
            fmxVariable = new Famix.LocalVariable(this.fmxRep);
        }

        let variableTypeName = this.UNKNOWN_VALUE;
        try {
            variableTypeName = variable.getType().getText().trim();
        } catch (error) {
            console.error(`> WARNING: got exception ${error}. Failed to get usable name for variable: ${variable.getName()}. Continuing...`);
        }

        const fmxType = this.createOrGetFamixType(variableTypeName);
        fmxVariable.setDeclaredType(fmxType);
        fmxVariable.setName(variable.getName());

        this.makeFamixIndexFileAnchor(variable, fmxVariable);

        return fmxVariable;
    }

    /**
     * Creates a Famix attribute
     * @param property An attribute
     * @returns The Famix model of the attribute
     */
    public createFamixAttribute(property: PropertyDeclaration | PropertySignature): Famix.Attribute {
        const fmxAttribute = new Famix.Attribute(this.fmxRep);
        const isSignature = property instanceof PropertySignature;
        fmxAttribute.setName(property.getName());

        let propTypeName = this.UNKNOWN_VALUE;
        try {
            propTypeName = property.getType().getText().trim();
        } catch (error) {
            console.error(`> WARNING: got exception ${error}. Failed to get usable name for attribute: ${property.getName()}. Continuing...`);
        }

        const fmxType = this.createOrGetFamixType(propTypeName);
        fmxAttribute.setDeclaredType(fmxType);
        fmxAttribute.setHasClassScope(true);

        property.getModifiers().forEach(m => fmxAttribute.addModifiers(m.getText()));
        if (!isSignature && property.getExclamationTokenNode()) {
            fmxAttribute.addModifiers("!");
        }
        if (property.getQuestionTokenNode()) {
            fmxAttribute.addModifiers("?");
        }

        this.makeFamixIndexFileAnchor(property, fmxAttribute);

        return fmxAttribute;
    }

    /**
     * Creates a Famix access
     * @param node A node
     * @param id An id of a parameter, a variable or an attribute
     * @returns The Famix model of the access
     */
    public createFamixAccess(node: Identifier, id: number): Famix.Access {
        const fmxVar = this.fmxRep.getFamixEntityById(id) as Famix.StructuralEntity;
        const nodeReferenceAncestor = node.getAncestors().find(a => a.getKind() === SyntaxKind.MethodDeclaration || a.getKind() === SyntaxKind.Constructor || a.getKind() === SyntaxKind.FunctionDeclaration || a.getKind() === SyntaxKind.ModuleDeclaration || a.getKind() === SyntaxKind.SourceFile); // for global variable it must work -> a => a.getKind() === any ???

        const ancestorFullyQualifiedName = this.FQNFunctions.getFQN(nodeReferenceAncestor);
        const accessor = this.getFamixEntityElementByFullyQualifiedName(ancestorFullyQualifiedName);

        const fmxAccess = new Famix.Access(this.fmxRep);
        fmxAccess.setAccessor(accessor);
        fmxAccess.setVariable(fmxVar);

        fmxAccess.setFullyQualifiedName(`${fmxVar.getFullyQualifiedName()}.__access__`);

        this.makeFamixIndexFileAnchor(node, fmxAccess);

        return fmxAccess;
    }

    /**
     * Creates a Famix invocation
     * @param node A node
     * @param m A method or a constructor
     * @param id The id of the method or the constructor
     * @returns The Famix model of the invocation
     */
    public createFamixInvocation(node: Identifier, m: MethodDeclaration | ConstructorDeclaration, id: number): Famix.Invocation {
        const fmxMethod = this.getFamixEntityById(id) as Famix.BehaviouralEntity;
        const nodeReferenceAncestor = node.getAncestors().find(a => a.getKind() === SyntaxKind.MethodDeclaration || a.getKind() === SyntaxKind.Constructor || a.getKind() === SyntaxKind.FunctionDeclaration || a.getKind() === SyntaxKind.ModuleDeclaration || a.getKind() === SyntaxKind.SourceFile); // for global variable it must work -> a => a.getKind() === any ???

        const ancestorFullyQualifiedName = this.FQNFunctions.getFQN(nodeReferenceAncestor);
        const sender = this.getFamixEntityElementByFullyQualifiedName(ancestorFullyQualifiedName);
        
        const receiverFullyQualifiedName = this.getClassNameOfMethod(m);
        const receiver = this.getFamixEntityElementByFullyQualifiedName(receiverFullyQualifiedName) as Famix.Class;

        const fmxInvocation = new Famix.Invocation(this.fmxRep);
        fmxInvocation.setSender(sender);
        fmxInvocation.setReceiver(receiver);
        fmxInvocation.addCandidates(fmxMethod);
        fmxInvocation.setSignature(fmxMethod.getSignature());

        fmxInvocation.setFullyQualifiedName(`${fmxMethod.getFullyQualifiedName()}.__invocation__`);

        this.makeFamixIndexFileAnchor(node, fmxInvocation);

        return fmxInvocation;
    }

    /**
     * Creates a Famix inheritance
     * @param cls A class or an interface
     * @param inhClass The inherited class or interface
     * @returns The Famix model of the inheritance
     */
    public createFamixInheritance(cls: ClassDeclaration | InterfaceDeclaration, inhClass: ClassDeclaration | ExpressionWithTypeArguments): Famix.Inheritance {
        const fmxInheritance = new Famix.Inheritance(this.fmxRep);
        const clsName = cls.getName();
        
        let inhClassName: string;
        if (inhClass instanceof ClassDeclaration) {
            inhClassName = inhClass.getName();
        }
        else {
            inhClassName = inhClass.getExpression().getText();
        }

        const subClass = this.fmxClasses.get(clsName);
        const superClass = this.fmxClasses.get(inhClassName);
        fmxInheritance.setSubclass(subClass);
        fmxInheritance.setSuperclass(superClass);

        fmxInheritance.setFullyQualifiedName(`${subClass.getFullyQualifiedName()}.__inheritance__`);

        this.makeFamixIndexFileAnchor(cls, fmxInheritance);

        return fmxInheritance;
    }

    /**
     * Creates a Famix parameter type
     * @param tp A type parameter
     * @returns The Famix model of the parameter type
     */
    private createFamixParameterType(tp: TypeParameterDeclaration): Famix.ParameterType {
        const fmxParameterType = new Famix.ParameterType(this.fmxRep);
        fmxParameterType.setName(tp.getName());
        return fmxParameterType;
    }

    /**
     * Creates or gets a Famix type
     * @param typeName A type name
     * @returns The Famix model of the type
     */
    private createOrGetFamixType(typeName: string): Famix.Type {
        let fmxType: Famix.Type;
        if (!this.fmxTypes.has(typeName)) {
            fmxType = new Famix.Type(this.fmxRep);
            fmxType.setName(typeName);
            this.fmxTypes.set(typeName, fmxType);
        }
        else {
            fmxType = this.fmxTypes.get(typeName);
        }
        return fmxType;
    }

    /**
     * Gets a Famix entity by id
     * @param famixId An id of a Famix entity
     * @returns The Famix entity corresponding to the id
     */
    private getFamixEntityById(famixId: number): Famix.Entity {
        return this.fmxRep.getFamixEntityById(famixId) as Famix.Entity;
    }

    /**
     * Gets a Famix entity by fully qualified name
     * @param ancestorFQN A fully qualified name
     * @returns The Famix entity corresponding to the fully qualified name
     */
    private getFamixEntityElementByFullyQualifiedName(ancestorFQN: string): Famix.Entity {
        return this.fmxRep.getFamixEntityElementByFullyQualifiedName(ancestorFQN) as Famix.Entity;
    }

    /**
     * Gets the signature of a method or a function
     * @param text A method or a function source code
     * @returns The signature of the method or the function
     */
    private computeSignature(text: string): string {
        const endSignatureText = text.indexOf("{");
        return text.substring(0, endSignatureText).trim();
    }

    /**
     * Gets the class fully qualified name of a method or a constructor
     * @param method A method or a constructor
     * @returns The class fully qualified name of the method or the constructor
     */
    private getClassNameOfMethod(method: MethodDeclaration | ConstructorDeclaration): string {
        return this.FQNFunctions.getFQN(method.getFirstAncestorByKind(SyntaxKind.ClassDeclaration) as ClassDeclaration);
    }
}
