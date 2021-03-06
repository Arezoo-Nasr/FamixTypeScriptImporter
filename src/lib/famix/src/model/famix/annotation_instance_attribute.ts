// automatically generated code, please do not change

import { FamixJSONExporter } from "../../famix_JSON_exporter";
import { Entity } from "./../famix/entity";
import { AnnotationTypeAttribute } from "./../famix/annotation_type_attribute";
import { AnnotationInstance } from "./../famix/annotation_instance";

export class AnnotationInstanceAttribute extends Entity {

  private annotationInstanceAttributeAnnotationTypeAttribute: AnnotationTypeAttribute;

  // oneMany.Getter
  // @FameProperty(name = "annotationTypeAttribute", opposite = "annotationAttributeInstances")
  public getAnnotationTypeAttribute(): AnnotationTypeAttribute {
    return this.annotationInstanceAttributeAnnotationTypeAttribute;
  }

  // oneMany.Setter
  public setAnnotationTypeAttribute(newAnnotationTypeAttribute: AnnotationTypeAttribute) {
    this.annotationInstanceAttributeAnnotationTypeAttribute = newAnnotationTypeAttribute;
    newAnnotationTypeAttribute.getAnnotationAttributeInstances().add(this);
  }

  private annotationInstanceAttributeParentAnnotationInstance: AnnotationInstance;

  // oneMany.Getter
  // @FameProperty(name = "parentAnnotationInstance", opposite = "attributes")
  public getParentAnnotationInstance(): AnnotationInstance {
    return this.annotationInstanceAttributeParentAnnotationInstance;
  }

  // oneMany.Setter
  public setParentAnnotationInstance(newParentAnnotationInstance: AnnotationInstance) {
    this.annotationInstanceAttributeParentAnnotationInstance = newParentAnnotationInstance;
    newParentAnnotationInstance.getAttributes().add(this);
  }

  private annotationInstanceAttributeValue: string;

  // @FameProperty(name = "value")
  public getValue(): string {
    return this.annotationInstanceAttributeValue;
  }

  public setValue(annotationInstanceAttributeValue: string) {
    this.annotationInstanceAttributeValue = annotationInstanceAttributeValue;
  }


  public getJSON(): string {
    const mse: FamixJSONExporter = new FamixJSONExporter("AnnotationInstanceAttribute", this);
    this.addPropertiesToExporter(mse);
    return mse.getJSON();
  }

  public addPropertiesToExporter(exporter: FamixJSONExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("annotationTypeAttribute", this.getAnnotationTypeAttribute());
    exporter.addProperty("parentAnnotationInstance", this.getParentAnnotationInstance());
    exporter.addProperty("value", this.getValue());

  }

}

