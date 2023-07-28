import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { SourcedEntity } from "./sourced_entity";

export class Comment extends SourcedEntity {

  private commentContainer: SourcedEntity;

  public getContainer(): SourcedEntity {
    return this.commentContainer;
  }

  public setContainer(commentContainer: SourcedEntity): void {
    this.commentContainer = commentContainer;
    commentContainer.addComment(this);
  }

  private commentContent: string;

  public getContent(): string {
    return this.commentContent;
  }

  public setContent(commentContent: string): void {
    this.commentContent = commentContent;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Comment", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("container", this.getContainer());
    exporter.addProperty("content", this.getContent());
  }
}
