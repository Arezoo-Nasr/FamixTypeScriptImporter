import { ClassDeclaration, MethodDeclaration, VariableStatement, FunctionDeclaration, Project, VariableDeclaration, InterfaceDeclaration, ParameterDeclaration, Identifier, ConstructorDeclaration, MethodSignature, SourceFile, ModuleDeclaration, PropertyDeclaration, PropertySignature, Decorator, ExpressionWithTypeArguments, GetAccessorDeclaration, SetAccessorDeclaration, ExportedDeclarations, CommentRange, EnumDeclaration, EnumMember, TypeParameterDeclaration } from "ts-morph";
import * as fs from 'fs';
import * as Famix from "./lib/famix/src/model/famix";
import { FamixRepository } from "./lib/famix/src/famix_repository";
import { FamixFunctions } from "./famix_functions";
import { calculate } from "./lib/ts-complex/cyclomatic-service";
// -> enlever les try catch ???

/**
 * This class is used to build a Famix model from a TypeScript source code
 */
export class Importer {

    private project = new Project(); // The project containing the source files to analyze
    private famixFunctions = new FamixFunctions(); // FamixFunctions object, it contains all the functions needed to create Famix entities
    private methodsAndFunctionsWithId = new Map<number, MethodDeclaration | ConstructorDeclaration | GetAccessorDeclaration | SetAccessorDeclaration | FunctionDeclaration>(); // Maps the Famix methods, constructors, getters, setters and functions ids to their ts-morph method, constructor, getter, setter or function object
    private arrayOfAccess = new Map<number, ParameterDeclaration | VariableDeclaration | PropertyDeclaration | EnumMember>(); // Maps the Famix parameters, variables, fields and enum values ids to their ts-morph parameter, variable, field or enum value object
    private classes = new Array<ClassDeclaration>(); // Array of all the classes of the source files
    private interfaces = new Array<InterfaceDeclaration>(); // Array of all the interfaces of the source files
    private modules = new Array<SourceFile>(); // Array of all the source files which are modules
    private exports = new Array<ReadonlyMap<string, ExportedDeclarations[]>>(); // Array of all the exports
    private currentCC: any; // Stores the cyclomatic complexity metrics for the current source file

    // not used
    private files = new Array<SourceFile>();
    private namespaces = new Array<ModuleDeclaration>();
    private methods = new Array<MethodDeclaration | ConstructorDeclaration | MethodSignature | GetAccessorDeclaration | SetAccessorDeclaration>();
    private functions = new Array<FunctionDeclaration>();
    private parameters = new Array<ParameterDeclaration>();
    private variableStatements = new Array<VariableStatement>();
    private variables = new Array<VariableDeclaration>();
    private parameterTypes = new Array<TypeParameterDeclaration>();
    private fields = new Array <PropertyDeclaration | PropertySignature>();
    private enums = new Array<EnumDeclaration>();
    private enumValues = new Array<EnumMember>();
    private decorators = new Array<Decorator>();
    private access_nodes = new Array<Identifier>();
    private invoc_nodes = new Array<Identifier>();
    private comments = new Array<CommentRange>();

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
            this.processImportClauses();
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
     * Main method for a ts-morph project
     * @param project A ts-morph project
     * @returns The Famix repository containing the Famix model
     */
    public famixRepFromProject(project: Project): FamixRepository {
        const sourceFilesNames = project.getSourceFiles().map(f => f.getFilePath()) as Array<string>;

        const fmxRep = this.famixRepFromPaths(sourceFilesNames);

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

        const isModule = this.isModule(f);

        if (isModule) {
            this.modules.push(f);
        }

        const fmxFile = this.famixFunctions.createOrGetFamixFile(f, isModule);

        console.info(`processFile: file: ${f.getBaseName()}, fqn = ${fmxFile.getFullyQualifiedName()}`);

        this.processComments(f, fmxFile);

        this.processClasses(f, fmxFile);

        this.processInterfaces(f, fmxFile);

        this.processVariableStatements(f, fmxFile);

        this.processEnums(f, fmxFile);

        this.processFunctions(f, fmxFile);

        this.processNamespaces(f, fmxFile);
    }

