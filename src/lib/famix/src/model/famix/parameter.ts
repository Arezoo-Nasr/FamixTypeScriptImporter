// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { StructuralEntity } from "./../famix/structural_entity";
import { BehavioralEntity } from "./behavioral_entity";

export class Parameter extends StructuralEntity {

  public getParentEntity() {
    return this.parentBehavioralEntity;
  }

  public setParentEntity(newParentEntity: BehavioralEntity) {
    this.setParentBehavioralEntity(newParentEntity);
  }


  private parentBehavioralEntity: BehavioralEntity;

  // oneMany.Getter
  // @FameProperty(name = "parentBehaviouralEntity", opposite = "parameters")
  public getParentBehavioralEntity(): BehavioralEntity {
    return this.parentBehavioralEntity;
  }

  // oneMany.Setter
  public setParentBehavioralEntity(newParentBehaviouralEntity: BehavioralEntity) {
    this.parentBehavioralEntity = newParentBehaviouralEntity;
    newParentBehaviouralEntity.addParameter(this);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Parameter", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("parentBehaviouralEntity", this.getParentBehavioralEntity());

  }

}

