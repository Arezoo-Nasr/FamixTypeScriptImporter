import { ClassDeclaration, MethodDeclaration, VariableStatement, SyntaxKind, FunctionDeclaration, Project, VariableDeclaration, InterfaceDeclaration, ParameterDeclaration, Identifier, ConstructorDeclaration, MethodSignature, SourceFile, ModuleDeclaration, PropertyDeclaration, PropertySignature } from "ts-morph";
import * as fs from 'fs';
import * as Famix from "../lib/famix/src/model/famix";
import * as FamixFile from "../lib/famix/src/model/file";
import { FamixRepository } from "../lib/famix/src/famix_repository";
import { FamixFunctions } from "../famix-functions-v2";
import { calculate } from "../lib/ts-complex/cyclomatic-service";
// -> enlever les try catch ???

/**
 * This class is used to build a Famix model from a Typescript source code
 */
export class Importer {

    private famixFunctions = new FamixFunctions();
    private project = new Project();
    private methodsWithId = new Map<number, MethodDeclaration | ConstructorDeclaration>(); // id of famix object (method) and ts-morph object
    private arrayOfAccess = new Map<number, ParameterDeclaration | VariableDeclaration | PropertyDeclaration>(); // id of famix object (parameter, variable, attribute) and ts-morph object
    private classes = new Array<ClassDeclaration>();
    private interfaces = new Array<InterfaceDeclaration>();
    private currentCC: any; // stores cyclomatic complexity metrics for current source file

    // not used
    private files = new Array<SourceFile>();
    private modules = new Array<ModuleDeclaration>;
    private methods = new Array<MethodDeclaration | ConstructorDeclaration | MethodSignature>();
    private functions = new Array<FunctionDeclaration>();
    private parameters = new Array<ParameterDeclaration>;
    private variableStatements = new Array<VariableStatement>();
    private variables = new Array<VariableDeclaration>();
    private attributes = new Array <PropertyDeclaration | PropertySignature>;
    private access_nodes = new Array<Identifier>;
    private invoc_nodes = new Array<Identifier>;

    /**
     * Main method
     * @param paths An array of paths to the source files to analyze
     * @returns The Famix repository containing the Famix model
     */
    public famixRepFromPath(paths: Array<string>): FamixRepository {
        try {
            console.info(`famixRepFromPath: paths: ${paths}`);

            const sourceFiles = this.project.addSourceFilesAtPaths(paths);
            this.processFiles(sourceFiles);
            this.processAccesses();
            this.processInvocations(); // todo
            this.processInheritances();
        }
        catch (error) {
            console.error(`> ERROR: got exception ${error}. Exiting...`);
            console.error(error.message);
            console.error(error.stack);
            process.exit(1);
        }

        const fmxRep = this.famixFunctions.getFamixRepository();

        return fmxRep;
    }

    /**
     * Main method for tests
     * @param source A TypeScript source code
     * @returns The Famix repository containing the Famix model
     */
    public famixRepFromSource(source: string): FamixRepository {
        const filePath = './famixTypeScriptTest.ts';

        fs.writeFileSync(filePath, source, 'utf-8');

        return this.famixRepFromPath([filePath]);
    }

    /**
     * Builds a Famix model for an array of source files
     * @param sourceFiles An array of source files
     */
    private processFiles(sourceFiles: Array<SourceFile>): void {
        sourceFiles.forEach(file => {
            console.info(`processFiles: File >>>>>>>>>> ${file.getBaseName()}`);

            // computes cyclomatic complexity for the current source file
            this.currentCC = calculate(file.getFilePath());

            this.processFile(file);
        });
    }

    /**
     * Builds a Famix model for a source file
     * @param f A source file
     */
    private processFile(f: SourceFile): void {
        this.files.push(f);

        const fmxFile = this.famixFunctions.createOrGetFile(f);

        console.log(`processFile: file: ${f.getBaseName()}, fqn = ${fmxFile.getFullyQualifiedName()}`);

        this.processClasses(f, fmxFile);

        this.processInterfaces(f, fmxFile);

        this.processGlobalVariables(f, fmxFile);

        this.processFunctions(f, fmxFile);

        this.processModules(f, fmxFile);
    }

