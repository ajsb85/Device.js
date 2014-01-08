new Test().add([
        testDeviceSpec,
        testDeviceRevision_Nexus7_2013,
    ]).run();

function testDeviceSpec(next) {
//    var userAgent = "Mozilla/5.0 (Linux; Android 4.2.2; Nexus 7 Build/JDQ39) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.169 Safari/537.22";
    var userAgent = "Mozilla/5.0 (Linux; Android 4.4; Nexus 5 Build/BuildID) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36";

    var spec = DeviceSpec.detect( DeviceSpec.token(userAgent) );

    if (spec.DEVICE         === "Nexus 5" &&
        spec.BRAND          === "Google" &&
        spec.DISPLAY.LONG  === 1920 &&
        spec.DISPLAY.SHORT === 1080 &&
        spec.DISPLAY.PPI    === 445 &&
        spec.DISPLAY.DPR    === 3 &&
        spec.RAM            === 2 &&
        spec.GPU.TYPE       === "Adreno") {
        console.log("testDeviceSpec ok");
        next && next.pass();
    } else {
        console.log("testDeviceSpec ng");
        next && next.miss();
    }
}

function testDeviceRevision_Nexus7_2013(next) {
    var userAgent = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.111 Safari/537.36";

    var spec = DeviceSpec.detect( DeviceSpec.token(userAgent) );
//alert(JSON.stringify(spec));

    if (spec.DEVICE          === "Nexus 7 (2013)" &&
        spec.SOC             === "APQ8064" &&
        spec.OS.BEGIN        === 430 &&
        spec.DISPLAY.DPR     === 2 &&
        spec.RAM             === 2 &&
        spec.GPU.TYPE        === "Adreno") {
        console.log("testDeviceRevision_Nexus7_2013 ok");
        next && next.pass();
    } else {
        console.log("testDeviceRevision_Nexus7_2013 ng. " + JSON.stringify(spec));
        next && next.miss();
    }
}
