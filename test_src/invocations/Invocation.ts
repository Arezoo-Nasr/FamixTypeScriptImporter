import {b} from "./invocation-import";

class Class1 {

	public returnHi(): string {
		return "Hi";
	}
}

class Class2 {

	public returnName(): string {
		return "Arezoo";
	}
}

class Class3 {

	public getString() {
		var class1Obj = new Class1();
		var class2Obj = new Class2();
		var returnValue1 = class1Obj.returnHi();
		var returnValue2 = class2Obj.returnName();
		var x = a(1);
		var y = b(2);
	}
}

function a(b: number) {
	return 15;
}
