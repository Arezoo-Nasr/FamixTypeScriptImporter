class Class1 {
	public returnHi(): string {
		return "Hi";
	}
}
class Class2 {
	public getHi() {
		var class1Obj = new Class1();
		var returnValue = class1Obj.returnHi();
		var class1Obj1 = new Class1();
	}
}