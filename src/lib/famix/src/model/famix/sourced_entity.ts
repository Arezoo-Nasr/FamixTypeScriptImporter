// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { SourceLanguage } from "./../famix/source_language";
import { Entity } from "./../famix/entity";
import { Comment } from "./../famix/comment";
import { SourceAnchor } from "./../famix/source_anchor";

export class SourcedEntity extends Entity {

  private namedEntityIsStub: boolean;

  // @FameProperty(name = "isStub")
  public getIsStub(): boolean {
    return this.namedEntityIsStub;
  }

  public setIsStub(namedEntityIsStub: boolean) {
    this.namedEntityIsStub = namedEntityIsStub;
  }

  private sourcedEntitySourceAnchor: SourceAnchor;

  // @FameProperty(name = "sourceAnchor", opposite = "element")
  public getSourceAnchor(): SourceAnchor {
    return this.sourcedEntitySourceAnchor;
  }

  public setSourceAnchor(newSourceAnchor: SourceAnchor) {
    if (this.sourcedEntitySourceAnchor === undefined) {
      this.sourcedEntitySourceAnchor = newSourceAnchor;
      newSourceAnchor.setElement(this);
    }
  }

  private sourcedEntityComments: Set<Comment> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "comments", opposite = "container", derived = true)
  public getComments(): Set<Comment> {
    return this.sourcedEntityComments;
  }

  // manyOne.Setter
  public addComments(sourcedEntityComments: Comment) {
    if (!this.sourcedEntityComments.has(sourcedEntityComments)) {
      this.sourcedEntityComments.add(sourcedEntityComments);
      sourcedEntityComments.setContainer(this);
    }
  }

  private sourcedEntityDeclaredSourceLanguage: SourceLanguage;

  // oneMany.Getter
  // @FameProperty(name = "declaredSourceLanguage", opposite = "sourcedEntities")
  public getDeclaredSourceLanguage(): SourceLanguage {
    return this.sourcedEntityDeclaredSourceLanguage;
  }

  // oneMany.Setter
  public setDeclaredSourceLanguage(newDeclaredSourceLanguage: SourceLanguage) {
    this.sourcedEntityDeclaredSourceLanguage = newDeclaredSourceLanguage;
    newDeclaredSourceLanguage.getSourcedEntities().add(this);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("SourcedEntity", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("sourceAnchor", this.getSourceAnchor());
    exporter.addProperty("comments", this.getComments());
    exporter.addProperty("declaredSourceLanguage", this.getDeclaredSourceLanguage());

  }

}

