// NOT any more (automatically generated code, please do not change)

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { StructuralEntity } from "./structural_entity";
import { ContainerEntity } from "./container_entity";

export class Variable extends StructuralEntity {

  public getParentEntity() {
    return this.getParentBehavioralEntity();
  }

  public setParentEntity(newParentEntity: ContainerEntity) {
      this.setParentBehavioralEntity(newParentEntity);
  }

  private localVariableContainer: ContainerEntity;

  // oneMany.Getter
  // @FameProperty(name = "container", opposite = "local variables")
  public getContainer(): ContainerEntity {
    return this.localVariableContainer;
  }

  // oneMany.Setter
  public setContainer(newContainer: ContainerEntity) {
    this.localVariableContainer = newContainer;
    newContainer.getVariables().add(this);
  }

  private localVariableParentBehaviouralEntity: ContainerEntity;

  public getParentBehavioralEntity(): ContainerEntity {
    return this.localVariableParentBehaviouralEntity;
  }

  public setParentBehavioralEntity(newParentBehaviouralEntity: ContainerEntity) {
    this.localVariableParentBehaviouralEntity = newParentBehaviouralEntity;
    newParentBehaviouralEntity.getVariables().add(this);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Variable", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("container", this.getContainer());
    exporter.addProperty("parentBehaviouralEntity", this.getParentBehavioralEntity());

  }

}

