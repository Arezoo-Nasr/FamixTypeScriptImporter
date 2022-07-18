var x = "hello";

namespace A {
    var w = 15;
}

export const y = 12.5;

function f() {
    var k = 0;
    if (true) {
        var ifBlockL = 12;
    }
    let cond = true;
    do {
        var doBlockL = 8
        cond = false;
    } while (cond);
    try {
        var tryBlockL = 1;
    } catch (error) {
        var catchBlockL = 12;        
    }
}