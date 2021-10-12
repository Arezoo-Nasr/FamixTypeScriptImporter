// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { BehaviouralEntity } from "./../famix/behavioural_entity";
import { ContainerEntity } from "./../famix/container_entity";
import { Module } from "./../famix/module";

export class Function extends BehaviouralEntity {

  private functionContainer: ContainerEntity;

  // oneMany.Getter
  // @FameProperty(name = "container", opposite = "functions")
  public getContainer(): ContainerEntity {
    return this.functionContainer;
  }

  // oneMany.Setter
  public setContainer(newContainer: ContainerEntity) {
    this.functionContainer = newContainer;
    newContainer.getFunctions().add(this);
  }

  private functionParentModule: Module;

  // @FameProperty(name = "parentModule")
  public getParentModule(): Module {
    return this.functionParentModule;
  }

  public setParentModule(functionParentModule: Module) {
    this.functionParentModule = functionParentModule;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("Function", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("container", this.getContainer());
    exporter.addProperty("parentModule", this.getParentModule());

  }

}

