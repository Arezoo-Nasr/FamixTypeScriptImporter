import {
    ClassDeclaration, ConstructorDeclaration, FunctionDeclaration, Identifier, InterfaceDeclaration, MethodDeclaration, MethodSignature, ModuleDeclaration, PropertyDeclaration, PropertySignature, SourceFile, TypeParameterDeclaration, VariableDeclaration, ParameterDeclaration
} from "ts-morph";
import * as Famix from "./lib/famix/src/model/famix";
import { FamixRepository } from "./lib/famix/src/famix_repository";

const UNKNOWN_VALUE = '(unknown due to parsing error)';

export class FamixFunctions {

    constructor() {
    }

    public makeFamixIndexFileAnchor(fmxRep: FamixRepository, sourceElement: SourceFile | ModuleDeclaration | Identifier | ClassDeclaration | InterfaceDeclaration | MethodDeclaration | MethodSignature | ConstructorDeclaration | ParameterDeclaration | VariableDeclaration | FunctionDeclaration | PropertyDeclaration | PropertySignature, famixElement: Famix.SourcedEntity) {
        let fmxIndexFileAnchor = new Famix.IndexedFileAnchor(fmxRep);
        fmxIndexFileAnchor.setFileName(sourceElement.getSourceFile().getFilePath());
        fmxIndexFileAnchor.setStartPos(sourceElement.getStart());
        fmxIndexFileAnchor.setEndPos(sourceElement.getEnd());
        if (famixElement != null) {
            fmxIndexFileAnchor.setElement(famixElement);
        }
    }

    public createOrGetFamixNamespace(fmxRep: FamixRepository, fmxNamespacesMap: Map<string, Famix.Namespace>, namespaceName: string, parentScope: Famix.Namespace = null): Famix.Namespace {
        let fmxNamespace: Famix.Namespace;
        if (!fmxNamespacesMap.has(namespaceName)) {
            fmxNamespace = new Famix.Namespace(fmxRep);
            fmxNamespace.setName(namespaceName);
            if (parentScope != null) {
                fmxNamespace.setParentScope(parentScope);
            }
            fmxNamespacesMap.set(namespaceName, fmxNamespace);
        }
        else {
            fmxNamespace = fmxNamespacesMap.get(namespaceName);
        }
        return fmxNamespace;
    }

    public createOrGetFamixClass(fmxRep: FamixRepository, fmxTypes: Map<string, Famix.Type>, cls: ClassDeclaration | InterfaceDeclaration, isInterface = false, isAbstract = false): Famix.Class {
        let fmxClass: Famix.ParameterizableClass; // -> Famix.Class ???
        let clsName = cls.getName();
        if (!fmxTypes.has(clsName)) {
            fmxClass = new Famix.ParameterizableClass(fmxRep); // -> Famix.Class ???
            fmxClass.setName(clsName);
            fmxClass.setIsInterface(isInterface);
            fmxClass.setIsAbstract(isAbstract);

            this.makeFamixIndexFileAnchor(fmxRep, cls, fmxClass);

            fmxTypes.set(clsName, fmxClass);
        }
        else {
            fmxClass = fmxTypes.get(clsName) as Famix.ParameterizableClass; // -> Famix.Class ???
        }
        return fmxClass;
    }

    public createOrGetFamixParameterType(fmxRep: FamixRepository, tp: TypeParameterDeclaration) {
        const fmxParameterType = new Famix.ParameterType(fmxRep);
        fmxParameterType.setName(tp.getName());
        return fmxParameterType;
    }

    // public createFamixMethod(fmxRep: FamixRepository, fmxTypes: Map<string, Famix.Type>, arrayOfAccess: Map<number, any>, mapOfMethodsForFindingInvocations: Map<number, MethodDeclaration | ConstructorDeclaration | MethodSignature>, method: MethodDeclaration | ConstructorDeclaration | MethodSignature, currentCC: any, isAbstract = false, isStatic = false): Famix.Method {
    //     // console.log(`creating a FamixMethod:`);

    //     const fmxMethod = new Famix.Method(fmxRep);
    //     const isConstructor = method instanceof ConstructorDeclaration;
    //     const isSignature = method instanceof MethodSignature;
    //     fmxMethod.setIsAbstract(isAbstract);
    //     fmxMethod.setIsConstructor(isConstructor);
    //     fmxMethod.setIsClassSide(isStatic);
    //     fmxMethod.setIsPrivate(method instanceof MethodDeclaration ? (method.getModifiers().find(x => x.getText() == 'private')) != undefined : false);
    //     fmxMethod.setIsProtected(method instanceof MethodDeclaration ? (method.getModifiers().find(x => x.getText() == 'protected')) != undefined : false);
    //     if (!fmxMethod.getIsPrivate() && !fmxMethod.getIsProtected()) {
    //         fmxMethod.setIsPublic(true);    
    //     }
    //     fmxMethod.setSignature(this.computeTSMethodSignature(method.getText()));

    //     let methodName : string;
    //     if (isConstructor) {
    //         methodName = "constructor";
    //     }
    //     else if (isSignature) {  // interfaces
    //         methodName = (method as MethodSignature).getName();
    //     }
    //     else {
    //         methodName = (method as MethodDeclaration).getName();
    //     }
    //     fmxMethod.setName(methodName);
    //     // for access
    //     mapOfMethodsForFindingInvocations.set(fmxMethod.id, method); // -> pas pour les interfaces (isSignature = true) ???