    /**
     * Builds a Famix model for a module
     * @param m A module
     * @param parentScope The Famix model of the module's parent (the parent can be a source file or a module)
     * @returns A Famix.Namespace representing the module
     */
    private processModule(m: ModuleDeclaration, parentScope: FamixFile.File | Famix.Namespace): Famix.Namespace {
        this.modules.push(m);

        const fmxNamespace = this.famixFunctions.createOrGetFamixNamespace(m, parentScope);
        
        console.log(`processModule: module declaration: ${m.getName()}, (${m.getType().getText()}), ${fmxNamespace.getFullyQualifiedName()}`);

        this.processClasses(m, fmxNamespace);

        this.processInterfaces(m, fmxNamespace);

        this.processLocalVariables(m, fmxNamespace);

        this.processFunctions(m, fmxNamespace);

        this.processModules(m, fmxNamespace);

        return fmxNamespace;
    }

    /**
     * Builds a Famix model for the classes of a container
     * @param m A container (a source file or a module)
     * @param fmxScope The Famix model of the container
     */
    private processClasses(m: SourceFile | ModuleDeclaration, fmxScope: FamixFile.File | Famix.Namespace) {
        console.info(`processClasses: ----------Finding Classes:`);
        m.getClasses().forEach(c => {
            const fmxClass = this.processClass(c);
            fmxScope.addClasses(fmxClass);
        });
    }

    /**
     * Builds a Famix model for the interfaces of a container
     * @param m A container (a source file or a module)
     * @param fmxScope The Famix model of the container
     */
    private processInterfaces(m: SourceFile | ModuleDeclaration, fmxScope: FamixFile.File | Famix.Namespace) {
        console.info(`processInterfaces: ----------Finding Interfaces:`);
        m.getInterfaces().forEach(i => {
            const fmxInterface = this.processInterface(i);
            fmxScope.addClasses(fmxInterface);
        });
    }

    /**
     * Builds a Famix model for the variables of a source file
     * @param m A source file
     * @param fmxScope The Famix model of the source file
     */
    private processGlobalVariables(m: SourceFile, fmxScope: FamixFile.File) {
        console.info(`processGlobalVariables: ----------Finding VariableStatements`);
        m.getVariableStatements().forEach(v => {
            const temp_variables = this.processVariableStatement(v, true) as Array<Famix.GlobalVariable>;
            temp_variables.forEach(variable => fmxScope.addGlobalVariables(variable));
        });
    }

    /**
     * Builds a Famix model for the variables of a container
     * @param m A container (a module, a function, a method or a constructor)
     * @param fmxScope The Famix model of the container
     */
    private processLocalVariables(m: ModuleDeclaration | FunctionDeclaration | MethodDeclaration | ConstructorDeclaration, fmxScope: Famix.Namespace | Famix.Function | Famix.Method) {
        console.info(`processLocalVariables: ----------Finding VariableStatements`);
        m.getVariableStatements().forEach(v => {
            const temp_variables = this.processVariableStatement(v, false) as Array<Famix.LocalVariable>;
            temp_variables.forEach(variable => fmxScope.addLocalVariables(variable));
        });
    }

    /**
     * Builds a Famix model for the functions of a container
     * @param m A container (a source file, a module, a function, a method or a constructor)
     * @param fmxScope The Famix model of the container
     */
    private processFunctions(m: SourceFile | ModuleDeclaration | FunctionDeclaration | MethodDeclaration | ConstructorDeclaration, fmxScope: FamixFile.File | Famix.Namespace | Famix.Function | Famix.Method) {
        console.info(`processFunctions: ----------Finding Functions:`);
        m.getFunctions().forEach(f => {
            const fmxFunction = this.processFunction(f);
            fmxScope.addFunctions(fmxFunction);
        });
    }

    /**
     * Builds a Famix model for the modules of a container
     * @param m A container (a source file or a module)
     * @param fmxScope The Famix model of the container
     */
    private processModules(m: SourceFile | ModuleDeclaration, fmxScope: FamixFile.File | Famix.Namespace) {
        console.info(`processModules: ----------Finding Modules:`);
        m.getModules().forEach(md => {
            const fmxNsp = this.processModule(md, fmxScope);
            fmxScope.addNamespaces(fmxNsp);
        });
    }

