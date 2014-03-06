new Test().add([
        testDevice,
        testDeviceToSpecObject,
        testDeviceiPhone5,
        testDeviceNexus5,
        testDeviceRevision_Nexus7_2013,
        testDeviceAndroidFirefox,
        testDevice_INFOBAR_A01,
        testDeviceWindowsPhone8S,
        testDeviceWindowsPhoneLumia920,
        testDeviceKindle,
        testDeviceGooglePlayEdition,
        // -- Device.query ---
        testDeviceQueryCPU,
        testDeviceQueryGPU,
        testDeviceQueryDEVICE,
        testDeviceQueryOSVERSION,
        testDeviceQueryDISPLAY,
        testDeviceQueryCaseSensitive,
        testDeviceQuerySOCAndDeviceID,
        testDeviceQueryDeviceID,
    ]).run().worker(function(err, test) {
        if (!err && typeof Device_ !== "undefined") {
            var undo = Test.swap(Device, Device_);

            new Test(test).run(function(err, test) {
                Test.undo(undo);
            });
        }
    });

function testDevice(next) {
    var spec = Device( UserAgent( Spec() ) );

    console.log("testDevice ok: " + spec.DEVICE.ID);
    next && next.pass();
}

function testDeviceToSpecObject(next) {
    var spec = Device.id("iPhone 3GS");

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

    var spec = Device( UserAgent( Spec( { ua: userAgent, emu: emulate } ) ) );

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
    var spec = Device( UserAgent( Spec({ ua: userAgent }) ) );

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
    var emu = { devicePixelRatio: 2 };
    var spec = Device( UserAgent( Spec({ ua: userAgent, emu: emu }) ) );

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
    var spec = Device( UserAgent( Spec({ ua: userAgent }) ) );

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

function testDevice_INFOBAR_A01(next) {
    var userAgent = "Mozilla/5.0 (Linux; U; Android 2.3.3; ja-jp; INFOBAR A01 Build/S6160) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1";
    var spec = Device( UserAgent( Spec({ ua: userAgent }) ) );

    if (spec.DEVICE.ID        === "INFOBAR A01" &&
        spec.DEVICE.SOC       === "MSM8655" &&
        spec.DEVICE.GPS       === true &&
        spec.OS.VERSION.PRE   ==  2.3 &&
        spec.OS.VERSION.HIGHEST == 2.3 &&
        spec.MEMORY.RAM       === 512 &&
        spec.GPU.TYPE         === "Adreno") {
        console.log("testDevice_INFOBAR_A01 ok: " + spec.DEVICE.ID);
        next && next.pass();
    } else {
        console.log("testDevice_INFOBAR_A01 ng: " + spec.DEVICE.ID);
        next && next.miss();
    }
}

function testDeviceWindowsPhone8S(next) {
    var userAgent = "Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; HTC; Windows Phone 8S by HTC)";
    var spec = Device( UserAgent( Spec({ ua: userAgent }) ) );

    if (spec.DEVICE.ID        === "8S" &&
        spec.DEVICE.SOC       === "MSM8627" &&
        spec.DEVICE.GPS       === true &&
        spec.OS.VERSION.PRE   ==  8 &&
        spec.MEMORY.RAM       === 512 &&
        spec.GPU.TYPE         === "Adreno") {
        console.log("testDeviceWindowsPhone8S ok: " + spec.DEVICE.ID);
        next && next.pass();
    } else {
        console.log("testDeviceWindowsPhone8S ng: " + spec.DEVICE.ID);
        next && next.miss();
    }
}

function testDeviceWindowsPhoneLumia920(next) {
    var userAgent = "Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 920)";
    var spec = Device( UserAgent( Spec({ ua: userAgent }) ) );

    if (spec.DEVICE.ID        === "Lumia 920" &&
        spec.DEVICE.SOC       === "MSM8960" &&
        spec.DEVICE.GPS       === true &&
        spec.OS.VERSION.PRE   ==  8 &&
        spec.MEMORY.RAM       === 1024 &&
        spec.GPU.TYPE         === "Adreno" &&
        spec.GPU.ID           === "225") {
        console.log("testDeviceWindowsPhoneLumia920 ok: " + spec.DEVICE.ID);
        next && next.pass();
    } else {
        console.log("testDeviceWindowsPhoneLumia920 ng: " + spec.DEVICE.ID);
        next && next.miss();
    }
}

function testDeviceKindle(next) {
    var userAgent = "Mozilla/5.0 (Linux; U; Android 4.0.3; en-us; KFTT Build/IML74K) AppleWebKit/535.19 (KHTML, like Gecko) Silk/3.4 Mobile Safari/535.19 Silk-Accelerated=true";
    var spec = Device( UserAgent( Spec({ ua: userAgent }) ) );

    if (spec.DEVICE.ID        === "KFTT" &&
        spec.DEVICE.SOC       === "OMAP4460" &&
        spec.DEVICE.GPS       === false &&
        spec.OS.VERSION.PRE   ==  4.0 &&
        spec.MEMORY.RAM       === 1024 &&
        spec.GPU.TYPE         === "PowerVR" &&
        spec.GPU.ID           === "SGX540") {
        console.log("testDeviceKindle ok: " + spec.DEVICE.ID);
        next && next.pass();
    } else {
        console.log("testDeviceKindle ng: " + spec.DEVICE.ID);
        next && next.miss();
    }
}

function testDeviceGooglePlayEdition(next) {
    var userAgent = "Mozilla/5.0 (Linux; U; Android 4.2.2; en-us; HTC6500LVW 4G Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30";
    var spec = Device( UserAgent( Spec({ ua: userAgent }) ) );

    if (spec.DEVICE.ID === "HTC6500LVW") {
        console.log("testDeviceGooglePlayEdition ok: " + spec.DEVICE.ID);
        next && next.pass();
    } else {
        console.log("testDeviceGooglePlayEdition ng: " + spec.DEVICE.ID);
        next && next.miss();
    }
}

function testDeviceQueryCPU(next) {
    var queryString = "CPU.TYPE = ARM; CPU.CLOCK >= 2.2";
    var id = Device.query(queryString);

    if ( id.indexOf("MSM8974") >= 0 ) {
        console.log("testDeviceQueryCPU ok. query: " + queryString + ", result: " + id.join(","));
        next && next.pass();
    } else {
        console.error("testDeviceQueryCPU ng. query: " + queryString + ", result: " + id.join(","));
        next && next.miss();
    }
}

function testDeviceQueryGPU(next) {
    var queryString = "GPU.TYPE=Adreno; GPU.ID=320";
    var id = Device.query(queryString);

    if ( id.indexOf("APQ8064T") >= 0 &&
         id.indexOf("APQ8064")  >= 0 ) {
        console.log("testDeviceQueryGPU ok. query: " + queryString + ", result: " + id.join(","));
        next && next.pass();
    } else {
        console.error("testDeviceQueryGPU ng. query: " + queryString + ", result: " + id.join(","));
        next && next.miss();
    }
}

function testDeviceQueryDEVICE(next) {
    var queryString = "DEVICE.BRAND=Google; DEVICE.SOC=MSM8974";
    var id = Device.query(queryString);

    if ( id.indexOf("Nexus 5") >= 0 ) {
        console.log("testDeviceQueryDEVICE ok. query: " + queryString + ", result: " + id.join(","));
        next && next.pass();
    } else {
        console.error("testDeviceQueryDEVICE ng. query: " + queryString + ", result: " + id.join(","));
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
        console.error("testDeviceQueryOSVERSION ng. query: " + queryString + ", result: " + id.join(","));
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
        console.error("testDeviceQueryDISPLAY ng. query: " + queryString + ", result: " + id.join(","));
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
        console.error("testDeviceQueryCaseSensitive ng.");
        next && next.miss();
    }
}

function testDeviceQuerySOCAndDeviceID(next) {
    var soc = Device.query("DEVICE.SOC=SHL24");

    if ( soc.length ) {
        console.log("testDeviceQuerySOCAndDeviceID ok.");
        next && next.pass();
    } else {
        console.error("testDeviceQuerySOCAndDeviceID ng.");
        next && next.miss();
    }
}

function testDeviceQueryDeviceID(next) {
    var id = Device.query("OS.TYPE=SHL24;OS.VERSION.PRE>=SHL24;DEVICE.SOC=SHL24;DEVICE.BRAND=SHL24");
    // id: ["SH-01F", "SH-01FDQ", "SH-02F", "SHT22", "SHL24", "SHL23", "DM016SH", "SBM302SH"]

    if ( id.indexOf("SH-01F")   >= 0 &&
         id.indexOf("SH-01FDQ") >= 0 &&
         id.indexOf("SH-02F")   >= 0 &&
         id.indexOf("SHT22")    >= 0 &&
         id.indexOf("SHL24")    >= 0 &&
         id.indexOf("SHL23")    >= 0 &&
         id.indexOf("DM016SH")  >= 0 &&
         id.indexOf("SBM302SH") >= 0) {
        console.log("testDeviceQueryDeviceID ok.");
        next && next.pass();
    } else {
        console.error("testDeviceQueryDeviceID ng.");
        next && next.miss();
    }
}

