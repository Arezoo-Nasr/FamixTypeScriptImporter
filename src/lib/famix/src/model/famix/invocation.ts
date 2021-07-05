// automatically generated code, please do not change

import {FamixMseExporter} from "../../famix_mse_exporter";
import {NamedEntity} from "./../famix/named_entity";
import {Association} from "./../famix/association";
import {BehaviouralEntity} from "./../famix/behavioural_entity";

export class Invocation extends Association {

  private invocationCandidates: Set<BehaviouralEntity> = new Set();

  // manyMany.Getter
  // @FameProperty(name = "candidates", opposite = "incomingInvocations")
  public getCandidates(): Set<BehaviouralEntity> {
    return this.invocationCandidates;
  }

  // manyMany.Setter
  public addCandidates(newCandidates: BehaviouralEntity) {
    if (!this.invocationCandidates.has(newCandidates)) {
      this.invocationCandidates.add(newCandidates);
      newCandidates.getIncomingInvocations().add(this);
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
    newReceiver.getReceivingInvocations().add(this);
  }

  private invocationSender: BehaviouralEntity;

  // oneMany.Getter
  // @FameProperty(name = "sender", opposite = "outgoingInvocations")
  public getSender(): BehaviouralEntity {
    return this.invocationSender;
  }

  // oneMany.Setter
  public setSender(newSender: BehaviouralEntity) {
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

  private invocationReceiverSourceCode: string;

  // @FameProperty(name = "receiverSourceCode")
  public getReceiverSourceCode(): string {
    return this.invocationReceiverSourceCode;
  }

  public setReceiverSourceCode(invocationReceiverSourceCode: string) {
    this.invocationReceiverSourceCode = invocationReceiverSourceCode;
  }


  public getMSE(): string {
    const mse: FamixMseExporter = new FamixMseExporter("FAMIX.Invocation", this);
    this.addPropertiesToExporter(mse);
    return mse.getMSE();
  }

  public addPropertiesToExporter(exporter: FamixMseExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("candidates", this.getCandidates());
    exporter.addProperty("receiver", this.getReceiver());
    exporter.addProperty("sender", this.getSender());
    exporter.addProperty("signature", this.getSignature());
    exporter.addProperty("receiverSourceCode", this.getReceiverSourceCode());

  }

}

