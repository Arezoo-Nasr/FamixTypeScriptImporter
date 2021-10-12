// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { StructuralEntity } from "./../famix/structural_entity";
import { BehaviouralEntity } from "./../famix/behavioural_entity";

export class LocalVariable extends StructuralEntity {

  private localVariableParentBehaviouralEntity: BehaviouralEntity;

  // oneMany.Getter
  // @FameProperty(name = "parentBehaviouralEntity", opposite = "localVariables")
  public getParentBehaviouralEntity(): BehaviouralEntity {
    return this.localVariableParentBehaviouralEntity;
  }

  // oneMany.Setter
  public setParentBehaviouralEntity(newParentBehaviouralEntity: BehaviouralEntity) {
    this.localVariableParentBehaviouralEntity = newParentBehaviouralEntity;
    newParentBehaviouralEntity.getLocalVariables().add(this);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("LocalVariable", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("parentBehaviouralEntity", this.getParentBehaviouralEntity());

  }

}

