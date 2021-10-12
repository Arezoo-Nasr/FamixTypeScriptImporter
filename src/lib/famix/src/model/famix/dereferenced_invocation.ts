// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { StructuralEntity } from "./../famix/structural_entity";
import { Invocation } from "./../famix/invocation";

export class DereferencedInvocation extends Invocation {

  private dereferencedInvocationReferencer: StructuralEntity;

  // oneMany.Getter
  // @FameProperty(name = "referencer", opposite = "dereferencedInvocations")
  public getReferencer(): StructuralEntity {
    return this.dereferencedInvocationReferencer;
  }

  // oneMany.Setter
  public setReferencer(newReferencer: StructuralEntity) {
    this.dereferencedInvocationReferencer = newReferencer;
    newReferencer.getDereferencedInvocations().add(this);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("DereferencedInvocation", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("referencer", this.getReferencer());

  }

}

