import { ClassDeclaration, FunctionDeclaration, InterfaceDeclaration, Project, SourceFile, SyntaxKind } from "ts-morph";
import * as Famix from "./lib/famix/src/model/famix";
import { FamixRepository } from "./lib/famix/src/famix_repository";
const fmxRep = new FamixRepository();
const fmxTypes = new Map<string, Famix.Type>();

export class TS2Famix {

    famixRepFromPath(paths: Array<string>) {
        console.info(`paths = ${paths}`)
        const project = new Project();
        var fmxNamespaces = new Map<string, Famix.Namespace>();
        let allClasses = new Array<ClassDeclaration>();
        let allInterfaces = new Array<InterfaceDeclaration>();
        try {
            const sourceFiles = project.addSourceFilesAtPaths(paths);
            console.info("Source files:")
            sourceFiles.forEach(file => {
                console.info(`> ${file.getBaseName()}`);
                var classes: ClassDeclaration[];
                var interfaces: InterfaceDeclaration[];

                var fmxIndexFileAnchor = new Famix.IndexedFileAnchor(fmxRep);
                fmxIndexFileAnchor.setFileName(file.getFilePath());
                fmxIndexFileAnchor.setStartPos(file.getStart());
                fmxIndexFileAnchor.setEndPos(file.getEnd());

                fmxRep.addElement(fmxIndexFileAnchor);

                var namespaceName: string;
                var fmxNamespace: Famix.Namespace;

                console.info("Module(s):")
                if (file.getModules().length) {
                    var namespace = file.getModules()[0];
                    namespaceName = namespace.getName();
                    classes = namespace.getClasses();
                    interfaces = namespace.getInterfaces();
                }
                else {
                    namespaceName = "DefaultNamespace";
                    classes = file.getClasses();
                    interfaces = file.getInterfaces();
                }
                console.info(`namespace: ${namespaceName}`);
                console.info(`classes: ${classes.map(c => c.getName())}`);
                console.info(`interfaces: ${interfaces.map(i => i.getName())}`);

                if (!fmxNamespaces.has(namespaceName)) {
                    fmxNamespace = new Famix.Namespace(fmxRep);
                    fmxNamespace.setName(namespaceName);
                    fmxNamespaces[namespaceName] = fmxNamespace;
                }
                else {
                    fmxNamespace = fmxNamespaces[namespaceName];
                }

                allClasses.push(...classes);
                allInterfaces.push(...interfaces);

                console.info("Analyzing classes:");
                classes.forEach(cls => {
                    console.info(`> ${cls.getName()}`);
                    var fmxClass = this.createFamixClass(cls, file);
                    fmxNamespace.addTypes(fmxClass);

                    console.info("Methods:");
                    cls.getMethods().forEach(method => {
                        console.info(` > ${method.getName()}`);
                        var fmxMethod = this.createFamixMethod(method, file);
                        fmxClass.addMethods(fmxMethod);
                    });

                    console.info("Properties:");
                    cls.getProperties().forEach(prop => {
                        console.info(` > ${prop.getName()}`);
                        var fmxAttr = this.createFamixAttribute(prop, file);
                        fmxClass.addAttributes(fmxAttr);
                    });

                    console.info("Constructors:");
                    cls.getConstructors().forEach(cstr => {
                        console.info(` > ${cstr.getSignature()}`);
                        var fmxMethod = this.createFamixMethod(cstr, file, false, true);
                        fmxClass.addMethods(fmxMethod);
                    });

                });

                console.info("Interfaces:");
                interfaces.forEach(inter => {
                    console.info(`> ${inter.getName()}`);
                    var fmxInter = this.createFamixClass(inter, file, true);
                    fmxNamespace.addTypes(fmxInter);

                    console.info("Methods:");
                    inter.getMethods().forEach(method => {
                        console.info(` > ${method.getName()}`);
                        var fmxMethod = this.createFamixMethod(method, file, true);
                        fmxInter.addMethods(fmxMethod);
                    });

                    console.info("Properties:");
                    inter.getProperties().forEach(prop => {
                        console.info(` > ${prop.getName()}`);
                        var fmxAttr = this.createFamixAttribute(prop, file);
                        fmxInter.addAttributes(fmxAttr);
                    });

                });

                console.info("Functions:");
                file.getFunctions().forEach(fct => {
                    console.info(` > ${fct.getName()}`);
                    var fmxFunct = this.createFamixFunction(fct, file);
                    fmxNamespace.addFunctions(fmxFunct);
                });

            });
            //*
            // Get Inheritances
            console.info("Inheritances:");
            allClasses.forEach(cls => {
                var baseClass = cls.getBaseClass();
                if (baseClass) {
                    console.info(` > ${cls.getName()} extends ${baseClass.getName()}`);
                    var fmxInher = new Famix.Inheritance(fmxRep);
                    var sub = fmxTypes.get(cls.getName());
                    var fmxSuper = fmxTypes.get(baseClass.getName());
                    fmxInher.setSubclass(sub);
                    fmxInher.setSuperclass(fmxSuper);
                }

                var interfaces = cls.getImplements();
                interfaces.forEach(inter => {
                    console.info(` > ${cls.getName()} implements ${inter.getText()}`);
                    var fmxImplements = new Famix.Inheritance(fmxRep);
                    var completeName = inter.getText();
                    var fmxSuperInter = fmxTypes.get(completeName.substring(completeName.lastIndexOf('.') + 1));
                    var subImplements = fmxTypes.get(cls.getName());
                    fmxImplements.setSuperclass(fmxSuperInter);
                    fmxImplements.setSubclass(subImplements);
                });
            });

            //*
            allInterfaces.forEach(inter => {
                var baseInter = inter.getBaseTypes()[0];
                if (baseInter && baseInter.getText() !== 'Object') {
                    console.info(` > ${inter.getName()} extends ${baseInter.getText()}`);
                    var fmxInher = new Famix.Inheritance(fmxRep);
                    var sub = fmxTypes.get(inter.getName());
                    var completeName = baseInter.getText();
                    var fmxSuper = fmxTypes.get(completeName.substring(completeName.lastIndexOf('.') + 1));
                    fmxInher.setSubclass(sub);
                    fmxInher.setSuperclass(fmxSuper);
                }
            });

        }
        catch (error: any) {
            console.error(error.message);
            console.error(error.stack)
            process.exit(1)
        }
        return fmxRep;
    }

