import { ClassDeclaration, ConstructorDeclaration, FunctionDeclaration, Identifier, InterfaceDeclaration, MethodDeclaration, MethodSignature, ModuleDeclaration, PropertyDeclaration, PropertySignature, SourceFile, TypeParameterDeclaration, VariableDeclaration, ParameterDeclaration } from "ts-morph";
import * as Famix from "./lib/famix/src/model/famix";
import { FamixRepository } from "./lib/famix/src/famix_repository";
import { SyntaxKind } from "@ts-morph/common";

const UNKNOWN_VALUE = '(unknown due to parsing error)';

export class FamixFunctions {

    private fmxRep = new FamixRepository();
    private fmxTypes = new Map<string, Famix.Type>();
    private fmxNamespacesMap = new Map<string, Famix.Namespace>();
    private arrayOfAccess = new Map<number, any>(); // id of famix object (variable, attribute) and ts-morph object
    private mapOfMethodsForFindingInvocations = new Map<number, MethodDeclaration | ConstructorDeclaration | MethodSignature>(); // id of famix object (method) and ts-morph object

    constructor() {
    }

    public getFamixRepository(): FamixRepository {
        return this.fmxRep;
    }

    public makeFamixIndexFileAnchor(sourceElement: SourceFile | ModuleDeclaration | Identifier | ClassDeclaration | InterfaceDeclaration | MethodDeclaration | MethodSignature | ConstructorDeclaration | ParameterDeclaration | VariableDeclaration | FunctionDeclaration | PropertyDeclaration | PropertySignature, famixElement: Famix.SourcedEntity) {
        let fmxIndexFileAnchor = new Famix.IndexedFileAnchor(this.fmxRep);
        fmxIndexFileAnchor.setFileName(sourceElement.getSourceFile().getFilePath());
        fmxIndexFileAnchor.setStartPos(sourceElement.getStart());
        fmxIndexFileAnchor.setEndPos(sourceElement.getEnd());
        if (famixElement !== null) {
            fmxIndexFileAnchor.setElement(famixElement);
        }
    }

    public createOrGetFamixNamespace(fmxRep: FamixRepository, fmxNamespacesMap: Map<string, Famix.Namespace>, namespaceName: string, parentScope: Famix.Namespace = null): Famix.Namespace {
        let fmxNamespace: Famix.Namespace;
        if (!fmxNamespacesMap.has(namespaceName)) {
            fmxNamespace = new Famix.Namespace(fmxRep);
            fmxNamespace.setName(namespaceName);
            if (parentScope !== null) {
                fmxNamespace.setParentScope(parentScope);
            }
            fmxNamespacesMap.set(namespaceName, fmxNamespace);
        }
        else {
            fmxNamespace = fmxNamespacesMap.get(namespaceName);
        }
        return fmxNamespace;
    }

    public createOrGetFamixClassOrInterface(cls: ClassDeclaration | InterfaceDeclaration, isInterface = false, isAbstract = false): Famix.ParameterizableClass {
        let fmxClass: Famix.ParameterizableClass; // -> Famix.Class ???
        let clsName = cls.getName();
        if (!this.fmxTypes.has(clsName)) {
            fmxClass = new Famix.ParameterizableClass(this.fmxRep); // -> Famix.Class ???
            fmxClass.setName(clsName);
            fmxClass.setIsInterface(isInterface);
            fmxClass.setIsAbstract(isAbstract);

            this.makeFamixIndexFileAnchor(cls, fmxClass);

            this.fmxTypes.set(clsName, fmxClass);
        }
        else {
            fmxClass = this.fmxTypes.get(clsName) as Famix.ParameterizableClass; // -> Famix.Class ???
        }
        return fmxClass;
    }

    public createOrGetFamixParameterType(tp: TypeParameterDeclaration): Famix.ParameterType {
        let fmxParameterType = new Famix.ParameterType(this.fmxRep);
        fmxParameterType.setName(tp.getName());
        return fmxParameterType;
    }

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

