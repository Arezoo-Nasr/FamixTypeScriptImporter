import { FamixBaseElement } from "./famix_base_element";
import { Class, Entity, Namespace, Function, Method } from "./model/famix";

/**
 * This class is used to store all FamixBaseElements
 */
export class FamixRepository {

  private elements = new Set<FamixBaseElement>();
  private famixClasses = new Set<Class>();
  private famixNamespaces = new Set<Namespace>();
  private famixMethods = new Set<Method>();
  private famixFunctions = new Set<Function>();
  private idCounter = 1;

  /**
   * Gets a Famix class by fully qualified name
   * @param name A class fully qualified name
   * @returns The Famix class corresponding to the fully qualified name or undefined if it doesn't exist
   */
  public getFamixClassByFullyQualifiedName(name: string): Class | undefined {
    return Array.from(this.famixClasses.values()).find(ns => ns.getFullyQualifiedName() === name);
  }

  /**
   * Gets a Famix entity by id
   * @param id An id of a Famix entity
   * @returns The Famix entity corresponding to the id or undefined if it doesn't exist
   */
  public getFamixEntityById(id: number): FamixBaseElement | undefined {
    const element = Array.from(this.elements.values()).find(e => e.id === id);
    return element;
  }

  /**
   * Gets a Famix entity by fully qualified name
   * @param FullyQualifiedName A fully qualified name
   * @returns The Famix entity corresponding to the fully qualified name or undefined if it doesn't exist
   */
  public getFamixEntityElementByFullyQualifiedName(FullyQualifiedName: string): FamixBaseElement | undefined {
    const allEntity = Array.from(this.elements.values()).filter(e => (e as any).constructor.name === 'Method' || (e as any).constructor.name === 'Function' || (e as any).constructor.name === 'Namespace' || (e as any).constructor.name === 'File') as Entity[];

    const entityElement = allEntity.find(c => c.getFullyQualifiedName() === FullyQualifiedName);
    return entityElement;
  }

  
  // Only for tests

  /**
   * Gets all Famix entities
   * @returns All Famix entities
   */
  public _getAllEntities(): Set<FamixBaseElement> {
    return new Set(Array.from(this.elements.values()));
  }

  /**
   * Gets all Famix entities of a given type
   * @param theType A type of Famix entity
   * @returns All Famix entities of the given type
   */
  public _getAllEntitiesWithType(theType: string): Set<FamixBaseElement> {
    return new Set(Array.from(this.elements.values()).filter(e => (e as any).constructor.name === theType));
  }

  /**
   * Gets a Famix class by name
   * @param name A class name
   * @returns The Famix class corresponding to the name or undefined if it doesn't exist
   */
  public _getFamixClass(name: string): Class | undefined {
    return Array.from(this.famixClasses.values()).find(ns => ns.getName() === name);
  }

  /**
   * Gets a Famix method by name
   * @param name A method name
   * @returns The Famix method corresponding to the name or undefined if it doesn't exist
   */
  public _getFamixMethod(name: string): Method | undefined {
    return Array.from(this.famixMethods.values()).find(ns => ns.getName() === name);
  }

  /**
   * Gets a Famix function by name
   * @param name A function name
   * @returns The Famix function corresponding to the name or undefined if it doesn't exist
   */
  public _getFamixFunction(name: string): Function | undefined {
    return Array.from(this.famixFunctions.values()).find(ns => ns.getName() === name);
  }

  /**
   * Gets a Famix namespace by name
   * @param moduleName A namespace name
   * @returns The Famix namespace corresponding to the name or undefined if it doesn't exist
   */
  public _getFamixNamespace(moduleName: string): Namespace | undefined {
    return Array.from(this.famixNamespaces.values()).find(ns => ns.getName() === moduleName);
  }

  /**
   * Gets all Famix namespaces
   * @returns All Famix namespaces
   */
  public _getFamixNamespaces(): Set<Namespace> {
    return new Set(Array.from(this.famixNamespaces.values()));
  }


  /**
   * Adds a Famix element to the repository
   * @param element A Famix element
   */
  public addElement(element: FamixBaseElement): void {
    if (element instanceof Class) {
      this.famixClasses.add(element);
    } else if (element instanceof Namespace) {
      this.famixNamespaces.add(element);
    } else if (element instanceof Method) {
      this.famixMethods.add(element);
    } else if (element instanceof Function) {
      this.famixFunctions.add(element);
    }
    this.elements.add(element);
    element.id = this.idCounter;
    this.idCounter++;
  }

  /**
   * Gets a JSON representation of the repository
   * @returns A JSON representation of the repository
   */
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
