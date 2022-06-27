import { FamixBaseElement } from "./famix_base_element";
import { Attribute, Class, ContainerEntity, Namespace, Function } from "./model/famix";

export class FamixRepository {
  private elements: Set<FamixBaseElement> = new Set<FamixBaseElement>();
  private famixClasses: Set<Class> = new Set<Class>();
  private famixNamespaces = new Set<Namespace>();
  private idCounter: number = 1;
  private static repo: FamixRepository;

  constructor() {
  }

  public static getFamixRepo(): FamixRepository {
    if (this.repo === undefined) {
      this.repo = new FamixRepository();
    }
    return this.repo;
  }

  public static clearFamixRepo() {
    this.repo = new FamixRepository();
  }

  public getAllEntitiesWithType(theType: string) {
    return new Set(Array.from(this.elements.values())
      .filter(e => (e as any).constructor.name == theType)
      .concat(Array.from(this.famixClasses.values())
        .filter(e => (e as any).constructor.name == theType)));
  }

  public createOrGetFamixClass(name: string, isInterface?: boolean, isAbstract?: boolean): Class {
    let newClass = this.getFamixClass(name);
    if (newClass === undefined) {
      newClass = new Class(this);
      newClass.setName(name.toLowerCase());
      newClass.setIsStub(true);
      if (isInterface) newClass.setIsInterface(isInterface);
      if (isAbstract) newClass.setIsAbstract(isAbstract);
    }
    return newClass;
  }

  public getFamixClass(name: string): Class | undefined {
    return Array.from(this.famixClasses.values())
      .find(ns => ns.getName() === name)
    // for (const fc of Array.from(this.famixClasses.values())) {
    //   if (fc.getName() === name) {
    //     return fc;
    //   }
    // }
    // return undefined;
  }

  //Added by hand
  // getFamixEntity(s: { name: string; container: string; kind: Attribute | Variable}) {
  //   return Array.from(this.elements.values()).find(e => e.)
  // }

  getFamixFunction(namespace: string, func: string) {
    return Array.from(this.elements)
      .find(e => (e instanceof Function 
                  && (e as Function).getName() === func 
                  && (e as Function).getContainer().getName() === namespace))
  }


  getFamixNamespace(moduleName: string) {
    return Array.from(this.famixNamespaces.values())
      .find(ns => ns.getName() === moduleName)
    // for (const fc of Array.from(this.famixNamespaces.values())) {
    //   if (fc.getName() === moduleName) {
    //     return fc;
    //   }
    // }
    // return undefined;
  }

  public getFamixElementById(id: number): FamixBaseElement | undefined {
    let element = Array.from(this.elements.values()).find(e => e.id == id);
    return element;
  }

  public getFamixContainerEntityElementByFullyQualifiedName(FullyQualifiedName: string): FamixBaseElement | undefined {

    let allContainerEntity = Array.from(this.elements.values())
      .filter(e => (e as any).constructor.name == 'Method'
        || (e as any).constructor.name == 'Function'
        || (e as any).constructor.name == 'Namespace') as ContainerEntity[];

    let containerEntityElement = allContainerEntity.find(c => c.getFullyQualifiedName() == FullyQualifiedName);
    return containerEntityElement;
  }

  public addElement(element: FamixBaseElement) {
    if (element instanceof Class) {
      this.famixClasses.add(element);
    } else if (element instanceof Namespace) {
      this.famixNamespaces.add(element);
    } else {
      this.elements.add(element);
    }
    element.id = this.idCounter;
    this.idCounter++;
  }

  public getJSON(): string {
    let ret: string = "[";///////
    for (const element of Array.from(this.famixClasses.values())) {
      ret = ret + element.getJSON() + ",";
    }
    for (const element of Array.from(this.elements.values())) {
      ret = ret + element.getJSON() + ",";
    }
    ret = ret.substring(0, ret.length - 1)
    return ret + "]";//////////
  }
}
