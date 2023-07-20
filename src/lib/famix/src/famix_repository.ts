import { FamixBaseElement } from "./famix_base_element";
import { Class, Entity, Namespace, Function, Method } from "./model/famix";

export class FamixRepository {

  private elements = new Set<FamixBaseElement>();
  private famixClasses = new Set<Class>();
  private famixNamespaces = new Set<Namespace>();
  private famixMethods = new Set<Method>();
  private idCounter = 1;

  // constructor() {
  // }

  public getFamixClass(name: string): Class | undefined {
    return Array.from(this.famixClasses.values()).find(ns => ns.getFullyQualifiedName() === name);
  }

  public getFamixElementById(id: number): FamixBaseElement | undefined {
    const element = Array.from(this.elements.values()).find(e => e.id === id);
    return element;
  }

  public getFamixEntityElementByFullyQualifiedName(FullyQualifiedName: string): FamixBaseElement | undefined {
    const allEntity = Array.from(this.elements.values()).filter(e => (e as any).constructor.name === 'Method' || (e as any).constructor.name === 'Function' || (e as any).constructor.name === 'Namespace' || (e as any).constructor.name === 'File') as Entity[];

    const entityElement = allEntity.find(c => c.getFullyQualifiedName() === FullyQualifiedName);
    return entityElement;
  }

  
  // Only for tests

  public _getAllEntities() {
    return new Set(Array.from(this.elements.values()));
  }

  public _getAllEntitiesWithType(theType: string) {
    return new Set(Array.from(this.elements.values()).filter(e => (e as any).constructor.name === theType));
  }

  public _getFamixClass(name: string): Class | undefined {
    return Array.from(this.famixClasses.values()).find(ns => ns.getName() === name);
  }

  public _getFamixMethod(name: string): Method | undefined {
    return Array.from(this.famixMethods.values()).find(ns => ns.getName() === name);
  }

  public _getFamixFunction(namespace: string, funcRegEx: string) {
    return Array.from(this.elements).find(e => (e instanceof Function && (e as Function).getName().match(funcRegEx) && (e as Function).getContainer().getName() === namespace));
  }

  public _getFamixNamespace(moduleName: string) {
    return Array.from(this.famixNamespaces.values()).find(ns => ns.getName() === moduleName);
  }

  public _getFamixNamespaces() {
    return new Set(Array.from(this.famixNamespaces.values()));
  }


  public addElement(element: FamixBaseElement) {
    if (element instanceof Class) {
      this.famixClasses.add(element);
    } else if (element instanceof Namespace) {
      this.famixNamespaces.add(element);
    } else if (element instanceof Method) {
      this.famixMethods.add(element);
    }
    this.elements.add(element);
    element.id = this.idCounter;
    this.idCounter++;
  }

  public getJSON(): string {
    let ret = "[";
    for (const element of Array.from(this.famixClasses.values())) {
      ret = ret + element.getJSON() + ",";
    }
    for (const element of Array.from(this.elements.values())) {
      ret = ret + element.getJSON() + ",";
    }
    ret = ret.substring(0, ret.length - 1);
    return ret + "]";
  }
}