    /**
     * Builds a Famix model for a class
     * @param c A class
     * @returns A Famix.Class or a Famix.ParameterizableClass representing the class
     */
    private processClass(c: ClassDeclaration): Famix.Class | Famix.ParameterizableClass {
        this.classes.push(c);

        const fmxClass = this.famixFunctions.createOrGetFamixClassOrInterface(c, c.isAbstract());

        console.log(`processClass: class: ${c.getName()}, (${c.getType().getText()}), fqn = ${fmxClass.getFullyQualifiedName()}`);

        this.processStructuredType(c, fmxClass);

        c.getConstructors().forEach(con => {
            const fmxCon = this.processMethod(con);
            fmxClass.addMethods(fmxCon);
        });

        return fmxClass;
    }

    /**
     * Builds a Famix model for an interface
     * @param i An interface
     * @returns A Famix.Class or a Famix.ParameterizableClass representing the interface
     */
    private processInterface(i: InterfaceDeclaration): Famix.Class | Famix.ParameterizableClass {
        this.interfaces.push(i);

        const fmxInterface = this.famixFunctions.createOrGetFamixClassOrInterface(i, false);

        console.log(`processInterface: interface: ${i.getName()}, (${i.getType().getText()}), fqn = ${fmxInterface.getFullyQualifiedName()}`);

        this.processStructuredType(i, fmxInterface);

        return fmxInterface;
    }

    /**
     * Builds a Famix model for the attributes and methods of a structured type
     * @param c A structured type (a class or an interface)
     * @param fmxScope The Famix model of the structured type
     */
    private processStructuredType(c: ClassDeclaration | InterfaceDeclaration, fmxScope: Famix.Class | Famix.ParameterizableClass) {
        c.getProperties().forEach(prop => {
            const fmxAttr = this.processAttribute(prop);
            fmxScope.addAttributes(fmxAttr);
        });

        c.getMethods().forEach(m => {
            const fmxMethod = this.processMethod(m);
            fmxScope.addMethods(fmxMethod);
        });
    }

    /**
     * Builds a Famix model for a method
     * @param m A method
     * @returns A Famix.Method representing the method
     */
    private processMethod(m: MethodDeclaration | ConstructorDeclaration | MethodSignature): Famix.Method {
        this.methods.push(m);

        let fmxMethod: Famix.Method;
        if (m instanceof MethodDeclaration) {
            fmxMethod = this.famixFunctions.createFamixMethod(m, this.currentCC, m.isAbstract(), m.isStatic());
        }
        else {
            fmxMethod = this.famixFunctions.createFamixMethod(m, this.currentCC, false, false);
        }

        console.log(`processMethod: method: ${!(m instanceof ConstructorDeclaration) ? m.getName() : "constructor"}, (${m.getType().getText()}), parent: ${(m.getParent() as ClassDeclaration | InterfaceDeclaration).getName()}, fqn = ${fmxMethod.getFullyQualifiedName()}`);

        this.processParameters(m, fmxMethod);

        if (!(m instanceof MethodSignature)) {
            this.processLocalVariables(m, fmxMethod);

            this.processFunctions(m, fmxMethod);

            this.methodsWithId.set(fmxMethod.id, m);
        }

        return fmxMethod;
    }

    /**
     * Builds a Famix model for a function
     * @param f A function
     * @returns A Famix.Function representing the function
     */
    private processFunction(f: FunctionDeclaration): Famix.Function { // -> invocations ???
        this.functions.push(f);

        const fmxFunction = this.famixFunctions.createFamixFunction(f);

        console.log(`processFunction: function: ${f.getName()}, (${f.getType().getText()}), fqn = ${fmxFunction.getFullyQualifiedName()}`);

        this.processParameters(f, fmxFunction);

        this.processLocalVariables(f, fmxFunction);

        this.processFunctions(f, fmxFunction);

        return fmxFunction;
    }

    /**
     * Builds a Famix model for the parameters of a method or a function
     * @param m A method or a function
     * @param fmxScope The Famix model of the method or the function
     */
    private processParameters(m: MethodDeclaration | ConstructorDeclaration | MethodSignature | FunctionDeclaration, fmxScope: Famix.Method | Famix.Function) {
        m.getParameters().forEach(param => {
            const fmxParam = this.processParameter(param);
            fmxScope.addParameters(fmxParam);
        });
    }

