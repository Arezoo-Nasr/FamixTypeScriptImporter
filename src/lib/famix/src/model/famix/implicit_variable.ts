// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { StructuralEntity } from "./../famix/structural_entity";
import { BehaviouralEntity } from "./../famix/behavioural_entity";

export class ImplicitVariable extends StructuralEntity {

  private implicitVariableParentBehaviouralEntity: BehaviouralEntity;

  // oneMany.Getter
  // @FameProperty(name = "parentBehaviouralEntity", opposite = "implicitVariables")
  public getParentBehaviouralEntity(): BehaviouralEntity {
    return this.implicitVariableParentBehaviouralEntity;
  }

  // oneMany.Setter
  public setParentBehaviouralEntity(newParentBehaviouralEntity: BehaviouralEntity) {
    this.implicitVariableParentBehaviouralEntity = newParentBehaviouralEntity;
    newParentBehaviouralEntity.getImplicitVariables().add(this);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("ImplicitVariable", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("parentBehaviouralEntity", this.getParentBehaviouralEntity());

  }

}

