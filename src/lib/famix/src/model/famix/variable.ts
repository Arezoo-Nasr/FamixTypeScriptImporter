import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { StructuralEntity } from "./structural_entity";
import { ContainerEntity } from "./container_entity";

export class Variable extends StructuralEntity {

  private parentEntity: ContainerEntity;

  public getParentEntity(): ContainerEntity {
    return this.parentEntity;
  }

  public setParentEntity(parentEntity: ContainerEntity): void {
    this.parentEntity = parentEntity;
    parentEntity.addVariable(this);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Variable", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("parentEntity", this.getParentEntity());
  }
}
