// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { SourcedEntity } from "./../famix/sourced_entity";

export class Comment extends SourcedEntity {

  private commentContainer: SourcedEntity;

  // oneMany.Getter
  // @FameProperty(name = "container", opposite = "comments")
  public getContainer(): SourcedEntity {
    return this.commentContainer;
  }

  // oneMany.Setter
  public setContainer(newContainer: SourcedEntity) {
    this.commentContainer = newContainer;
    newContainer.getComments().add(this);
  }

  private commentContent: string;

  // @FameProperty(name = "content")
  public getContent(): string {
    return this.commentContent;
  }

  public setContent(commentContent: string) {
    this.commentContent = commentContent;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Comment", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("container", this.getContainer());
    exporter.addProperty("content", this.getContent());

  }

}

