import { ClassDeclaration, ConstructorDeclaration, FunctionDeclaration, Identifier, InterfaceDeclaration, MethodDeclaration, MethodSignature, ModuleDeclaration, PropertyDeclaration, PropertySignature, SourceFile, TypeParameterDeclaration, VariableDeclaration, ParameterDeclaration, ExpressionWithTypeArguments } from "ts-morph";
import * as Famix from "./lib/famix/src/model/famix";
import * as FamixFile from "./lib/famix/src/model/file";
import { FamixRepository } from "./lib/famix/src/famix_repository";
import { SyntaxKind } from "@ts-morph/common";
import { getFQN } from "./new-parsing-strategy/fqn";
// -> enlever les try catch ???

export class FamixFunctions {

    private fmxRep = new FamixRepository();
    private fmxTypes = new Map<string, Famix.Type>();
    private fmxClasses = new Map<string, Famix.Class | Famix.ParameterizableClass>();
    private fmxNamespaces = new Map<string, Famix.Namespace>();
    private fmxFiles = new Map<string, FamixFile.File>();
    private arrayOfAccess = new Map<number, ParameterDeclaration | VariableDeclaration | PropertyDeclaration>(); // id of famix object (variable, attribute) and ts-morph object -> utile ???

    private UNKNOWN_VALUE = '(unknown due to parsing error)'; // -> utile ???

    public getFamixRepository(): FamixRepository {
        return this.fmxRep;
    }

    private makeFamixIndexFileAnchor(sourceElement: SourceFile | ModuleDeclaration | Identifier | ClassDeclaration | InterfaceDeclaration | MethodDeclaration | MethodSignature | ConstructorDeclaration | ParameterDeclaration | VariableDeclaration | FunctionDeclaration | PropertyDeclaration | PropertySignature, famixElement: Famix.SourcedEntity): void {
        const fmxIndexFileAnchor = new Famix.IndexedFileAnchor(this.fmxRep);
        fmxIndexFileAnchor.setFileName(sourceElement.getSourceFile().getFilePath());
        fmxIndexFileAnchor.setStartPos(sourceElement.getStart());
        fmxIndexFileAnchor.setEndPos(sourceElement.getEnd());
        fmxIndexFileAnchor.setElement(famixElement);

        if (!(famixElement instanceof Famix.Invocation) && !(famixElement instanceof Famix.Inheritance)) {
            famixElement.setFullyQualifiedName(getFQN(sourceElement));
        }
    }

