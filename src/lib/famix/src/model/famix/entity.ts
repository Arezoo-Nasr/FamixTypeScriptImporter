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

  private behaviouralEntityOutgoingInvocations: Set<Invocation> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "outgoingInvocations", opposite = "sender", derived = true)
  public getOutgoingInvocations(): Set<Invocation> {
    return this.behaviouralEntityOutgoingInvocations;
  }

  // manyOne.Setter
  public addOutgoingInvocations(behaviouralEntityOutgoingInvocations: Invocation) {
    if (!this.behaviouralEntityOutgoingInvocations.has(behaviouralEntityOutgoingInvocations)) {
      this.behaviouralEntityOutgoingInvocations.add(behaviouralEntityOutgoingInvocations);
      behaviouralEntityOutgoingInvocations.setSender(this);
    }
  }

  private behaviouralEntityIncomingInvocations: Set<Invocation> = new Set();

  // manyMany.Getter
  // @FameProperty(name = "incomingInvocations", opposite = "candidates", derived = true)
  public getIncomingInvocations(): Set<Invocation> {
    return this.behaviouralEntityIncomingInvocations;
  }

  // manyMany.Setter
  public addIncomingInvocations(newIncomingInvocations: Invocation) {
    if (!this.behaviouralEntityIncomingInvocations.has(newIncomingInvocations)) {
      this.behaviouralEntityIncomingInvocations.add(newIncomingInvocations);
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

  }

}

