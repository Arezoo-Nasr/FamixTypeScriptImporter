/* Example from https://www.typescriptlang.org/docs/handbook/namespaces.html */
namespace Validation {
    export interface StringValidator {
      isAcceptable(s: string): boolean;
    }
  }