    public createFamixMethod(method: MethodDeclaration | ConstructorDeclaration | MethodSignature, currentCC: any, isAbstract = false, isStatic = false): Famix.Method {
        let fmxMethod = new Famix.Method(this.fmxRep);
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
        fmxMethod.setSignature(this.computeTSMethodSignature(method.getText()));

        let methodName: string;
        if (isConstructor) {
            methodName = "constructor";
        }
        else if (isSignature) {  // interfaces
            methodName = (method as MethodSignature).getName();
        }
        else {
            methodName = (method as MethodDeclaration).getName();
        }
        fmxMethod.setName(methodName);

        // if (!isSignature) {
        //     fmxMethod.setCyclomaticComplexity(currentCC[fmxMethod.getName()]);
        // } // -> To modify ???

        let methodTypeName = UNKNOWN_VALUE; 
        try {
            methodTypeName = this.getUsableName(method.getReturnType().getText());            
        } catch (error: any) {
            console.error(`> WARNING -- failed to get usable name for return type of method: ${fmxMethod.getName()}`);
        }

        let fmxType = this.createOrGetFamixType(methodTypeName);
        fmxMethod.setDeclaredType(fmxType);
        fmxMethod.setKind(method.getKindName());
        fmxMethod.setNumberOfLinesOfCode(method.getEndLineNumber() - method.getStartLineNumber());
        let parameters = method.getParameters();
        fmxMethod.setNumberOfParameters(parameters.length);
        fmxMethod.setNumberOfStatements((method as MethodDeclaration | ConstructorDeclaration).getStatements().length);

        // let fqn = UNKNOWN_VALUE;
        // try {
        //     fqn = method.getSymbol().getFullyQualifiedName();
        // } catch (error: any) {
        //     console.error(`> WARNING -- failed to get fully qualified name for method: ${fmxMethod.getName()}`);
        // }
        // fmxMethod.setFullyQualifiedName(fqn);
        
        this.makeFamixIndexFileAnchor(method, fmxMethod);

        // for access
        this.mapOfMethodsForFindingInvocations.set(fmxMethod.id, method); // -> pas pour les interfaces (isSignature === true) ???

        return fmxMethod;
    }

    public createFamixFunction(func: FunctionDeclaration): Famix.Function {
        let fmxFunction = new Famix.Function(this.fmxRep);
        fmxFunction.setName(func.getSymbol().getFullyQualifiedName());

        let functionTypeName = UNKNOWN_VALUE;
        try {
            functionTypeName = this.getUsableName(func.getReturnType().getText());
        } catch (error: any) {
            console.error(`> WARNING - unable to get a usable name for function return type of: ${func.getName()}`)
        }

        let fmxType = this.createOrGetFamixType(functionTypeName);
        fmxFunction.setDeclaredType(fmxType);
        fmxFunction.setNumberOfLinesOfCode(func.getEndLineNumber() - func.getStartLineNumber());
        let parameters = func.getParameters();
        fmxFunction.setNumberOfParameters(parameters.length);
        fmxFunction.setNumberOfStatements(func.getStatements().length);

        // let fullyQualifiedName = UNKNOWN_VALUE;
        // try {
        //     fullyQualifiedName = func.getSymbol().getFullyQualifiedName();
        // } catch (error) {
        //     console.info(`  > WARNING - unable to get a fully qualified name for function return type of: ${func.getName()}`)
        // }
        // fmxFunction.setFullyQualifiedName(fullyQualifiedName);

        this.makeFamixIndexFileAnchor(func, fmxFunction);

        return fmxFunction;
    }

    public createFamixParameter(param: ParameterDeclaration): Famix.Parameter {
        let fmxParam = new Famix.Parameter(this.fmxRep);
        let paramTypeName = UNKNOWN_VALUE;
        try {
            paramTypeName = this.getUsableName(param.getType().getText());
        } catch (error: any) {
            console.error(`> WARNING -- failed to get usable name for param: ${param.getName()}`);
        }
        fmxParam.setDeclaredType(this.createOrGetFamixType(paramTypeName));
        fmxParam.setName(param.getName());

        this.makeFamixIndexFileAnchor(param, fmxParam);

        // for access
        this.arrayOfAccess.set(fmxParam.id, param);

        return fmxParam;
    }

