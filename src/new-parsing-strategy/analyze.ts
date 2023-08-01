import { ClassDeclaration, MethodDeclaration, VariableStatement, FunctionDeclaration, Project, VariableDeclaration, InterfaceDeclaration, ParameterDeclaration, Identifier, ConstructorDeclaration, MethodSignature, SourceFile, ModuleDeclaration, PropertyDeclaration, PropertySignature } from "ts-morph";
import * as fs from 'fs';
import * as Famix from "../lib/famix/src/model/famix";
import { FamixRepository } from "../lib/famix/src/famix_repository";
import { FamixFunctions } from "../famix_functions";
import { calculate } from "../lib/ts-complex/cyclomatic-service";
// -> enlever les try catch ???

/**
 * This class is used to build a Famix model from a TypeScript source code
 */
export class Importer {

    private famixFunctions = new FamixFunctions(); // FamixFunctions object, it contains all the functions needed to create Famix entities
    private project = new Project(); // The project containing the source files to analyze
    private methodsWithId = new Map<number, MethodDeclaration | ConstructorDeclaration>(); // Maps the Famix methods ids to their ts-morph method object
    private arrayOfAccess = new Map<number, ParameterDeclaration | VariableDeclaration | PropertyDeclaration>(); // Maps the Famix parameters, variables and fields ids to their ts-morph parameter, variable or field object
    private classes = new Array<ClassDeclaration>(); // Array of all the classes of the source files
    private interfaces = new Array<InterfaceDeclaration>(); // Array of all the interfaces of the source files
    private currentCC: any; // Stores the cyclomatic complexity metrics for the current source file

    // not used
    private files = new Array<SourceFile>();
    private namespaces = new Array<ModuleDeclaration>;
    private methods = new Array<MethodDeclaration | ConstructorDeclaration | MethodSignature>();
    private functions = new Array<FunctionDeclaration>();
    private parameters = new Array<ParameterDeclaration>;
    private variableStatements = new Array<VariableStatement>();
    private variables = new Array<VariableDeclaration>();
    private fields = new Array <PropertyDeclaration | PropertySignature>;
    private access_nodes = new Array<Identifier>;
    private invoc_nodes = new Array<Identifier>;

