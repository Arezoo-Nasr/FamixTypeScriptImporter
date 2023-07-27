// NOT any more (automatically generated code, please do not change)

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Type } from "./type";

import { Invocation } from "./invocation";
import { NamedEntity } from "./named_entity";
import { Reference } from "./reference";
import { Access } from "./access";
import { Function } from "./function";
import { Variable } from "./variable";


export class ContainerEntity extends NamedEntity {

  private parentContainerEntity: ContainerEntity;

  public getParentContainerEntity(): ContainerEntity {
    return this.parentContainerEntity;
  }

  public setParentContainerEntity(parentContainerEntity: ContainerEntity) {
    this.parentContainerEntity = parentContainerEntity;
  }

  public getFullyQualifiedName(): string {
    return this.parentContainerEntity.getFullyQualifiedName() + "." + this.getName();
  }

  private behaviouralEntityCyclomaticComplexity: number;

  // @FameProperty(name = "cyclomaticComplexity")
  public getCyclomaticComplexity(): number {
    return this.behaviouralEntityCyclomaticComplexity;
  }

  public setCyclomaticComplexity(behaviouralEntityCyclomaticComplexity: number) {
    this.behaviouralEntityCyclomaticComplexity = behaviouralEntityCyclomaticComplexity;
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



  private childrenTypes: Set<Type> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "types", opposite = "behavioural", derived = true)
  public getTypes(): Set<Type> {
    return this.childrenTypes;
  }

  // manyOne.Setter
  public addType(aType: Type) {
    if (!this.childrenTypes.has(aType)) {
      this.childrenTypes.add(aType);
      aType.setParentContainerEntity(this);
    }
  }

  private childrenFunctions: Set<Function> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "functions", opposite = "behavioural", derived = true)
  public getFunctions(): Set<Function> {
    return this.childrenFunctions;
  }

  // manyOne.Setter
  public addFunction(aFunction: Function) {
    if (!this.childrenFunctions.has(aFunction)) {
      this.childrenFunctions.add(aFunction);
      aFunction.setParentContainerEntity(this);
    }
  }

  private variables: Set<Variable> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "local StructuralEntitys", opposite = "behavioural", derived = true)
  public getVariables(): Set<Variable> {
    return this.variables;
  }

  // manyOne.Setter
  public addVariable(variable: Variable) {
    if (!this.variables.has(variable)) {
      this.variables.add(variable);
      variable.setParentEntity(this);
    }
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("BehaviouralEntity", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("fullyQualifiedName", this.getFullyQualifiedName());
    exporter.addProperty("cyclomaticComplexity", this.getCyclomaticComplexity());
    exporter.addProperty("numberOfStatements", this.getNumberOfStatements());
    exporter.addProperty("outgoingReferences", this.getOutgoingReferences());
    exporter.addProperty("numberOfLinesOfCode", this.getNumberOfLinesOfCode());
    exporter.addProperty("outgoingInvocations", this.getOutgoingInvocations());
    exporter.addProperty("accesses", this.getAccesses());
    exporter.addProperty("types", this.getTypes());
    exporter.addProperty("functions", this.getFunctions());
    exporter.addProperty("StructuralEntitys", this.getVariables());

  }

}

