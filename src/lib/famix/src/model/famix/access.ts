// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { StructuralEntity } from "./../famix/structural_entity";
import { Association } from "./../famix/association";
import { BehaviouralEntity } from "./../famix/behavioural_entity";

export class Access extends Association {

  private accessAccessor: BehaviouralEntity;

  // oneMany.Getter
  // @FameProperty(name = "accessor", opposite = "accesses")
  public getAccessor(): BehaviouralEntity {
    return this.accessAccessor;
  }

  // oneMany.Setter
  public setAccessor(newAccessor: BehaviouralEntity) {
    this.accessAccessor = newAccessor;
    newAccessor.getAccesses().add(this);
  }

  private accessVariable: StructuralEntity;

  // oneMany.Getter
  // @FameProperty(name = "variable", opposite = "incomingAccesses")
  public getVariable(): StructuralEntity {
    return this.accessVariable;
  }

  // oneMany.Setter
  public setVariable(newVariable: StructuralEntity) {
    this.accessVariable = newVariable;
    newVariable.getIncomingAccesses().add(this);
  }

  private accessIsWrite: boolean;

  // @FameProperty(name = "isWrite")
  public getIsWrite(): boolean {
    return this.accessIsWrite;
  }

  public setIsWrite(accessIsWrite: boolean) {
    this.accessIsWrite = accessIsWrite;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Access", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("accessor", this.getAccessor());
    exporter.addProperty("variable", this.getVariable());
    exporter.addProperty("isWrite", this.getIsWrite());

  }

}

