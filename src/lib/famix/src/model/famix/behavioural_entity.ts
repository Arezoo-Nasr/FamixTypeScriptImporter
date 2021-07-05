// automatically generated code, please do not change

import {FamixMseExporter} from "../../famix_mse_exporter";
import {Type} from "./../famix/type";
import {ImplicitVariable} from "./../famix/implicit_variable";
import {Invocation} from "./../famix/invocation";
import {ContainerEntity} from "./../famix/container_entity";
import {Reference} from "./../famix/reference";
import {LocalVariable} from "./../famix/local_variable";
import {Access} from "./../famix/access";
import {Parameter} from "./../famix/parameter";

export class BehaviouralEntity extends ContainerEntity {

  private behaviouralEntitySignature: string;

  // @FameProperty(name = "signature")
  public getSignature(): string {
    return this.behaviouralEntitySignature;
  }

  public setSignature(behaviouralEntitySignature: string) {
    this.behaviouralEntitySignature = behaviouralEntitySignature;
  }

  private behaviouralEntityNumberOfParameters: number;

  // @FameProperty(name = "numberOfParameters")
  public getNumberOfParameters(): number {
    return this.behaviouralEntityNumberOfParameters;
  }

  public setNumberOfParameters(behaviouralEntityNumberOfParameters: number) {
    this.behaviouralEntityNumberOfParameters = behaviouralEntityNumberOfParameters;
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
    newDeclaredType.getBehavioursWithDeclaredType().add(this);
  }

  private behaviouralEntityCyclomaticComplexity: number;

  // @FameProperty(name = "cyclomaticComplexity")
  public getCyclomaticComplexity(): number {
    return this.behaviouralEntityCyclomaticComplexity;
  }

  public setCyclomaticComplexity(behaviouralEntityCyclomaticComplexity: number) {
    this.behaviouralEntityCyclomaticComplexity = behaviouralEntityCyclomaticComplexity;
  }

  private behaviouralEntityNumberOfComments: number;

  // @FameProperty(name = "numberOfComments")
  public getNumberOfComments(): number {
    return this.behaviouralEntityNumberOfComments;
  }

  public setNumberOfComments(behaviouralEntityNumberOfComments: number) {
    this.behaviouralEntityNumberOfComments = behaviouralEntityNumberOfComments;
  }

