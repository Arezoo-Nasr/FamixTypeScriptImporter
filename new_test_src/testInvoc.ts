class A {
    x() {}
}

class B {
    y() {
        new A().x();
    }
}
