import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { ContainerEntity } from "./container_entity";
import { StructuralEntity } from "./structural_entity";

export class Variable extends StructuralEntity {

  private parentContainerEntity: ContainerEntity;

  public getParentContainerEntity(): ContainerEntity {
    return this.parentContainerEntity;
  }

  public setParentContainerEntity(parentContainerEntity: ContainerEntity): void {
    this.parentContainerEntity = parentContainerEntity;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Variable", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("parentBehaviouralEntity", this.getParentContainerEntity());
  }
}