    private createFamixClass(cls, file: SourceFile, isInterface = false): Famix.Class {
        var fmxClass = new Famix.Class(fmxRep);
        var clsName = cls.getName();
        fmxClass.setName(clsName);
        fmxClass.setIsInterface(isInterface);

        var fmxIndexFileAnchor = new Famix.IndexedFileAnchor(fmxRep);
        fmxIndexFileAnchor.setFileName(file.getFilePath());
        fmxIndexFileAnchor.setStartPos(cls.getStart());
        fmxIndexFileAnchor.setEndPos(cls.getEnd());
        fmxIndexFileAnchor.setElement(fmxClass);

        fmxClass.setSourceAnchor(fmxIndexFileAnchor);

        fmxRep.addElement(fmxClass);
        fmxTypes.set(clsName, fmxClass);
        return fmxClass;
    }

    private createFamixMethod(method, file: SourceFile, isSignature = false, isConstructor = false): Famix.Method {

        var fmxMethod = new Famix.Method(fmxRep);
        if (isConstructor) {
            fmxMethod.setName("constructor");
        }
        else {
            var methodName = method.getName();
            fmxMethod.setName(methodName);
        }

        var methodTypeName = this.getUsableName(method.getReturnType().getText());
        var fmxType = this.getFamixType(methodTypeName);
        fmxMethod.setDeclaredType(fmxType);

        var fmxIndexFileAnchor = new Famix.IndexedFileAnchor(fmxRep);
        fmxIndexFileAnchor.setFileName(file.getFilePath());
        fmxIndexFileAnchor.setStartPos(method.getStart());
        fmxIndexFileAnchor.setEndPos(method.getEnd());
        fmxIndexFileAnchor.setElement(fmxMethod);

        fmxMethod.setSourceAnchor(fmxIndexFileAnchor);

        fmxMethod.setNumberOfLinesOfCode(method.getEndLineNumber() - method.getStartLineNumber());

        method.getParameters().forEach(param => {
            var fmxParam = new Famix.Parameter(fmxRep);
            var paramTypeName = this.getUsableName(param.getType().getText());
            fmxParam.setDeclaredType(this.getFamixType(paramTypeName));
            fmxParam.setName(param.getName());
            fmxMethod.addParameters(fmxParam);
        });

        if (!isSignature) {
            let MethodeCyclo = 1;
            method.getStatements().forEach(stmt => {
                if ([SyntaxKind.IfStatement, SyntaxKind.WhileStatement, SyntaxKind.ForStatement,
                SyntaxKind.DoStatement].includes(stmt.getKind())) {
                    MethodeCyclo++;
                }
            });

            fmxMethod.setCyclomaticComplexity(MethodeCyclo);
            fmxMethod.setNumberOfStatements(method.getStatements().length);
        }

        return fmxMethod;
    }