    /**
     * Builds a Famix model for a namespace
     * @param m A namespace
     * @param parentScope The Famix model of the namespace's parent (the parent can be a source file or a namespace)
     * @returns A Famix.Namespace representing the namespace
     */
    private processNamespace(m: ModuleDeclaration, parentScope: Famix.ScriptEntity | Famix.Module | Famix.Namespace): Famix.Namespace {
        this.namespaces.push(m);

        const fmxNamespace = this.famixFunctions.createOrGetFamixNamespace(m, parentScope);

        console.info(`processNamespace: namespace: ${m.getName()}, (${m.getType().getText()}), ${fmxNamespace.getFullyQualifiedName()}`);

        this.processComments(m, fmxNamespace);

        this.processClasses(m, fmxNamespace);

        this.processInterfaces(m, fmxNamespace);

        this.processVariableStatements(m, fmxNamespace);

        this.processEnums(m, fmxNamespace);
        
        this.processFunctions(m, fmxNamespace);

        this.processNamespaces(m, fmxNamespace);

        return fmxNamespace;
    }

    /**
     * Builds a Famix model for the classes of a container
     * @param m A container (a source file or a namespace)
     * @param fmxScope The Famix model of the container
     */
    private processClasses(m: SourceFile | ModuleDeclaration, fmxScope: Famix.ScriptEntity | Famix.Module | Famix.Namespace) {
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
    private processInterfaces(m: SourceFile | ModuleDeclaration, fmxScope: Famix.ScriptEntity | Famix.Module | Famix.Namespace) {
        console.info(`processInterfaces: ---------- Finding Interfaces:`);
        m.getInterfaces().forEach(i => {
            const fmxInterface = this.processInterface(i);
            fmxScope.addType(fmxInterface);
        });
    }

    /**
     * Builds a Famix model for the variable statements of a container
     * @param m A container (a source file, a namespace, a function or a method)
     * @param fmxScope The Famix model of the container
     */
    private processVariableStatements(m: SourceFile | ModuleDeclaration | FunctionDeclaration | MethodDeclaration | ConstructorDeclaration | GetAccessorDeclaration | SetAccessorDeclaration, fmxScope: Famix.ScriptEntity | Famix.Module | Famix.Namespace | Famix.Function | Famix.Method | Famix.Accessor) {
        console.info(`processVariableStatements: ---------- Finding Variable Statements:`);
        m.getVariableStatements().forEach(v => {
            const fmxVariableStatement = this.processVariableStatement(v);
            fmxScope.addType(fmxVariableStatement);
            fmxScope.addVariables(fmxVariableStatement);
        });
    }

    /**
     * Builds a Famix model for the enums of a container
     * @param m A container (a source file, a namespace, a function or a method)
     * @param fmxScope The Famix model of the container
     */
    private processEnums(m: SourceFile | ModuleDeclaration | FunctionDeclaration | MethodDeclaration | ConstructorDeclaration | GetAccessorDeclaration | SetAccessorDeclaration, fmxScope: Famix.ScriptEntity | Famix.Module | Famix.Namespace | Famix.Function | Famix.Method | Famix.Accessor) {
        console.info(`processEnums: ---------- Finding Enums:`);
        m.getEnums().forEach(e => {
            const fmxEnum = this.processEnum(e);
            fmxScope.addType(fmxEnum);
        });
    }

    /**
     * Builds a Famix model for the functions of a container
     * @param m A container (a source file, a namespace, a function or a method)
     * @param fmxScope The Famix model of the container
     */
    private processFunctions(m: SourceFile | ModuleDeclaration | FunctionDeclaration | MethodDeclaration | ConstructorDeclaration | GetAccessorDeclaration | SetAccessorDeclaration, fmxScope: Famix.ScriptEntity | Famix.Module | Famix.Namespace | Famix.Function | Famix.Method | Famix.Accessor) {
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
    private processNamespaces(m: SourceFile | ModuleDeclaration, fmxScope: Famix.ScriptEntity | Famix.Module | Famix.Namespace) {
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

        const fmxClass = this.famixFunctions.createOrGetFamixClass(c);

        console.info(`processClass: class: ${c.getName()}, (${c.getType().getText()}), fqn = ${fmxClass.getFullyQualifiedName()}`);

        this.processComments(c, fmxClass);

        this.processDecorators(c, fmxClass);

        this.processStructuredType(c, fmxClass);

        c.getConstructors().forEach(con => {
            const fmxCon = this.processMethod(con);
            fmxClass.addMethod(fmxCon);
        });

        c.getGetAccessors().forEach(acc => {
            const fmxAcc = this.processMethod(acc);
            fmxClass.addMethod(fmxAcc);
        });
        
        c.getSetAccessors().forEach(acc => {
            const fmxAcc = this.processMethod(acc);
            fmxClass.addMethod(fmxAcc);
        });

        return fmxClass;
    }

    /**
     * Builds a Famix model for an interface
     * @param i An interface
     * @returns A Famix.Interface or a Famix.ParameterizableInterface representing the interface
     */
    private processInterface(i: InterfaceDeclaration): Famix.Interface | Famix.ParameterizableInterface {
        this.interfaces.push(i);

        const fmxInterface = this.famixFunctions.createOrGetFamixInterface(i);

        console.info(`processInterface: interface: ${i.getName()}, (${i.getType().getText()}), fqn = ${fmxInterface.getFullyQualifiedName()}`);

        this.processComments(i, fmxInterface);

        this.processStructuredType(i, fmxInterface);

        return fmxInterface;
    }

    /**
     * Builds a Famix model for the parameter types, fields and methods of a structured type
     * @param c A structured type (a class or an interface)
     * @param fmxScope The Famix model of the structured type
     */
    private processStructuredType(c: ClassDeclaration | InterfaceDeclaration, fmxScope: Famix.Class | Famix.ParameterizableClass | Famix.Interface | Famix.ParameterizableInterface) {
        console.info(`processStructuredType: ---------- Finding Fields and Methods:`);
        if (fmxScope instanceof Famix.ParameterizableClass || fmxScope instanceof Famix.ParameterizableInterface) {
            c.getTypeParameters().forEach(tp => {
                const fmxParameterType = this.processParameterType(tp);
                fmxScope.addParameterType(fmxParameterType);
            });
        }

        c.getProperties().forEach(prop => {
            const fmxField = this.processField(prop);
            fmxScope.addField(fmxField);
        });

        c.getMethods().forEach(m => {
            const fmxMethod = this.processMethod(m);
            fmxScope.addMethod(fmxMethod);
        });
    }

    /**
     * Builds a Famix model for a parameter type
     * @param p A parameter type
     * @returns A Famix.ParameterType representing the parameter type
     */
    private processParameterType(p: TypeParameterDeclaration): Famix.ParameterType {
        this.parameterTypes.push(p);

        const fmxParameterType = this.famixFunctions.createFamixParameterType(p);

        console.info(`processParameterType: parameter type: ${p.getName()}, (${p.getType().getText()}), fqn = ${fmxParameterType.getFullyQualifiedName()}`);

        this.processComments(p, fmxParameterType);

        return fmxParameterType;
    }

    /**
     * Builds a Famix model for a field
     * @param p A field
     * @returns A Famix.Field representing the field
     */
    private processField(p: PropertyDeclaration | PropertySignature): Famix.Field {
        this.fields.push(p);

        const fmxField = this.famixFunctions.createFamixField(p);

        console.info(`processField: field: ${p.getName()}, (${p.getType().getText()}), fqn = ${fmxField.getFullyQualifiedName()}`);

        this.processComments(p, fmxField);

        if (!(p instanceof PropertySignature)) {
            this.processDecorators(p, fmxField);

            this.arrayOfAccess.set(fmxField.id, p);
        }

        return fmxField;
    }

    /**
     * Builds a Famix model for a method or an accessor
     * @param m A method or an accessor
     * @returns A Famix.Method or a Famix.Accessor representing the method or the accessor
     */
    private processMethod(m: MethodDeclaration | ConstructorDeclaration | MethodSignature | GetAccessorDeclaration | SetAccessorDeclaration): Famix.Method | Famix.Accessor {
        this.methods.push(m);

        const fmxMethod = this.famixFunctions.createFamixMethod(m, this.currentCC);

        console.info(`processMethod: method: ${!(m instanceof ConstructorDeclaration) ? m.getName() : "constructor"}, (${m.getType().getText()}), parent: ${(m.getParent() as ClassDeclaration | InterfaceDeclaration).getName()}, fqn = ${fmxMethod.getFullyQualifiedName()}`);

        this.processComments(m, fmxMethod);

        this.processParameters(m, fmxMethod);

        if (!(m instanceof MethodSignature)) {
            this.processVariableStatements(m, fmxMethod);

            this.processEnums(m, fmxMethod);

            this.processFunctions(m, fmxMethod);

            this.methodsAndFunctionsWithId.set(fmxMethod.id, m);
        }

        if (m instanceof MethodDeclaration || m instanceof GetAccessorDeclaration || m instanceof SetAccessorDeclaration) {
            this.processDecorators(m, fmxMethod);
        }

        return fmxMethod;
    }

    /**
     * Builds a Famix model for a function
     * @param f A function
     * @returns A Famix.Function representing the function
     */
    private processFunction(f: FunctionDeclaration): Famix.Function {
        this.functions.push(f);

        const fmxFunction = this.famixFunctions.createFamixFunction(f, this.currentCC);

        console.info(`processFunction: function: ${f.getName()}, (${f.getType().getText()}), fqn = ${fmxFunction.getFullyQualifiedName()}`);

        this.processComments(f, fmxFunction);

        this.processParameters(f, fmxFunction);

        this.processVariableStatements(f, fmxFunction);

        this.processEnums(f, fmxFunction);

        this.processFunctions(f, fmxFunction);

        this.methodsAndFunctionsWithId.set(fmxFunction.id, f);

        return fmxFunction;
    }

    /**
     * Builds a Famix model for the parameters of a method or a function
     * @param m A method or a function
     * @param fmxScope The Famix model of the method or the function
     */
    private processParameters(m: MethodDeclaration | ConstructorDeclaration | MethodSignature | GetAccessorDeclaration | SetAccessorDeclaration | FunctionDeclaration, fmxScope: Famix.Method | Famix.Accessor | Famix.Function) {
        console.info(`processParameters: ---------- Finding Parameters:`);
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

        this.processComments(p, fmxParam);

        this.processDecorators(p, fmxParam);

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
    private processVariableStatement(v: VariableStatement): Famix.VariableStatement {
        this.variableStatements.push(v);

        const fmxVariableStatement = this.famixFunctions.createFamixVariableStatement(v);

        console.info(`processVariableStatement: variable statement: variable statement, (${v.getType().getText()}), ${v.getDeclarationKindKeyword().getText()}, fqn = ${fmxVariableStatement.getFullyQualifiedName()}`);

        this.processComments(v, fmxVariableStatement);

        v.getDeclarations().forEach(variable => {
            const fmxVar = this.processVariable(variable);
            fmxVariableStatement.addVariableInStatement(fmxVar);
        }); 

        return fmxVariableStatement;
    }

    /**
     * Builds a Famix model for a variable
     * @param v A variable
     * @returns A Famix.Variable representing the variable
     */
    private processVariable(v: VariableDeclaration): Famix.Variable {
        this.variables.push(v);

        const fmxVar = this.famixFunctions.createFamixVariable(v);

        console.info(`processVariable: variable: ${v.getName()}, (${v.getType().getText()}), ${v.getInitializer() ? "initializer: " + v.getInitializer().getText() : "initializer: "}, fqn = ${fmxVar.getFullyQualifiedName()}`);

        this.processComments(v, fmxVar);

        this.arrayOfAccess.set(fmxVar.id, v);

        return fmxVar;
    }

    /**
     * Builds a Famix model for an enum
     * @param e An enum
     * @returns A Famix.Enum representing the enum
     */
    private processEnum(e: EnumDeclaration): Famix.Enum {
        this.enums.push(e);

        const fmxEnum = this.famixFunctions.createFamixEnum(e);

        console.info(`processEnum: enum: ${e.getName()}, (${e.getType().getText()}), fqn = ${fmxEnum.getFullyQualifiedName()}`);

        this.processComments(e, fmxEnum);

        e.getMembers().forEach(m => {
            const fmxEnumValue = this.processEnumValue(m);
            fmxEnum.addValue(fmxEnumValue);
        });

        return fmxEnum;
    }

    /**
     * Builds a Famix model for an enum value
     * @param v An enum value
     * @returns A Famix.EnumValue representing the enum value
     */
    private processEnumValue(v: EnumMember): Famix.EnumValue {
        this.enumValues.push(v);

        const fmxEnumValue = this.famixFunctions.createFamixEnumValue(v);

        console.info(`processEnumValue: enum value: ${v.getName()}, (${v.getType().getText()}), fqn = ${fmxEnumValue.getFullyQualifiedName()}`);

        this.processComments(v, fmxEnumValue);

        this.arrayOfAccess.set(fmxEnumValue.id, v);

        return fmxEnumValue;
    }

    /**
     * Builds a Famix model for the decorators of a class, a method, a parameter or a field
     * @param e A class, a method, a parameter or a field
     * @param fmxScope The Famix model of the class, the method, the parameter or the field
     */
    private processDecorators(e: ClassDeclaration | MethodDeclaration | GetAccessorDeclaration | SetAccessorDeclaration | ParameterDeclaration | PropertyDeclaration, fmxScope: Famix.Class | Famix.ParameterizableClass | Famix.Method | Famix.Accessor | Famix.Parameter | Famix.Field): void {
        console.info(`processDecorators: ---------- Finding Decorators:`);
        e.getDecorators().forEach(dec => {
            const fmxDec = this.processDecorator(dec, e);
            fmxScope.addDecorator(fmxDec);
        });
    }

    /**
     * Builds a Famix model for a decorator
     * @param d A decorator
     * @param e A class, a method, a parameter or a field
     * @returns A Famix.Decorator representing the decorator
     */
    private processDecorator(d: Decorator, e: ClassDeclaration | MethodDeclaration | GetAccessorDeclaration | SetAccessorDeclaration | ParameterDeclaration | PropertyDeclaration): Famix.Decorator {
        this.decorators.push(d);

        const fmxDec = this.famixFunctions.createOrGetFamixDecorator(d, e);

        console.info(`processDecorator: decorator: ${d.getName()}, (${d.getType().getText()}), fqn = ${fmxDec.getFullyQualifiedName()}`);

        this.processComments(d, fmxDec);

        return fmxDec;
    }

    /**
     * Builds a Famix model for the comments
     * @param e A source file, a module, a class, an interface, a method, a function, a parameter, a variable, a field or a decorator
     * @param fmxScope The Famix model of the named entity
     */
    private processComments(e: SourceFile | ModuleDeclaration | ClassDeclaration | InterfaceDeclaration | MethodDeclaration | ConstructorDeclaration | MethodSignature | GetAccessorDeclaration | SetAccessorDeclaration | FunctionDeclaration | ParameterDeclaration | VariableDeclaration | PropertyDeclaration | PropertySignature | Decorator | EnumDeclaration | EnumMember | TypeParameterDeclaration | VariableStatement, fmxScope: Famix.NamedEntity): void {
        console.info(`processComments: ---------- Finding Comments:`);
        e.getLeadingCommentRanges().forEach(c => {
            const fmxComment = this.processComment(c, fmxScope);
            fmxScope.addComment(fmxComment);
        });
        e.getTrailingCommentRanges().forEach(c => {
            const fmxComment = this.processComment(c, fmxScope);
            fmxScope.addComment(fmxComment);
        });
    }

    /**
     * Builds a Famix model for a comment
     * @param c A comment
     * @param fmxScope The Famix model of the comment's container
     * @returns A Famix.Comment representing the comment
     */
    private processComment(c: CommentRange, fmxScope: Famix.NamedEntity): Famix.Comment {
        this.comments.push(c);

        const fmxComment = this.famixFunctions.createFamixComment(c, fmxScope);

        console.info(`processComment: comment: ${c.getText()}`);

        return fmxComment;
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
     * @param id An id of a parameter, a variable or a field
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
     * Builds a Famix model for the invocations of the methods and functions of the source files
     */
    private processInvocations(): void {
        console.info(`Creating invocations:`);
        this.methodsAndFunctionsWithId.forEach((m, id) => {
            console.info(`Invocations to ${(m instanceof MethodDeclaration || m instanceof GetAccessorDeclaration || m instanceof SetAccessorDeclaration || m instanceof FunctionDeclaration) ? m.getName() : "constructor"}`);
            try {
                const temp_nodes = m.findReferencesAsNodes() as Array<Identifier>;
                temp_nodes.forEach(node => this.processNodeForInvocations(node, m, id));
            } catch (error) {
                console.error(`> WARNING: got exception ${error}. Continuing...`);
            }
        });
    }

    /**
     * Builds a Famix model for an invocation of a method or a function
     * @param n A node
     * @param m A method or a function
     * @param id The id of the method or the function
     */
    private processNodeForInvocations(n: Identifier, m: MethodDeclaration | ConstructorDeclaration | GetAccessorDeclaration | SetAccessorDeclaration | FunctionDeclaration, id: number): void {
        this.invoc_nodes.push(n);

        try {
            this.famixFunctions.createFamixInvocation(n, m, id);

            console.info(`node: node, (${n.getType().getText()})`);
        } catch (error) {
            console.error(`> WARNING: got exception ${error}. ScopeDeclaration invalid for ${n.getSymbol().getFullyQualifiedName()}. Continuing...`);
        }
    }

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
            const implementedInterfaces = this.getImplementedOrExtendedInterfaces(cls);
            implementedInterfaces.forEach(impInter => {
                this.famixFunctions.createFamixInheritance(cls, impInter);

                console.info(`processInheritances: class: ${cls.getName()}, (${cls.getType().getText()}), impInter: ${impInter.getName()}, (${impInter.getType().getText()})`);
            });
        });

        this.interfaces.forEach(inter => {
            console.info(`processInheritances: Checking interface inheritance for ${inter.getName()}`);
            const extendedInterfaces = this.getImplementedOrExtendedInterfaces(inter);
            extendedInterfaces.forEach(extInter => {
                this.famixFunctions.createFamixInheritance(inter, extInter);

                console.info(`processInheritances: inter: ${inter.getName()}, (${inter.getType().getText()}), extInter: ${extInter.getName()}, (${extInter.getType().getText()})`);
            });
        });
    }

    /**
     * Builds a Famix model for the import clauses of the source files which are modules
     */
    private processImportClauses(): void {
        console.info(`processImportClauses: Creating import clauses:`);
        this.modules.forEach(f => {
            f.getImportDeclarations().forEach(i => {
                i.getNamedImports().forEach(ni => {
                    console.info(`processImportClauses: Importing ${ni.getName()}`);
                    const importedEntityName = ni.getName();
                    let bool = false;
                    this.exports.forEach(e => {
                        if (e.has(importedEntityName)) {
                            bool = true;
                        }
                    });
                    this.famixFunctions.createFamixImportClause(f, i.getModuleSpecifierValue(), ni, bool);
                });

                const defaultImport = i.getDefaultImport();
                if (defaultImport !== undefined) {
                    this.famixFunctions.createFamixImportClause(f, i.getModuleSpecifierValue(), defaultImport, false);
                }
            }); 
        });
    }

    /**
     * Checks if the file has any imports or exports to be considered a module
     * @param sourceFile A source file
     * @returns A boolean indicating if the file is a module
     */
    private isModule(sourceFile: SourceFile): boolean {
        if (sourceFile.getImportDeclarations().length > 0 || sourceFile.getExportedDeclarations().size > 0) {
            this.exports.push(sourceFile.getExportedDeclarations());
            return true;
        }
        return false;
    }

    /**
     * Gets the interfaces implemented or extended by a class or an interface
     * @param subClass A class or an interface
     * @returns An array of InterfaceDeclaration containing the interfaces implemented or extended by the subClass
     */
    private getImplementedOrExtendedInterfaces(subClass: ClassDeclaration | InterfaceDeclaration): Array<InterfaceDeclaration> {
        let impOrExtInterfaces: Array<ExpressionWithTypeArguments>;
        if (subClass instanceof ClassDeclaration) {
            impOrExtInterfaces = subClass.getImplements();
        }
        else {
            impOrExtInterfaces = subClass.getExtends();
        }

        const interfacesNames = this.interfaces.map(i => i.getName());
        const implementedOrExtendedInterfaces = new Array<InterfaceDeclaration>();

        impOrExtInterfaces.forEach(i => {
            if (interfacesNames.includes(i.getExpression().getText())) {
                implementedOrExtendedInterfaces.push(this.interfaces[interfacesNames.indexOf(i.getExpression().getText())]);
            }
        });

        return implementedOrExtendedInterfaces;
    }
}