    /**
     * Main method
     * @param paths An array of paths to the source files to analyze
     * @returns The Famix repository containing the Famix model
     */
    public famixRepFromPaths(paths: Array<string>): FamixRepository {
        try {
            console.info(`famixRepFromPaths: paths: ${paths}`);

            const sourceFiles = this.project.addSourceFilesAtPaths(paths);
            this.processFiles(sourceFiles);
            this.processAccesses();
            this.processInvocations();
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
    public famixRepFromSource(filename: string, source: string): FamixRepository {
        const filePath = `./test_src/${filename}.ts`;

        fs.writeFileSync(filePath, source, 'utf-8');

        const fmxRep = this.famixRepFromPaths([filePath]);

        return fmxRep;
    }

    /**
     * Builds a Famix model for an array of source files
     * @param sourceFiles An array of source files
     */
    private processFiles(sourceFiles: Array<SourceFile>): void {
        sourceFiles.forEach(file => {
            console.info(`processFiles: File: >>>>>>>>>> ${file.getBaseName()}`);

            // Computes the cyclomatic complexity metrics for the current source file
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

        const fmxScriptEntity = this.famixFunctions.createOrGetFamixScriptEntity(f);

        console.info(`processFile: file: ${f.getBaseName()}, fqn = ${fmxScriptEntity.getFullyQualifiedName()}`);

        this.processClasses(f, fmxScriptEntity);

        this.processInterfaces(f, fmxScriptEntity);

        this.processVariables(f, fmxScriptEntity);

        this.processFunctions(f, fmxScriptEntity);

        this.processNamespaces(f, fmxScriptEntity);
    }

    /**
     * Builds a Famix model for a namespace
     * @param m A namespace
     * @param parentScope The Famix model of the namespace's parent (the parent can be a source file or a namespace)
     * @returns A Famix.Namespace representing the namespace
     */
    private processNamespace(m: ModuleDeclaration, parentScope: Famix.ScriptEntity | Famix.Namespace): Famix.Namespace {
        this.namespaces.push(m);

        const fmxNamespace = this.famixFunctions.createOrGetFamixNamespace(m, parentScope);
        
        console.info(`processNamespace: namespace: ${m.getName()}, (${m.getType().getText()}), ${fmxNamespace.getFullyQualifiedName()}`);

        this.processClasses(m, fmxNamespace);

        this.processInterfaces(m, fmxNamespace);

        this.processVariables(m, fmxNamespace);

        this.processFunctions(m, fmxNamespace);

        this.processNamespaces(m, fmxNamespace);

        return fmxNamespace;
    }

    /**
     * Builds a Famix model for the classes of a container
     * @param m A container (a source file or a namespace)
     * @param fmxScope The Famix model of the container
     */
    private processClasses(m: SourceFile | ModuleDeclaration, fmxScope: Famix.ScriptEntity | Famix.Namespace) {
        console.info(`processClasses: ---------- Finding Classes:`);
        m.getClasses().forEach(c => {
            const fmxClass = this.processClass(c);
            fmxScope.addType(fmxClass);
        });
    }

    /**
     * Builds a Famix model for the interfaces of a container
     * @param m A container (a source file or a namespace)
     * @param fmxScope The Famix model of the container
     */
    private processInterfaces(m: SourceFile | ModuleDeclaration, fmxScope: Famix.ScriptEntity | Famix.Namespace) {
        console.info(`processInterfaces: ---------- Finding Interfaces:`);
        m.getInterfaces().forEach(i => {
            const fmxInterface = this.processInterface(i);
            fmxScope.addType(fmxInterface);
        });
    }

    /**
     * Builds a Famix model for the variables of a container
     * @param m A container (a namespace, a function, a method or a constructor)
     * @param fmxScope The Famix model of the container
     */
    private processVariables(m: SourceFile | ModuleDeclaration | FunctionDeclaration | MethodDeclaration | ConstructorDeclaration, fmxScope: Famix.ScriptEntity | Famix.Namespace | Famix.Function | Famix.Method) {
        console.info(`processVariables: ---------- Finding VariableStatements`);
        m.getVariableStatements().forEach(v => {
            const temp_variables = this.processVariableStatement(v);
            temp_variables.forEach(variable => fmxScope.addVariable(variable));
        });
    }

    /**
     * Builds a Famix model for the functions of a container
     * @param m A container (a source file, a namespace, a function, a method or a constructor)
     * @param fmxScope The Famix model of the container
     */
    private processFunctions(m: SourceFile | ModuleDeclaration | FunctionDeclaration | MethodDeclaration | ConstructorDeclaration, fmxScope: Famix.ScriptEntity | Famix.Namespace | Famix.Function | Famix.Method) {
        console.info(`processFunctions: ---------- Finding Functions:`);
        m.getFunctions().forEach(f => {
            const fmxFunction = this.processFunction(f);
            fmxScope.addFunction(fmxFunction);
        });
    }

    /**
     * Builds a Famix model for the namespaces of a container
     * @param m A container (a source file or a namespace)
     * @param fmxScope The Famix model of the container
     */
    private processNamespaces(m: SourceFile | ModuleDeclaration, fmxScope: Famix.ScriptEntity | Famix.Namespace) {
        console.info(`processNamespaces: ---------- Finding Namespaces:`);
        m.getModules().forEach(md => {
            const fmxNsp = this.processNamespace(md, fmxScope);
            fmxScope.addNamespace(fmxNsp);
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

        console.info(`processClass: class: ${c.getName()}, (${c.getType().getText()}), fqn = ${fmxClass.getFullyQualifiedName()}`);

        this.processStructuredType(c, fmxClass);

        c.getConstructors().forEach(con => {
            const fmxCon = this.processMethod(con);
            fmxClass.addMethod(fmxCon);
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

        console.info(`processInterface: interface: ${i.getName()}, (${i.getType().getText()}), fqn = ${fmxInterface.getFullyQualifiedName()}`);

        this.processStructuredType(i, fmxInterface);

        return fmxInterface;
    }

    /**
     * Builds a Famix model for the fields and methods of a structured type
     * @param c A structured type (a class or an interface)
     * @param fmxScope The Famix model of the structured type
     */
    private processStructuredType(c: ClassDeclaration | InterfaceDeclaration, fmxScope: Famix.Class | Famix.ParameterizableClass) {
        c.getProperties().forEach(prop => {
            const fmxAttr = this.processField(prop);
            fmxScope.addField(fmxAttr);
        });

        c.getMethods().forEach(m => {
            const fmxMethod = this.processMethod(m);
            fmxScope.addMethod(fmxMethod);
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

        console.info(`processMethod: method: ${!(m instanceof ConstructorDeclaration) ? m.getName() : "constructor"}, (${m.getType().getText()}), parent: ${(m.getParent() as ClassDeclaration | InterfaceDeclaration).getName()}, fqn = ${fmxMethod.getFullyQualifiedName()}`);

        this.processParameters(m, fmxMethod);

        if (!(m instanceof MethodSignature)) {
            this.processVariables(m, fmxMethod);

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

        console.info(`processFunction: function: ${f.getName()}, (${f.getType().getText()}), fqn = ${fmxFunction.getFullyQualifiedName()}`);

        this.processParameters(f, fmxFunction);

        this.processVariables(f, fmxFunction);

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
            fmxScope.addParameter(fmxParam);
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

        console.info(`processParameter: parameter: ${p.getName()}, (${p.getType().getText()}), fqn = ${fmxParam.getFullyQualifiedName()}`);

        const parent = p.getParent();

        if (!(parent instanceof MethodSignature)) {
            this.arrayOfAccess.set(fmxParam.id, p);
        }

        return fmxParam;
    }

    /**
     * Builds a Famix model for the variables of a variable statement
     * @param v A variable statement
     * @returns An array of Famix.Variable containing the variables
     */
    private processVariableStatement(v: VariableStatement): Array<Famix.Variable> {
        this.variableStatements.push(v);

        const temp_variables = new Array<Famix.Variable>();

        console.info(`processVariableStatement: variable statement: variable statement, (${v.getType().getText()}), ${v.getDeclarationKindKeyword().getText()}`);

        v.getDeclarations().forEach(variable => {
            const fmxVar = this.processVariable(variable);
            temp_variables.push(fmxVar);
        }); 

        return temp_variables;
    }

    /**
     * Builds a Famix model for a variable
     * @param v A variable
     * @returns A Famix.Variable representing the variable
     */
    private processVariable(v: VariableDeclaration): Famix.Variable {
        this.variables.push(v);

        const fmxVar = this.famixFunctions.createFamixVariable(v);

        console.info(`processVariable: variable: ${v.getName()}, (${v.getType().getText()}), ${v.getInitializer() ? "initializer: " + v.getInitializer().getText() : ""}, fqn = ${fmxVar.getFullyQualifiedName()}`);

        this.arrayOfAccess.set(fmxVar.id, v);

        return fmxVar;
    }

    /**
     * Builds a Famix model for a field
     * @param p A field
     * @returns A Famix.Field representing the field
     */
    private processField(p: PropertyDeclaration | PropertySignature): Famix.Field {
        this.fields.push(p);
                        
        const fmxAttr = this.famixFunctions.createFamixField(p);

        console.info(`processField: field: ${p.getName()}, (${p.getType().getText()}), fqn = ${fmxAttr.getFullyQualifiedName()}`);

        if (!(p instanceof PropertySignature)) {
            this.arrayOfAccess.set(fmxAttr.id, p);
        }

        return fmxAttr;
    }

    /**
     * Builds a Famix model for the accesses on the parameters, variables and fields of the source files
     */
    private processAccesses(): void {
        console.info(`processAccesses: Creating accesses:`);
        this.arrayOfAccess.forEach((v, id) => {
            console.info(`processAccesses: Accesses to ${v.getName()}`);
            try {
                const temp_nodes = v.findReferencesAsNodes() as Array<Identifier>;
                temp_nodes.forEach(node => this.processNodeForAccesses(node, id));
            } catch (error) {
                console.error(`> WARNING: got exception ${error}. Continuing...`);
            }
        });
    }

    /**
     * Builds a Famix model for an access on a parameter, variable or field
     * @param n A node
     * @param id An id of a parameter, a variable or an field
     */
    private processNodeForAccesses(n: Identifier, id: number): void {
        this.access_nodes.push(n);

        try {
            this.famixFunctions.createFamixAccess(n, id);

            console.info(`processNodeForAccesses: node: node, (${n.getType().getText()})`);
        } catch (error) {
            console.error(`> WARNING: got exception ${error}. ScopeDeclaration invalid for ${n.getSymbol().getFullyQualifiedName()}. Continuing...`);
        }
    }

    /**
     * Builds a Famix model for the invocations of the methods and constructors of the source files
     */
    private processInvocations(): void {
        console.info(`Creating invocations:`);
        this.methodsWithId.forEach((m, id) => {
            console.info(`Invocations to ${m instanceof MethodDeclaration ? m.getName() : "constructor"}`);
            try {
                const temp_nodes = m.findReferencesAsNodes() as Array<Identifier>;
                temp_nodes.forEach(node => this.processNodeForInvocations(node, m, id));
            } catch (error) {
                console.error(`> WARNING: got exception ${error}. Continuing...`);
            }
        });
    }

    /**
     * Builds a Famix model for an invocation of a method or a constructor
     * @param n A node
     * @param m A method or a constructor
     * @param id The id of the method or the constructor
     */
    private processNodeForInvocations(n: Identifier, m: MethodDeclaration | ConstructorDeclaration, id: number): void {
        this.invoc_nodes.push(n);

        try {
            this.famixFunctions.createFamixInvocation(n, m, id);

            console.info(`node: node, (${n.getType().getText()})`);
        } catch (error) {
            console.error(`> WARNING: got exception ${error}. ScopeDeclaration invalid for ${n.getSymbol().getFullyQualifiedName()}. Continuing...`);
        }
    }

    // private processInvocationsByCE(): void {
    //     const callExpressions = this.allProjectCallExpressions();
    //     callExpressions.forEach(ce => {
    //         console.log(`  CallExpression: ${ce.getText()}`);
    //         const returnType = this.project.getTypeChecker().getTypeAtLocation(ce);
    //         console.log(`  returnType: ${returnType.getText()}`);
    //         const theDescendants = ce.getDescendants();
    //         const DAncest = theDescendants[3].getAncestors();
    //         console.log(DAncest.length);
    //         for (let pas = 0; pas < DAncest.length; pas++) {
    //             console.log(pas, DAncest[pas].getText(), DAncest[pas].getKindName());
    //         }
    //         console.log(theDescendants.length);
    //         for (let pas = 0; pas < theDescendants.length; pas++) {
    //             console.log(pas, theDescendants[pas].getKindName(), theDescendants[pas].getText());
    //         }
    //         // const receiver = this.typeChecker.getType(ce.compilerNode.expression.getChildren()[0]);
    //     });
    // }

    // private allProjectCallExpressions(): Array<any> {
    //     const callExpressions = new Array<any>;
    //     for (const file of this.project.getSourceFiles()) {
    //         for (const ce of file.getDescendantsOfKind(SyntaxKind.CallExpression)) {
    //             callExpressions.push(ce);
    //         }
    //     }
    //     return callExpressions;
    // }

    /**
     * Builds a Famix model for the inheritances of the classes and interfaces of the source files
     */
    private processInheritances(): void {
        console.info(`processInheritances: Creating inheritances:`);
        this.classes.forEach(cls => {
            console.info(`processInheritances: Checking class inheritance for ${cls.getName()}`);
            const extClass = cls.getBaseClass();
            if (extClass !== undefined) {
                this.famixFunctions.createFamixInheritance(cls, extClass);
                
                console.info(`processInheritances: class: ${cls.getName()}, (${cls.getType().getText()}), extClass: ${extClass.getName()}, (${extClass.getType().getText()})`);
            }

            console.info(`processInheritances: Checking interface inheritance for ${cls.getName()}`);
            const implementsInter = cls.getImplements();
            implementsInter.forEach(impInter => {
                this.famixFunctions.createFamixInheritance(cls, impInter);

                console.info(`processInheritances: class: ${cls.getName()}, (${cls.getType().getText()}), impInter: ${impInter.getExpression().getText()}, (${impInter.getType().getText()})`);
            });
        });

        this.interfaces.forEach(inter => {
            console.info(`processInheritances: Checking interface inheritance for ${inter.getName()}`);
            inter.getExtends().forEach(extInter => {
                this.famixFunctions.createFamixInheritance(inter, extInter);

                console.info(`processInheritances: inter: ${inter.getName()}, (${inter.getType().getText()}), extInter: ${extInter.getExpression().getText()}, (${extInter.getType().getText()})`);
            });
        });
    }
}
