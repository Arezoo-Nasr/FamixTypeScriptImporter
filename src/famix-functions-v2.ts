import { ClassDeclaration, ConstructorDeclaration, FunctionDeclaration, Identifier, InterfaceDeclaration, MethodDeclaration, MethodSignature, ModuleDeclaration, PropertyDeclaration, PropertySignature, SourceFile, TypeParameterDeclaration, VariableDeclaration, ParameterDeclaration } from "ts-morph";
import * as Famix from "./lib/famix/src/model/famix";
import { FamixRepository } from "./lib/famix/src/famix_repository";
import { SyntaxKind } from "@ts-morph/common";
import { getFQN } from "./new-parsing-strategy/fqn";

const UNKNOWN_VALUE = '(unknown due to parsing error)';

export class FamixFunctions {

    private fmxRep = new FamixRepository();
    private fmxTypes = new Map<string, Famix.Type>();
    private fmxNamespacesMap = new Map<string, Famix.Namespace>();
    private arrayOfAccess = new Map<number, ParameterDeclaration | VariableDeclaration | PropertyDeclaration | PropertySignature>(); // id of famix object (variable, attribute) and ts-morph object
    private mapOfMethodsForFindingInvocations = new Map<number, MethodDeclaration | ConstructorDeclaration | MethodSignature>(); // id of famix object (method) and ts-morph object

    // constructor() {
    // }

    public getFamixRepository(): FamixRepository {
        return this.fmxRep;
    }

    public makeFamixIndexFileAnchor(sourceElement: SourceFile | ModuleDeclaration | Identifier | ClassDeclaration | InterfaceDeclaration | MethodDeclaration | MethodSignature | ConstructorDeclaration | ParameterDeclaration | VariableDeclaration | FunctionDeclaration | PropertyDeclaration | PropertySignature, famixElement: Famix.SourcedEntity): void {
        const fmxIndexFileAnchor = new Famix.IndexedFileAnchor(this.fmxRep);
        fmxIndexFileAnchor.setFileName(sourceElement.getSourceFile().getFilePath());
        fmxIndexFileAnchor.setStartPos(sourceElement.getStart());
        fmxIndexFileAnchor.setEndPos(sourceElement.getEnd());
        if (famixElement !== null && !(famixElement instanceof Famix.Invocation)) {
            famixElement.setFullyQualifiedName(getFQN(sourceElement));
            fmxIndexFileAnchor.setElement(famixElement);
        }
        else if (!(famixElement instanceof Famix.Invocation)) {
            fmxIndexFileAnchor.setFullyQualifiedName(getFQN(sourceElement));
        }
    }

    public createOrGetFamixNamespace(m: ModuleDeclaration | SourceFile, parentScope: Famix.Namespace = null): Famix.Namespace {
        let namespaceName: string;
        if (m instanceof ModuleDeclaration) {
            namespaceName = (m as ModuleDeclaration).getName();
        }
        else {
            namespaceName = "__global__";
        }

        let fmxNamespace: Famix.Namespace;
        if (!this.fmxNamespacesMap.has(namespaceName)) {
            fmxNamespace = new Famix.Namespace(this.fmxRep);
            fmxNamespace.setName(namespaceName);
            if (parentScope !== null) {
                fmxNamespace.setParentScope(parentScope);
            }

            if (m instanceof ModuleDeclaration) {
                this.makeFamixIndexFileAnchor(m, fmxNamespace);
            }
            else {
                fmxNamespace.setFullyQualifiedName(`${getFQN(m)}.__global__`); // -> makeIndex ???
            }

            this.fmxNamespacesMap.set(namespaceName, fmxNamespace);
        }
        else {
            fmxNamespace = this.fmxNamespacesMap.get(namespaceName);
        }
        return fmxNamespace;
    }

