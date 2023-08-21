import { ClassDeclaration, ConstructorDeclaration, FunctionDeclaration, Identifier, InterfaceDeclaration, MethodDeclaration, MethodSignature, ModuleDeclaration, PropertyDeclaration, PropertySignature, SourceFile, TypeParameterDeclaration, VariableDeclaration, ParameterDeclaration, Decorator, GetAccessorDeclaration, SetAccessorDeclaration, Node, ImportSpecifier, CommentRange, EnumDeclaration, EnumMember, VariableStatement, TypeAliasDeclaration, JSDoc } from "ts-morph";
import * as Famix from "./lib/famix/src/model/famix";
import { FamixRepository } from "./lib/famix/src/famix_repository";
import { SyntaxKind } from "@ts-morph/common";
import { FQNFunctions } from "./fqn";
// -> enlever les try catch ???

/**
 * This class contains all the functions needed to create Famix entities
 */
export class FamixFunctions {

    private fmxRep = new FamixRepository(); // The Famix repository
    private FQNFunctions = new FQNFunctions(); // The fully qualified name functions
    private fmxAliases = new Map<string, Famix.Alias>(); // Maps the alias names to their Famix model
    private fmxTypes = new Map<string, Famix.Type>(); // Maps the type names to their Famix model
    private fmxClasses = new Map<string, Famix.Class | Famix.ParameterizableClass>(); // Maps the class names to their Famix model
    private fmxInterfaces = new Map<string, Famix.Interface | Famix.ParameterizableInterface>(); // Maps the interface names to their Famix model
    private fmxNamespaces = new Map<string, Famix.Namespace>(); // Maps the namespace names to their Famix model
    private fmxFiles = new Map<string, Famix.ScriptEntity | Famix.Module>(); // Maps the source file names to their Famix model
    private UNKNOWN_VALUE = '(unknown due to parsing error)'; // The value to use when a name is not usable

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
    private makeFamixIndexFileAnchor(sourceElement: SourceFile | ModuleDeclaration | ClassDeclaration | InterfaceDeclaration | MethodDeclaration | ConstructorDeclaration | MethodSignature | FunctionDeclaration | ParameterDeclaration | VariableDeclaration | PropertyDeclaration | PropertySignature | TypeParameterDeclaration | Identifier | Decorator | GetAccessorDeclaration | SetAccessorDeclaration | ImportSpecifier | CommentRange | EnumDeclaration | EnumMember | VariableStatement | TypeAliasDeclaration | JSDoc, famixElement: Famix.SourcedEntity): void {
        const fmxIndexFileAnchor = new Famix.IndexedFileAnchor(this.fmxRep);
        fmxIndexFileAnchor.setElement(famixElement);

        if (sourceElement !== null) {
            fmxIndexFileAnchor.setFileName(sourceElement.getSourceFile().getFilePath());
            
            if (!(sourceElement instanceof CommentRange)) {
                fmxIndexFileAnchor.setStartPos(sourceElement.getStart());
                fmxIndexFileAnchor.setEndPos(sourceElement.getEnd());
            }

            if (!(famixElement instanceof Famix.Association) && !(famixElement instanceof Famix.Comment) && !(sourceElement instanceof CommentRange) && !(sourceElement instanceof Identifier) && !(sourceElement instanceof ImportSpecifier) && !(sourceElement instanceof JSDoc)) {
                (famixElement as Famix.NamedEntity).setFullyQualifiedName(this.FQNFunctions.getFQN(sourceElement));
            }
        }
    }