    private createFamixAttribute(prop, file: SourceFile): Famix.Attribute {
        var fmxAttr = new Famix.Attribute(fmxRep);
        fmxAttr.setName(prop.getName());

        var propTypeName = prop.getType().getText();
        var fmxType = this.getFamixType(propTypeName);
        fmxAttr.setDeclaredType(fmxType);

        var fmxIndexFileAnchor = new Famix.IndexedFileAnchor(fmxRep);
        fmxIndexFileAnchor.setFileName(file.getFilePath());
        fmxIndexFileAnchor.setStartPos(prop.getStart());
        fmxIndexFileAnchor.setEndPos(prop.getEnd());
        fmxIndexFileAnchor.setElement(fmxAttr);

        fmxAttr.setSourceAnchor(fmxIndexFileAnchor);

        return fmxAttr;

    }

    private createFamixFunction(fct: FunctionDeclaration, file: SourceFile): Famix.Function {
        var fmxFunct = new Famix.Function(fmxRep);
        fmxFunct.setName(fct.getName());

        var fctTypeName = this.getUsableName(fct.getReturnType().getText());
        var fmxType = this.getFamixType(fctTypeName);
        fmxFunct.setDeclaredType(fmxType);

        var fmxIndexFileAnchor = new Famix.IndexedFileAnchor(fmxRep);
        fmxIndexFileAnchor.setFileName(file.getFilePath());
        fmxIndexFileAnchor.setStartPos(fct.getStart());
        fmxIndexFileAnchor.setEndPos(fct.getEnd());
        fmxIndexFileAnchor.setElement(fmxFunct);

        fmxFunct.setSourceAnchor(fmxIndexFileAnchor);

        fmxFunct.setNumberOfLinesOfCode(fct.getEndLineNumber() - fct.getStartLineNumber());

        fct.getParameters().forEach(param => {
            var fmxParam = new Famix.Parameter(fmxRep);
            var paramTypeName = this.getUsableName(param.getType().getText());
            fmxParam.setDeclaredType(this.getFamixType(paramTypeName));
            fmxParam.setName(param.getName());
            fmxFunct.addParameters(fmxParam);
        });

        let MethodeCyclo = 1;
        fct.getStatements().forEach(stmt => {
            if ([SyntaxKind.IfStatement, SyntaxKind.WhileStatement, SyntaxKind.ForStatement,
            SyntaxKind.DoStatement].includes(stmt.getKind())) {
                MethodeCyclo++;
            }
        });

        fmxFunct.setCyclomaticComplexity(MethodeCyclo);
        fmxFunct.setNumberOfStatements(fct.getStatements().length);

        return fmxFunct;
    }

    private getUsableName(name: string): string {
        if (name.includes('<'))
            name = name.substring(0, name.indexOf('<'));
        if (name.includes('.'))
            name = name.substring(name.lastIndexOf('.') + 1);

        return name;
    }

    private getFamixType(typeName: string): Famix.Type {
        var fmxType: Famix.Type;

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
