// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { FamixBaseElement } from "./../../famix_base_element";
import { Invocation } from "./../famix/invocation";

export class Entity extends FamixBaseElement {

  // Arezoo
  private fullyQualifiedName: string;

  // manyOne.Getter
  // @FameProperty(name = "fullyQualifiedName")
  public getFullyQualifiedName(): string {
    return this.fullyQualifiedName;
  }

  // manyOne.Setter
  public setFullyQualifiedName(fullyQualifiedName: string) {
    this.fullyQualifiedName = fullyQualifiedName;
  }

  private entityOutgoingInvocations: Set<Invocation> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "outgoingInvocations", opposite = "sender", derived = true)
  public getOutgoingInvocations(): Set<Invocation> {
    return this.entityOutgoingInvocations;
  }

  // manyOne.Setter
  public addOutgoingInvocations(entityOutgoingInvocations: Invocation) {
    if (!this.entityOutgoingInvocations.has(entityOutgoingInvocations)) {
      this.entityOutgoingInvocations.add(entityOutgoingInvocations);
      entityOutgoingInvocations.setSender(this);
    }
  }

  private entityIncomingInvocations: Set<Invocation> = new Set();

  // manyMany.Getter
  // @FameProperty(name = "incomingInvocations", opposite = "candidates", derived = true)
  public getIncomingInvocations(): Set<Invocation> {
    return this.entityIncomingInvocations;
  }

  // manyMany.Setter
  public addIncomingInvocations(newIncomingInvocations: Invocation) {
    if (!this.entityIncomingInvocations.has(newIncomingInvocations)) {
      this.entityIncomingInvocations.add(newIncomingInvocations);
      newIncomingInvocations.getCandidates().add(this);
    }
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Entity", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("outgoingInvocations", this.getOutgoingInvocations());
    exporter.addProperty("incomingInvocations", this.getIncomingInvocations());

  }

}