    public createOrGetFamixClassOrInterface(cls: ClassDeclaration | InterfaceDeclaration, isInterface = false, isAbstract = false): Famix.Class | Famix.ParameterizableClass {
        let fmxClass: Famix.Class | Famix.ParameterizableClass;
        const clsName = cls.getName();
        if (!this.fmxTypes.has(clsName)) {
            const isGenerics = cls.getTypeParameters().length;
            if (isGenerics) {
                fmxClass = new Famix.ParameterizableClass(this.fmxRep);
                cls.getTypeParameters().forEach(tp => {
                    (fmxClass as Famix.ParameterizableClass).addParameterType(this.createOrGetFamixParameterType(tp));
                })
            }
            else {
                fmxClass = new Famix.Class(this.fmxRep);
            }

            fmxClass.setName(clsName);
            fmxClass.setIsInterface(isInterface);
            fmxClass.setIsAbstract(isAbstract);

            this.makeFamixIndexFileAnchor(cls, fmxClass);

            this.fmxTypes.set(clsName, fmxClass);
        }
        else {
            fmxClass = this.fmxTypes.get(clsName) as (Famix.Class | Famix.ParameterizableClass);
        }
        return fmxClass;
    }

    public createOrGetFamixParameterType(tp: TypeParameterDeclaration): Famix.ParameterType { // -> makeIndex ???
        const fmxParameterType = new Famix.ParameterType(this.fmxRep);
        fmxParameterType.setName(tp.getName());
        return fmxParameterType;
    }

    private createOrGetFamixType(typeName: string): Famix.Type { // -> makeIndex ???
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
        } catch (error) {
            console.error(`> WARNING -- failed to get usable name for return type of method: ${fmxMethod.getName()}`);
        }

        const fmxType = this.createOrGetFamixType(methodTypeName);
        fmxMethod.setDeclaredType(fmxType);
        fmxMethod.setKind(method.getKindName());
        fmxMethod.setNumberOfLinesOfCode(method.getEndLineNumber() - method.getStartLineNumber());
        const parameters = method.getParameters();
        fmxMethod.setNumberOfParameters(parameters.length);
        fmxMethod.setNumberOfStatements((method as MethodDeclaration | ConstructorDeclaration).getStatements().length);

        // let fqn = UNKNOWN_VALUE;
        // try {
        //     fqn = method.getSymbol().getFullyQualifiedName();
        // } catch (error) {
        //     console.error(`> WARNING -- failed to get fully qualified name for method: ${fmxMethod.getName()}`);
        // }
        // fmxMethod.setFullyQualifiedName(fqn);
        
        this.makeFamixIndexFileAnchor(method, fmxMethod);

        // for access
        this.mapOfMethodsForFindingInvocations.set(fmxMethod.id, method); // -> pas pour les interfaces (isSignature === true) ???

