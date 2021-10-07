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
	}
}