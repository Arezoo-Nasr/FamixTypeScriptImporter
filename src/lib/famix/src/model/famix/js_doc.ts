import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { SourcedEntity } from "./sourced_entity";

export class JSDoc extends SourcedEntity {

  private container: SourcedEntity;

  public getContainer(): SourcedEntity {
    return this.container;
  }

  public setContainer(container: SourcedEntity): void {
    this.container = container;
    container.addJSDoc(this);
  }

  private content: string;

  public getContent(): string {
    return this.content;
  }

  public setContent(content: string): void {
    this.content = content;
  }

  private description: string;

  public getDescription(): string {
    return this.description;
  }

  public setDescription(description: string): void {
    this.description = description;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("JSDoc", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("container", this.getContainer());
    exporter.addProperty("content", this.getContent());
    exporter.addProperty("description", this.getDescription());
  }
}
