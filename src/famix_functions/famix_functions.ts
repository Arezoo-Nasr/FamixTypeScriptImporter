import { ClassDeclaration, ConstructorDeclaration, FunctionDeclaration, Identifier, InterfaceDeclaration, MethodDeclaration, MethodSignature, ModuleDeclaration, PropertyDeclaration, PropertySignature, SourceFile, TypeParameterDeclaration, VariableDeclaration, ParameterDeclaration, Decorator, GetAccessorDeclaration, SetAccessorDeclaration, Node, ImportSpecifier, CommentRange, EnumDeclaration, EnumMember, VariableStatement, TypeAliasDeclaration, JSDoc, SyntaxKind } from "ts-morph";
import * as Famix from "../lib/famix/src/model/famix";
import { FamixRepository } from "../lib/famix/src/famix_repository";
import { FQNFunctions } from "../fqn";
import { FamixFunctionsIndex } from "./famix_functions_index";
import { FamixFunctionsAssociations } from "./famix_functions_associations";
// -> enlever les try catch ???

/**
 * This class contains all the functions needed to create Famix entities
 */
export class FamixFunctions {

    private famixRep = new FamixRepository(); // The Famix repository
    private FQNFunctions = new FQNFunctions(); // The fully qualified name functions
    private fmxAliases = new Map<string, Famix.Alias>(); // Maps the alias names to their Famix model
    private fmxTypes = new Map<string, Famix.Type>(); // Maps the type names to their Famix model
    private fmxClasses = new Map<string, Famix.Class | Famix.ParameterizableClass>(); // Maps the class names to their Famix model
    private fmxInterfaces = new Map<string, Famix.Interface | Famix.ParameterizableInterface>(); // Maps the interface names to their Famix model
    private fmxNamespaces = new Map<string, Famix.Namespace>(); // Maps the namespace names to their Famix model
    private fmxFiles = new Map<string, Famix.ScriptEntity | Famix.Module>(); // Maps the source file names to their Famix model
    private famixFunctionsIndex = new FamixFunctionsIndex(this.famixRep); // FamixFunctionsIndex object, it contains all the functions needed to create Famix index file anchors
    private famixFunctionsAssociations = new FamixFunctionsAssociations(this.famixRep, this.fmxClasses, this.fmxInterfaces);; // FamixFunctions object, it contains all the functions needed to create Famix associations
    private UNKNOWN_VALUE = '(unknown due to parsing error)'; // The value to use when a name is not usable

    /**
     * Gets the Famix repository
     * @returns The Famix repository
     */
    public getFamixRepository(): FamixRepository {
        return this.famixRep;
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
                fmxFile = new Famix.Module(this.famixRep); 
            }
            else {
                fmxFile = new Famix.ScriptEntity(this.famixRep);
            }
            fmxFile.setName(fileName);
            fmxFile.setNumberOfLinesOfText(f.getEndLineNumber() - f.getStartLineNumber());
            fmxFile.setNumberOfCharacters(f.getFullText().length);

            this.famixFunctionsIndex.makeFamixIndexFileAnchor(f, fmxFile);

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
            fmxNamespace = new Famix.Namespace(this.famixRep);
            fmxNamespace.setName(namespaceName);
            fmxNamespace.setParentScope(parentScope);

            this.famixFunctionsIndex.makeFamixIndexFileAnchor(m, fmxNamespace);

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
            fmxAlias = new Famix.Alias(this.famixRep);
            fmxAlias.setName(a.getName());

            const fmxType = this.createOrGetFamixType(aliasName, a);
            fmxAlias.setAliasedEntity(fmxType);

