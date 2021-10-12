// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Attribute } from "./../famix/attribute";
import { AnnotationInstanceAttribute } from "./../famix/annotation_instance_attribute";

export class AnnotationTypeAttribute extends Attribute {

  private annotationTypeAttributeAnnotationAttributeInstances: Set<AnnotationInstanceAttribute> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "annotationAttributeInstances", opposite = "annotationTypeAttribute", derived = true)
  public getAnnotationAttributeInstances(): Set<AnnotationInstanceAttribute> {
    return this.annotationTypeAttributeAnnotationAttributeInstances;
  }

  // manyOne.Setter
  public addAnnotationAttributeInstances(annotationTypeAttributeAnnotationAttributeInstances: AnnotationInstanceAttribute) {
    if (!this.annotationTypeAttributeAnnotationAttributeInstances.has(annotationTypeAttributeAnnotationAttributeInstances)) {
      this.annotationTypeAttributeAnnotationAttributeInstances.add(annotationTypeAttributeAnnotationAttributeInstances);
      annotationTypeAttributeAnnotationAttributeInstances.setAnnotationTypeAttribute(this);
    }
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("AnnotationTypeAttribute", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("annotationAttributeInstances", this.getAnnotationAttributeInstances());

  }

}