    /**
     * Creates or gets a Famix script entity or module
     * @param f A source file
     * @param isModule A boolean indicating if the source file is a module
     * @returns The Famix model of the source file
     */
    public createOrGetFamixFile(f: SourceFile, isModule: boolean): Famix.ScriptEntity | Famix.Module {
        let fmxFile: Famix.ScriptEntity | Famix.Module;
        const fileName = f.getBaseName();
        if (!this.fmxFiles.has(fileName)) {
            if (isModule) {
                fmxFile = new Famix.Module(this.fmxRep); 
            }
            else {
                fmxFile = new Famix.ScriptEntity(this.fmxRep);
            }
            fmxFile.setName(fileName);
            fmxFile.setNumberOfLinesOfText(f.getEndLineNumber() - f.getStartLineNumber());
            fmxFile.setNumberOfCharacters(f.getFullText().length);

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
     * @param m A namespace
     * @param parentScope The Famix model of the namespace's parent (the parent can be a source file or a namespace)
     * @returns The Famix model of the namespace
     */
    public createOrGetFamixNamespace(m: ModuleDeclaration, parentScope: Famix.ScriptEntity | Famix.Module | Famix.Namespace): Famix.Namespace {
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
     * Creates a Famix alias
     * @param a An alias
     * @returns The Famix model of the alias
     */
    public createFamixAlias(a: TypeAliasDeclaration): Famix.Alias {
        let fmxAlias: Famix.Alias;
        const aliasName = a.getName();
        if (!this.fmxAliases.has(aliasName)) {
            fmxAlias = new Famix.Alias(this.fmxRep);
            fmxAlias.setName(a.getName());

            const fmxType = this.createOrGetFamixType(a.getName());

            fmxAlias.setAliasedEntity(fmxType);

            this.makeFamixIndexFileAnchor(a, fmxAlias);

            this.fmxAliases.set(aliasName, fmxAlias);
        }
        else {
            fmxAlias = this.fmxAliases.get(aliasName);
        }
        return fmxAlias;
    }

    /**
     * Creates or gets a Famix class or parameterizable class
     * @param cls A class
     * @returns The Famix model of the class
     */
    public createOrGetFamixClass(cls: ClassDeclaration): Famix.Class | Famix.ParameterizableClass {
        let fmxClass: Famix.Class | Famix.ParameterizableClass;
        const isAbstract = cls.isAbstract();
        const clsName = cls.getName();
        if (!this.fmxClasses.has(clsName)) {
            const isGeneric = cls.getTypeParameters().length;
            if (isGeneric) {
                fmxClass = new Famix.ParameterizableClass(this.fmxRep);
            }
            else {
                fmxClass = new Famix.Class(this.fmxRep);
            }

            fmxClass.setName(clsName);
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
     * Creates or gets a Famix interface or parameterizable interface
     * @param inter An interface
     * @returns The Famix model of the interface
     */
    public createOrGetFamixInterface(inter: InterfaceDeclaration): Famix.Interface | Famix.ParameterizableInterface {
        let fmxInterface: Famix.Interface | Famix.ParameterizableInterface;
        const interName = inter.getName();
        if (!this.fmxInterfaces.has(interName)) {
            const isGeneric = inter.getTypeParameters().length;
            if (isGeneric) {
                fmxInterface = new Famix.ParameterizableInterface(this.fmxRep);
            }
            else {
                fmxInterface = new Famix.Interface(this.fmxRep);
            }

            fmxInterface.setName(interName);

            this.makeFamixIndexFileAnchor(inter, fmxInterface);

            this.fmxInterfaces.set(interName, fmxInterface);
        }
        else {
            fmxInterface = this.fmxInterfaces.get(interName) as (Famix.Interface | Famix.ParameterizableInterface);
        }
        return fmxInterface;
    }

    /**
     * Creates a Famix property
     * @param property A property
     * @returns The Famix model of the property
     */
    public createFamixProperty(property: PropertyDeclaration | PropertySignature): Famix.Property {
        const fmxProperty = new Famix.Property(this.fmxRep);
        const isSignature = property instanceof PropertySignature;
        fmxProperty.setName(property.getName());

        let propTypeName = this.UNKNOWN_VALUE;
        try {
            propTypeName = property.getType().getText().trim();
        } catch (error) {
            console.error(`> WARNING: got exception ${error}. Failed to get usable name for property: ${property.getName()}. Continuing...`);
        }

        const fmxType = this.createOrGetFamixType(propTypeName);
        fmxProperty.setDeclaredType(fmxType);

        property.getModifiers().forEach(m => fmxProperty.addModifier(m.getText()));
        if (!isSignature && property.getExclamationTokenNode()) {
            fmxProperty.addModifier("!");
        }
        if (property.getQuestionTokenNode()) {
            fmxProperty.addModifier("?");
        }
        if (property.getName().substring(0, 1) === "#") {
            fmxProperty.addModifier("#");
        }

        if (fmxProperty.getModifiers().has("static")) {
            fmxProperty.setIsClassSide(true);
        }
        else {
            fmxProperty.setIsClassSide(false);
        }

        this.makeFamixIndexFileAnchor(property, fmxProperty);

        return fmxProperty;
    }

    /**
     * Creates a Famix method or accessor
     * @param method A method or an accessor
     * @param currentCC The cyclomatic complexity metrics of the current source file
     * @returns The Famix model of the method or the accessor
     */
    public createFamixMethod(method: MethodDeclaration | ConstructorDeclaration | MethodSignature | GetAccessorDeclaration | SetAccessorDeclaration, currentCC: any): Famix.Method | Famix.Accessor {
        let fmxMethod: Famix.Method | Famix.Accessor;
        if (method instanceof GetAccessorDeclaration || method instanceof SetAccessorDeclaration) {
            fmxMethod = new Famix.Accessor(this.fmxRep);
            const isGetter = method instanceof GetAccessorDeclaration;
            const isSetter = method instanceof SetAccessorDeclaration;
            (fmxMethod as Famix.Accessor).setIsGetter(isGetter);
            (fmxMethod as Famix.Accessor).setIsSetter(isSetter);
        }
        else {
            fmxMethod = new Famix.Method(this.fmxRep);
        }
        const isConstructor = method instanceof ConstructorDeclaration;
        const isSignature = method instanceof MethodSignature;
        const isGeneric = method.getTypeParameters().length > 0;
        fmxMethod.setIsGeneric(isGeneric);

        let isAbstract = false;
        let isStatic = false;
        if (method instanceof MethodDeclaration || method instanceof GetAccessorDeclaration || method instanceof SetAccessorDeclaration) {
            isAbstract = method.isAbstract();
            isStatic = method.isStatic();
        }

        fmxMethod.setIsAbstract(isAbstract);
        fmxMethod.setIsConstructor(isConstructor);
        fmxMethod.setIsClassSide(isStatic);
        fmxMethod.setIsPrivate((method instanceof MethodDeclaration || method instanceof GetAccessorDeclaration || method instanceof SetAccessorDeclaration) ? (method.getModifiers().find(x => x.getText() === 'private')) !== undefined : false);
        fmxMethod.setIsProtected((method instanceof MethodDeclaration || method instanceof GetAccessorDeclaration || method instanceof SetAccessorDeclaration) ? (method.getModifiers().find(x => x.getText() === 'protected')) !== undefined : false);
        fmxMethod.setSignature(this.computeSignature(method.getText()));

        let methodName: string;
        if (isConstructor) {
            methodName = "constructor";
        }
        else {
            methodName = (method as MethodDeclaration | MethodSignature | GetAccessorDeclaration | SetAccessorDeclaration).getName();
        }
        fmxMethod.setName(methodName);

        if (!isConstructor) {
            if (method.getName().substring(0, 1) === "#") {
                fmxMethod.setIsPrivate(true);
            }
        }

        if (!fmxMethod.getIsPrivate() && !fmxMethod.getIsProtected()) {
            fmxMethod.setIsPublic(true);    
        }
        else {
            fmxMethod.setIsPublic(false);
        }

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
     * @param currentCC The cyclomatic complexity metrics of the current source file
     * @returns The Famix model of the function
     */
    public createFamixFunction(func: FunctionDeclaration, currentCC: any): Famix.Function {
        const fmxFunction = new Famix.Function(this.fmxRep);
        fmxFunction.setName(func.getName());
        fmxFunction.setSignature(this.computeSignature(func.getText()));
        fmxFunction.setCyclomaticComplexity(currentCC[fmxFunction.getName()]);
        const isGeneric = func.getTypeParameters().length > 0;
        fmxFunction.setIsGeneric(isGeneric);

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
     * Creates a Famix type parameter
     * @param tp A type parameter
     * @returns The Famix model of the type parameter
     */
    public createFamixTypeParameter(tp: TypeParameterDeclaration): Famix.TypeParameter {
        const fmxTypeParameter = new Famix.TypeParameter(this.fmxRep);
        fmxTypeParameter.setName(tp.getName());

        this.makeFamixIndexFileAnchor(tp, fmxTypeParameter);

        return fmxTypeParameter;
    }

    /**
     * Creates a Famix variable statement
     * @param variableStatement A variable statement
     * @returns The Famix model of the variable statement
     */
    public createFamixVariableStatement(variableStatement: VariableStatement): Famix.VariableStatement {
        const fmxVariableStatement = new Famix.VariableStatement(this.fmxRep);
        fmxVariableStatement.setName("variableStatement");

        this.makeFamixIndexFileAnchor(variableStatement, fmxVariableStatement);

        return fmxVariableStatement;
    }

    /**
     * Creates a Famix variable
     * @param variable A variable
     * @returns The Famix model of the variable
     */
    public createFamixVariable(variable: VariableDeclaration): Famix.Variable {
        const fmxVariable = new Famix.Variable(this.fmxRep);

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
     * Creates a Famix enum
     * @param enumEntity An enum
     * @returns The Famix model of the enum
     */
    public createFamixEnum(enumEntity: EnumDeclaration): Famix.Enum {
        const fmxEnum = new Famix.Enum(this.fmxRep);
        fmxEnum.setName(enumEntity.getName());

        this.makeFamixIndexFileAnchor(enumEntity, fmxEnum);

        return fmxEnum;
    }

    /**
     * Creates a Famix enum value
     * @param enumValue An enum value
     * @returns The Famix model of the enum value
     */
    public createFamixEnumValue(enumValue: EnumMember): Famix.EnumValue {
        const fmxEnumValue = new Famix.EnumValue(this.fmxRep);
        fmxEnumValue.setName(enumValue.getName());

        this.makeFamixIndexFileAnchor(enumValue, fmxEnumValue);

        return fmxEnumValue;
    }

    /**
     * Creates or gets a Famix decorator
     * @param decorator A decorator
     * @param decoratedEntity A class, a method, a parameter or a property
     * @returns The Famix model of the decorator
     */
    public createOrGetFamixDecorator(decorator: Decorator, decoratedEntity: ClassDeclaration | MethodDeclaration | GetAccessorDeclaration | SetAccessorDeclaration | ParameterDeclaration | PropertyDeclaration): Famix.Decorator {
        const fmxDecorator = new Famix.Decorator(this.fmxRep);
        const decoratorName = "@" + decorator.getName();
        const decoratorExpression = decorator.getText().substring(1);

        fmxDecorator.setName(decoratorName);
        fmxDecorator.setDecoratorExpression(decoratorExpression);
        const decoratedEntityFullyQualifiedName = this.FQNFunctions.getFQN(decoratedEntity);
        const fmxDecoratedEntity = this.getFamixEntityByFullyQualifiedName(decoratedEntityFullyQualifiedName) as Famix.NamedEntity;
        fmxDecorator.setDecoratedEntity(fmxDecoratedEntity);

        this.makeFamixIndexFileAnchor(decorator, fmxDecorator);

        return fmxDecorator;
    }

    /**
     * Creates a Famix JS doc
     * @param jsDoc A JS doc
     * @param fmxScope The Famix model of the JS doc's container
     * @returns The Famix model of the JS doc
     */
    public createFamixJSDoc(jsDoc: JSDoc, fmxScope: Famix.NamedEntity): Famix.JSDoc {
        const fmxJSDoc = new Famix.JSDoc(this.fmxRep);
        fmxJSDoc.setContent(jsDoc.getText());
        fmxJSDoc.setContainer(fmxScope);
        fmxJSDoc.setDescription(jsDoc.getDescription().trim());

        this.makeFamixIndexFileAnchor(jsDoc, fmxJSDoc);

        return fmxJSDoc;
    }

    /**
     * Creates a Famix comment
     * @param comment A comment
     * @param fmxScope The Famix model of the comment's container
     * @returns The Famix model of the comment
     */
    public createFamixComment(comment: CommentRange, fmxScope: Famix.NamedEntity): Famix.Comment {
        const fmxComment = new Famix.Comment(this.fmxRep);
        fmxComment.setContent(comment.getText());
        fmxComment.setContainer(fmxScope);

        this.makeFamixIndexFileAnchor(comment, fmxComment);

        return fmxComment;
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

        this.makeFamixIndexFileAnchor(null, fmxType);

        return fmxType;
    }

    /**
     * Creates a Famix access
     * @param node A node
     * @param id An id of a parameter, a variable or a property
     */
    public createFamixAccess(node: Identifier, id: number): void {
        const fmxVar = this.fmxRep.getFamixEntityById(id) as Famix.StructuralEntity;
        const nodeReferenceAncestor = this.findAncestor(node);
        const ancestorFullyQualifiedName = this.FQNFunctions.getFQN(nodeReferenceAncestor);
        const accessor = this.getFamixEntityByFullyQualifiedName(ancestorFullyQualifiedName) as Famix.ContainerEntity;

        const fmxAccess = new Famix.Access(this.fmxRep);
        fmxAccess.setAccessor(accessor);
        fmxAccess.setVariable(fmxVar);

        this.makeFamixIndexFileAnchor(node, fmxAccess);
    }

    /**
     * Creates a Famix invocation
     * @param node A node
     * @param m A method or a function
     * @param id The id of the method or the function
     */
    public createFamixInvocation(node: Identifier, m: MethodDeclaration | ConstructorDeclaration | GetAccessorDeclaration | SetAccessorDeclaration | FunctionDeclaration, id: number): void {
        const fmxMethodOrFunction = this.getFamixEntityById(id) as Famix.BehavioralEntity;
        const nodeReferenceAncestor = this.findAncestor(node);
        const ancestorFullyQualifiedName = this.FQNFunctions.getFQN(nodeReferenceAncestor);
        const sender = this.getFamixEntityByFullyQualifiedName(ancestorFullyQualifiedName) as Famix.ContainerEntity;
        const receiverFullyQualifiedName = this.FQNFunctions.getFQN(m.getParent());
        const receiver = this.getFamixEntityByFullyQualifiedName(receiverFullyQualifiedName) as Famix.NamedEntity;

        const fmxInvocation = new Famix.Invocation(this.fmxRep);
        fmxInvocation.setSender(sender);
        fmxInvocation.setReceiver(receiver);
        fmxInvocation.addCandidate(fmxMethodOrFunction);
        fmxInvocation.setSignature(fmxMethodOrFunction.getSignature());

        this.makeFamixIndexFileAnchor(node, fmxInvocation);
    }

    /**
     * Creates a Famix inheritance
     * @param cls A class or an interface
     * @param inhClass The inherited class or interface
     */
    public createFamixInheritance(cls: ClassDeclaration | InterfaceDeclaration, inhClass: ClassDeclaration | InterfaceDeclaration): void {
        const fmxInheritance = new Famix.Inheritance(this.fmxRep);
        const clsName = cls.getName();
        
        let subClass: Famix.Class | Famix.Interface;
        if (cls instanceof ClassDeclaration) {
            subClass = this.fmxClasses.get(clsName);
        }
        else {
            subClass = this.fmxInterfaces.get(clsName);
        }
        
        const inhClassName = inhClass.getName();
        let superClass: Famix.Class | Famix.Interface;
        if (inhClass instanceof ClassDeclaration) {
            superClass = this.fmxClasses.get(inhClassName);
        }
        else {
            superClass = this.fmxInterfaces.get(inhClassName);
        }

        if (superClass === undefined) {
            if (inhClass instanceof ClassDeclaration) {
                superClass = new Famix.Class(this.fmxRep);
                this.fmxClasses.set(inhClassName, superClass);
            }
            else {
                superClass = new Famix.Interface(this.fmxRep);
                this.fmxInterfaces.set(inhClassName, superClass);
            }

            superClass.setName(inhClassName);
            superClass.setIsStub(true);

            this.makeFamixIndexFileAnchor(inhClass, superClass);
        }

        fmxInheritance.setSubclass(subClass);
        fmxInheritance.setSuperclass(superClass);

        this.makeFamixIndexFileAnchor(null, fmxInheritance);
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
        const fmxImportClause = new Famix.ImportClause(this.fmxRep);

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
                importedEntity = new Famix.NamedEntity(this.fmxRep);
                importedEntity.setName(importedEntityName);
                if (!isInExports) {
                    importedEntity.setIsStub(true);
                }
                this.makeFamixIndexFileAnchor(importElement, importedEntity);
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
            importedEntity = new Famix.NamedEntity(this.fmxRep);
            importedEntity.setName(importedEntityName);
            this.makeFamixIndexFileAnchor(importElement, importedEntity);
            importedEntity.setFullyQualifiedName(pathName);
        }

        const importerFullyQualifiedName = this.FQNFunctions.getFQN(importer);
        const fmxImporter = this.getFamixEntityByFullyQualifiedName(importerFullyQualifiedName) as Famix.Module;
        fmxImportClause.setImporter(fmxImporter);
        fmxImportClause.setImportedEntity(importedEntity);
        fmxImportClause.setModuleSpecifier(moduleSpecifier);

        this.makeFamixIndexFileAnchor(null, fmxImportClause);

        fmxImporter.addImportClause(fmxImportClause);
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
    private getFamixEntityByFullyQualifiedName(ancestorFQN: string): Famix.Entity {
        return this.fmxRep.getFamixEntityByFullyQualifiedName(ancestorFQN) as Famix.Entity;
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
     * Finds the ancestor of a node
     * @param node A node
     * @returns The ancestor of the node
     */
    private findAncestor(node: Identifier): Node {
        return node.getAncestors().find(a => a.getKind() === SyntaxKind.MethodDeclaration || a.getKind() === SyntaxKind.Constructor || a.getKind() === SyntaxKind.FunctionDeclaration || a.getKind() === SyntaxKind.ModuleDeclaration || a.getKind() === SyntaxKind.SourceFile || a.getKindName() === "GetAccessor" || a.getKindName() === "SetAccessor");
    }
}
