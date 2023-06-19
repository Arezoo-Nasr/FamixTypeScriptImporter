import {
    ClassDeclaration, ConstructorDeclaration, FunctionDeclaration, Identifier, InterfaceDeclaration, MethodDeclaration, MethodSignature, ModuleDeclaration, PropertyDeclaration, PropertySignature, SourceFile, TypeParameterDeclaration, VariableDeclaration, ParameterDeclaration
} from "ts-morph";
import * as Famix from "./lib/famix/src/model/famix";
import { FamixRepository } from "./lib/famix/src/famix_repository";

export class FamixFunctions {

    constructor() {
    }

    public makeFamixIndexFileAnchor(fmxRep : FamixRepository, sourceElement: SourceFile | ModuleDeclaration | Identifier | ClassDeclaration | InterfaceDeclaration | MethodDeclaration | MethodSignature | ConstructorDeclaration | ParameterDeclaration | VariableDeclaration | FunctionDeclaration | PropertyDeclaration | PropertySignature, famixElement: Famix.SourcedEntity) {
        let fmxIndexFileAnchor = new Famix.IndexedFileAnchor(fmxRep);
        fmxIndexFileAnchor.setFileName(sourceElement.getSourceFile().getFilePath());
        fmxIndexFileAnchor.setStartPos(sourceElement.getStart());
        fmxIndexFileAnchor.setEndPos(sourceElement.getEnd());
        if (famixElement != null) {
            fmxIndexFileAnchor.setElement(famixElement);
        }
    }

    public createOrGetFamixNamespace(fmxRep : FamixRepository, fmxNamespacesMap : Map<string, Famix.Namespace>, namespaceName: string, parentScope: Famix.Namespace = null): Famix.Namespace {
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

    public createOrGetFamixClass(fmxRep : FamixRepository, fmxTypes : Map<string, Famix.Type>, cls: ClassDeclaration | InterfaceDeclaration, isInterface = false, isAbstract = false): Famix.Class {
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

    public createOrGetFamixParameterType(fmxRep : FamixRepository, tp: TypeParameterDeclaration) {
        const fmxParameterType = new Famix.ParameterType(fmxRep);
        fmxParameterType.setName(tp.getName());
        return fmxParameterType;
    }
}
