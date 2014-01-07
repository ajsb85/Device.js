new Test().add([
        testDeviceSpec,
    ]).run();

function testDeviceSpec(next) {
//    var userAgent = "Mozilla/5.0 (Linux; Android 4.2.2; Nexus 7 Build/JDQ39) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.169 Safari/537.22";
    var userAgent = "Mozilla/5.0 (Linux; Android 4.4; Nexus 5 Build/BuildID) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36";

    var spec = DeviceSpec.detect( DeviceSpec.getDeviceToken(userAgent) );

    if (spec.DEVICE         === "Nexus 5" &&
        spec.BRAND          === "GOOGLE" &&
        spec.DISPLAY.WIDTH  === 1920 &&
        spec.DISPLAY.HEIGHT === 1080 &&
        spec.DISPLAY.PPI    === 445 &&
        spec.RAM            === 2 &&
        spec.GPU.TYPE       === "Adreno") {
        console.log("testDeviceSpec ok");
        next && next.pass();
    } else {
        console.log("testDeviceSpec ng");
        next && next.miss();
    }
}

