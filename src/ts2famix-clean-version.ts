import {
    ClassDeclaration, ConstructorDeclaration, FunctionDeclaration, Identifier, InterfaceDeclaration, MethodDeclaration, MethodSignature, ModuleDeclaration, Project, PropertyDeclaration, PropertySignature, SourceFile, TypeParameterDeclaration, VariableDeclaration, ParameterDeclaration, SyntaxKind
} from "ts-morph";
import * as Famix from "./lib/famix/src/model/famix";
import { FamixRepository } from "./lib/famix/src/famix_repository";
import { FamixFunctions } from "./famix-functions";
import { assert } from "console";

const UNKNOWN_VALUE = '(unknown due to parsing error)';

const cyclomatic = require('./lib/ts-complex/cyclomatic-service');

export class TS2Famix {

    private famixFunctions = new FamixFunctions();
    // -> Map en readonly ???
    private fmxRep = new FamixRepository();
    private allClasses = new Array<ClassDeclaration>();
    private allInterfaces = new Array<InterfaceDeclaration>();
    private readonly fmxNamespacesMap = new Map<string, Famix.Namespace>();
    private readonly fmxTypes = new Map<string, Famix.Type>();
    private arrayOfAccess = new Map<number, any>(); // id of famix object (variable, attribute) and ts-morph object
    private mapOfMethodsForFindingInvocations = new Map<number, MethodDeclaration | ConstructorDeclaration | MethodSignature>(); // id of famix object (method) and ts-morph object
    
    private project = new Project();

    private currentCC: any; // store cc (cyclomatic complexity) metrics for current file

    constructor() {
    }

    public famixRepFromPaths(paths: Array<string>) {
        try {
            const sourceFiles = this.project.addSourceFilesAtPaths(paths);
            this.generateNamespaces(sourceFiles);
        }
        catch (error: any) {
            console.error(error.message);
            console.error(error.stack)
            process.exit(1)
        }
        return this.fmxRep;
    }
    
    private generateNamespaces(sourceFiles: SourceFile[]) {

        sourceFiles.forEach(file => {
            this.famixFunctions.makeFamixIndexFileAnchor(this.fmxRep, file, null);

            this.currentCC = cyclomatic.calculate(file.getFilePath());

            let currentModules: ModuleDeclaration[] = file.getModules();
            if (currentModules.length > 0) {
                this.readNamespaces(currentModules, file);
            }

            this.readNamespaces(file, file); // -> else ou pas ???
        });
    }

    private readNamespaces(currentModules: ModuleDeclaration[] | SourceFile, file: SourceFile, parentScope: Famix.Namespace = null) {

        if (currentModules[0] instanceof ModuleDeclaration) {
            (currentModules as ModuleDeclaration[]).forEach(module => {
                this.fillModule(module, file, parentScope);
            });
        }
        else {
            this.fillModule(file, file, parentScope);
        }
    }

    private fillModule(module : ModuleDeclaration | SourceFile, file: SourceFile, parentScope: Famix.Namespace = null) {

        let namespaceName: string;
        let fmxNamespace: Famix.Namespace;
        let interfacesInFile: InterfaceDeclaration[];
        let classesInFile: ClassDeclaration[];
        let functionsInFile: FunctionDeclaration[];

        if (module instanceof ModuleDeclaration) {
            namespaceName = module.getName();
        }
        else {
            namespaceName = "__global";
        }

        classesInFile = module.getClasses();
        interfacesInFile = module.getInterfaces();
        functionsInFile = module.getFunctions();
        const variablesInFile = module.getVariableDeclarations();

        if (classesInFile.length || interfacesInFile.length || functionsInFile.length || variablesInFile) {
            fmxNamespace = this.famixFunctions.createOrGetFamixNamespace(this.fmxRep, this.fmxNamespacesMap, namespaceName, parentScope);
        }

        //if (module instanceof ModuleDeclaration) {
        this.famixFunctions.makeFamixIndexFileAnchor(this.fmxRep, module, fmxNamespace); // -> seulement si moduleDeclaration ???

        if (classesInFile.length) {
            this.addClassOrInterfaceElements(classesInFile, fmxNamespace);
        }
        if (interfacesInFile.length) {
            this.addClassOrInterfaceElements(interfacesInFile, fmxNamespace);
        }
        // if (functionsInFile.length) {
        //     this.addFunctionElements(functionsInFile, fmxNamespace);
        // }
        // if (variablesInFile.length) {
        //     this.addVariableElements(variablesInFile, fmxNamespace);
        // }

        if (module.getModules().length > 0) {
            // nested namespaces
            this.readNamespaces(module.getModules(), file, fmxNamespace);
        }
    }

    private addClassOrInterfaceElements(objectsInFile: ClassDeclaration[] | InterfaceDeclaration[], fmxNamespace: Famix.Namespace) {
        if (objectsInFile[0] instanceof ClassDeclaration) {
            this.allClasses = [...objectsInFile] as ClassDeclaration[];
        }
        else {
            this.allInterfaces = [...objectsInFile] as InterfaceDeclaration[];
        }

        objectsInFile.forEach(obj => {
            let fmxObj : any;
            const isGenerics = obj.getTypeParameters().length;
            fmxObj = this.famixFunctions.createOrGetFamixClass(this.fmxRep, this.fmxTypes, obj, false, obj.isAbstract());
            if (isGenerics) {
                obj.getTypeParameters().forEach(p => {
                    fmxObj.addParameterType(this.famixFunctions.createOrGetFamixParameterType(this.fmxRep, p));
                })
            }
            fmxNamespace.addTypes(fmxObj);

            // if (obj instanceof InterfaceDeclaration) {
            //     obj.getMethods().forEach(method => {
            //         let fmxMethod = this.famixFunctions.createFamixMethod(this.fmxRep, this.fmxTypes, this.mapOfMethodsForFindingInvocations, method, this.currentCC);
            //         fmxObj.addMethods(fmxMethod);
            //     });

            //     obj.getProperties().forEach(prop => {
            //         let fmxAttr = this.famixFunctions.createFamixAttribute(this.fmxRep, this.fmxTypes, this.arrayOfAccess, prop, true);
            //         fmxObj.addAttributes(fmxAttr);
            //     });
            // }
        });
    }
}