            this.famixFunctionsIndex.makeFamixIndexFileAnchor(a, fmxAlias);

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
                fmxClass = new Famix.ParameterizableClass(this.famixRep);
            }
            else {
                fmxClass = new Famix.Class(this.famixRep);
            }

            fmxClass.setName(clsName);
            fmxClass.setIsAbstract(isAbstract);

            this.famixFunctionsIndex.makeFamixIndexFileAnchor(cls, fmxClass);

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
                fmxInterface = new Famix.ParameterizableInterface(this.famixRep);
            }
            else {
                fmxInterface = new Famix.Interface(this.famixRep);
            }

            fmxInterface.setName(interName);

            this.famixFunctionsIndex.makeFamixIndexFileAnchor(inter, fmxInterface);

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
        const fmxProperty = new Famix.Property(this.famixRep);
        const isSignature = property instanceof PropertySignature;
        fmxProperty.setName(property.getName());

        let propTypeName = this.UNKNOWN_VALUE;
        try {
            propTypeName = property.getType().getText().trim();
        } catch (error) {
            console.error(`> WARNING: got exception ${error}. Failed to get usable name for property: ${property.getName()}. Continuing...`);
        }

        const fmxType = this.createOrGetFamixType(propTypeName, property);
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

        this.famixFunctionsIndex.makeFamixIndexFileAnchor(property, fmxProperty);

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
            fmxMethod = new Famix.Accessor(this.famixRep);
            const isGetter = method instanceof GetAccessorDeclaration;
            const isSetter = method instanceof SetAccessorDeclaration;
            (fmxMethod as Famix.Accessor).setIsGetter(isGetter);
            (fmxMethod as Famix.Accessor).setIsSetter(isSetter);
        }
        else {
            fmxMethod = new Famix.Method(this.famixRep);
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

        const fmxType = this.createOrGetFamixType(methodTypeName, method);
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
        
        this.famixFunctionsIndex.makeFamixIndexFileAnchor(method, fmxMethod);

        return fmxMethod;
    }

    /**
     * Creates a Famix function
     * @param func A function
     * @param currentCC The cyclomatic complexity metrics of the current source file
     * @returns The Famix model of the function
     */
    public createFamixFunction(func: FunctionDeclaration, currentCC: any): Famix.Function {
        const fmxFunction = new Famix.Function(this.famixRep);
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

        const fmxType = this.createOrGetFamixType(functionTypeName, func);
        fmxFunction.setDeclaredType(fmxType);
        fmxFunction.setNumberOfLinesOfCode(func.getEndLineNumber() - func.getStartLineNumber());
        const parameters = func.getParameters();
        fmxFunction.setNumberOfParameters(parameters.length);
        fmxFunction.setNumberOfStatements(func.getStatements().length);

        this.famixFunctionsIndex.makeFamixIndexFileAnchor(func, fmxFunction);

        return fmxFunction;
    }

    /**
     * Creates a Famix parameter
     * @param param A parameter
     * @returns The Famix model of the parameter
     */
    public createFamixParameter(param: ParameterDeclaration): Famix.Parameter {
        const fmxParam = new Famix.Parameter(this.famixRep);

        let paramTypeName = this.UNKNOWN_VALUE;
        try {
            paramTypeName = param.getType().getText().trim();
        } catch (error) {
            console.error(`> WARNING: got exception ${error}. Failed to get usable name for parameter: ${param.getName()}. Continuing...`);
        }

        const fmxType = this.createOrGetFamixType(paramTypeName, param);
        fmxParam.setDeclaredType(fmxType);
        fmxParam.setName(param.getName());

        this.famixFunctionsIndex.makeFamixIndexFileAnchor(param, fmxParam);

        return fmxParam;
    }

    /**
     * Creates a Famix type parameter
     * @param tp A type parameter
     * @returns The Famix model of the type parameter
     */
    public createFamixTypeParameter(tp: TypeParameterDeclaration): Famix.TypeParameter {
        const fmxTypeParameter = new Famix.TypeParameter(this.famixRep);
        fmxTypeParameter.setName(tp.getName());

        this.famixFunctionsIndex.makeFamixIndexFileAnchor(tp, fmxTypeParameter);

        return fmxTypeParameter;
    }

    /**
     * Creates a Famix variable statement
     * @param variableStatement A variable statement
     * @returns The Famix model of the variable statement
     */
    public createFamixVariableStatement(variableStatement: VariableStatement): Famix.VariableStatement {
        const fmxVariableStatement = new Famix.VariableStatement(this.famixRep);
        fmxVariableStatement.setName("variableStatement");

        this.famixFunctionsIndex.makeFamixIndexFileAnchor(variableStatement, fmxVariableStatement);

        return fmxVariableStatement;
    }

    /**
     * Creates a Famix variable
     * @param variable A variable
     * @returns The Famix model of the variable
     */
    public createFamixVariable(variable: VariableDeclaration): Famix.Variable {
        const fmxVariable = new Famix.Variable(this.famixRep);

        let variableTypeName = this.UNKNOWN_VALUE;
        try {
            variableTypeName = variable.getType().getText().trim();
        } catch (error) {
            console.error(`> WARNING: got exception ${error}. Failed to get usable name for variable: ${variable.getName()}. Continuing...`);
        }

        const fmxType = this.createOrGetFamixType(variableTypeName, variable);
        fmxVariable.setDeclaredType(fmxType);
        fmxVariable.setName(variable.getName());

        this.famixFunctionsIndex.makeFamixIndexFileAnchor(variable, fmxVariable);

        return fmxVariable;
    }

    /**
     * Creates a Famix enum
     * @param enumEntity An enum
     * @returns The Famix model of the enum
     */
    public createFamixEnum(enumEntity: EnumDeclaration): Famix.Enum {
        const fmxEnum = new Famix.Enum(this.famixRep);
        fmxEnum.setName(enumEntity.getName());

        this.famixFunctionsIndex.makeFamixIndexFileAnchor(enumEntity, fmxEnum);

        return fmxEnum;
    }

    /**
     * Creates a Famix enum value
     * @param enumValue An enum value
     * @returns The Famix model of the enum value
     */
    public createFamixEnumValue(enumValue: EnumMember): Famix.EnumValue {
        const fmxEnumValue = new Famix.EnumValue(this.famixRep);

        let enumValueTypeName = this.UNKNOWN_VALUE;
        try {
            enumValueTypeName = enumValue.getType().getText().trim();
        } catch (error) {
            console.error(`> WARNING: got exception ${error}. Failed to get usable name for enum value: ${enumValue.getName()}. Continuing...`);
        }

        const fmxType = this.createOrGetFamixType(enumValueTypeName, enumValue);
        fmxEnumValue.setDeclaredType(fmxType);
        fmxEnumValue.setName(enumValue.getName());

        this.famixFunctionsIndex.makeFamixIndexFileAnchor(enumValue, fmxEnumValue);

        return fmxEnumValue;
    }

    /**
     * Creates or gets a Famix decorator
     * @param decorator A decorator
     * @param decoratedEntity A class, a method, a parameter or a property
     * @returns The Famix model of the decorator
     */
    public createOrGetFamixDecorator(decorator: Decorator, decoratedEntity: ClassDeclaration | MethodDeclaration | GetAccessorDeclaration | SetAccessorDeclaration | ParameterDeclaration | PropertyDeclaration): Famix.Decorator {
        const fmxDecorator = new Famix.Decorator(this.famixRep);
        const decoratorName = "@" + decorator.getName();
        const decoratorExpression = decorator.getText().substring(1);

        fmxDecorator.setName(decoratorName);
        fmxDecorator.setDecoratorExpression(decoratorExpression);
        const decoratedEntityFullyQualifiedName = this.FQNFunctions.getFQN(decoratedEntity);
        const fmxDecoratedEntity = this.getFamixEntityByFullyQualifiedName(decoratedEntityFullyQualifiedName) as Famix.NamedEntity;
        fmxDecorator.setDecoratedEntity(fmxDecoratedEntity);

        this.famixFunctionsIndex.makeFamixIndexFileAnchor(decorator, fmxDecorator);

        return fmxDecorator;
    }

    /**
     * Creates a Famix JS doc
     * @param jsDoc A JS doc
     * @param fmxScope The Famix model of the JS doc's container
     * @returns The Famix model of the JS doc
     */
    public createFamixJSDoc(jsDoc: JSDoc, fmxScope: Famix.NamedEntity): Famix.JSDoc {
        const fmxJSDoc = new Famix.JSDoc(this.famixRep);
        fmxJSDoc.setContent(jsDoc.getText());
        fmxJSDoc.setContainer(fmxScope);
        fmxJSDoc.setDescription(jsDoc.getDescription().trim());

        this.famixFunctionsIndex.makeFamixIndexFileAnchor(jsDoc, fmxJSDoc);

        return fmxJSDoc;
    }

    /**
     * Creates a Famix comment
     * @param comment A comment
     * @param fmxScope The Famix model of the comment's container
     * @returns The Famix model of the comment
     */
    public createFamixComment(comment: CommentRange, fmxScope: Famix.NamedEntity): Famix.Comment {
        const fmxComment = new Famix.Comment(this.famixRep);
        fmxComment.setContent(comment.getText());
        fmxComment.setContainer(fmxScope);

        this.famixFunctionsIndex.makeFamixIndexFileAnchor(comment, fmxComment);

        return fmxComment;
    }

    /**
     * Creates or gets a Famix type
     * @param typeName A type name
     * @param element A ts-morph element
     * @returns The Famix model of the type
     */
    private createOrGetFamixType(typeName: string, element: TypeAliasDeclaration | PropertyDeclaration | PropertySignature | MethodDeclaration | ConstructorDeclaration | MethodSignature | GetAccessorDeclaration | SetAccessorDeclaration | FunctionDeclaration | ParameterDeclaration | VariableDeclaration | EnumMember): Famix.Type | Famix.PrimitiveType | Famix.ParameterizedType {
        let fmxType: Famix.Type | Famix.PrimitiveType | Famix.ParameterizedType;
        let isPrimitiveType = false;
        let isParameterizedType = false;

        const typeAncestor = this.findTypeAncestor(element);
        const ancestorFullyQualifiedName = this.FQNFunctions.getFQN(typeAncestor);
        const ancestor = this.getFamixEntityByFullyQualifiedName(ancestorFullyQualifiedName) as Famix.ContainerEntity;

        if (typeName === "number" || typeName === "string" || typeName === "boolean" || typeName === "bigint" || typeName === "symbol" || typeName === "undefined" || typeName === "null") {
            isPrimitiveType = true;
        }

        if(!isPrimitiveType && typeName.includes("<") && typeName.includes(">") && !(typeName.includes("=>"))) {
            isParameterizedType = true;
        }

        if (!this.fmxTypes.has(typeName)) {
            if (isPrimitiveType) {
                fmxType = new Famix.PrimitiveType(this.famixRep);
                fmxType.setIsStub(true);
            }
            else if (isParameterizedType) {
                fmxType = new Famix.ParameterizedType(this.famixRep);
                const parameterTypeNames = typeName.substring(typeName.indexOf("<") + 1, typeName.indexOf(">")).split(",").map(s => s.trim());
                const baseTypeName = typeName.substring(0, typeName.indexOf("<")).trim();
                parameterTypeNames.forEach(parameterTypeName => {
                    const fmxParameterType = this.createOrGetFamixType(parameterTypeName, element);
                    (fmxType as Famix.ParameterizedType).addArgument(fmxParameterType);
                });
                const fmxBaseType = this.createOrGetFamixType(baseTypeName, element);
                (fmxType as Famix.ParameterizedType).setBaseType(fmxBaseType);
            }
            else {
                fmxType = new Famix.Type(this.famixRep);
            }

            fmxType.setName(typeName);
            fmxType.setContainer(ancestor);
            
            this.famixFunctionsIndex.makeFamixIndexFileAnchor(null, fmxType);

            this.fmxTypes.set(typeName, fmxType);
        }
        else {
            fmxType = this.fmxTypes.get(typeName);
        }

        return fmxType;
    }

    /**
     * Creates a Famix access
     * @param node A node
     * @param id An id of a parameter, a variable or a property
     */
    public createFamixAccess(node: Identifier, id: number): void {
        this.famixFunctionsAssociations.createFamixAccess(node, id);
    }

    /**
     * Creates a Famix invocation
     * @param node A node
     * @param m A method or a function
     * @param id The id of the method or the function
     */
    public createFamixInvocation(node: Identifier, m: MethodDeclaration | ConstructorDeclaration | GetAccessorDeclaration | SetAccessorDeclaration | FunctionDeclaration, id: number): void {
        this.famixFunctionsAssociations.createFamixInvocation(node, m, id);
    }

    /**
     * Creates a Famix inheritance
     * @param cls A class or an interface
     * @param inhClass The inherited class or interface
     */
    public createFamixInheritance(cls: ClassDeclaration | InterfaceDeclaration, inhClass: ClassDeclaration | InterfaceDeclaration): void {
        this.famixFunctionsAssociations.createFamixInheritance(cls, inhClass);
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
        this.famixFunctionsAssociations.createFamixImportClause(importer, moduleSpecifier, moduleSpecifierFilePath, importElement, isInExports, isDefaultExport);
    }

    /**
     * Gets a Famix entity by fully qualified name
     * @param ancestorFQN A fully qualified name
     * @returns The Famix entity corresponding to the fully qualified name
     */
    private getFamixEntityByFullyQualifiedName(ancestorFQN: string): Famix.Entity {
        return this.famixRep.getFamixEntityByFullyQualifiedName(ancestorFQN) as Famix.Entity;
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
     * Finds the ancestor of a ts-morph element
     * @param element A ts-morph element
     * @returns The ancestor of the ts-morph element
     */
    private findTypeAncestor(element: TypeAliasDeclaration | PropertyDeclaration | PropertySignature | MethodDeclaration | ConstructorDeclaration | MethodSignature | GetAccessorDeclaration | SetAccessorDeclaration | FunctionDeclaration | ParameterDeclaration | VariableDeclaration | EnumMember): Node {
        return element.getAncestors().find(a => a.getKind() === SyntaxKind.MethodDeclaration || a.getKind() === SyntaxKind.Constructor || a.getKind() === SyntaxKind.MethodSignature || a.getKind() === SyntaxKind.FunctionDeclaration || a.getKind() === SyntaxKind.ModuleDeclaration || a.getKind() === SyntaxKind.SourceFile || a.getKindName() === "GetAccessor" || a.getKindName() === "SetAccessor" || a.getKind() === SyntaxKind.ClassDeclaration || a.getKind() === SyntaxKind.InterfaceDeclaration);
    }
}
