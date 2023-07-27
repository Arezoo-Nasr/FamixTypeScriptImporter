// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Type } from "./../famix/type";
import { Access } from "./../famix/access";
import { NamedEntity } from "./../famix/named_entity";
import { ContainerEntity } from "./container_entity";
import { Class } from "./class";

export abstract class StructuralEntity extends NamedEntity {

  private structuralEntityIncomingAccesses: Set<Access> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "incomingAccesses", opposite = "variable", derived = true)
  public getIncomingAccesses(): Set<Access> {
    return this.structuralEntityIncomingAccesses;
  }

  // manyOne.Setter
  public addIncomingAccesses(structuralEntityIncomingAccesses: Access) {
    if (!this.structuralEntityIncomingAccesses.has(structuralEntityIncomingAccesses)) {
      this.structuralEntityIncomingAccesses.add(structuralEntityIncomingAccesses);
      structuralEntityIncomingAccesses.setVariable(this);
    }
  }

  private structuralEntityDeclaredType: Type;

  // oneMany.Getter
  // @FameProperty(name = "declaredType", opposite = "structuresWithDeclaredType")
  public getDeclaredType(): Type {
    return this.structuralEntityDeclaredType;
  }

  // oneMany.Setter
  public setDeclaredType(newDeclaredType: Type) {
    this.structuralEntityDeclaredType = newDeclaredType;
    newDeclaredType.getStructuresWithDeclaredType().add(this);
  }

  public abstract getParentEntity(): Class | ContainerEntity;

  public abstract setParentEntity(newParentEntity: Class | ContainerEntity): void;

  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("FAMIX.StructuralEntity", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("incomingAccesses", this.getIncomingAccesses());
    exporter.addProperty("declaredType", this.getDeclaredType());

  }

}

