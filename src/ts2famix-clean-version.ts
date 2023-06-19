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

    private readonly fmxNamespacesMap = new Map<string, Famix.Namespace>();
    private readonly fmxTypes = new Map<string, Famix.Type>();
    private fmxRep = new FamixRepository();
    private allClasses = new Array<ClassDeclaration>();
    private allInterfaces = new Array<InterfaceDeclaration>();
    private arrayOfAccess = new Map<number, any>(); // id of famix object (variable, attribute) and ts-morph object
    private mapOfMethodsForFindingInvocations = new Map<number, MethodDeclaration | ConstructorDeclaration | MethodSignature>(); // id of famix object (method) and ts-morph object
    
    private project = new Project();

    private currentCC: any; // store cc (cyclomatic complexity) metrics for current file

    constructor() {
    }

    public famixRepFromPath(paths: Array<string>) {
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
            else {
                this.readNamespaces(file, file); // -> else ou pas ???
            }
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
        let classesInFile: ClassDeclaration[];

        if (module instanceof ModuleDeclaration) {
            namespaceName = module.getName();
        }
        else {
            namespaceName = "__global";
        }

        fmxNamespace = this.famixFunctions.createOrGetFamixNamespace(this.fmxRep, this.fmxNamespacesMap, namespaceName, parentScope);
        classesInFile = module.getClasses();

        if (module instanceof ModuleDeclaration) {
            this.famixFunctions.makeFamixIndexFileAnchor(this.fmxRep, module, fmxNamespace); // -> seulement si moduleDeclaration ???
        }

        if (classesInFile.length) {
            this.addClassElements(classesInFile, fmxNamespace);
        }
    }

    private addClassElements(classesInFile: ClassDeclaration[], fmxNamespace: Famix.Namespace) {

        this.allClasses = [...classesInFile];

        classesInFile.forEach(cls => {
            let fmxClass : any;
            const isGenerics = cls.getTypeParameters().length;
            fmxClass = this.famixFunctions.createOrGetFamixClass(this.fmxRep, this.fmxTypes, cls, false, cls.isAbstract());
            if (isGenerics) {
                cls.getTypeParameters().forEach(p => {
                    fmxClass.addParameterType(this.famixFunctions.createOrGetFamixParameterType(this.fmxRep, p));
                })
            }
            fmxNamespace.addTypes(fmxClass);
        });
    }
}