    public createFamixVariable(variable: VariableDeclaration): Famix.LocalVariable {

        // try {
        //     let fullyQualifiedLocalVarName = variable.getSymbol().getFullyQualifiedName();
        // } catch (error: any) {
        //     console.error(`> WARNING -- failed to get fullyQualifiedName for ${variable.getName()}`);
        // }

        let fmxLocalVariable = new Famix.LocalVariable(this.fmxRep);
        let localVariableTypeName = UNKNOWN_VALUE;
        try {
            localVariableTypeName = this.getUsableName(variable.getType().getText());
        } catch (error: any) {
            console.error(`> WARNING -- failed to get text of type for ${variable.getName()}`);
        }
        fmxLocalVariable.setDeclaredType(this.createOrGetFamixType(localVariableTypeName));
        fmxLocalVariable.setName(variable.getName());

        this.makeFamixIndexFileAnchor(variable, fmxLocalVariable);

        // for access
        this.arrayOfAccess.set(fmxLocalVariable.id, variable);

        return fmxLocalVariable;
    }

    public createFamixAttribute(fmxRep: FamixRepository, fmxTypes: Map<string, Famix.Type>, arrayOfAccess: Map<number, any>, property: PropertyDeclaration | PropertySignature, isSignature = false): Famix.Attribute {
        let fmxAttribute = new Famix.Attribute(fmxRep);
        fmxAttribute.setName(property.getName());

        let propTypeName = UNKNOWN_VALUE;
        try {
            propTypeName = property.getType().getText();
        } catch (error: any) {
            console.error(`> WARNING: unable to get type text for ${property.getName()}`);
        }

        let fmxType = this.createOrGetFamixType(propTypeName);
        fmxAttribute.setDeclaredType(fmxType);
        fmxAttribute.setHasClassScope(true);
        this.makeFamixIndexFileAnchor(property, fmxAttribute);

        if (!isSignature) { // -> enlever le if ???
            // for access
            arrayOfAccess.set(fmxAttribute.id, property);
        }

        return fmxAttribute;
    }

    public createFamixInvocation(sender: Famix.BehaviouralEntity, receiver: Famix.Class, fmxMethod: Famix.BehaviouralEntity, node: Identifier): Famix.Invocation {
        let fmxInvocation = new Famix.Invocation(this.fmxRep);
        fmxInvocation.setSender(sender);
        fmxInvocation.setReceiver(receiver);
        fmxInvocation.addCandidates(fmxMethod);
        fmxInvocation.setSignature(fmxMethod.getSignature())

        this.makeFamixIndexFileAnchor(node, fmxInvocation);

        return fmxInvocation;
    }

    public getFamixElementById(famixId: number): Famix.BehaviouralEntity {
        return this.fmxRep.getFamixElementById(famixId) as Famix.BehaviouralEntity; // -> Famix.Entity ???
    }

    public getFamixContainerEntityElementByFullyQualifiedName(ancestorFQN: string): Famix.BehaviouralEntity {
        return this.fmxRep.getFamixContainerEntityElementByFullyQualifiedName(ancestorFQN) as Famix.BehaviouralEntity; // -> Famix.Entity ???
    }

    public getFamixClass(name: string): Famix.Class {
        return this.fmxRep.getFamixClass(name) as Famix.Class;
    }

    private computeTSMethodSignature(methodText: string): string {
        const endSignatureText = methodText.indexOf("{");
        return methodText.substring(0, endSignatureText).trim();
    }
    
    private getUsableName(name: string): string {
        if (name.includes('<')) {
            name = name.substring(0, name.indexOf('<'));
        }
        if (name.includes('.')) {
            name = name.substring(name.lastIndexOf('.') + 1);
        }
        return name;
    }

    public getClassNameOfMethod(method: MethodDeclaration | ConstructorDeclaration | MethodSignature): string {
        if (method instanceof MethodDeclaration) {
            const md = method as MethodDeclaration;
            return (md.getFirstAncestorByKind(SyntaxKind.ClassDeclaration) as ClassDeclaration).getName();
        }
    }
}
