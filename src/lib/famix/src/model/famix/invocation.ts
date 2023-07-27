// NOT any more (automatically generated code, please do not change)

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { NamedEntity } from "./named_entity";
import { Association } from "./association";
import { BehavioralEntity } from "./behavioral_entity";
import { ContainerEntity } from "./container_entity";

export class Invocation extends Association {

  private invocationCandidates: Set<BehavioralEntity> = new Set();

  // manyMany.Getter
  // @FameProperty(name = "candidates", opposite = "incomingInvocations")
  public getCandidates(): Set<BehavioralEntity> {
    return this.invocationCandidates;
  }

  // manyMany.Setter
  public addCandidate(newCandidate: BehavioralEntity) {  
    if (!this.invocationCandidates.has(newCandidate)) {
      this.invocationCandidates.add(newCandidate);
      newCandidate.getIncomingInvocations().add(this);
    }
  }

  private invocationReceiver: NamedEntity;

  // oneMany.Getter
  // @FameProperty(name = "receiver", opposite = "receivingInvocations")
  public getReceiver(): NamedEntity {
    return this.invocationReceiver;
  }

  // oneMany.Setter
  public setReceiver(newReceiver: NamedEntity) {
    this.invocationReceiver = newReceiver;
    newReceiver.addReceivedInvocation(this);
  }

  // private invocationSender: BehaviouralEntity;
  private invocationSender: ContainerEntity;

  // oneMany.Getter
  // @FameProperty(name = "sender", opposite = "outgoingInvocations")
  public getSender(): ContainerEntity {
    return this.invocationSender;
  }

  // oneMany.Setter
  public setSender(newSender: ContainerEntity) {
    this.invocationSender = newSender;
    newSender.getOutgoingInvocations().add(this);
  }

  private invocationSignature: string;

  // @FameProperty(name = "signature")
  public getSignature(): string {
    return this.invocationSignature;
  }

  public setSignature(invocationSignature: string) {
    this.invocationSignature = invocationSignature;
  }



  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Invocation", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("candidates", this.getCandidates());
    exporter.addProperty("receiver", this.getReceiver());
    exporter.addProperty("sender", this.getSender());
    exporter.addProperty("signature", this.getSignature());


  }

}

