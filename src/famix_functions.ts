import { ClassDeclaration, ConstructorDeclaration, FunctionDeclaration, Identifier, InterfaceDeclaration, MethodDeclaration, MethodSignature, ModuleDeclaration, PropertyDeclaration, PropertySignature, SourceFile, TypeParameterDeclaration, VariableDeclaration, ParameterDeclaration, ExpressionWithTypeArguments } from "ts-morph";
import * as Famix from "./lib/famix/src/model/famix";
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
    private fmxClasses = new Map<string, Famix.Class | Famix.ParameterizableClass>(); // Maps the classes names to their Famix model
    private fmxInterfaces = new Map<string, Famix.Interface | Famix.ParameterizableInterface>(); // Maps the interfaces names to their Famix model
    private fmxNamespaces = new Map<string, Famix.Namespace>(); // Maps the namespaces names to their Famix model
    private fmxScriptEntities = new Map<string, Famix.ScriptEntity>(); // Maps the source files names to their Famix model
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
    private makeFamixIndexFileAnchor(sourceElement: SourceFile | ModuleDeclaration | ClassDeclaration | InterfaceDeclaration | MethodDeclaration | ConstructorDeclaration | MethodSignature | FunctionDeclaration | ParameterDeclaration | VariableDeclaration | PropertyDeclaration | PropertySignature | TypeParameterDeclaration | Identifier, famixElement: Famix.SourcedEntity): void {
        const fmxIndexFileAnchor = new Famix.IndexedFileAnchor(this.fmxRep);
        fmxIndexFileAnchor.setElement(famixElement);

        if (sourceElement !== null) {
            fmxIndexFileAnchor.setFileName(sourceElement.getSourceFile().getFilePath());
            fmxIndexFileAnchor.setStartPos(sourceElement.getStart());
            fmxIndexFileAnchor.setEndPos(sourceElement.getEnd());

            if (!(famixElement instanceof Famix.Access) && !(famixElement instanceof Famix.Invocation) && !(famixElement instanceof Famix.Inheritance)) {
                (famixElement as Famix.NamedEntity).setFullyQualifiedName(this.FQNFunctions.getFQN(sourceElement));
            }
        }
    }

    /**
     * Creates or gets a Famix script entity
     * @param f A source file
     * @returns The Famix model of the source file
     */
    public createOrGetFamixScriptEntity(f: SourceFile): Famix.ScriptEntity {
        let fmxScriptEntity: Famix.ScriptEntity;
        const fileName = f.getBaseName();
        if (!this.fmxScriptEntities.has(fileName)) {
            fmxScriptEntity = new Famix.ScriptEntity(this.fmxRep);
            fmxScriptEntity.setName(fileName);
            fmxScriptEntity.setNumberOfLinesOfText(f.getEndLineNumber() - f.getStartLineNumber());
            fmxScriptEntity.setNumberOfCharacters(f.getFullText().length);

            this.makeFamixIndexFileAnchor(f, fmxScriptEntity);

            this.fmxScriptEntities.set(fileName, fmxScriptEntity);
        }
        else {
            fmxScriptEntity = this.fmxScriptEntities.get(fileName);
        }
        return fmxScriptEntity;
    }

    /**
     * Creates or gets a Famix namespace
     * @param m A namespace
     * @param parentScope The Famix model of the namespace's parent (the parent can be a source file or a namespace)
     * @returns The Famix model of the namespace
     */
    public createOrGetFamixNamespace(m: ModuleDeclaration, parentScope: Famix.ScriptEntity | Famix.Namespace): Famix.Namespace {
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
     * @param cls A class
     * @param isAbstract A boolean indicating if the class is abstract
     * @returns The Famix model of the class
     */
    public createOrGetFamixClass(cls: ClassDeclaration, isAbstract: boolean): Famix.Class | Famix.ParameterizableClass {
        let fmxClass: Famix.Class | Famix.ParameterizableClass;
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
            const isGenerics = inter.getTypeParameters().length;
            if (isGenerics) {
                fmxInterface = new Famix.ParameterizableInterface(this.fmxRep);
                inter.getTypeParameters().forEach(tp => {
                    const fmxParameterType = this.createFamixParameterType(tp);
                    (fmxInterface as Famix.ParameterizableInterface).addParameterType(fmxParameterType);
                });
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
     * Creates a Famix method
     * @param method A method
     * @param currentCC The cyclomatic complexity metrics of the current source file
     * @param isAbstract A boolean indicating if the method is abstract
     * @param isStatic A boolean indicating if the method is static
     * @returns The Famix model of the method
     */
    public createFamixMethod(method: MethodDeclaration | ConstructorDeclaration | MethodSignature, currentCC: any, isAbstract: boolean, isStatic: boolean): Famix.Method {
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
     * Creates a Famix field
     * @param property An field
     * @returns The Famix model of the field
     */
    public createFamixField(property: PropertyDeclaration | PropertySignature): Famix.Field {
        const fmxField = new Famix.Field(this.fmxRep);
        const isSignature = property instanceof PropertySignature;
        fmxField.setName(property.getName());

        let propTypeName = this.UNKNOWN_VALUE;
        try {
            propTypeName = property.getType().getText().trim();
        } catch (error) {
            console.error(`> WARNING: got exception ${error}. Failed to get usable name for field: ${property.getName()}. Continuing...`);
        }

        const fmxType = this.createOrGetFamixType(propTypeName);
        fmxField.setDeclaredType(fmxType);
        //fmxField.setHasClassScope(true);

        property.getModifiers().forEach(m => fmxField.addModifier(m.getText()));
        if (!isSignature && property.getExclamationTokenNode()) {
            fmxField.addModifier("!");
        }
        if (property.getQuestionTokenNode()) {
            fmxField.addModifier("?");
        }

        this.makeFamixIndexFileAnchor(property, fmxField);

        return fmxField;
    }

    /**
     * Creates a Famix access
     * @param node A node
     * @param id An id of a parameter, a variable or an field
     */
    public createFamixAccess(node: Identifier, id: number): void {
        const fmxVar = this.fmxRep.getFamixEntityById(id) as Famix.StructuralEntity;
        const nodeReferenceAncestor = node.getAncestors().find(a => a.getKind() === SyntaxKind.MethodDeclaration || a.getKind() === SyntaxKind.Constructor || a.getKind() === SyntaxKind.FunctionDeclaration || a.getKind() === SyntaxKind.ModuleDeclaration || a.getKind() === SyntaxKind.SourceFile); // for global variable it must work -> a => a.getKind() === any ???

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
     * @param m A method or a constructor
     * @param id The id of the method or the constructor
     */
    public createFamixInvocation(node: Identifier, m: MethodDeclaration | ConstructorDeclaration, id: number): void {
        const fmxMethod = this.getFamixEntityById(id) as Famix.BehavioralEntity;
        const nodeReferenceAncestor = node.getAncestors().find(a => a.getKind() === SyntaxKind.MethodDeclaration || a.getKind() === SyntaxKind.Constructor || a.getKind() === SyntaxKind.FunctionDeclaration || a.getKind() === SyntaxKind.ModuleDeclaration || a.getKind() === SyntaxKind.SourceFile); // for global variable it must work -> a => a.getKind() === any ???

        const ancestorFullyQualifiedName = this.FQNFunctions.getFQN(nodeReferenceAncestor);
        const sender = this.getFamixEntityByFullyQualifiedName(ancestorFullyQualifiedName) as Famix.ContainerEntity;
        const receiverFullyQualifiedName = this.getClassNameOfMethod(m);
        const receiver = this.getFamixEntityByFullyQualifiedName(receiverFullyQualifiedName) as Famix.Class;

        const fmxInvocation = new Famix.Invocation(this.fmxRep);
        fmxInvocation.setSender(sender);
        fmxInvocation.setReceiver(receiver);
        fmxInvocation.addCandidate(fmxMethod);
        fmxInvocation.setSignature(fmxMethod.getSignature());

        this.makeFamixIndexFileAnchor(node, fmxInvocation);
    }

    /**
     * Creates a Famix inheritance
     * @param cls A class or an interface
     * @param inhClass The inherited class or interface
     */
    public createFamixInheritance(cls: ClassDeclaration | InterfaceDeclaration, inhClass: ClassDeclaration | ExpressionWithTypeArguments): void {
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

        this.makeFamixIndexFileAnchor(cls, fmxInheritance);
    }

    /**
     * Creates a Famix parameter type
     * @param tp A type parameter
     * @returns The Famix model of the parameter type
     */
    private createFamixParameterType(tp: TypeParameterDeclaration): Famix.ParameterType {
        const fmxParameterType = new Famix.ParameterType(this.fmxRep);
        fmxParameterType.setName(tp.getName());

        this.makeFamixIndexFileAnchor(tp, fmxParameterType);

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

        this.makeFamixIndexFileAnchor(null, fmxType);

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
     * Gets the class fully qualified name of a method or a constructor
     * @param method A method or a constructor
     * @returns The class fully qualified name of the method or the constructor
     */
    private getClassNameOfMethod(method: MethodDeclaration | ConstructorDeclaration): string {
        return this.FQNFunctions.getFQN(method.getFirstAncestorByKind(SyntaxKind.ClassDeclaration) as ClassDeclaration);
    }
}
