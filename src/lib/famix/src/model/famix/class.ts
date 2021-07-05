// automatically generated code, please do not change

import {FamixMseExporter} from "../../famix_mse_exporter";
import {Type} from "./../famix/type";

export class Class extends Type {

  private classIsTestCase: boolean;

  // @FameProperty(name = "isTestCase")
  public getIsTestCase(): boolean {
    return this.classIsTestCase;
  }

  public setIsTestCase(classIsTestCase: boolean) {
    this.classIsTestCase = classIsTestCase;
  }

  private classIsInterface: boolean;

  // @FameProperty(name = "isInterface")
  public getIsInterface(): boolean {
    return this.classIsInterface;
  }

  public setIsInterface(classIsInterface: boolean) {
    this.classIsInterface = classIsInterface;
  }


  public getMSE(): string {
    const mse: FamixMseExporter = new FamixMseExporter("FAMIX.Class", this);
    this.addPropertiesToExporter(mse);
    return mse.getMSE();
  }

  public addPropertiesToExporter(exporter: FamixMseExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("isTestCase", this.getIsTestCase());
    exporter.addProperty("isInterface", this.getIsInterface());

  }

}

