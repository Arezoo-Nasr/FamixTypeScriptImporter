import { ClassDeclaration, MethodDeclaration, VariableStatement, SyntaxKind, FunctionDeclaration, Project, VariableDeclaration, InterfaceDeclaration, ParameterDeclaration, Identifier, ConstructorDeclaration, MethodSignature, SourceFile, ModuleDeclaration, PropertyDeclaration, PropertySignature } from "ts-morph";
import * as Famix from "../lib/famix/src/model/famix";
import * as FamixFile from "../lib/famix/src/model/file";
import { FamixRepository } from "../lib/famix/src/famix_repository";
import { FamixFunctions } from "../famix-functions-v2";
import { calculate } from "../lib/ts-complex/cyclomatic-service";
// -> enlever les try catch ???

export class Importer {

    private famixFunctions = new FamixFunctions();
    private project = new Project();
    private methodsWithId = new Map<number, MethodDeclaration | ConstructorDeclaration>(); // id of famix object (method) and ts-morph object
    private arrayOfAccess = new Map<number, ParameterDeclaration | VariableDeclaration | PropertyDeclaration>(); // id of famix object (parameter, variable, attribute) and ts-morph object
    private classes = new Array<ClassDeclaration>();
    private interfaces = new Array<InterfaceDeclaration>();
    private currentCC: any; // store cyclomatic complexity metrics for current file

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