    /**
     * Builds a Famix model for a parameter
     * @param p A parameter
     * @returns A Famix.Parameter representing the parameter
     */
    private processParameter(p: ParameterDeclaration): Famix.Parameter {
        this.parameters.push(p);

        const fmxParam = this.famixFunctions.createFamixParameter(p);

        console.log(`processParameter: parameter: ${p.getName()}, (${p.getType().getText()}), fqn = ${fmxParam.getFullyQualifiedName()}`);

        const parent = p.getParent();

        if (!(parent instanceof MethodSignature)) {
            this.arrayOfAccess.set(fmxParam.id, p);
        }

        return fmxParam;
    }

    /**
     * Builds a Famix model for the variables of a variable statement
     * @param v A variable statement
     * @param isGlobal A boolean indicating if the variables are global or local
     * @returns An array of Famix.LocalVariable or Famix.GlobalVariable containing the variables
     */
    private processVariableStatement(v: VariableStatement, isGlobal = false): Array<Famix.LocalVariable | Famix.GlobalVariable> {
        this.variableStatements.push(v);

        const temp_variables = new Array<Famix.LocalVariable | Famix.GlobalVariable>();

        console.log(`processVariableStatement: variable statement: variable statement, (${v.getType().getText()}), ${v.getDeclarationKindKeyword().getText()}`);

        v.getDeclarations().forEach(variable => {
            const fmxVar = this.processVariable(variable, isGlobal);
            temp_variables.push(fmxVar);
        }); 

        return temp_variables;
    }

    /**
     * Builds a Famix model for a variable
     * @param v A variable
     * @param isGlobal A boolean indicating if the variable is global or local
     * @returns A Famix.LocalVariable or Famix.GlobalVariable representing the variable
     */
    private processVariable(v: VariableDeclaration, isGlobal = false): Famix.LocalVariable | Famix.GlobalVariable {
        this.variables.push(v);

        const fmxVar = this.famixFunctions.createFamixVariable(v, isGlobal);

        console.log(`processVariable: variable: ${v.getName()}, (${v.getType().getText()}), ${v.getInitializer() ? "initializer: " + v.getInitializer().getText() : ""}, fqn = ${fmxVar.getFullyQualifiedName()}`);

        this.arrayOfAccess.set(fmxVar.id, v);

        return fmxVar;
    }

    /**
     * Builds a Famix model for an attribute
     * @param p An attribute
     * @returns A Famix.Attribute representing the attribute
     */
    private processAttribute(p: PropertyDeclaration | PropertySignature): Famix.Attribute {
        this.attributes.push(p);
                        
        const fmxAttr = this.famixFunctions.createFamixAttribute(p);

        console.log(`processAttribute: attribute: ${p.getName()}, (${p.getType().getText()}), fqn = ${fmxAttr.getFullyQualifiedName()}`);

        if (!(p instanceof PropertySignature)) {
            this.arrayOfAccess.set(fmxAttr.id, p);
        }

        return fmxAttr;
    }

    /**
     * Builds a Famix model for the accesses on the parameters, variables and attributes of the source files
     */
    private processAccesses(): void {
        console.log(`processAccesses: Creating accesses:`);
        this.arrayOfAccess.forEach((v, id) => {
            console.log(`processAccesses: Accesses to ${v.getName()}`);
            try {
                const temp_nodes = v.findReferencesAsNodes() as Array<Identifier>;
                temp_nodes.forEach(node => this.processNodeForAccesses(node, id));
            } catch (error) {
                console.error(`> WARNING: got exception ${error}. Continuing...`);
            }
        });
    }

    /**
     * Builds a Famix model for an access on a parameter, variable or attribute
     * @param n A node
     * @param id An id of a parameter, a variable or an attribute
     */
    private processNodeForAccesses(n: Identifier, id: number): void {
        this.access_nodes.push(n);

        try {
            const fmxAccess = this.famixFunctions.createFamixAccess(n, id);

            console.log(`processNodeForAccesses: node: node, (${n.getType().getText()}), fqn = ${fmxAccess.getFullyQualifiedName()}`);
        } catch (error) {
            console.error(`> WARNING: got exception ${error}. ScopeDeclaration invalid for ${n.getSymbol().getFullyQualifiedName()}. Continuing...`);
        }
    }

