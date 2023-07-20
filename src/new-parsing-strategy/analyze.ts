import { ClassDeclaration, MethodDeclaration, VariableStatement, SyntaxKind, FunctionDeclaration, Project, VariableDeclaration, InterfaceDeclaration, ParameterDeclaration, Identifier, ConstructorDeclaration, MethodSignature, SourceFile, ModuleDeclaration, PropertyDeclaration, PropertySignature } from "ts-morph";
import { getFQN } from "./fqn";
import * as Famix from "../lib/famix/src/model/famix";
import { FamixRepository } from "../lib/famix/src/famix_repository";
import { FamixFunctions } from "../famix-functions-v2";

const cyclomatic = require('../lib/ts-complex/cyclomatic-service');

export function famixRepFromPath(paths: Array<string>): FamixRepository {

    const famixFunctions = new FamixFunctions();
    const project = new Project();

    console.info(`paths = ${paths}`);
    const sourceFiles = project.addSourceFilesAtPaths(paths);

    const methodsWithId = new Map<number, MethodDeclaration | ConstructorDeclaration>(); // id of famix object(method) and ts-morph object -> seulement pour constructeur et methodDeclaration ?
    const nodes = new Array<Identifier>;

    sourceFiles.forEach(file => {
        console.info(``);
        console.info(`File >>>>>>>>>> ${file.getBaseName()}`);
        console.info(``);
        const sourceFile = file;

        const currentCC = cyclomatic.calculate(sourceFile.getFilePath()); // store cc metrics for current file



        const files = new Array<SourceFile>();
        const modules = new Array<ModuleDeclaration>;
        const classes = new Array<ClassDeclaration>();
        const interfaces = new Array<InterfaceDeclaration>();
        const methods = new Array<MethodDeclaration | ConstructorDeclaration | MethodSignature>();
        const functions = new Array<FunctionDeclaration>();
        const parameters = new Array<ParameterDeclaration>;
        const variableStatements = new Array<VariableStatement>();
        const variables = new Array<VariableDeclaration>();
        const attributes = new Array <PropertyDeclaration | PropertySignature>;

        processFile(sourceFile);

        function processFile(f: SourceFile): void { // -> global namespace ???
            files.push(f);

            famixFunctions.createFile(f);

            console.log(`sourceFile: ${f.getBaseName()} fqn = ${f.getSymbol()?.getFullyQualifiedName()}, ${getFQN(f)}`);

            console.info(`----------Finding Classes:`);
            f.getClasses().forEach(c => processClass(c));

            console.info(`----------Finding Interfaces:`);
            f.getInterfaces().forEach(i => processInterface(i));
        
            console.info(`----------Finding VariableStatements`);        
            f.getVariableStatements().forEach(v => processVariableStatement(v, true));
        
            console.info(`----------Finding Functions:`);
            f.getFunctions().forEach(f => processFunction(f));

            console.info(`----------Finding Modules:`);
            f.getModules().forEach(md => {
                console.info(`Module "${md.getName()}", fqn = '${md.getSourceFile().getBaseName()}':`);
                processModule(md, null);
            });
        }

        function processModule(m: ModuleDeclaration, parentScope: Famix.Namespace = null): void {
            modules.push(m);

            const fmxNamespace = famixFunctions.createOrGetFamixNamespace(m, parentScope);
            
            console.log(`module declaration: ${m.getName()}, (${m.getType().getText()}`);

            console.log(`module declaration: fqn = ${m.getSymbol()?.getFullyQualifiedName()}, ${fmxNamespace.getFullyQualifiedName()}`);

            console.info(`----------Finding Classes:`);
            m.getClasses().forEach(c => {
                const fmxClass = processClass(c);
                fmxNamespace.addTypes(fmxClass);
            });

            console.info(`----------Finding Interfaces:`);
            m.getInterfaces().forEach(i => {
                const fmxInterface = processInterface(i);
                fmxNamespace.addTypes(fmxInterface);
            });
        
            console.info(`----------Finding VariableStatements`);        
            m.getVariableStatements().forEach(v => {
                const temp_variables = processVariableStatement(v, false) as Array<Famix.LocalVariable>;
                temp_variables.forEach(variable => fmxNamespace.addLocalVariables(variable));
            });
        
            console.info(`----------Finding Functions:`);
            m.getFunctions().forEach(f => {
                const fmxFunction = processFunction(f);
                fmxNamespace.addFunctions(fmxFunction);
            });

            console.info(`----------Finding Modules:`);
            m.getModules().forEach(md => {
                console.info(`Module "${md.getName()}", fqn = '${md.getSourceFile().getBaseName()}':`);
                processModule(md, fmxNamespace);
            });
        }

        function processClass(c: ClassDeclaration): Famix.Class | Famix.ParameterizableClass {
            classes.push(c);

            const fmxClass = famixFunctions.createOrGetFamixClassOrInterface(c, c.isAbstract());

            console.log(`class: ${c.getName()} (${c.getType().getText()}), fqn = ${c.getSymbol()?.getFullyQualifiedName()}, ${fmxClass.getFullyQualifiedName()}`);

            c.getProperties().forEach(prop => {
                const fmxAttr = processAttribute(prop);
                fmxClass.addAttributes(fmxAttr);
            });

            c.getMethods().forEach(m => {
                const fmxMethod = processMethod(m);
                fmxClass.addMethods(fmxMethod);
            });

            // c.getConstructors().forEach(con => processConstructor(con));
            // c.getMembers().forEach(mem => processMember(mem));

            return fmxClass;
        }

        function processInterface(i: InterfaceDeclaration): Famix.Class | Famix.ParameterizableClass { // -> fusionner avec processClass ???
            interfaces.push(i);

            const fmxInterface = famixFunctions.createOrGetFamixClassOrInterface(i, false);

            console.log(`interface: ${i.getName()} (${i.getType().getText()}), fqn = ${i.getSymbol()?.getFullyQualifiedName()}, ${fmxInterface.getFullyQualifiedName()}`);

            i.getProperties().forEach(prop => {
                const fmxAttr = processAttribute(prop);
                fmxInterface.addAttributes(fmxAttr);
            });

            i.getMethods().forEach(m => {
                const fmxMethod = processMethod(m);
                fmxInterface.addMethods(fmxMethod);
            });

            // c.getConstructors().forEach(con => processConstructor(con));
            // c.getMembers().forEach(mem => processMember(mem));

            return fmxInterface;
        }

        function processMethod(m: MethodDeclaration | ConstructorDeclaration | MethodSignature): Famix.Method {
            methods.push(m);

            let fmxMethod: Famix.Method;
            if (m instanceof MethodDeclaration) {
                fmxMethod = famixFunctions.createFamixMethod(m, currentCC, m.isAbstract(), m.isStatic());
            }
            else {
                fmxMethod = famixFunctions.createFamixMethod(m, currentCC, false, false);
            }
            famixFunctions.createOrGetFamixClassOrInterface(m.getParent() as (ClassDeclaration | InterfaceDeclaration)).addMethods(fmxMethod);

            if (m instanceof MethodDeclaration || m instanceof MethodSignature) {
                console.log(`Method declaration: ${m.getName()}`);
            }
            else {
                console.log(`Method declaration: constructor`);
            }

            console.log(`Method declaration: ${(m.getParent() as ClassDeclaration).getName()}, ${famixFunctions.createOrGetFamixClassOrInterface(m.getParent() as (ClassDeclaration | InterfaceDeclaration)).getName()}`);

            console.log(`method: (${m.getType().getText()}), fqn = ${m.getSymbol()?.getFullyQualifiedName()}, ${fmxMethod.getFullyQualifiedName()}`);

            m.getParameters().forEach(param => {
                const fmxParam = processParameter(param);
                fmxMethod.addParameters(fmxParam);
            });

            if (m instanceof MethodDeclaration || m instanceof ConstructorDeclaration) {
                m.getVariableStatements().forEach(v => {
                    const temp_variables = processVariableStatement(v, false) as Array<Famix.LocalVariable>;
                    temp_variables.forEach(variable => fmxMethod.addLocalVariables(variable));
                });

                m.getFunctions().forEach(fun => {
                    const fmxFunction = processFunction(fun);
                    fmxMethod.addFunctions(fmxFunction);
                });
            }

            if (m instanceof MethodDeclaration || m instanceof ConstructorDeclaration) {
                methodsWithId.set(fmxMethod.id, m); // -> seulement pour constructeur et methodDeclaration ?
            }

            return fmxMethod;
        }

        function processFunction(f: FunctionDeclaration): Famix.Function { // -> invocations ???
            functions.push(f);

            const fmxFunction = famixFunctions.createFamixFunction(f);

            console.log(`function: ${f.getName()} (${f.getType().getText()}), fqn = ${f.getSymbol()?.getFullyQualifiedName()}, ${fmxFunction.getFullyQualifiedName()}`);

            f.getParameters().forEach(param => {
                const fmxParam = processParameter(param);
                fmxFunction.addParameters(fmxParam);
            });

            f.getVariableStatements().forEach(v => {
                const temp_variables = processVariableStatement(v, false) as Array<Famix.LocalVariable>;
                temp_variables.forEach(variable => fmxFunction.addLocalVariables(variable));
            });

            f.getFunctions().forEach(ff => {
                const fmxFunc = processFunction(ff);
                fmxFunction.addFunctions(fmxFunc);
            });
            
            return fmxFunction;
        }

        function processParameter(p: ParameterDeclaration): Famix.Parameter {
            parameters.push(p);

            const fmxParam = famixFunctions.createFamixParameter(p);

            console.log(`parameter: ${p.getName()} (${p.getType().getText()}), fqn = ${p.getSymbol()?.getFullyQualifiedName()}, ${fmxParam.getFullyQualifiedName()}`);

            return fmxParam;
        }

        function processVariableStatement(v: VariableStatement, isGlobal = false): Array<Famix.LocalVariable | Famix.GlobalVariable> {
            variableStatements.push(v);

            const temp_variables = new Array<Famix.LocalVariable | Famix.GlobalVariable>();

            v.getDeclarations().forEach(variable => {
                const fmxVar = processVariable(variable, isGlobal);
                temp_variables.push(fmxVar);
            }); 

            console.log(`Variable statement: ${v.getDeclarationKindKeyword().getText()} '${v.getText()}' ${v.getDeclarations()[0].getName()}`);

            return temp_variables;
        }

        function processVariable(v: VariableDeclaration, isGlobal = false): Famix.LocalVariable | Famix.GlobalVariable {
            variables.push(v);

            const fmxVar = famixFunctions.createFamixVariable(v, isGlobal);

            console.log(`variable declaration: ${v.getName()} (${v.getType().getText()}), fqn = ${v.getSymbol()?.getFullyQualifiedName()} ${v.getInitializer() ? "initializer: '" + v.getInitializer().getText() + "'" : ''} `);

            console.log(`variable declaration: ${v.getName()} (${v.getType().getText()}), fqn = ${v.getSymbol()?.getFullyQualifiedName()}, ${fmxVar.getFullyQualifiedName()}`);

            return fmxVar;
        }

        function processAttribute(p: PropertyDeclaration | PropertySignature): Famix.Attribute {
            attributes.push(p);
                            
            const fmxAttr = famixFunctions.createFamixAttribute(p);

            console.log(`attribute: ${p.getName()} (${p.getType().getText()}), fqn = ${p.getSymbol()?.getFullyQualifiedName()}, ${fmxAttr.getFullyQualifiedName()}`);

            return fmxAttr;
        }
    });

    function processInvocations(): void { // process après avoir traité tous les fichiers ???
        methodsWithId.forEach((m, id) => {
            try {
                const temp_nodes = m.findReferencesAsNodes() as Array<Identifier>;
                temp_nodes.forEach(node => processNode(node, m, id));
            } catch (error) {
                console.error(`> WARNING: got exception ${error}. Continuing...`);
            }
        });
    }

    function processNode(n: Identifier, m: MethodDeclaration | ConstructorDeclaration | MethodSignature, id: number): void {
        nodes.push(n);

        try {
            const fmxInvocation = famixFunctions.createFamixInvocation(n, m, id);

            console.log(`node: (${n.getType().getText()}), fqn = ${n.getSymbol()?.getFullyQualifiedName()}, ${fmxInvocation.getFullyQualifiedName()}`);
        } catch (error) {
            console.error(`---error--- scopeDeclaration invalid for ${n.getSymbol().getFullyQualifiedName()}. Continuing parse...`);
        }
    }

    function processInvocationsByCE(): void { // process après avoir traité tous les fichiers ???
        const callExpressions = allProjectCallExpressions();
        callExpressions.forEach(ce => {
            console.log(`  CallExpression: ${ce.getText()}`);
            const returnType = project.getTypeChecker().getTypeAtLocation(ce);
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

    function allProjectCallExpressions(): Array<any> {
        const callExpressions = [];
        for (const file of project.getSourceFiles()) {
            for (const ce of file.getDescendantsOfKind(SyntaxKind.CallExpression)) {
                callExpressions.push(ce);
            }
        }
        return callExpressions;
    }

    processInvocations();



    const fmxRep = famixFunctions.getFamixRepository();
    return fmxRep;
}
