new Test().add([
        testDevice,
        testDeviceiPhone5,
        testDeviceNexus5,
        testDeviceRevision_Nexus7_2013,
        testDeviceAndroidFirefox,
        testDeviceWindowPhone8S,
        testDeviceWindowPhoneLumia920,
    ]).run();

function testDevice(next) {
    var spec = Device();

    console.log("testDevice ok: " + spec.DEVICE.ID);
    next && next.pass();
}

function testDeviceQueryCPU(next) {
    var queryString = "CPU.TYPE = ARM; CPU.CLOCK >= 2.2";
    var id = Device.query(queryString);

    if ( id.join(",") === "MSM8974" ) {
        console.log("testDeviceQueryCPU ok. query: " + queryString + ", result: " + id.join(","));
        next && next.pass();
    } else {
        console.log("testDeviceQueryCPU ng. query: " + queryString + ", result: " + id.join(","));
        next && next.miss();
    }
}

function testDeviceQueryGPU(next) {
    var queryString = "GPU.TYPE=Adreno; GPU.ID=320";
    var id = Device.query(queryString);

    if ( id.join(",") === "APQ8064T,APQ8064" ) {
        console.log("testDeviceQueryGPU ok. query: " + queryString + ", result: " + id.join(","));
        next && next.pass();
    } else {
        console.log("testDeviceQueryGPU ng. query: " + queryString + ", result: " + id.join(","));
        next && next.miss();
    }
}

function testDeviceQueryDEVICE(next) {
    var queryString = "DEVICE.BRAND=Google; DEVICE.SOC=MSM8974";
    var id = Device.query(queryString);

    if ( id.join(",") === "Nexus 5,EM01L" ) {
        console.log("testDeviceQueryDEVICE ok. query: " + queryString + ", result: " + id.join(","));
        next && next.pass();
    } else {
        console.log("testDeviceQueryDEVICE ng. query: " + queryString + ", result: " + id.join(","));
        next && next.miss();
    }
}

function testDeviceQueryOSVERSION(next) {
    var queryString = "OS.TYPE = android; OS.VERSION.PRE >= 2.3 ; OS.VERSION.HIGHEST < 4.1";
    var id = Device.query(queryString);

    if ( id.length ) {
        console.log("testDeviceQueryOSVERSION ok. query: " + queryString + ", result: " + id.join(","));
        next && next.pass();
    } else {
        console.log("testDeviceQueryOSVERSION ng. query: " + queryString + ", result: " + id.join(","));
        next && next.miss();
    }
}

function testDeviceQueryDISPLAY(next) {
    var queryString = "OS.TYPE = ios; DEVICE.SOC = A5X ; DISPLAY.LONG > 1920";
    var id = Device.query(queryString);

    if ( id.join(",") === "iPad 3" ) {
        console.log("testDeviceQueryDISPLAY ok. query: " + queryString + ", result: " + id.join(","));
        next && next.pass();
    } else {
        console.log("testDeviceQueryDISPLAY ng. query: " + queryString + ", result: " + id.join(","));
        next && next.miss();
    }
}

function testDeviceQueryCaseSensitive(next) {
    var id1 = Device.query("OS.TYPE = android", true);  // case-sensitive
    var id2 = Device.query("OS.TYPE = Android", false); // ignore-case

    if ( id1.length === 0 &&
         id2.length >= 0 ) {
        console.log("testDeviceQueryCaseSensitive ok.");
        next && next.pass();
    } else {
        console.log("testDeviceQueryCaseSensitive ng.");
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
        console.log("testDeviceNexus5 ok: " + spec.DEVICE.ID);
        next && next.pass();
    } else {
        console.log("testDeviceNexus5 ng: " + spec.DEVICE.ID);
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

function testDeviceAndroidFirefox(next) {
    var userAgent = "Mozilla/5.0 (Android; Mobile; rv:13.0) Gecko/13.0 Firefox/13.0";
    var spec = Device( userAgent );

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
    var spec = Device( userAgent );

    if (spec.DEVICE.ID        === "8S" &&
        spec.DEVICE.SOC       === "MSM8627" &&
        spec.DEVICE.GPS       === true &&
        spec.OS.VERSION.PRE   ==  8 &&
        spec.MEMORY.RAM       === 0.5 &&
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
    var spec = Device( userAgent );

    if (spec.DEVICE.ID        === "Lumia 920" &&
        spec.DEVICE.SOC       === "MSM8960" &&
        spec.DEVICE.GPS       === true &&
        spec.OS.VERSION.PRE   ==  8 &&
        spec.MEMORY.RAM       === 1 &&
        spec.GPU.TYPE         === "Adreno" &&
        spec.GPU.ID           === "225") {
        console.log("testDeviceWindowPhoneLumia920 ok: " + spec.DEVICE.ID);
        next && next.pass();
    } else {
        console.log("testDeviceWindowPhoneLumia920 ng: " + spec.DEVICE.ID);
        next && next.miss();
    }
}

