// automatically generated code, please do not change

import { FamixMseExporter } from "../../famix_mse_exporter";
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
    const mse: FamixMseExporter = new FamixMseExporter("Parameter", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixMseExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("parentBehaviouralEntity", this.getParentBehaviouralEntity());

  }

}

