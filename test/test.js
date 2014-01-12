new Test().add([
        testDevice,
        testDeviceiPhone5,
        testDeviceNexus5,
        testDeviceRevision_Nexus7_2013,
    ]).run();

function testDevice(next) {
    var spec = Device();

    console.log("testDevice ok: " + spec.DEVICE.ID);
    next && next.pass();
}

function testDeviceiPhone5(next) {

    var userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25";
    var emulate = {
            screen: {
                width: 320,
                height: 568
            },
            devicePixelRatio: 2
        };

    var spec = Device( userAgent, emulate );

    if (spec.DEVICE.ID      === "iPhone 5" &&
        spec.DEVICE.MAYBE   === true &&
        spec.DEVICE.BRAND   === "Apple" &&
        spec.OS.VERSION     ==  6.0 &&
        spec.GPU.TYPE       === "PowerVR") {
        console.log("testDeviceiPhone5 ok: " + spec.DEVICE.ID);
        next && next.pass();
    } else {
        console.log("testDeviceiPhone5 ng: " + spec.DEVICE.ID);
        next && next.miss();
    }
}

function testDeviceNexus5(next) {
    var userAgent = "Mozilla/5.0 (Linux; Android 4.4; Nexus 5 Build/BuildID) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36";
    var spec = Device( userAgent );

    if (spec.DEVICE.ID      === "Nexus 5" &&
        spec.DEVICE.MAYBE   === false &&
        spec.DEVICE.BRAND   === "Google" &&
        spec.DISPLAY.LONG   === 1920 &&
        spec.DISPLAY.SHORT  === 1080 &&
        spec.DISPLAY.PPI    === 445 &&
        spec.DISPLAY.DPR    === 3 &&
        spec.MEMORY.RAM     === 2 &&
        spec.GPU.TYPE       === "Adreno") {
        console.log("testDeviceSpec ok: " + spec.DEVICE.ID);
        next && next.pass();
    } else {
        console.log("testDeviceSpec ng: " + spec.DEVICE.ID);
        next && next.miss();
    }
}

function testDeviceRevision_Nexus7_2013(next) {
    var userAgent = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.111 Safari/537.36";
    var spec = Device( userAgent, { devicePixelRatio: 2 } );

    if (spec.DEVICE.ID        === "Nexus 7 (2013)" &&
        spec.DEVICE.SOC       === "APQ8064" &&
        spec.DEVICE.GPS       === true &&
        spec.OS.VERSION.PRE   ==  4.3 &&
        spec.DISPLAY.DPR      === 2 &&
        spec.MEMORY.RAM       === 2 &&
        spec.GPU.TYPE         === "Adreno") {
        console.log("testDeviceRevision_Nexus7_2013 ok: " + spec.DEVICE.ID);
        next && next.pass();
    } else {
        console.log("testDeviceRevision_Nexus7_2013 ng: " + spec.DEVICE.ID);
        next && next.miss();
    }
}
