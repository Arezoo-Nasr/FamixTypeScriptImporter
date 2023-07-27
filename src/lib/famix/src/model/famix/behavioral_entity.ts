// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Type } from "./type";
import { ContainerEntity } from "./container_entity";
import { Parameter } from "./parameter";
import { Invocation } from "./invocation";

export class BehavioralEntity extends ContainerEntity {

  private behaviouralEntitySignature: string;

  // @FameProperty(name = "signature")
  public getSignature(): string {
    return this.behaviouralEntitySignature;
  }

  public setSignature(behaviouralEntitySignature: string) {
    this.behaviouralEntitySignature = behaviouralEntitySignature;
  }

  private parameters: Set<Parameter> = new Set();

  public getParameters(): Set<Parameter> {
    return this.parameters;
  }

  public addParameter(parameter: Parameter) {
    if (!this.parameters.has(parameter)) {
      this.parameters.add(parameter);
      parameter.setParentBehavioralEntity(this);
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

  private behaviouralEntityDeclaredType: Type;

  // oneMany.Getter
  // @FameProperty(name = "declaredType", opposite = "behavioursWithDeclaredType")
  public getDeclaredType(): Type {
    return this.behaviouralEntityDeclaredType;
  }

  // oneMany.Setter
  public setDeclaredType(newDeclaredType: Type) {
    this.behaviouralEntityDeclaredType = newDeclaredType;
    newDeclaredType.getBehaviorsWithDeclaredType().add(this);
  }





  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Method", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("signature", this.getSignature());
    exporter.addProperty("parameters", this.getParameters());
    exporter.addProperty("incomingInvocations", this.getIncomingInvocations());
    exporter.addProperty("declaredType", this.getDeclaredType());

  }

}

