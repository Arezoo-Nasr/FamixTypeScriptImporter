// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { NamedEntity } from "./../famix/named_entity";
import { ScopingEntity } from "./../famix/scoping_entity";

export class Package extends ScopingEntity {

  private packageNumberOfClientPackages: number;

  // @FameProperty(name = "numberOfClientPackages")
  public getNumberOfClientPackages(): number {
    return this.packageNumberOfClientPackages;
  }

  public setNumberOfClientPackages(packageNumberOfClientPackages: number) {
    this.packageNumberOfClientPackages = packageNumberOfClientPackages;
  }

  private packageChildNamedEntities: Set<NamedEntity> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "childNamedEntities", opposite = "parentPackage", derived = true)
  public getChildNamedEntities(): Set<NamedEntity> {
    return this.packageChildNamedEntities;
  }

  // manyOne.Setter
  public addChildNamedEntities(packageChildNamedEntities: NamedEntity) {
    if (!this.packageChildNamedEntities.has(packageChildNamedEntities)) {
      this.packageChildNamedEntities.add(packageChildNamedEntities);
      packageChildNamedEntities.setParentPackage(this);
    }
  }

  private packageNumberOfMethods: number;

  // @FameProperty(name = "numberOfMethods")
  public getNumberOfMethods(): number {
    return this.packageNumberOfMethods;
  }

  public setNumberOfMethods(packageNumberOfMethods: number) {
    this.packageNumberOfMethods = packageNumberOfMethods;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("FAMIX.Package", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("numberOfClientPackages", this.getNumberOfClientPackages());
    exporter.addProperty("numberOfMethods", this.getNumberOfMethods());
    exporter.addProperty("childNamedEntities", this.getChildNamedEntities());

  }

}

