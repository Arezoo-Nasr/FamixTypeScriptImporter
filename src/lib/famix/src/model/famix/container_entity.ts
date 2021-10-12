// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Function } from "./../famix/function";
import { NamedEntity } from "./../famix/named_entity";
import { Type } from "./../famix/type";
import { AnnotationType } from "./../famix/annotation_type";

export class ContainerEntity extends NamedEntity {

  private containerEntityTypes: Set<Type> = new Set();

  //Arezoo
  private fullyQualifiedName: string;

  // @FameProperty(name = "fullyQualifiedName")
  public getFullyQualifiedName(): string {
    return this.fullyQualifiedName;
  }
  public setFullyQualifiedName(fullyQualifiedName: string) {
    this.fullyQualifiedName = fullyQualifiedName;
  }
  //

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
    exporter.addProperty("types", this.getTypes());
    exporter.addProperty("functions", this.getFunctions());
    exporter.addProperty("definedAnnotationTypes", this.getDefinedAnnotationTypes());
    exporter.addProperty("fullyQualifiedName", this.getFullyQualifiedName());
  }
}

