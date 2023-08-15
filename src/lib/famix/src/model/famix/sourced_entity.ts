import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { SourceLanguage } from "./source_language";
import { Entity } from "./entity";
import { Comment } from "./comment";
import { SourceAnchor } from "./source_anchor";

export class SourcedEntity extends Entity {

  private isStub: boolean;

  public getIsStub(): boolean {
    return this.isStub;
  }

  public setIsStub(isStub: boolean): void {
    this.isStub = isStub;
  }

  private sourceAnchor: SourceAnchor;

  public getSourceAnchor(): SourceAnchor {
    return this.sourceAnchor;
  }

  public setSourceAnchor(sourceAnchor: SourceAnchor): void {
    if (this.sourceAnchor === undefined) {
      this.sourceAnchor = sourceAnchor;
      sourceAnchor.setElement(this);
    }
  }

  private comments: Set<Comment> = new Set();

  public getComments(): Set<Comment> {
    return this.comments;
  }

  public addComment(comments: Comment): void {
    if (!this.comments.has(comments)) {
      this.comments.add(comments);
      comments.setContainer(this);
    }
  }

  private declaredSourceLanguage: SourceLanguage;

  public getDeclaredSourceLanguage(): SourceLanguage {
    return this.declaredSourceLanguage;
  }

  public setDeclaredSourceLanguage(declaredSourceLanguage: SourceLanguage): void {
    this.declaredSourceLanguage = declaredSourceLanguage;
    declaredSourceLanguage.addSourcedEntity(this);
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("SourcedEntity", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("isStub", this.getIsStub());
    exporter.addProperty("sourceAnchor", this.getSourceAnchor());
    exporter.addProperty("comments", this.getComments());
    exporter.addProperty("declaredSourceLanguage", this.getDeclaredSourceLanguage());
  }
}
