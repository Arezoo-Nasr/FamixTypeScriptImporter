class AccessClassForTesting {
	private privateAttribute: number = 42;
	public publicAttribute: string = "FamixTypeScript.Access";
	public returnAccessName(): string {
		this.privateMethod();
		return this.publicAttribute;
	}
	private privateMethod() {
		this.privateAttribute ++;
	}
}
