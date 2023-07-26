import { FamixBaseElement } from "./famix_base_element";
import { Class, Entity, Namespace, Function, Method, Type } from "./model/famix";

/**
 * This class is used to store all Famix elements
 */
export class FamixRepository {

  private elements = new Set<FamixBaseElement>(); // All Famix elements
  private famixClasses = new Set<Class>(); // All Famix classes
  private famixNamespaces = new Set<Namespace>(); // All Famix namespaces
  private famixMethods = new Set<Method>(); // All Famix methods
  private famixFunctions = new Set<Function>(); // All Famix functions
  private idCounter = 1; // Id counter

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
    const allEntity = Array.from(this.elements.values()) as Array<Entity>;
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
   * Gets all method names as a set from a class
   * @param className A class name
   * @returns The set of class "className" method names
   */
  public _methodNamesAsSetFromClass(className: string): Set<string> {
    const theClass = this._getFamixClass(className) as Class;
    return new Set(Array.from(theClass.getMethods()).map(m => m.getName()));
  }

  /**
   * Gets all method parents as a set from a class
   * @param className A class name
   * @returns The set of class "className" method parents
   */
  public _methodParentsAsSetFromClass(className: string): Set<Type> {
    const theClass = this._getFamixClass(className) as Class;
    return new Set(Array.from(theClass.getMethods()).map(m => m.getParentType()));
  }

  /**
   * Gets the map of Famix elements ids and their Famix element from a JSON model
   * @param model A JSON model
   * @returns The map of Famix elements ids and their Famix element from the JSON model
   */
  public _initMapFromModel(model: string): Map<number, any> {
    const parsedModel: Array<any> = JSON.parse(model);
    const idToElementMap: Map<number, any> = new Map();
    parsedModel.forEach(element => {
        idToElementMap.set(element.id, element);
    });
    return idToElementMap;
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