  private behaviouralEntityImplicitVariables: Set<ImplicitVariable> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "implicitVariables", opposite = "parentBehaviouralEntity", derived = true)
  public getImplicitVariables(): Set<ImplicitVariable> {
    return this.behaviouralEntityImplicitVariables;
  }

  // manyOne.Setter
  public addImplicitVariables(behaviouralEntityImplicitVariables: ImplicitVariable) {
    if (!this.behaviouralEntityImplicitVariables.has(behaviouralEntityImplicitVariables)) {
      this.behaviouralEntityImplicitVariables.add(behaviouralEntityImplicitVariables);
      behaviouralEntityImplicitVariables.setParentBehaviouralEntity(this);
    }
  }

  private behaviouralEntityLocalVariables: Set<LocalVariable> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "localVariables", opposite = "parentBehaviouralEntity", derived = true)
  public getLocalVariables(): Set<LocalVariable> {
    return this.behaviouralEntityLocalVariables;
  }

  // manyOne.Setter
  public addLocalVariables(behaviouralEntityLocalVariables: LocalVariable) {
    if (!this.behaviouralEntityLocalVariables.has(behaviouralEntityLocalVariables)) {
      this.behaviouralEntityLocalVariables.add(behaviouralEntityLocalVariables);
      behaviouralEntityLocalVariables.setParentBehaviouralEntity(this);
    }
  }

  private behaviouralEntityNumberOfStatements: number;

  // @FameProperty(name = "numberOfStatements")
  public getNumberOfStatements(): number {
    return this.behaviouralEntityNumberOfStatements;
  }

  public setNumberOfStatements(behaviouralEntityNumberOfStatements: number) {
    this.behaviouralEntityNumberOfStatements = behaviouralEntityNumberOfStatements;
  }

  private behaviouralEntityOutgoingReferences: Set<Reference> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "outgoingReferences", opposite = "source", derived = true)
  public getOutgoingReferences(): Set<Reference> {
    return this.behaviouralEntityOutgoingReferences;
  }

  // manyOne.Setter
  public addOutgoingReferences(behaviouralEntityOutgoingReferences: Reference) {
    if (!this.behaviouralEntityOutgoingReferences.has(behaviouralEntityOutgoingReferences)) {
      this.behaviouralEntityOutgoingReferences.add(behaviouralEntityOutgoingReferences);
      behaviouralEntityOutgoingReferences.setSource(this);
    }
  }

  private behaviouralEntityNumberOfLinesOfCode: number;

  // @FameProperty(name = "numberOfLinesOfCode")
  public getNumberOfLinesOfCode(): number {
    return this.behaviouralEntityNumberOfLinesOfCode;
  }

  public setNumberOfLinesOfCode(behaviouralEntityNumberOfLinesOfCode: number) {
    this.behaviouralEntityNumberOfLinesOfCode = behaviouralEntityNumberOfLinesOfCode;
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

  private behaviouralEntityNumberOfConditionals: number;

  // @FameProperty(name = "numberOfConditionals")
  public getNumberOfConditionals(): number {
    return this.behaviouralEntityNumberOfConditionals;
  }

  public setNumberOfConditionals(behaviouralEntityNumberOfConditionals: number) {
    this.behaviouralEntityNumberOfConditionals = behaviouralEntityNumberOfConditionals;
  }

  private behaviouralEntityAccesses: Set<Access> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "accesses", opposite = "accessor", derived = true)
  public getAccesses(): Set<Access> {
    return this.behaviouralEntityAccesses;
  }

  // manyOne.Setter
  public addAccesses(behaviouralEntityAccesses: Access) {
    if (!this.behaviouralEntityAccesses.has(behaviouralEntityAccesses)) {
      this.behaviouralEntityAccesses.add(behaviouralEntityAccesses);
      behaviouralEntityAccesses.setAccessor(this);
    }
  }

  private behaviouralEntityParameters: Set<Parameter> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "parameters", opposite = "parentBehaviouralEntity", derived = true)
  public getParameters(): Set<Parameter> {
    return this.behaviouralEntityParameters;
  }

  // manyOne.Setter
  public addParameters(behaviouralEntityParameters: Parameter) {
    if (!this.behaviouralEntityParameters.has(behaviouralEntityParameters)) {
      this.behaviouralEntityParameters.add(behaviouralEntityParameters);
      behaviouralEntityParameters.setParentBehaviouralEntity(this);
    }
  }


  public getMSE(): string {
    const mse: FamixMseExporter = new FamixMseExporter("FAMIX.BehaviouralEntity", this);
    this.addPropertiesToExporter(mse);
    return mse.getMSE();
  }

  public addPropertiesToExporter(exporter: FamixMseExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("signature", this.getSignature());
    exporter.addProperty("numberOfParameters", this.getNumberOfParameters());
    exporter.addProperty("declaredType", this.getDeclaredType());
    exporter.addProperty("cyclomaticComplexity", this.getCyclomaticComplexity());
    exporter.addProperty("numberOfComments", this.getNumberOfComments());
    exporter.addProperty("implicitVariables", this.getImplicitVariables());
    exporter.addProperty("localVariables", this.getLocalVariables());
    exporter.addProperty("numberOfStatements", this.getNumberOfStatements());
    exporter.addProperty("outgoingReferences", this.getOutgoingReferences());
    exporter.addProperty("numberOfLinesOfCode", this.getNumberOfLinesOfCode());
    exporter.addProperty("outgoingInvocations", this.getOutgoingInvocations());
    exporter.addProperty("incomingInvocations", this.getIncomingInvocations());
    exporter.addProperty("numberOfConditionals", this.getNumberOfConditionals());
    exporter.addProperty("accesses", this.getAccesses());
    exporter.addProperty("parameters", this.getParameters());

  }

}