        return fmxMethod;
    }

    public createFamixFunction(func: FunctionDeclaration): Famix.Function {
        const fmxFunction = new Famix.Function(this.fmxRep);
        fmxFunction.setName(func.getSymbol().getFullyQualifiedName());

        let functionTypeName = UNKNOWN_VALUE;
        try {
            functionTypeName = this.getUsableName(func.getReturnType().getText());
        } catch (error) {
            console.error(`> WARNING - unable to get a usable name for function return type of: ${func.getName()}`)
        }

        const fmxType = this.createOrGetFamixType(functionTypeName);
        fmxFunction.setDeclaredType(fmxType);
        fmxFunction.setNumberOfLinesOfCode(func.getEndLineNumber() - func.getStartLineNumber());
        const parameters = func.getParameters();
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
        const fmxParam = new Famix.Parameter(this.fmxRep);
        let paramTypeName = UNKNOWN_VALUE;
        try {
            paramTypeName = this.getUsableName(param.getType().getText());
        } catch (error) {
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
        // } catch (error) {
        //     console.error(`> WARNING -- failed to get fullyQualifiedName for ${variable.getName()}`);
        // }

        const fmxLocalVariable = new Famix.LocalVariable(this.fmxRep);
        let localVariableTypeName = UNKNOWN_VALUE;
        try {
            localVariableTypeName = this.getUsableName(variable.getType().getText());
        } catch (error) {
            console.error(`> WARNING -- failed to get text of type for ${variable.getName()}`);
        }
        fmxLocalVariable.setDeclaredType(this.createOrGetFamixType(localVariableTypeName));
        fmxLocalVariable.setName(variable.getName());

        this.makeFamixIndexFileAnchor(variable, fmxLocalVariable);

        // for access
        this.arrayOfAccess.set(fmxLocalVariable.id, variable);

        return fmxLocalVariable;
    }

    public createFamixAttribute(fmxRep: FamixRepository, fmxTypes: Map<string, Famix.Type>, arrayOfAccess: Map<number, ParameterDeclaration | VariableDeclaration | PropertyDeclaration | PropertySignature>, property: PropertyDeclaration | PropertySignature, isSignature = false): Famix.Attribute {
        const fmxAttribute = new Famix.Attribute(fmxRep);
        fmxAttribute.setName(property.getName());

        let propTypeName = UNKNOWN_VALUE;
        try {
            propTypeName = property.getType().getText();
        } catch (error) {
            console.error(`> WARNING: unable to get type text for ${property.getName()}`);
        }

        const fmxType = this.createOrGetFamixType(propTypeName);
        fmxAttribute.setDeclaredType(fmxType);
        fmxAttribute.setHasClassScope(true);

        this.makeFamixIndexFileAnchor(property, fmxAttribute);

        if (!isSignature) { // -> enlever le if ???
            // for access
            arrayOfAccess.set(fmxAttribute.id, property);
        }

        return fmxAttribute;
    }

    public createFamixInvocation(node: Identifier, m: MethodDeclaration | ConstructorDeclaration | MethodSignature, id: number): Famix.Invocation {
        const fmxMethod = this.getFamixElementById(id);
        const nodeReferenceAncestor = node.getAncestors().find(a => a.getKind() === SyntaxKind.MethodDeclaration || a.getKind() === SyntaxKind.Constructor || a.getKind() === SyntaxKind.FunctionDeclaration || a.getKind() === SyntaxKind.ModuleDeclaration || a.getKind() === SyntaxKind.SourceFile); // for global variable it must work

        const ancestorFullyQualifiedName = getFQN(nodeReferenceAncestor);
        const sender = this.getFamixEntityElementByFullyQualifiedName(ancestorFullyQualifiedName);
        
        const receiverFullyQualifiedName = this.getClassNameOfMethod(m); // -> utiliser getFQN ???
        const receiver = this.getFamixClass(receiverFullyQualifiedName);

        // TODO const receiver = nodeReferenceAncestor.getPreviousSiblingIfKind() // TODO

        const fmxInvocation = new Famix.Invocation(this.fmxRep);
        fmxInvocation.setSender(sender);
        fmxInvocation.setReceiver(receiver);
        fmxInvocation.addCandidates(fmxMethod);
        fmxInvocation.setSignature(fmxMethod.getSignature())

        fmxInvocation.setFullyQualifiedName(`${fmxMethod.getFullyQualifiedName()}.__invocation__`);

        this.makeFamixIndexFileAnchor(node, fmxInvocation);

        return fmxInvocation;
    }

    public getFamixElementById(famixId: number): Famix.BehaviouralEntity {
        return this.fmxRep.getFamixElementById(famixId) as Famix.BehaviouralEntity; // -> Famix.Entity ???
    }

    public getFamixEntityElementByFullyQualifiedName(ancestorFQN: string): Famix.Entity {
        return this.fmxRep.getFamixEntityElementByFullyQualifiedName(ancestorFQN) as Famix.Entity;
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
        return (method.getFirstAncestorByKind(SyntaxKind.ClassDeclaration) as ClassDeclaration).getName();
    }
}
