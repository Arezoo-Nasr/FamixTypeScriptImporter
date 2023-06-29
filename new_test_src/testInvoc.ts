class A {
    public x(): void {true;}
}

class B {
    public y(): void {
        new A().x();
    }
}
