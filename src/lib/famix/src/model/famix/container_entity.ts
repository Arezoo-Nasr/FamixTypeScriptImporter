// NOT any more (automatically generated code, please do not change)

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Function } from "./../famix/function";
import { NamedEntity } from "./../famix/named_entity";
import { Type } from "./../famix/type";
import { AnnotationType } from "./../famix/annotation_type";
import { LocalVariable } from "./../famix/local_variable";
import { GlobalVariable } from "./../famix/global_variable";
import { Namespace } from "./../famix/namespace";
import { Class } from "./../famix/class";

export class ContainerEntity extends NamedEntity {

  // private fullyQualifiedName: string;

  // // manyOne.Getter
  // // @FameProperty(name = "fullyQualifiedName")
  // public getFullyQualifiedName(): string {
  //   return this.fullyQualifiedName;
  // }

  // // manyOne.Setter
  // public setFullyQualifiedName(fullyQualifiedName: string) {
  //   this.fullyQualifiedName = fullyQualifiedName;
  // }

  private containerEntityTypes: Set<Type> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "types", opposite = "container", derived = true)
  public getTypes(): Set<Type> {
    return this.containerEntityTypes;
  }

  // manyOne.Setter
  public addTypes(containerEntityTypes: Type) {
    if (!this.containerEntityTypes.has(containerEntityTypes)) {
      this.containerEntityTypes.add(containerEntityTypes);
      containerEntityTypes.setContainer(this);
    }
  }

  private containerEntityFunctions: Set<Function> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "functions", opposite = "container", derived = true)
  public getFunctions(): Set<Function> {
    return this.containerEntityFunctions;
  }

  // manyOne.Setter
  public addFunctions(containerEntityFunctions: Function) {
    if (!this.containerEntityFunctions.has(containerEntityFunctions)) {
      this.containerEntityFunctions.add(containerEntityFunctions);
      containerEntityFunctions.setContainer(this);
    }
  }

  private containerEntityClasses: Set<Class> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "classes", opposite = "container", derived = true)
  public getClasses(): Set<Class> {
    return this.containerEntityClasses;
  }

  // manyOne.Setter
  public addClasses(containerEntityClasses: Class) {
    if (!this.containerEntityClasses.has(containerEntityClasses)) {
      this.containerEntityClasses.add(containerEntityClasses);
      containerEntityClasses.setContainer(this);
    }
  }

  private containerEntityNamespaces: Set<Namespace> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "namespaces", opposite = "container", derived = true)
  public getNamespaces(): Set<Namespace> {
    return this.containerEntityNamespaces;
  }

  // manyOne.Setter
  public addNamespaces(containerEntityNamespaces: Namespace) {
    if (!this.containerEntityNamespaces.has(containerEntityNamespaces)) {
      this.containerEntityNamespaces.add(containerEntityNamespaces);
      containerEntityNamespaces.setContainer(this);
    }
  }

  private containerEntityLocalVariables: Set<LocalVariable> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "local variables", opposite = "container", derived = true)
  public getLocalVariables(): Set<LocalVariable> {
    return this.containerEntityLocalVariables;
  }

  // manyOne.Setter
  public addLocalVariables(containerEntityLocalVariables: LocalVariable) {
    if (!this.containerEntityLocalVariables.has(containerEntityLocalVariables)) {
      this.containerEntityLocalVariables.add(containerEntityLocalVariables);
      containerEntityLocalVariables.setContainer(this);
    }
  }

  private containerEntityGlobalVariables: Set<GlobalVariable> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "global variables", opposite = "container", derived = true)
  public getGlobalVariables(): Set<GlobalVariable> {
    return this.containerEntityGlobalVariables;
  }

  // manyOne.Setter
  public addGlobalVariables(containerEntityGlobalVariables: GlobalVariable) {
    if (!this.containerEntityGlobalVariables.has(containerEntityGlobalVariables)) {
      this.containerEntityGlobalVariables.add(containerEntityGlobalVariables);
      containerEntityGlobalVariables.setContainer(this);
    }
  }

  private containerEntityDefinedAnnotationTypes: Set<AnnotationType> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "definedAnnotationTypes", opposite = "container", derived = true)
  public getDefinedAnnotationTypes(): Set<AnnotationType> {
    return this.containerEntityDefinedAnnotationTypes;
  }

  // manyOne.Setter
  public addDefinedAnnotationTypes(containerEntityDefinedAnnotationTypes: AnnotationType) {
    if (!this.containerEntityDefinedAnnotationTypes.has(containerEntityDefinedAnnotationTypes)) {
      this.containerEntityDefinedAnnotationTypes.add(containerEntityDefinedAnnotationTypes);
      containerEntityDefinedAnnotationTypes.setContainer(this);
    }
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("ContainerEntity", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    // exporter.addProperty("fullyQualifiedName", this.getFullyQualifiedName());
    exporter.addProperty("types", this.getTypes());
    exporter.addProperty("functions", this.getFunctions());
    exporter.addProperty("classes", this.getClasses());
    exporter.addProperty("namespaces", this.getNamespaces());
    exporter.addProperty("localVariables", this.getLocalVariables());
    exporter.addProperty("globalVariables", this.getGlobalVariables());
    exporter.addProperty("definedAnnotationTypes", this.getDefinedAnnotationTypes());

  }

}

