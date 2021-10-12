// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Type } from "./../famix/type";
import { ContainerEntity } from "./../famix/container_entity";
import { AnnotationInstance } from "./../famix/annotation_instance";

export class AnnotationType extends Type {

  private annotationTypeContainer: ContainerEntity;

  // oneMany.Getter
  // @FameProperty(name = "container", opposite = "definedAnnotationTypes")
  public getContainer(): ContainerEntity {
    return this.annotationTypeContainer;
  }

  // oneMany.Setter
  public setContainer(newContainer: ContainerEntity) {
    this.annotationTypeContainer = newContainer;
    newContainer.getDefinedAnnotationTypes().add(this);
  }

  private annotationTypeInstances: Set<AnnotationInstance> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "instances", opposite = "annotationType", derived = true)
  public getInstances(): Set<AnnotationInstance> {
    return this.annotationTypeInstances;
  }

  // manyOne.Setter
  public addInstances(annotationTypeInstances: AnnotationInstance) {
    if (!this.annotationTypeInstances.has(annotationTypeInstances)) {
      this.annotationTypeInstances.add(annotationTypeInstances);
      annotationTypeInstances.setAnnotationType(this);
    }
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("AnnotationType", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("container", this.getContainer());
    exporter.addProperty("instances", this.getInstances());

  }

}

