class A {
    public x(): void {}
}

class B {
    public y(): void {
        new A().x();
    }
}