    //     if (!isSignature) {
    //         fmxMethod.setCyclomaticComplexity(currentCC[fmxMethod.getName()]);
    //     }

    //     let methodTypeName = UNKNOWN_VALUE; 
    //     try {
    //         methodTypeName = this.getUsableName(method.getReturnType().getText());            
    //     } catch (error: any) {
    //         console.error(`> WARNING -- failed to get usable name for return type of method: ${fmxMethod.getName()}`);
    //     }

    //     let fmxType = this.createOrGetFamixType(fmxRep, fmxTypes, methodTypeName);
    //     fmxMethod.setDeclaredType(fmxType);
    //     fmxMethod.setKind(method.getKindName());
    //     fmxMethod.setNumberOfLinesOfCode(method.getEndLineNumber() - method.getStartLineNumber());

    //     let fqn = UNKNOWN_VALUE;
    //     try {
    //         fqn = method.getSymbol().getFullyQualifiedName();
    //     } catch (error: any) {
    //         console.error(`> WARNING -- failed to get fully qualified name for method: ${fmxMethod.getName()}`);
    //     }
    //     fmxMethod.setFullyQualifiedName(fqn);
    //     this.makeFamixIndexFileAnchor(fmxRep, method, fmxMethod);

    //     // Parameters
    //     let parameters = method.getParameters();
    //     if (parameters.length > 0) {
    //         parameters.forEach(param => {
    //             let fmxParam = new Famix.Parameter(fmxRep);
    //             let paramTypeName = UNKNOWN_VALUE;
    //             try {
    //                 paramTypeName = this.getUsableName(param.getType().getText());
    //             } catch (error: any) {
    //                 console.error(`> WARNING -- failed to get usable name for param: ${param.getName()}`);
    //             }
    //             fmxParam.setDeclaredType(this.createOrGetFamixType(fmxRep, fmxTypes, paramTypeName));
    //             fmxParam.setName(param.getName());
    //             fmxMethod.addParameters(fmxParam);
    //             this.makeFamixIndexFileAnchor(fmxRep, param, fmxParam);
    //             if (!isSignature) {
    //                 // for access
    //                 arrayOfAccess.set(fmxParam.id, param);
    //             }
    //         });
    //     }
    //     fmxMethod.setNumberOfParameters(parameters.length);

    //     // Arezoo
    //     // Variables
    //     if (!isSignature) {
    //         let variables = method.getVariableDeclarations();
    //         if (variables.length > 0) {
    //             variables.forEach(variable => {
    //                 try {
    //                     let fullyQualifiedLocalVarName = variable.getSymbol().getFullyQualifiedName();
    //                 } catch (error: any) {
    //                     console.error(`> WARNING -- failed to get fullyQualifiedName for ${variable.getName()}`);
    //                 }

    //                 let fmxLocalVariable = this.makeFamixLocalVariable(variable);
    //                 fmxMethod.addLocalVariables(fmxLocalVariable);
    //                 this.makeFamixIndexFileAnchor(variable, fmxLocalVariable);
    //                 //var cf = variable.getSourceFile().getSymbol().getFullyQualifiedName();
    //                 //for access
    //                 console.log(`    Add local variable for eventual access> ${variable.getText()} with ${fmxLocalVariable.id}`);
    //                 this.arrayOfAccess.set(fmxLocalVariable.id, variable);
    //             });
    //         }
    //         fmxMethod.setNumberOfStatements(method.getStatements().length);
    //     }
        
    //     return fmxMethod;
    // }

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

    public createFamixAttribute(fmxRep: FamixRepository, fmxTypes: Map<string, Famix.Type>, arrayOfAccess: Map<number, any>, property: PropertyDeclaration | PropertySignature, isSignature = false): Famix.Attribute {

        let fmxAttribute = new Famix.Attribute(fmxRep);
        fmxAttribute.setName(property.getName());

        let propTypeName = UNKNOWN_VALUE;
        try {
            propTypeName = property.getType().getText();
        } catch (error: any) {
            console.error(`> WARNING: unable to get type text for ${property.getName()}`);
        }

        let fmxType = this.createOrGetFamixType(fmxRep, fmxTypes, propTypeName);
        fmxAttribute.setDeclaredType(fmxType);
        fmxAttribute.setHasClassScope(true);
        this.makeFamixIndexFileAnchor(fmxRep, property, fmxAttribute);

        if (!isSignature) { // -> enlever le if ???
            // for access
            arrayOfAccess.set(fmxAttribute.id, property);
        }
        return fmxAttribute;
    }

    private createOrGetFamixType(fmxRep: FamixRepository, fmxTypes: Map<string, Famix.Type>, typeName: string): Famix.Type {
        let fmxType: Famix.Type;
        if (!fmxTypes.has(typeName)) {
            fmxType = new Famix.Type(fmxRep);
            fmxType.setName(typeName);
            fmxTypes.set(typeName, fmxType);
        }
        else {
            fmxType = fmxTypes.get(typeName);
        }
        return fmxType;
    }
}
