new Test().add([
        testDevice,
        testDeviceCatalog,
        testDeviceToSpecObject,
        testDeviceiPhone5,
        testDeviceNexus5,
        testDeviceRevision_Nexus7_2013,
        testDeviceAndroidFirefox,
        testDeviceWindowPhone8S,
        testDeviceWindowPhoneLumia920,
    ]).run().worker(function(err, test) {
        if (!err && typeof Device_ !== "undefined") {
            Device = Device_;
            new Test(test).run().worker();
        }
    });

function testDevice(next) {
    var spec = Device( Spec() );

    console.log("testDevice ok: " + spec.DEVICE.ID);
    next && next.pass();
}

function testDeviceCatalog(next) {
    var object1 = Device.catalog("SOC");
    var object2 = Device.catalog("DEVICE");

    if (object1 && object2) {
        console.log("testDeviceCatalog ok.");
        next && next.pass();
    } else {
        console.log("testDeviceCatalog ng.");
        next && next.miss();
    }
}

function testDeviceToSpecObject(next) {
    var spec = Device("iPhone 3GS");

    if (spec.DEVICE.BRAND === "Apple") {
        console.log("testDeviceToSpecObject ok.");
        next && next.pass();
    } else {
        console.log("testDeviceToSpecObject ng.");
        next && next.miss();
    }
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

    var spec = Device( Spec(userAgent), emulate );

    if (spec.DEVICE.ID      === "iPhone 5" &&
        spec.DEVICE.MAYBE   === true &&
        spec.DEVICE.BRAND   === "Apple" &&
//      spec.OS.VERSION     ==  6.0 &&
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
    var spec = Device( Spec(userAgent) );

    if (spec.DEVICE.ID      === "Nexus 5" &&
        spec.DEVICE.MAYBE   === false &&
        spec.DEVICE.BRAND   === "Google" &&
        spec.DISPLAY.LONG   === 1920 &&
        spec.DISPLAY.SHORT  === 1080 &&
        spec.DISPLAY.PPI    === 445 &&
        spec.DISPLAY.DPR    === 3 &&
        spec.MEMORY.RAM     === 2048 &&
        spec.GPU.TYPE       === "Adreno") {
        console.log("testDeviceNexus5 ok: " + spec.DEVICE.ID);
        next && next.pass();
    } else {
        console.log("testDeviceNexus5 ng: " + spec.DEVICE.ID);
        next && next.miss();
    }
}

function testDeviceRevision_Nexus7_2013(next) {
    var userAgent = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.111 Safari/537.36";
    var spec = Device( Spec(userAgent), { devicePixelRatio: 2 } );

    if (spec.DEVICE.ID        === "Nexus 7 (2013)" &&
        spec.DEVICE.SOC       === "APQ8064" &&
        spec.DEVICE.GPS       === true &&
        spec.OS.VERSION.PRE   ==  4.3 &&
        spec.DISPLAY.DPR      === 2 &&
        spec.MEMORY.RAM       === 2048 &&
        spec.GPU.TYPE         === "Adreno") {
        console.log("testDeviceRevision_Nexus7_2013 ok: " + spec.DEVICE.ID);
        next && next.pass();
    } else {
        console.log("testDeviceRevision_Nexus7_2013 ng: " + spec.DEVICE.ID);
        next && next.miss();
    }
}

function testDeviceAndroidFirefox(next) {
    var userAgent = "Mozilla/5.0 (Android; Mobile; rv:13.0) Gecko/13.0 Firefox/13.0";
    var spec = Device( Spec(userAgent) );

    if (spec.DEVICE.ID        === "" &&
        spec.DEVICE.SOC       === "" &&
        spec.DEVICE.GPS       === false &&
        spec.OS.VERSION.PRE   ==  0 &&
        spec.DISPLAY.DPR      === 0 &&
        spec.MEMORY.RAM       === 0 &&
        spec.GPU.TYPE         === "") {
        console.log("testDeviceAndroidFirefox ok: " + spec.DEVICE.ID);
        next && next.pass();
    } else {
        console.log("testDeviceAndroidFirefox ng: " + spec.DEVICE.ID);
        next && next.miss();
    }
}

function testDeviceWindowPhone8S(next) {
    var userAgent = "Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; HTC; Windows Phone 8S by HTC)";
    var spec = Device( Spec(userAgent) );

    if (spec.DEVICE.ID        === "8S" &&
        spec.DEVICE.SOC       === "MSM8627" &&
        spec.DEVICE.GPS       === true &&
        spec.OS.VERSION.PRE   ==  8 &&
        spec.MEMORY.RAM       === 512 &&
        spec.GPU.TYPE         === "Adreno") {
        console.log("testDeviceWindowPhone8S ok: " + spec.DEVICE.ID);
        next && next.pass();
    } else {
        console.log("testDeviceWindowPhone8S ng: " + spec.DEVICE.ID);
        next && next.miss();
    }
}

function testDeviceWindowPhoneLumia920(next) {
    var userAgent = "Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 920)";
    var spec = Device( Spec(userAgent) );

    if (spec.DEVICE.ID        === "Lumia 920" &&
        spec.DEVICE.SOC       === "MSM8960" &&
        spec.DEVICE.GPS       === true &&
        spec.OS.VERSION.PRE   ==  8 &&
        spec.MEMORY.RAM       === 1024 &&
        spec.GPU.TYPE         === "Adreno" &&
        spec.GPU.ID           === "225") {
        console.log("testDeviceWindowPhoneLumia920 ok: " + spec.DEVICE.ID);
        next && next.pass();
    } else {
        console.log("testDeviceWindowPhoneLumia920 ng: " + spec.DEVICE.ID);
        next && next.miss();
    }
}

