// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { StructuralEntity } from "./../famix/structural_entity";
import { BehaviouralEntity } from "./../famix/behavioural_entity";

export class Parameter extends StructuralEntity {

  private parameterParentBehaviouralEntity: BehaviouralEntity;

  // oneMany.Getter
  // @FameProperty(name = "parentBehaviouralEntity", opposite = "parameters")
  public getParentBehaviouralEntity(): BehaviouralEntity {
    return this.parameterParentBehaviouralEntity;
  }

  // oneMany.Setter
  public setParentBehaviouralEntity(newParentBehaviouralEntity: BehaviouralEntity) {
    this.parameterParentBehaviouralEntity = newParentBehaviouralEntity;
    newParentBehaviouralEntity.getParameters().add(this);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Parameter", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("parentBehaviouralEntity", this.getParentBehaviouralEntity());

  }

}

