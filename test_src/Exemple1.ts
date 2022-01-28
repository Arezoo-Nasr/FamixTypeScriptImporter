export namespace MyNamespace {

	export class class1 {
		protected projectName: string;

		constructor() {
			this.projectName = "Support for TypeScript";
		}

		public getName(university: string): string {
			var finalString: string = this.projectName + "in Moose" + university;
			return finalString;
		}
	}

	class class2 {
		public getString() {
			var class1Obj = new class1();
			var returnValue1 = class1Obj.getName("ETS");
		}
	}

	class class3 extends class1 {
		public func() {
			var x = this.projectName;
		}
	}
}

interface inter1 {
	att1: string;
	met1(): number;
}
interface inter2 {
	att2: string;
	met2(): number;
}

class classinter1 implements inter1 {
	att1: string = "";
	public met1(): number {
		return 2;
	}
}
function ds(){
var fd = "hiii";
}