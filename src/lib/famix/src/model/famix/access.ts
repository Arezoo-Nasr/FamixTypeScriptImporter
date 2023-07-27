// NOT any more (automatically generated code, please do not change)

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { StructuralEntity } from "./../famix/structural_entity";
import { Association } from "./../famix/association";
// import { BehaviouralEntity } from "./../famix/behavioural_entity";
import { ContainerEntity } from "./../famix/container_entity";

export class Access extends Association {

  private accessor: ContainerEntity;

  // oneMany.Getter
  // @FameProperty(name = "accessor", opposite = "accesses")
  public getAccessor(): ContainerEntity {
    return this.accessor;
  }

  // oneMany.Setter
  public setAccessor(newAccessor: ContainerEntity) {
    this.accessor = newAccessor;
    newAccessor.getAccesses().add(this);
  }

  private variable: StructuralEntity;

  // oneMany.Getter
  // @FameProperty(name = "variable", opposite = "incomingAccesses")
  public getVariable(): StructuralEntity {
    return this.variable;
  }

  // oneMany.Setter
  public setVariable(newVariable: StructuralEntity) {
    this.variable = newVariable;
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