    // main method.
    // Takes a list of files to analyze
    public famixRepFromPath(paths: Array<string>): FamixRepository {
        try {
            console.info(`paths = ${paths}`);
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

    // takes a list of files and processFile each of them
    private processFiles(sourceFiles: Array<SourceFile>): void {
        sourceFiles.forEach(file => {
            console.info(``);
            console.info(`File >>>>>>>>>> ${file.getBaseName()}`);
            console.info(``);

            // computes cyclomatic complexity for the file
            this.currentCC = calculate(file.getFilePath());

            this.processFile(file);
        });
    }

    // build a Famix model for one file
    private processFile(f: SourceFile): void {
        this.files.push(f);

        // creates FamixFile for the current file
        const fmxFile = this.famixFunctions.createOrGetFile(f);

        console.log(`file: ${f.getBaseName()}, fqn = ${fmxFile.getFullyQualifiedName()}`);

        console.info(`----------Finding Classes:`);
        f.getClasses().forEach(c => {
            const fmxClass = this.processClass(c);
            fmxFile.addClasses(fmxClass);
        });

        console.info(`----------Finding Interfaces:`);
        f.getInterfaces().forEach(i => {
            const fmxInterface = this.processInterface(i);
            fmxFile.addClasses(fmxInterface);
        });
    
        console.info(`----------Finding VariableStatements`);        
        f.getVariableStatements().forEach(v => {
            const temp_variables = this.processVariableStatement(v, true) as Array<Famix.GlobalVariable>;
            temp_variables.forEach(variable => fmxFile.addGlobalVariables(variable));
        });
    
        console.info(`----------Finding Functions:`);
        f.getFunctions().forEach(f => {
            const fmxFunction = this.processFunction(f);
            fmxFile.addFunctions(fmxFunction);
        });

        console.info(`----------Finding Modules:`);
        f.getModules().forEach(md => {
            const fmxNamespace = this.processModule(md, fmxFile);
            fmxFile.addNamespaces(fmxNamespace);
        });
    }

    // builds a Famix model for a module
    private processModule(m: ModuleDeclaration, parentScope: Famix.Namespace | FamixFile.File): Famix.Namespace {
        this.modules.push(m);

        const fmxNamespace = this.famixFunctions.createOrGetFamixNamespace(m, parentScope);
        
        console.log(`module declaration: ${m.getName()}, (${m.getType().getText()}), ${fmxNamespace.getFullyQualifiedName()}`);

        console.info(`----------Finding Classes:`);
        m.getClasses().forEach(c => {
            const fmxClass = this.processClass(c);
            fmxNamespace.addClasses(fmxClass);
        });

        console.info(`----------Finding Interfaces:`);
        m.getInterfaces().forEach(i => {
            const fmxInterface = this.processInterface(i);
            fmxNamespace.addClasses(fmxInterface);
        });
    
        console.info(`----------Finding VariableStatements`);        
        m.getVariableStatements().forEach(v => {
            const temp_variables = this.processVariableStatement(v, false) as Array<Famix.LocalVariable>;
            temp_variables.forEach(variable => fmxNamespace.addLocalVariables(variable));
        });
    
        console.info(`----------Finding Functions:`);
        m.getFunctions().forEach(f => {
            const fmxFunction = this.processFunction(f);
            fmxNamespace.addFunctions(fmxFunction);
        });

        console.info(`----------Finding Modules:`);
        m.getModules().forEach(md => {
            const fmxNsp = this.processModule(md, fmxNamespace);
            fmxNamespace.addNamespaces(fmxNsp);
        });

        return fmxNamespace;
    }

    private processClass(c: ClassDeclaration): Famix.Class | Famix.ParameterizableClass {
        this.classes.push(c);

        const fmxClass = this.famixFunctions.createOrGetFamixClassOrInterface(c, c.isAbstract());

        console.log(`class: ${c.getName()}, (${c.getType().getText()}), fqn = ${fmxClass.getFullyQualifiedName()}`);

        c.getProperties().forEach(prop => {
            const fmxAttr = this.processAttribute(prop);
            fmxClass.addAttributes(fmxAttr);
        });

        c.getConstructors().forEach(con => {
            const fmxCon = this.processMethod(con);
            fmxClass.addMethods(fmxCon);
        });

        c.getMethods().forEach(m => {
            const fmxMethod = this.processMethod(m);
            fmxClass.addMethods(fmxMethod);
        });

        return fmxClass;
    }

    private processInterface(i: InterfaceDeclaration): Famix.Class | Famix.ParameterizableClass {
        this.interfaces.push(i);

        const fmxInterface = this.famixFunctions.createOrGetFamixClassOrInterface(i, false);

        console.log(`interface: ${i.getName()}, (${i.getType().getText()}), fqn = ${fmxInterface.getFullyQualifiedName()}`);

        i.getProperties().forEach(prop => {
            const fmxAttr = this.processAttribute(prop);
            fmxInterface.addAttributes(fmxAttr);
        });

        i.getMethods().forEach(m => {
            const fmxMethod = this.processMethod(m);
            fmxInterface.addMethods(fmxMethod);
        });

        return fmxInterface;
    }

    private processMethod(m: MethodDeclaration | ConstructorDeclaration | MethodSignature): Famix.Method {
        this.methods.push(m);

        let fmxMethod: Famix.Method;
        if (m instanceof MethodDeclaration) {
            fmxMethod = this.famixFunctions.createFamixMethod(m, this.currentCC, m.isAbstract(), m.isStatic());
        }
        else {
            fmxMethod = this.famixFunctions.createFamixMethod(m, this.currentCC, false, false);
        }

        console.log(`method: ${!(m instanceof ConstructorDeclaration) ? m.getName() : "constructor"}, (${m.getType().getText()}), parent: ${(m.getParent() as ClassDeclaration | InterfaceDeclaration).getName()}, fqn = ${fmxMethod.getFullyQualifiedName()}`);

        m.getParameters().forEach(param => {
            const fmxParam = this.processParameter(param);
            fmxMethod.addParameters(fmxParam);
        });

        if (!(m instanceof MethodSignature)) {
            m.getVariableStatements().forEach(v => {
                const temp_variables = this.processVariableStatement(v, false) as Array<Famix.LocalVariable>;
                temp_variables.forEach(variable => fmxMethod.addLocalVariables(variable));
            });

            m.getFunctions().forEach(fun => {
                const fmxFunction = this.processFunction(fun);
                fmxMethod.addFunctions(fmxFunction);
            });

            this.methodsWithId.set(fmxMethod.id, m);
        }

        return fmxMethod;
    }

    private processFunction(f: FunctionDeclaration): Famix.Function { // -> invocations ???
        this.functions.push(f);

        const fmxFunction = this.famixFunctions.createFamixFunction(f);

        console.log(`function: ${f.getName()}, (${f.getType().getText()}), fqn = ${fmxFunction.getFullyQualifiedName()}`);

        f.getParameters().forEach(param => {
            const fmxParam = this.processParameter(param);
            fmxFunction.addParameters(fmxParam);
        });

        f.getVariableStatements().forEach(v => {
            const temp_variables = this.processVariableStatement(v, false) as Array<Famix.LocalVariable>;
            temp_variables.forEach(variable => fmxFunction.addLocalVariables(variable));
        });

        f.getFunctions().forEach(ff => {
            const fmxFunc = this.processFunction(ff);
            fmxFunction.addFunctions(fmxFunc);
        });
        
        return fmxFunction;
    }

    private processParameter(p: ParameterDeclaration): Famix.Parameter {
        this.parameters.push(p);

        const fmxParam = this.famixFunctions.createFamixParameter(p);

        console.log(`parameter: ${p.getName()}, (${p.getType().getText()}), fqn = ${fmxParam.getFullyQualifiedName()}`);

        const parent = p.getParent();

        if (!(parent instanceof MethodSignature)) {
            this.arrayOfAccess.set(fmxParam.id, p);
        }

        return fmxParam;
    }

    private processVariableStatement(v: VariableStatement, isGlobal = false): Array<Famix.LocalVariable | Famix.GlobalVariable> {
        this.variableStatements.push(v);

        const temp_variables = new Array<Famix.LocalVariable | Famix.GlobalVariable>();

        console.log(`variable statement: variable statement, (${v.getType().getText()}), ${v.getDeclarationKindKeyword().getText()}`);

        v.getDeclarations().forEach(variable => {
            const fmxVar = this.processVariable(variable, isGlobal);
            temp_variables.push(fmxVar);
        }); 

        return temp_variables;
    }

    private processVariable(v: VariableDeclaration, isGlobal = false): Famix.LocalVariable | Famix.GlobalVariable {
        this.variables.push(v);

        const fmxVar = this.famixFunctions.createFamixVariable(v, isGlobal);

        console.log(`variable: ${v.getName()}, (${v.getType().getText()}), ${v.getInitializer() ? "initializer: " + v.getInitializer().getText() : ""}, fqn = ${fmxVar.getFullyQualifiedName()}`);

        this.arrayOfAccess.set(fmxVar.id, v);

        return fmxVar;
    }

    private processAttribute(p: PropertyDeclaration | PropertySignature): Famix.Attribute {
        this.attributes.push(p);
                        
        const fmxAttr = this.famixFunctions.createFamixAttribute(p);

        console.log(`attribute: ${p.getName()}, (${p.getType().getText()}), fqn = ${fmxAttr.getFullyQualifiedName()}`);

        if (!(p instanceof PropertySignature)) {
            this.arrayOfAccess.set(fmxAttr.id, p);
        }

        return fmxAttr;
    }

    private processAccesses(): void {
        console.log(`Creating accesses:`);
        this.arrayOfAccess.forEach((v, id) => {
            console.log(`Accesses to ${v.getName()}`);
            try {
                const temp_nodes = v.findReferencesAsNodes() as Array<Identifier>;
                temp_nodes.forEach(node => this.processNodeForAccesses(node, id));
            } catch (error) {
                console.info(`> WARNING: got exception ${error}. Continuing...`);
            }
        });
    }

    private processNodeForAccesses(n: Identifier, id: number): void {
        this.access_nodes.push(n);

        try {
            const fmxAccess = this.famixFunctions.createFamixAccess(n, id);

            console.log(`node: node, (${n.getType().getText()}), fqn = ${fmxAccess.getFullyQualifiedName()}`);
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

    private processInheritances(): void {
        console.log(`Creating inheritances:`);
        this.classes.forEach(cls => {
            console.info(`Checking class inheritance for ${cls.getName()}`);
            const extClass = cls.getBaseClass();
            if (extClass !== undefined) {
                const fmxInheritance = this.famixFunctions.createFamixInheritance(cls, extClass);
                
                console.log(`class: ${cls.getName()}, (${cls.getType().getText()}), extClass: ${extClass.getName()}, (${extClass.getType().getText()}), fqn = ${fmxInheritance.getFullyQualifiedName()}`);
            }

            console.info(`Checking interface inheritance for ${cls.getName()}`);
            const implementsInter = cls.getImplements();
            implementsInter.forEach(impInter => {
                const fmxInheritance = this.famixFunctions.createFamixInheritance(cls, impInter);

                console.log(`class: ${cls.getName()}, (${cls.getType().getText()}), impInter: ${impInter.getExpression().getText()}, (${impInter.getType().getText()}), fqn = ${fmxInheritance.getFullyQualifiedName()}`);
            });
        });

        this.interfaces.forEach(inter => {
            console.info(`Checking interface inheritance for ${inter.getName()}`);
            inter.getExtends().forEach(extInter => {
                const fmxInheritance = this.famixFunctions.createFamixInheritance(inter, extInter);

                console.log(`inter: ${inter.getName()}, (${inter.getType().getText()}), extInter: ${extInter.getExpression().getText()}, (${extInter.getType().getText()}), fqn = ${fmxInheritance.getFullyQualifiedName()}`);
            });
        });
    }
}
