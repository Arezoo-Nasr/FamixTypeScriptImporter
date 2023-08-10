import { FamixJSONExporter } from "./../../famix_JSON_exporter";
import { Method } from "./method";

export class Accessor extends Method {

  private isGetter: boolean;

  public getIsGetter(): boolean {
    return this.isGetter;
  }

  public setIsGetter(isGetter: boolean): void {
    this.isGetter = isGetter;
  }

  private isSetter: boolean;

  public getIsSetter(): boolean {
    return this.isSetter;
  }

  public setIsSetter(isSetter: boolean): void {
    this.isSetter = isSetter;
  }

  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Accessor", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter): void {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("isGetter", this.getIsGetter());
    exporter.addProperty("isSetter", this.getIsSetter());
  }
}
