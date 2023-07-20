// NOT any more (automatically generated code, please do not change)

import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { FamixBaseElement } from "./../../famix_base_element";
import { Invocation } from "./../famix/invocation";
import { SourceAnchor } from "./../famix/source_anchor";

export class Entity extends FamixBaseElement {

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

  private entitySourceAnchor: SourceAnchor;

  // @FameProperty(name = "sourceAnchor", opposite = "element")
  public getSourceAnchor(): SourceAnchor {
    return this.entitySourceAnchor;
  }

  public setSourceAnchor(newSourceAnchor: SourceAnchor) {
    if (this.entitySourceAnchor === undefined) {
      this.entitySourceAnchor = newSourceAnchor;
      newSourceAnchor.setElement(this);
    }
  }

  private entityParentScope: Entity;

  // oneMany.Getter
  // @FameProperty(name = "parentScope", opposite = "childScopes")
  public getParentScope(): Entity {
    return this.entityParentScope;
  }

  // oneMany.Setter
  public setParentScope(newParentScope: Entity) {
    this.entityParentScope = newParentScope;
    newParentScope.getChildScopes().add(this);
  }

  private entityChildScopes: Set<Entity> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "childScopes", opposite = "parentScope", derived = true)
  public getChildScopes(): Set<Entity> {
    return this.entityChildScopes;
  }

  // manyOne.Setter
  public addChildScopes(entityChildScopes: Entity) {
    if (!this.entityChildScopes.has(entityChildScopes)) {
      this.entityChildScopes.add(entityChildScopes);
      entityChildScopes.setParentScope(this);
    }
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
    exporter.addProperty("fullyQualifiedName", this.getFullyQualifiedName());
    exporter.addProperty("sourceAnchor", this.getSourceAnchor());
    exporter.addProperty("parentScope", this.getParentScope());
    exporter.addProperty("childScopes", this.getChildScopes());
    exporter.addProperty("outgoingInvocations", this.getOutgoingInvocations());
    exporter.addProperty("incomingInvocations", this.getIncomingInvocations());
  
  }

}

