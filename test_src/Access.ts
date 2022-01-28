class AccessClassForTesting {
	private privateAttribute: number = 42;
	public accessName: string = "FamixTypeScript.Access";
	public returnAccessName(): string {
		return this.accessName;
	}
	private privateMethod() {
		this.privateAttribute ++;
	}
}