    private processInvocations(): void {
        console.log(`Creating invocations:`);
        this.methodsWithId.forEach((m, id) => {
            console.log(`Invocations to ${m instanceof MethodDeclaration ? m.getName() : "constructor"}`);
            try {
                const temp_nodes = m.findReferencesAsNodes() as Array<Identifier>;
                temp_nodes.forEach(node => this.processNodeForInvocations(node, m, id));
            } catch (error) {
                console.error(`> WARNING: got exception ${error}. Continuing...`);
            }
        });
    }

    private processNodeForInvocations(n: Identifier, m: MethodDeclaration | ConstructorDeclaration | MethodSignature, id: number): void {
        this.invoc_nodes.push(n);

        try {
            const fmxInvocation = this.famixFunctions.createFamixInvocation(n, m, id);

            console.log(`node: node, (${n.getType().getText()}), fqn = ${fmxInvocation.getFullyQualifiedName()}`);
        } catch (error) {
            console.error(`> WARNING: got exception ${error}. ScopeDeclaration invalid for ${n.getSymbol().getFullyQualifiedName()}. Continuing...`);
        }
    }

    private processInvocationsByCE(): void {
        const callExpressions = this.allProjectCallExpressions();
        callExpressions.forEach(ce => {
            console.log(`  CallExpression: ${ce.getText()}`);
            const returnType = this.project.getTypeChecker().getTypeAtLocation(ce);
            console.log(`  returnType: ${returnType.getText()}`);
            const theDescendants = ce.getDescendants();
            const DAncest = theDescendants[3].getAncestors();
            console.log(DAncest.length);
            for (let pas = 0; pas < DAncest.length; pas++) {
                console.log(pas, DAncest[pas].getText(), DAncest[pas].getKindName());
            }
            console.log(theDescendants.length);
            for (let pas = 0; pas < theDescendants.length; pas++) {
                console.log(pas, theDescendants[pas].getKindName(), theDescendants[pas].getText());
            }
            // const receiver = this.typeChecker.getType(ce.compilerNode.expression.getChildren()[0]);
        });
    }

    private allProjectCallExpressions(): Array<any> {
        const callExpressions = new Array<any>;
        for (const file of this.project.getSourceFiles()) {
            for (const ce of file.getDescendantsOfKind(SyntaxKind.CallExpression)) {
                callExpressions.push(ce);
            }
        }
        return callExpressions;
    }

    /**
     * Builds a Famix model for the inheritances of the classes and interfaces of the source files
     */
    private processInheritances(): void {
        console.log(`processInheritances: Creating inheritances:`);
        this.classes.forEach(cls => {
            console.info(`processInheritances: Checking class inheritance for ${cls.getName()}`);
            const extClass = cls.getBaseClass();
            if (extClass !== undefined) {
                const fmxInheritance = this.famixFunctions.createFamixInheritance(cls, extClass);
                
                console.log(`processInheritances: class: ${cls.getName()}, (${cls.getType().getText()}), extClass: ${extClass.getName()}, (${extClass.getType().getText()}), fqn = ${fmxInheritance.getFullyQualifiedName()}`);
            }

            console.info(`processInheritances: Checking interface inheritance for ${cls.getName()}`);
            const implementsInter = cls.getImplements();
            implementsInter.forEach(impInter => {
                const fmxInheritance = this.famixFunctions.createFamixInheritance(cls, impInter);

                console.log(`processInheritances: class: ${cls.getName()}, (${cls.getType().getText()}), impInter: ${impInter.getExpression().getText()}, (${impInter.getType().getText()}), fqn = ${fmxInheritance.getFullyQualifiedName()}`);
            });
        });

        this.interfaces.forEach(inter => {
            console.info(`processInheritances: Checking interface inheritance for ${inter.getName()}`);
            inter.getExtends().forEach(extInter => {
                const fmxInheritance = this.famixFunctions.createFamixInheritance(inter, extInter);

                console.log(`processInheritances: inter: ${inter.getName()}, (${inter.getType().getText()}), extInter: ${extInter.getExpression().getText()}, (${extInter.getType().getText()}), fqn = ${fmxInheritance.getFullyQualifiedName()}`);
            });
        });
    }
}
