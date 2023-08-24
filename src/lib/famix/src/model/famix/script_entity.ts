import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { ScopingEntity } from "./scoping_entity";

export class ScriptEntity extends ScopingEntity {

  private numberOfLinesOfText: number;

  public getNumberOfLinesOfText(): number {
    return this.numberOfLinesOfText;
  }

  public setNumberOfLinesOfText(numberOfLinesOfText: number): void {
    this.numberOfLinesOfText = numberOfLinesOfText;
  }

  private numberOfCharacters: number;

  public getNumberOfCharacters(): number {
    return this.numberOfCharacters;
  }

  public setNumberOfCharacters(numberOfCharacters: number): void {
    this.numberOfCharacters = numberOfCharacters;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("ScriptEntity", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("numberOfLinesOfText", this.getNumberOfLinesOfText());
    exporter.addProperty("numberOfCharacters", this.getNumberOfCharacters());
  }
}