    public createFile(f: SourceFile): FamixFile.File {
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

    public createOrGetFamixNamespace(m: ModuleDeclaration, parentScope: Famix.Namespace | FamixFile.File): Famix.Namespace {
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

    public createOrGetFamixClassOrInterface(cls: ClassDeclaration | InterfaceDeclaration, isAbstract = false): Famix.Class | Famix.ParameterizableClass {
        let fmxClass: Famix.Class | Famix.ParameterizableClass;
        const isInterface = cls instanceof InterfaceDeclaration;
        const clsName = cls.getName();
        if (!this.fmxClasses.has(clsName)) {
            const isGenerics = cls.getTypeParameters().length;
            if (isGenerics) {
                fmxClass = new Famix.ParameterizableClass(this.fmxRep);
                cls.getTypeParameters().forEach(tp => {
                    const fmxParameterType = this.createOrGetFamixParameterType(tp);
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
            methodTypeName = this.getUsableName(method.getReturnType().getText());            
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

    public createFamixFunction(func: FunctionDeclaration): Famix.Function {
        const fmxFunction = new Famix.Function(this.fmxRep);
        fmxFunction.setName(func.getName());

        let functionTypeName = this.UNKNOWN_VALUE;
        try {
            functionTypeName = this.getUsableName(func.getReturnType().getText());
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

    public createFamixParameter(param: ParameterDeclaration): Famix.Parameter {
        const fmxParam = new Famix.Parameter(this.fmxRep);

        let paramTypeName = this.UNKNOWN_VALUE;
        try {
            paramTypeName = this.getUsableName(param.getType().getText());
        } catch (error) {
            console.error(`> WARNING: got exception ${error}. Failed to get usable name for parameter: ${param.getName()}. Continuing...`);
        }

        const fmxType = this.createOrGetFamixType(paramTypeName);
        fmxParam.setDeclaredType(fmxType);
        fmxParam.setName(param.getName());

        this.makeFamixIndexFileAnchor(param, fmxParam);

        this.arrayOfAccess.set(fmxParam.id, param); // -> if method !isSignature ??? utile ???

        return fmxParam;
    }

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
            variableTypeName = this.getUsableName(variable.getType().getText());
        } catch (error) {
            console.error(`> WARNING: got exception ${error}. Failed to get usable name for variable: ${variable.getName()}. Continuing...`);
        }

        const fmxType = this.createOrGetFamixType(variableTypeName);
        fmxVariable.setDeclaredType(fmxType);
        fmxVariable.setName(variable.getName());

        this.makeFamixIndexFileAnchor(variable, fmxVariable);

        this.arrayOfAccess.set(fmxVariable.id, variable); // -> utile ???

        return fmxVariable;
    }

    public createFamixAttribute(property: PropertyDeclaration | PropertySignature): Famix.Attribute {
        const fmxAttribute = new Famix.Attribute(this.fmxRep);
        const isSignature = property instanceof PropertySignature;
        fmxAttribute.setName(property.getName());

        let propTypeName = this.UNKNOWN_VALUE;
        try {
            propTypeName = this.getUsableName(property.getType().getText());
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

        if (!isSignature) { // -> enlever le if ???
            this.arrayOfAccess.set(fmxAttribute.id, property as PropertyDeclaration); // -> utile ???
        }

        return fmxAttribute;
    }

    public createFamixInvocation(node: Identifier, m: MethodDeclaration | ConstructorDeclaration | MethodSignature, id: number): Famix.Invocation {
        const fmxMethod = this.getFamixElementById(id);
        const nodeReferenceAncestor = node.getAncestors().find(a => a.getKind() === SyntaxKind.MethodDeclaration || a.getKind() === SyntaxKind.Constructor || a.getKind() === SyntaxKind.FunctionDeclaration || a.getKind() === SyntaxKind.ModuleDeclaration || a.getKind() === SyntaxKind.SourceFile); // for global variable it must work -> a => a.getKind() === any ???

        const ancestorFullyQualifiedName = getFQN(nodeReferenceAncestor);
        const sender = this.getFamixEntityElementByFullyQualifiedName(ancestorFullyQualifiedName);
        
        const receiverFullyQualifiedName = this.getClassNameOfMethod(m);
        const receiver = this.getFamixClass(receiverFullyQualifiedName);

        // TODO const receiver = nodeReferenceAncestor.getPreviousSiblingIfKind()

        const fmxInvocation = new Famix.Invocation(this.fmxRep);
        fmxInvocation.setSender(sender);
        fmxInvocation.setReceiver(receiver);
        fmxInvocation.addCandidates(fmxMethod);
        fmxInvocation.setSignature(fmxMethod.getSignature());

        fmxInvocation.setFullyQualifiedName(`${fmxMethod.getFullyQualifiedName()}.__invocation__`);

        this.makeFamixIndexFileAnchor(node, fmxInvocation);

        return fmxInvocation;
    }

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

    private createOrGetFamixParameterType(tp: TypeParameterDeclaration): Famix.ParameterType {
        const fmxParameterType = new Famix.ParameterType(this.fmxRep);
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

    private getFamixElementById(famixId: number): Famix.BehaviouralEntity {
        return this.fmxRep.getFamixElementById(famixId) as Famix.BehaviouralEntity; // -> Famix.Entity ???
    }

    private getFamixEntityElementByFullyQualifiedName(ancestorFQN: string): Famix.Entity {
        return this.fmxRep.getFamixEntityElementByFullyQualifiedName(ancestorFQN) as Famix.Entity;
    }

    private getFamixClass(name: string): Famix.Class {
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

    private getClassNameOfMethod(method: MethodDeclaration | ConstructorDeclaration | MethodSignature): string {
        return getFQN(method.getFirstAncestorByKind(SyntaxKind.ClassDeclaration) as ClassDeclaration);
    }
}
