// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { StructuralEntity } from "./../famix/structural_entity";
import { ContainerEntity } from "./container_entity";
import { Reference } from "./../famix/reference";
import { BehavioralEntity } from "./behavioral_entity";

export class Type extends ContainerEntity {

  private typeContainer: ContainerEntity;

  // oneMany.Getter
  // @FameProperty(name = "container", opposite = "types")
  public getContainer(): ContainerEntity {
    return this.typeContainer;
  }

  // oneMany.Setter
  public setContainer(newContainer: ContainerEntity) {
    this.typeContainer = newContainer;
    newContainer.getTypes().add(this);
  }

  private typeIncomingReferences: Set<Reference> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "incomingReferences", opposite = "target", derived = true)
  public getIncomingReferences(): Set<Reference> {
    return this.typeIncomingReferences;
  }

  // manyOne.Setter
  public addIncomingReferences(typeIncomingReferences: Reference) {
    if (!this.typeIncomingReferences.has(typeIncomingReferences)) {
      this.typeIncomingReferences.add(typeIncomingReferences);
      typeIncomingReferences.setTarget(this);
    }
  }

  private typeStructuresWithDeclaredType: Set<StructuralEntity> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "structuresWithDeclaredType", opposite = "declaredType", derived = true)
  public getStructuresWithDeclaredType(): Set<StructuralEntity> {
    return this.typeStructuresWithDeclaredType;
  }

  // manyOne.Setter
  public addStructuresWithDeclaredType(typeStructuresWithDeclaredType: StructuralEntity) {
    if (!this.typeStructuresWithDeclaredType.has(typeStructuresWithDeclaredType)) {
      this.typeStructuresWithDeclaredType.add(typeStructuresWithDeclaredType);
      typeStructuresWithDeclaredType.setDeclaredType(this);
    }
  }



  private typeBehavioursWithDeclaredType: Set<BehavioralEntity> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "behavioursWithDeclaredType", opposite = "declaredType", derived = true)
  public getBehaviorsWithDeclaredType(): Set<BehavioralEntity> {
    return this.typeBehavioursWithDeclaredType;
  }

  // manyOne.Setter
  public addBehaviorsWithDeclaredType(typeBehavioursWithDeclaredType: BehavioralEntity) {
    if (!this.typeBehavioursWithDeclaredType.has(typeBehavioursWithDeclaredType)) {
      this.typeBehavioursWithDeclaredType.add(typeBehavioursWithDeclaredType);
      typeBehavioursWithDeclaredType.setDeclaredType(this);
    }
  }




  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Type", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("container", this.getContainer());
    exporter.addProperty("behavioursWithDeclaredType", this.getBehaviorsWithDeclaredType());
    exporter.addProperty("structuresWithDeclaredType", this.getStructuresWithDeclaredType());
    exporter.addProperty("incomingReferences", this.getIncomingReferences());

  }

}

