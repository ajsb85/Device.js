// @name: Device.js

(function(global) {

// --- variable --------------------------------------------
var inNode = "process" in global;

// --- define ----------------------------------------------
// --- interface -------------------------------------------
function Device(spec_or_id, // @arg SpecObject/String: SpecObject or device-id.
                emulate) {  // @arg Object(= null): emulate spec values. { screen, devicePixelRatio }
                            //   emulate.screen.width     - Integer(= 0):
                            //   emulate.screen.height    - Integer(= 0):
                            //   emulate.devicePixelRatio - Number(= 0):
                            // @ret SpecObject: { DEVICE, OS, ... }
                            // @help: Device
                            // @desc: Detect device spec.
//{@assert
    _if(spec_or_id.constructor !== ({}).constructor && typeof spec_or_id !== "string", "invalid Device(spec_or_id,)");
    emulate && _if(emulate.constructor !== ({}).constructor, "invalid Device(,emulate)");
//}@assert

    if (typeof spec_or_id === "string") {
        var id = spec_or_id;
        var spec = Spec();

        if (id in DEVICE_CATALOG) {
            return _applyDeviceData(spec, id);
        } else if (id in SOC_CATALOG) {
            var soc = SOC_CATALOG[id];

            spec["CPU"]["TYPE"]  = soc[0];
            spec["CPU"]["CLOCK"] = soc[1];
            spec["CPU"]["CORES"] = soc[2];
            spec["CPU"]["SIMD"]  = soc[3] !== "Tegra2"; // Tegra2 NEON unsupported
            spec["GPU"]["TYPE"]  = soc[3];
            spec["GPU"]["ID"]    = soc[4];
        }
        return spec;
    }
    return _detectDeviceSpec(spec_or_id, emulate || null);
}

Device["name"] = "Device";
Device["repository"] = "https://github.com/uupaa/Device.js";

Device["catalog"] = Device_catalog; // Device.catalog(name:String):Object

// --- implement -------------------------------------------
function _detectDeviceSpec(spec,      // @arg SpecObject:
                           emulate) { // @arg Object(= null): emulate spec values. { screen, devicePixelRatio }
                                      // @ret SpecObject: device spec object.
                                      // @desc: detect device spec.

    // "Mozilla/5.0 (Linux; U; Android 4.0.4; ja-jp; SonySO-04D Build/7.0.D.1.117)..."
    //                                                   ~~~~~~
    //                                                  device id
    //
    var ua = spec["BROWSER"]["USER_AGENT"];
    var os = ""; // device os
    var id = ""; // device id

    // detect device-id and device-os;
    if ( /PlayStation|Xbox|Nintendo/i.test(ua) ) {
        os = "Game";
        id = _getGameDeviceID(ua, emulate);
    } else if ( /Android/.test(ua) ) {
        os = "Android";
        id = _getAndroidDeviceID(ua, emulate);
    } else if ( /iPhone|iPad|iPod/.test(ua) ) {
        os = "iOS";
        id = _getiOSDeviceID(ua, emulate);
    } else if ( /Windows Phone/.test(ua) ) {
        os = "Windows Phone";
        id = _getWindowsPhoneDeviceID(ua, emulate);
    } else {
        ; // delegate to OS.js
    }
    spec["OS"]["TYPE"] = os;

    var data = DEVICE_CATALOG[id] || null;

    if (data) {
        if (data["hook"]) { // has hook function.
            id = data["hook"](id, emulate); // overwrite device id. "Nexus 7" -> "Nexus 7 (2013)"
        }
        return _applyDeviceData(spec, id);
    }
    return spec;
}

function _applyDeviceData(spec, // @arg SpecObject:
                          id) { // @arg String: device-id
                                // @ret SpecObject: { DEVICE, OS, CPU, ... }
    var data = DEVICE_CATALOG[id];
    var soc  = SOC_CATALOG[ data[2] ];

    spec["DEVICE"]["ID"]     = id;
    spec["DEVICE"]["MAYBE"]  = /iPad 2|iPad 3|iPhone 4|iPhone 5|iPod touch 5/.test(id);
    spec["DEVICE"]["BRAND"]  = data[1];
    spec["DEVICE"]["SOC"]    = data[2];
    spec["DEVICE"]["GPS"]    = /GPS/.test(data[12]);
    spec["OS"]["TYPE"]       = data[0];
    spec["CPU"]["TYPE"]      = soc[0];
    spec["CPU"]["CLOCK"]     = soc[1];
    spec["CPU"]["CORES"]     = soc[2];
    spec["CPU"]["SIMD"]      = soc[3] !== "Tegra2"; // Tegra2 NEON unsupported
    spec["GPU"]["TYPE"]      = soc[3];
    spec["GPU"]["ID"]        = soc[4];
    spec["INPUT"]["TOUCH"]   = !!data[10]; // to Boolean value
    spec["INPUT"]["TOUCHES"] = data[10];
    spec["MEMORY"]["RAM"]    = data[9];
    spec["DISPLAY"]["PPI"]   = data[7];
    spec["DISPLAY"]["DPR"]   = data[8];
    spec["DISPLAY"]["INCH"]  = data[11];
    spec["DISPLAY"]["LONG"]  = Math.max(data[5], data[6]);
    spec["DISPLAY"]["SHORT"] = Math.min(data[5], data[6]);
    spec["NETWORK"]["3G"]    = /3G/.test(data[12]);
    spec["NETWORK"]["LTE"]   = /LTE/.test(data[12]);
    spec["NETWORK"]["NFC"]   = /NFC/.test(data[12]);
    spec["NETWORK"]["WIFI"]  = /WIFI/.test(data[12]);

    var pre     = data[3].split(".");
    var highest = data[4].split(".");

    spec["OS"]["VERSION"]["PRE"]["MAJOR"]     = parseInt(pre[0]);
    spec["OS"]["VERSION"]["PRE"]["MINOR"]     = parseInt(pre[1]);
    spec["OS"]["VERSION"]["PRE"]["PATCH"]     = parseInt(pre[2]);
    spec["OS"]["VERSION"]["HIGHEST"]["MAJOR"] = parseInt(highest[0]);
    spec["OS"]["VERSION"]["HIGHEST"]["MINOR"] = parseInt(highest[1]);
    spec["OS"]["VERSION"]["HIGHEST"]["PATCH"] = parseInt(highest[2]);

    return spec;
}

function _getAndroidDeviceID(userAgent, // @arg String:
                             emulate) { // @arg Object(= null): emulate spec values. { screen:Object, devicePixelRatio }
                                        // @ret String: id
    // Examples.
    // Mozilla/5.0 (Linux;    Android 4.1.1;        Nexus 7            Build/JRO03S)      AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Safari/535.19
    // Mozilla/5.0 (Linux; U; Android 1.5;   ja-jp; GDDJ-09            Build/CDB56)       AppleWebKit/528.5+ (KHTML, like Gecko) Version/3.1.2 Mobile Safari/525.20.1
    // Mozilla/5.0 (Linux; U; Android 2.3.3; ja-jp; INFOBAR A01        Build/S9081)       AppleWebKit/533.1  (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1
    // Mozilla/5.0 (Linux; U; Android 3.2;   ja-jp; SC-01D             Build/MASTER)      AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13
    // Mozilla/5.0 (Linux; U; Android 4.0.1; ja-jp; Galaxy Nexus       Build/ITL41D)      AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30
    // Mozilla/5.0 (Linux; U; Android 4.0.3; ja-jp; URBANO PROGRESSO   Build/010.0.3000)  AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30
    // Mozilla/5.0 (Linux; U; Android 3.2;   ja-jp; Sony Tablet S      Build/THMAS11000)  AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13
    // Mozilla/5.0 (Linux; U; Android 2.3;   ja-jp; SonyEricssonSO-01C Build/3.0.A.1.34)  AppleWebKit/533.1  (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1
    // Mozilla/5.0 (Linux; U; Android 4.0.4; ja-jp; SonySO-04D         Build/7.0.D.1.117) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30
    //                                              ~~~~~~~~~~~~~~~~
    //                                                device id

    var id = userAgent.split("Build/")[0].split(";").slice(-1).join().trim();

    if ( /^Sony/.test(id) ) {
        if ( /Tablet/.test(id) ) {
            ;
        } else {
            // Remove "Sony" and "Ericsson" prefixes.
            id = id.replace(/^Sony/, "").
                    replace(/^Ericsson/, "");
        }
    }
    return id;
}

function _getiOSDeviceID(userAgent, // @arg String:
                         emulate) { // @arg Object(= null): emulate spec values. { screen:Object, devicePixelRatio }
                                    // @ret String: id
    // Examples.
    //
    // Mozilla/5.0 (iPad;   CPU        OS 6_0   like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25
    // Mozilla/5.0 (iPod;   CPU iPhone OS 5_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A405 Safari/7534.48.3
    // Mozilla/5.0 (iPhone; CPU iPhone OS 6_0   like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25
    //              ~~~~~~
    //            device id

    var deviceInfo = emulate || global;
    var id = /iPad/.test(userAgent) ? "iPad"
           : /iPod/.test(userAgent) ? "iPod"
                                    : "iPhone";
    var dpr = deviceInfo["devicePixelRatio"] || 1;
    var longEdge = Math.max( (deviceInfo["screen"] || {})["width"]  || 0,
                             (deviceInfo["screen"] || {})["height"] || 0 ); // iPhone 4S: 480, iPhone 5: 568

    switch (id) {
    case "iPad":
        id = (dpr === 1) ? "iPad 2"  // maybe, candidate: iPad 2, iPad mini
                         : "iPad 3"; // maybe, candidate: iPad 3, iPad 4, iPad Air, iPad mini Retina, ...
        break;
    case "iPhone":
        id = (dpr === 1)      ? "iPhone 3GS"
           : (longEdge > 480) ? "iPhone 5"   // maybe, candidate: iPhone 5, iPhone 5c, iPhone 5s, iPhone 6...
                              : "iPhone 4";  // maybe, condidate: iPhone 4, iPhone 4S
        break;
    case "iPod":
        id = (longEdge > 480) ? "iPod touch 5"  // maybe, candidate: iPod touch 5, iPod touch 6...
           : (dpr === 2)      ? "iPod touch 4"
                              : "iPod touch 3";
    }
    return id;
}

function _getWindowsPhoneDeviceID(userAgent, // @arg String:
                                  emulate) { // @arg Object(= null): emulate spec values. { screen:Object, devicePixelRatio }
                                             // @ret String: id
    // Examples.
    // Mozilla/4.0 (compatible; MSIE 7.0; Windows Phone OS 7.5; Trident/3.1; IEMobile/7.0; <manufacturer>; <model> [;<operator])
    // Mozilla/4.0 (compatible; MSIE 7.0; Windows Phone OS 7.0; Trident/3.1; IEMobile/7.0; LG;      GW910)
    // Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; FujitsuToshibaMobileCommun; IS12T; KDDI)
    // Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; SAMSUNG; SGH-i917)
    // Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; HTC;     Windows Phone 8S by HTC; 1.04.163.03)
    //                                                                                                            ~~
    //
    // Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; HTC; Windows Phone 8S by HTC)
    // Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; HTC; Windows Phone 8S by HTC) BMID/E67A464280
    //                                                                                                     ~~~~~~~~~~~~~~~~~~~~~~~
    //                                                                                                             device id
    // Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; HTC;    Windows Phone 8X by HTC)
    // Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; HUAWEI; W1-U00)
    // Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA;  Lumia 920)

    var ua = userAgent.split("(")[1].split(")")[0];
    var token = ua.replace("ARM; ", "").replace("Touch; ", "").
                   replace(/LG; /i, "").replace(/ZTE; /i, "").
                   replace(/HTC; /i, "").replace(/DELL; /i, "").
                   replace(/ACER; /i, "").replace(/Alcatel; /i, "").
                   replace(/NOKIA; /i, "").replace(/SAMSUNG; /i, "").
                   replace(/FujitsuToshibaMobileCommun; /i, "").
                   replace(/Windows Phone /g, "").replace(" by HTC", ""). // nonsense!
                   split(/IEMobile\//)[1].split("; ");

//  var ieVersion = token[0];
    var id = (token[1] || "").trim();

    return id;
}

function _getGameDeviceID(userAgent, // @arg String:
                          emulate) { // @arg Object(= null): emulate spec values. { screen:Object, devicePixelRatio }
                                     // @ret String: id
    return /PlayStation 3/i.test(userAgent)        ? "PS 3"
         : /PlayStation 4/i.test(userAgent)        ? "PS 4"
         : /PlayStation Vita/i.test(userAgent)     ? "PS Vita"
         : /PlayStation Portable/i.test(userAgent) ? "PSP"
         : /Xbox One/i.test(userAgent)             ? "Xbox One"
         : /Xbox/i.test(userAgent)                 ? "Xbox 360"
         : /WiiU/i.test(userAgent)                 ? "Wii U"
         : /Wii/i.test(userAgent)                  ? "Wii"
         : /3DS/i.test(userAgent)                  ? "3DS"
                                                   : "";
}

function _versionValueOf() {
    return parseFloat(this["MAJOR"] + "." + this["MINOR"]);
}

function _typeValueOf() {
    return this["TYPE"];
}

function _nameValueOf() {
    return this["NAME"];
}

function Device_catalog(name) { // @arg String: "DEVICE" or "SOC"
                                // @ret Object: DEVICE_CATALOG or SOC_CATALOG
                                // @help: Device.catalog
//{@assert
    _if(typeof name !== "string", "invalid Device.catalog(name): " + name);
//}@assert

    name = name.toUpperCase();

    return name === "SOC"    ? SOC_CATALOG
         : name === "DEVICE" ? DEVICE_CATALOG
                             : {};
}

// --- const variable --------------------------------------
// --- OS TYPE ---
var IOS         = "iOS";
var ANDROID     = "Android";
var WPHONE      = "Windows Phone";
var GAME        = "Game";
//
// --- Device Brand / Maker ---
var GOOGLE      = "Google";
var APPLE       = "Apple";
var LG          = "LG";
var SAMSUNG     = "Samsung";
var SHARP       = "SHARP";
var SONY        = "SONY";
var FUJITSU     = "Fujitsu";
var NEC         = "NEC";
var PANASONIC   = "Panasonic";
var HUAWEI      = "Huawei";
var TOSHIBA     = "TOSHIBA";
var KYOCERA     = "Kyocera";
var HTC         = "HTC";
var MOTOROLA    = "Motorola";
var PANTECH     = "Pantech";
var CASIO       = "CASIO";
var DELL        = "DELL";
var ZTE         = "ZTE";
var ACER        = "Acer";
var NOKIA       = "Nokia";
var MICROSOFT   = "MicroSoft";
var NINTENDO    = "Nintendo";

// --- SoC ---
var MSM8974AB   = "MSM8974AB";
var APQ8074     = "APQ8074";
var MSM8974     = "MSM8974";
var MSM8930     = "MSM8930";
var APQ8064T    = "APQ8064T";
var APQ8064     = "APQ8064";
var MSM8960     = "MSM8960";
var MSM8660A    = "MSM8660A";
var MSM8260A    = "MSM8260A";
var APQ8060     = "APQ8060";
var MSM8660     = "MSM8660";
var MSM8655     = "MSM8655";
var MSM8627     = "MSM8627";
var MSM8260     = "MSM8260";
var MSM8255T    = "MSM8255T";
var MSM8255     = "MSM8255";
var MSM8230     = "MSM8230";
var MSM8227     = "MSM8227";
var MSM7230     = "MSM7230";
var APQ8055     = "APQ8055";
var MSM8225     = "MSM8225";
var QSD8650     = "QSD8650";
var QSD8250     = "QSD8250";
var MSM7227     = "MSM7227";
var T30L        = "T30L";
var AP37        = "AP37";
var AP33        = "AP33";
var AP25H       = "AP25H";
var T20         = "T20";
var OMAP4460    = "OMAP4460";
var OMAP4430    = "OMAP4430";
var OMAP3630    = "OMAP3630";
var EXYNOS5250  = "Exynos5250";
var EXYNOS4412  = "Exynos4412";
var EXYNOS4210  = "Exynos4210";
var S5PC110     = "S5PC110";
var K3V2T       = "K3V2T";
var K3V2        = "K3V2";
var APE5R       = "APE5R";
var S5L8900     = "S5L8900";
var S5PC100     = "S5PC100";
var A4          = "A4";
var A5          = "A5";
var A5X         = "A5X";
var A6          = "A6";
var A6X         = "A6X";
var A7          = "A7";
var HIGHSPEC    = "HighSpec";  // HighSpec Game Console
var LOWSPEC     = "LowSpec";   // LowSpec Game Console

// --- GPU type ---
var ADRENO      = "Adreno";
var TEGRA       = "Tegra";
var TEGRA2      = "Tegra2";
var POWERVR     = "PowerVR";
var MALI        = "Mali";
var IMMERSION   = "Immersion";

// --- CPU type ---
var ARM         = "ARM";
var ARM64       = "ARM64";
var ATOM        = "ATOM";

// --- NFC, GPS, WiFi, 3G, LTE ---
var NGW3L       = "NFC_GPS_WIFI_3G_LTE";
var NGW3        = "NFC_GPS_WIFI_3G";
var NGW         = "NFC_GPS_WIFI";
var GW3L        = "GPS_WIFI_3G_LTE";
var GW3         = "GPS_WIFI_3G";
var G3L         = "GPS_3G_LTE";
var GW          = "GPS_WIFI";
var W           = "WIFI";

// --- OS Version ---
var v800        = "8.0.0";
var v750        = "7.5.0";
var v700        = "7.0.0";
var v615        = "6.1.5";
var v600        = "6.0.0";
var v511        = "5.1.1";
var v510        = "5.1.0";
var v440        = "4.4.0";
var v433        = "4.3.3";
var v430        = "4.3.0";
var v422        = "4.2.2";
var v421        = "4.2.1";
var v420        = "4.2.0";
var v412        = "4.1.2";
var v411        = "4.1.1";
var v410        = "4.1.0";
var v404        = "4.0.4";
var v403        = "4.0.3";
var v401        = "4.0.1";
var v400        = "4.0.0";
var v320        = "3.2.0";
var v310        = "3.1.0";
var v300        = "3.0.0";
var v237        = "2.3.7";
var v236        = "2.3.6";
var v235        = "2.3.5";
var v234        = "2.3.4";
var v233        = "2.3.3";
var v232        = "2.3.2";
var v230        = "2.3.0";
var v222        = "2.2.2";
var v221        = "2.2.1";
var v220        = "2.2.0";
var v211        = "2.1.1";
var v210        = "2.1.0";
var v200        = "2.0.0";
var v160        = "1.6.0";
var v000        = "0.0.0";

// --- database ---------------------------------------------
// Device list: https://www.handsetdetection.com/properties/vendormodel/
var DEVICE_CATALOG = {
//                       [0]       [1]       [2]         [3] [4]    [5]  [6]  [7] [8]   [9]  [10]  [11] [12]
//                       OS.TYPE,  BRAND     SOC         OS.VER     DISP.SIZE PPI DPR   RAM TOUCH  INCH NFC+GPS+WiFi+3G+LTE+CHROMIUM
// --- Apple ---
    "iPod touch 3":     [IOS,      APPLE,    S5PC100,   v310,v511,  640,960,  326,  2,  128,  5,     0,   W  ], // iPod touch 8GB Model
  //"iPod touch 3":     [IOS,      APPLE,    CortexA8,  v310,v511,  640,960,  326,  2,  256,  5,     0,   W  ], // iPod touch 32/64GB Model
    "iPod touch 4":     [IOS,      APPLE,    A4,        v410,v615,  640,960,  326,  2,  256,  5,     0,   W  ],
    "iPod touch 5":     [IOS,      APPLE,    A5,        v600,v000,  640,1136, 326,  2,  512,  5,     0,   W  ],
    "iPhone 3G":        [IOS,      APPLE,    S5L8900,   v200,v421,  320,480,  163,  1,  128,  5,     0,  GW3 ],
    "iPhone 3GS":       [IOS,      APPLE,    S5PC100,   v300,v615,  320,480,  163,  1,  256,  5,     0,  GW3 ],
    "iPhone 4":         [IOS,      APPLE,    A4,        v400,v000,  640,960,  326,  2,  512,  5,     0,  GW3 ],
    "iPhone 4S":        [IOS,      APPLE,    A5,        v511,v000,  640,960,  326,  2,  512,  5,     0,  GW3 ],
    "iPhone 5":         [IOS,      APPLE,    A6,        v600,v000,  640,1136, 326,  2, 1024,  5,     0,  GW3L],
    "iPhone 5c":        [IOS,      APPLE,    A6,        v700,v000,  640,1136, 326,  2, 1024,  5,     0,  GW3L],
    "iPhone 5s":        [IOS,      APPLE,    A7,        v700,v000,  640,1136, 326,  2, 1024,  5,     0,  GW3L],
    "iPad 1":           [IOS,      APPLE,    A4,        v320,v615,  768,1024, 132,  1,  256, 10,     0,  GW  ],
    "iPad 2":           [IOS,      APPLE,    A5,        v430,v000,  768,1024, 132,  1,  512, 10,     0,  GW3 ],
    "iPad 3":           [IOS,      APPLE,    A5X,       v510,v000, 1536,2048, 264,  2, 1024, 10,     0,  GW3 ],
    "iPad 4":           [IOS,      APPLE,    A6X,       v600,v000, 1536,2048, 264,  2, 1024, 10,     0,  GW3L],
    "iPad Air":         [IOS,      APPLE,    A7,        v700,v000, 1536,2048, 264,  2, 1024, 10,     0,  GW3L],
    "iPad mini":        [IOS,      APPLE,    A5,        v600,v000,  768,1024, 132,  2,  512, 10,     0,  GW3 ],
    "iPad mini Retina": [IOS,      APPLE,    A7,        v700,v000, 1536,2048, 326,  2, 1024, 10,     0,  GW3L],
// --- Google ---
    "Nexus One":        [ANDROID,  GOOGLE,   QSD8250,   v210,v236,  480,800,  252,1.5,  512,  2,     0,  GW3 ],
    "Nexus S":          [ANDROID,  GOOGLE,   S5PC110,   v232,v410,  480,800,    0,1.5,  512,  5,     0, NGW3 ],
    "Galaxy Nexus":     [ANDROID,  GOOGLE,   OMAP4460,  v400,v422,  720,1280, 316,  2, 1024,  2,     0, NGW3L], // LTE (partial)
    "Nexus 4":          [ANDROID,  GOOGLE,   APQ8064,   v420,v000,  768,1280, 318,  2, 2048,  5,     0, NGW3L],
    "Nexus 5":          [ANDROID,  GOOGLE,   MSM8974,   v440,v000, 1080,1920, 445,  3, 2048,  5,     0, NGW3L],
    "Nexus 7":          [ANDROID,  GOOGLE,   T30L,      v411,v000,  800,1280, 216,1.33,1024,  5,     0, NGW3L],
    "Nexus 7 (2013)":   [ANDROID,  GOOGLE,   APQ8064,   v430,v000, 1200,1920, 323,  2, 2048,  5,     0, NGW3L],
    "Nexus 10":         [ANDROID,  GOOGLE,   EXYNOS5250,v420,v000, 1600,2560, 300,  2, 2048,  5,     0, NGW  ],
//  "Xperia Z Ultra":   [ANDROID,  SONY,     MSM8974,   v440,v000, 1080,1920, 342,  0, 2048,  5,   6.4, NGW3L], // Xperia Z Ultra Google Edition
// --- Sony ---
//  "SGP412JP":         [ANDROID,  SONY,     APQ8074,   v420,v000, 1080,1920, 342,  0, 2048,  5,   6.4, NGW  ], // Xperia Z Ultra WiFi Edition
// 
//                       [0]       [1]       [2]         [3] [4]    [5]  [6]  [7] [8]   [9]  [10]  [11] [12]
//                       OS.TYPE,  BRAND     SOC         OS.VER     DISP.SIZE PPI DPR   RAM TOUCH  INCH NFC+GPS+WiFi+3G+LTE+CHROMIUM
//{@jp
// --- docomo ---
// http://spec.nttdocomo.co.jp/spmss/
    "L-01F":            [ANDROID,  LG,       MSM8974,   v422,v422, 1080,1776, 480,  0, 2048,  5,     0, NGW3L],
    "SC-01F":           [ANDROID,  SAMSUNG,  MSM8974,   v430,v433, 1080,1920, 480,  0, 2048,  5,     0, NGW3L], // S Browser
    "SC-02F":           [ANDROID,  SAMSUNG,  MSM8974,   v430,v430, 1080,1920, 480,  0, 2048,  5,     0, NGW3L], // S Browser
    "SH-01F":           [ANDROID,  SHARP,    MSM8974,   v422,v422, 1080,1776, 480,  0, 2048,  5,     0, NGW3L],
    "SH-01FDQ":         [ANDROID,  SHARP,    MSM8974,   v422,v422, 1080,1776, 480,  0, 2048,  5,     0, NGW3L],
    "SH-02F":           [ANDROID,  SHARP,    MSM8974,   v422,v000, 1080,1920, 487,  0, 2048,  5,     0, NGW3L],
    "SH-03F":           [ANDROID,  SHARP,    MSM8960,   v000,v000,  540,960,    0,  0, 1024,  5,   4.1, NGW3L], // JUNIOR 2 (no Google Play)
    "SO-01F":           [ANDROID,  SONY,     MSM8974,   v422,v422, 1080,1776, 480,  3, 2048,  5,     0, NGW3L], // Xperia Z1
    "SO-02F":           [ANDROID,  SONY,     MSM8974,   v422,v422,  720,1184, 320,  0, 2048,  5,     0, NGW3L],
//  "SO-03F":           [ANDROID,  SONY,     MSM8974AB, v442,v000, 1080,1920,   0,  0, 3072,  5,   5.2, NGW3L], // Xperia Z2 (Sirius)
    "F-01F":            [ANDROID,  FUJITSU,  MSM8974,   v422,v422, 1080,1776, 480,  0, 2048,  5,     0, NGW3L],
    "F-02F":            [ANDROID,  FUJITSU,  MSM8974,   v422,v422, 1504,2560, 320,  0, 2048,  5,     0, NGW3L],
    "F-03F":            [ANDROID,  FUJITSU,  MSM8974,   v422,v422,  720,1184, 320,  0, 2048,  5,     0, NGW3L],
    "F-04F":            [ANDROID,  FUJITSU,  APQ8064T,  v422,v422,  540,888,  240,  0, 2048,  5,     0,  GW3 ],
    "L-05E":            [ANDROID,  LG,       APQ8064T,  v422,v422,  720,1280, 320,  0, 2048,  5,     0, NGW3L],
    "N-06E":            [ANDROID,  NEC,      APQ8064T,  v422,v422,  720,1184, 320,  0, 2048,  5,     0, NGW3L],
    "SC-04E":           [ANDROID,  SAMSUNG,  APQ8064T,  v422,v422, 1080,1920, 480,  0, 2048,  5,     0, NGW3L], // S Browser
    "SO-04E":           [ANDROID,  SONY,     APQ8064,   v412,v422,  720,1184, 320,  0, 2048,  5,     0, NGW3L],
    "SO-04EM":          [ANDROID,  SONY,     APQ8064,   v422,v422,  720,1184, 320,  0, 2048,  5,     0, NGW3L],
    "SH-06E":           [ANDROID,  SHARP,    APQ8064T,  v422,v422, 1080,1920, 480,  0, 2048,  5,     0, NGW3L],
    "SH-07E":           [ANDROID,  SHARP,    APQ8064T,  v422,v422,  720,1280, 320,  0, 2048,  2,     0, NGW3L],
    "SH-08E":           [ANDROID,  SHARP,    APQ8064T,  v422,v422, 1200,1824, 320,  0, 2048,  5,     0, NGW3L],
    "P-03E":            [ANDROID,  PANASONIC,APQ8064T,  v422,v422, 1080,1920, 480,  0, 2048,  5,     0, NGW3L],
    "F-06E":            [ANDROID,  FUJITSU,  APQ8064T,  v422,v422, 1080,1776, 480,  0, 2048,  5,     0, NGW3L],
    "F-07E":            [ANDROID,  FUJITSU,  APQ8064T,  v422,v422,  720,1184, 320,  0, 2048,  5,     0, NGW3L],
    "F-08E":            [ANDROID,  FUJITSU,  APQ8064T,  v422,v422,  540,867,  240,  0, 2048,  5,     0,  GW3L],
    "F-09E":            [ANDROID,  FUJITSU,  APQ8064T,  v422,v422,  540,888,  240,  0, 2048,  5,     0,  GW3L],
    "L-01E":            [ANDROID,  LG,       APQ8064,   v404,v412,  720,1280, 320,  0, 2048,  5,     0,  GW3L],
    "L-02E":            [ANDROID,  LG,       MSM8960,   v404,v412,  720,1280, 320,  0, 1024,  5,     0,  GW3L],
    "L-04E":            [ANDROID,  LG,       APQ8064T,  v412,v412, 1080,1920, 480,  0, 2048,  5,     0, NGW3L],
    "N-02E":            [ANDROID,  NEC,      MSM8960,   v404,v412,  480,800,  240,  0, 1024,  5,     0,  GW3L],
    "N-03E":            [ANDROID,  NEC,      APQ8064,   v404,v412,  720,1280, 320,  0, 2048,  5,     0,  GW3L],
    "N-04E":            [ANDROID,  NEC,      APQ8064,   v412,v412,  720,1280, 320,  0, 2048,  5,     0,  GW3L],
    "N-05E":            [ANDROID,  NEC,      MSM8960,   v412,v412,  540,960,  240,  0, 1024,  5,     0,  GW3L],
    "SC-01E":           [ANDROID,  SAMSUNG,  APQ8060,   v404,v404,  800,1280, 160,  0, 1024,  5,     0,  GW3L],
    "SC-02E":           [ANDROID,  SAMSUNG,  EXYNOS4412,v411,v411,  720,1280, 320,  0, 2048,  5,     0,  GW3L],
    "SC-03E":           [ANDROID,  SAMSUNG,  EXYNOS4412,v411,v411,  720,1280, 320,  0, 2048,  5,     0,  GW3L],
    "SH-01E":           [ANDROID,  SHARP,    MSM8960,   v404,v412,  540,888,  240,  0, 1024,  2,     0,  GW3L],
    "SH-01EVW":         [ANDROID,  SHARP,    MSM8960,   v404,v412,  540,888,  240,  0, 1024,  2,     0,  GW3L],
    "SH-02E":           [ANDROID,  SHARP,    APQ8064,   v404,v412,  720,1280, 320,  0, 2048,  2,     0, NGW3L],
    "SH-04E":           [ANDROID,  SHARP,    APQ8064,   v412,v412,  720,1184, 320,  0, 2048,  5,     0, NGW3L],
    "SH-05E":           [ANDROID,  SHARP,    MSM8960,   v404,v404,  540,960,  240,  0, 1024,  2,     0,  G3L ], // JUNIOR (no Google Play, no WiFi)
    "SO-01E":           [ANDROID,  SONY,     MSM8960,   v404,v412,  720,1184, 320,  0, 1024,  5,     0, NGW3L],
    "SO-02E":           [ANDROID,  SONY,     APQ8064,   v412,v422,  720,1184, 320,  3, 1024,  5,     0, NGW3L], // Xperia Z
    "SO-03E":           [ANDROID,  SONY,     APQ8064,   v412,v412, 1128,1920, 240,  0, 2048,  5,     0, NGW3L],
    "P-02E":            [ANDROID,  PANASONIC,APQ8064,   v412,v412, 1080,1920, 480,  0, 2048,  5,     0, NGW3L],
    "F-02E":            [ANDROID,  FUJITSU,  AP37,      v412,v412, 1080,1920, 480,  0, 2048,  5,     0, NGW3L],
    "F-03E":            [ANDROID,  FUJITSU,  MSM8960,   v404,v412,  540,960,  240,  0, 1024,  5,     0, NGW3L],
    "F-04E":            [ANDROID,  FUJITSU,  AP33,      v404,v422,  720,1280, 320,  0, 2048,  5,     0, NGW3L],
    "F-05E":            [ANDROID,  FUJITSU,  AP37,      v404,v412, 1200,1920, 240,  0, 2048,  5,     0, NGW3L],
    "HW-01E":           [ANDROID,  HUAWEI,   MSM8960,   v404,v404,  720,1280, 320,  0, 1024,  5,     0,  GW3L],
    "HW-03E":           [ANDROID,  HUAWEI,   K3V2,      v412,v412,  720,1280, 320,  0, 2048,  5,     0,  GW3L],
    "dtab01":           [ANDROID,  HUAWEI,   K3V2T,     v412,v412,  800,1280, 160,  0, 1024,  5,     0,  GW3 ],
    "L-05D":            [ANDROID,  LG,       MSM8960,   v404,v412,  480,800,  240,1.5, 1024,  5,     0,  GW3L], // Optimus it
    "L-06D":            [ANDROID,  LG,       APQ8060,   v404,v404,  768,1024, 320,  0, 1024,  5,     0,  GW3L],
    "L-06DJOJO":        [ANDROID,  LG,       APQ8060,   v404,v404,  768,1024, 320,  0, 1024,  5,     0,  GW3L],
    "N-07D":            [ANDROID,  NEC,      MSM8960,   v404,v404,  720,1280, 342,  0, 1024,  5,     0,  GW3L],
    "N-08D":            [ANDROID,  NEC,      MSM8960,   v404,v404,  800,1280, 213,  0, 1024,  5,     0,  GW3L],
    "SC-06D":           [ANDROID,  SAMSUNG,  MSM8960,   v404,v412,  720,1280, 320,  2, 2048,  5,     0,  GW3L], // Galaxy S III
    "SH-06D":           [ANDROID,  SHARP,    OMAP4460,  v235,v404,  720,1280, 320,  0, 1024,  5,     0,  GW3 ],
    "SH-06DNERV":       [ANDROID,  SHARP,    OMAP4460,  v235,v404,  720,1280, 320,  0, 1024,  2,     0,  GW3 ],
    "SH-07D":           [ANDROID,  SHARP,    MSM8255,   v404,v404,  480,854,  240,  0, 1024,  2,     0,  GW3 ],
    "SH-09D":           [ANDROID,  SHARP,    MSM8960,   v404,v412,  720,1280, 312,  0, 1024,  2,     0,  GW3L],
    "SH-10D":           [ANDROID,  SHARP,    MSM8960,   v404,v412,  720,1280, 320,  0, 1024,  2,     0,  GW3L],
    "SO-04D":           [ANDROID,  SONY,     MSM8960,   v404,v412,  720,1184, 320,  0, 1024,  5,     0,  GW3L],
    "SO-05D":           [ANDROID,  SONY,     MSM8960,   v404,v412,  540,888,  240,1.5, 1024,  5,     0,  GW3L], // Xperia SX
    "P-06D":            [ANDROID,  PANASONIC,OMAP4460,  v404,v404,  720,1280, 320,  0, 1024,  5,     0,  GW3 ],
    "P-07D":            [ANDROID,  PANASONIC,MSM8960,   v404,v404,  720,1280, 320,  0, 1024,  5,     0,  GW3L],
    "P-08D":            [ANDROID,  PANASONIC,OMAP4460,  v404,v404,  800,1280, 160,  0, 1024,  5,     0,  GW3 ],
    "F-09D":            [ANDROID,  FUJITSU,  MSM8255,   v403,v403,  480,800,  240,  0, 1024,  2,     0,  GW3 ],
    "F-10D":            [ANDROID,  FUJITSU,  AP33,      v403,v422,  720,1280, 323,  2, 1024,  5,     0,  GW3L], // ARROWS X
    "F-11D":            [ANDROID,  FUJITSU,  MSM8255,   v403,v422,  480,800,  240,  0, 1024,  5,     0,  GW3 ],
    "F-12D":            [ANDROID,  FUJITSU,  MSM8255,   v403,v403,  480,800,  235,  0, 1024,  5,     0,  GW3 ],
    "T-02D":            [ANDROID,  TOSHIBA,  MSM8960,   v404,v412,  540,960,  257,  0, 1024,  5,     0,  GW3L],
    "L-01D":            [ANDROID,  LG,       APQ8060,   v235,v404,  720,1280, 320,  0, 1024,  5,     0,  GW3L],
    "L-02D":            [ANDROID,  LG,       OMAP4430,  v237,v404,  480,800,  240,  0, 1024,  5,     0,  GW3 ],
    "N-01D":            [ANDROID,  NEC,      MSM8255T,  v235,v235,  480,800,  235,  0,  512,  5,     0,  GW3 ],
    "N-04D":            [ANDROID,  NEC,      APQ8060,   v236,v404,  720,1280, 342,  0, 1024,  5,     0,  GW3L],
    "N-05D":            [ANDROID,  NEC,      MSM8260,   v236,v404,  720,1280, 320,  0, 1024,  5,     0,  GW3 ],
    "N-06D":            [ANDROID,  NEC,      APQ8060,   v236,v404,  800,1280, 213,  0, 1024,  5,     0,  GW3L],
    "SC-01D":           [ANDROID,  SAMSUNG,  APQ8060,   v320,v404,  800,1200, 160,  0, 1024,  5,     0,  GW3L],
    "SC-02D":           [ANDROID,  SAMSUNG,  EXYNOS4210,v320,v404,  600,1024, 160,  0, 1024,  5,     0,  GW3 ],
    "SC-03D":           [ANDROID,  SAMSUNG,  APQ8060,   v236,v404,  480,800,  240,1.5, 1024,  5,     0, NGW3L], // GALAXY S II LTE
    "SC-04D":           [ANDROID,  SAMSUNG,  OMAP4460,  v401,v422,  720,1280, 320,  2, 1024,  5,     0, NGW3 ], // Galaxy Nexus
    "SC-05D":           [ANDROID,  SAMSUNG,  APQ8060,   v236,v412,  800,1280, 320,  0, 1024,  5,     0, NGW3L],
    "SH-01D":           [ANDROID,  SHARP,    OMAP4430,  v235,v404,  720,1280, 328,  0, 1024,  2,     0,  GW3 ],
    "SH-02D":           [ANDROID,  SHARP,    MSM8255,   v235,v235,  540,960,  300,  0,  512,  2,     0,  GW3 ],
    "SH-04D":           [ANDROID,  SHARP,    MSM8255,   v234,v234,  540,960,  300,  0,  512,  2,     0,  GW3 ],
    "SO-01D":           [ANDROID,  SONY,     MSM8255,   v234,v234,  480,854,  240,1.5,  512,  2,     0,  GW3 ], // Xperia Play
    "SO-02D":           [ANDROID,  SONY,     MSM8260,   v237,v404,  720,1280, 320,  0, 1024,  5,     0,  GW3 ],
    "SO-03D":           [ANDROID,  SONY,     MSM8260,   v237,v404,  720,1280, 320,  0, 1024,  5,     0,  GW3 ],
    "P-01D":            [ANDROID,  PANASONIC,MSM8255,   v234,v234,  480,800,  240,1.5,  512,  2,     0,  GW3 ],
    "P-02D":            [ANDROID,  PANASONIC,OMAP4430,  v235,v404,  540,960,  240,  0, 1024,  2,     0,  GW3 ],
    "P-04D":            [ANDROID,  PANASONIC,OMAP4430,  v235,v404,  540,960,  257,  0, 1024,  5,     0,  GW3 ],
    "P-05D":            [ANDROID,  PANASONIC,OMAP4430,  v235,v404,  540,960,  257,  0, 1024,  5,     0,  GW3 ],
    "F-01D":            [ANDROID,  FUJITSU,  OMAP4430,  v320,v403,  800,1280, 160,  0, 1024,  5,     0,  GW3L],
    "F-03D":            [ANDROID,  FUJITSU,  MSM8255,   v235,v235,  480,800,  240,  0,  512,  2,     0,  GW3 ],
    "F-05D":            [ANDROID,  FUJITSU,  OMAP4430,  v235,v403,  720,1280, 342,  0, 1024,  2,     0,  GW3L],
    "F-07D":            [ANDROID,  FUJITSU,  MSM8255,   v235,v235,  480,800,  235,  0,  512,  5,     0,  GW3 ],
    "F-08D":            [ANDROID,  FUJITSU,  OMAP4430,  v235,v403,  720,1280, 342,  0, 1024,  2,     0,  GW3 ],
    "T-01D":            [ANDROID,  TOSHIBA,  OMAP4430,  v235,v403,  720,1280, 320,  0, 1024,  2,     0,  GW3 ],
    "SC-02C":           [ANDROID,  SAMSUNG,  EXYNOS4210,v403,v403,  480,800,  240,  0, 1024,  5,     0,  GW3 ], // Galaxy S II
    "SO-01C":           [ANDROID,  SONY,     MSM8255,   v232,v234,  480,854,    0,1.5,  512,  2,     0,  GW3 ], // Xperia arc
    "SO-02C":           [ANDROID,  SONY,     MSM8255,   v233,v234,  480,854,    0,  0,  512,  2,     0,  GW3 ], // Xperia acro
    "SO-03C":           [ANDROID,  SONY,     MSM8255,   v234,v234,  480,854,    0,  0,  512,  2,     0,  GW3 ], // Xperia acro
    "SH-13C":           [ANDROID,  SHARP,    MSM8255,   v234,v234,  540,960,    0,  0,  512,  2,     0,  GW3 ],
    "SH-12C":           [ANDROID,  SHARP,    MSM8255T,  v233,v233,  540,960,    0,  0,  512,  2,     0,  GW3 ],
    "N-04C":            [ANDROID,  NEC,      MSM7230,   v220,v233,  480,854,    0,  0,  512,  2,     0,  GW3 ],
    "N-06C":            [ANDROID,  NEC,      MSM8255,   v230,v230,  480,854,    0,  0,  512,  2,     0,  GW3 ],
    "P-07C":            [ANDROID,  PANASONIC,OMAP3630,  v230,v230,  480,800,    0,  0,  512,  2,     0,  GW3 ],
    "F-12C":            [ANDROID,  FUJITSU,  MSM8255,   v230,v230,  480,800,    0,  0,  512,  2,     0,  GW3 ],
    "L-04C":            [ANDROID,  LG,       MSM7227,   v220,v230,  320,480,    0,  0,  512,  2,     0,  GW3 ],
    "L-06C":            [ANDROID,  LG,       T20,       v300,v310,  768,1280,   0,  0, 1024,  2,     0,  GW3 ],
    "L-07C":            [ANDROID,  LG,       OMAP3630,  v233,v233,  480,800,    0,  0,  512,  2,     0,  GW3 ],
    "T-01C":            [ANDROID,  TOSHIBA,  QSD8250,   v211,v222,  480,854,    0,1.5,    0,  2,     0,  GW3 ], // REGZA Phone
    "SH-03C":           [ANDROID,  SONY,     QSD8250,   v211,v222,  480,800,    0,  0,    0,  2,     0,  GW3 ],
    "SC-01C":           [ANDROID,  SAMSUNG,  S5PC110,   v220,v236,  600,1024,   0,1.5,    0,  2,     0,  GW3 ], // GALAXY Tab
    "SC-0 2B":           [ANDROID,  SAMSUNG,  S5PC110,   v220,v236,  480,800,    0,1.5,    0,  2,     0,  GW3 ], // GALAXY S
    "SH-10B":           [ANDROID,  SHARP,    QSD8250,   v160,v160,  480,960,    0,  1,    0,  2,     0,  GW3 ], // LYNX
    "SO-01B":           [ANDROID,  SONY,     QSD8250,   v160,v211,  480,854,    0,1.5,  384,  1,     0,  GW3 ],// Xperia
//                       [0]       [1]       [2]         [3] [4]    [5]  [6]  [7] [8]   [9]  [10]  [11] [12]
//                       OS.TYPE,  BRAND     SOC         OS.VER     DISP.SIZE PPI DPR   RAM TOUCH  INCH NFC+GPS+WiFi+3G+LTE+CHROMIUM
// --- au ---
// http://www.au.kddi.com/developer/android/
    "FJT21":            [ANDROID,  FUJITSU,  MSM8974,   v422,v422, 1600,2560, 300,  0, 2048, 10,     0, NGW3L],
    "SOL23":            [ANDROID,  SONY,     MSM8974,   v422,v422, 1080,1920, 442,  3, 2048, 10,     0, NGW3L], // Xperia Z1
    "SCL22":            [ANDROID,  SAMSUNG,  MSM8974,   v430,v430, 1080,1920, 386,  0, 3072, 10,     0, NGW3L], // S Browser
    "KYL22":            [ANDROID,  KYOCERA,  MSM8974,   v422,v422, 1080,1920, 443,  0, 2048,  5,     0, NGW3L],
    "LGL22":            [ANDROID,  LG,       MSM8974,   v422,v422, 1080,1920, 422,  0, 2048, 10,     0, NGW3L], // isai
    "SHL23":            [ANDROID,  SHARP,    MSM8974,   v422,v422, 1080,1920, 460,  0, 2048,  5,     0, NGW3L],
    "FJL22":            [ANDROID,  FUJITSU,  MSM8974,   v422,v422, 1080,1920, 444,  0, 2048, 10,     0, NGW3L],
    "SHL22":            [ANDROID,  SHARP,    APQ8064T,  v422,v422,  720,1280, 302,  0, 2048,  5,     0, NGW3L],
    "KYY21":            [ANDROID,  KYOCERA,  MSM8960,   v422,v422,  720,1280, 314,  0, 2048,  5,     0, NGW3L], // URBANO L01
    "HTL22":            [ANDROID,  HTC,      APQ8064T,  v412,v422, 1080,1920, 468,  0, 2048, 10,     0, NGW3L], // HTC J One
    "SOL22":            [ANDROID,  SONY,     APQ8064,   v412,v422, 1080,1920, 443,  0, 2048, 10,     0, NGW3L], // Xperia UL
    "HTX21":            [ANDROID,  HTC,      APQ8064,   v411,v411,  720,1280, 314,  0, 1024, 10,     0, NGW3L], // INFOBAR A02
    "SHT21":            [ANDROID,  SHARP,    MSM8960,   v404,v412,  800,1280, 216,  0, 1024,  2,     0, NGW3L], // AQUOS PAD
    "HTL21":            [ANDROID,  HTC,      APQ8064,   v411,v411, 1080,1920, 444,  3, 2048, 10,     0, NGW3L], // HTC J Butterfly
    "SCL21":            [ANDROID,  SAMSUNG,  MSM8960,   v404,v412,  720,1280, 306,  0, 2048, 10,     0,  GW3L], // GALAXY SIII Progre
    "CAL21":            [ANDROID,  CASIO,    MSM8960,   v404,v404,  480,800,  236,  0, 1024,  5,     0,  GW3L], // G'zOne TYPE-L
    "SHL21":            [ANDROID,  SHARP,    MSM8960,   v404,v412,  720,1280, 309,  0, 1024,  2,     0,  GW3L], // AUOS PHONE SERIE
    "KYL21":            [ANDROID,  KYOCERA,  MSM8960,   v404,v404,  720,1280, 314,  0, 1024,  5,     0,  GW3L], // DIGNO S
    "FJL21":            [ANDROID,  FUJITSU,  MSM8960,   v404,v404,  720,1280, 342,  2, 1024, 10,     0,  GW3L], // ARROWS ef
    "SOL21":            [ANDROID,  SONY,     MSM8960,   v404,v412,  720,1280, 345,  0, 1024, 10,     0,  GW3L], // Xperia VL
    "LGL21":            [ANDROID,  LG,       APQ8064,   v404,v404,  720,1280, 315,  0, 2048, 10,     0,  GW3L], // Optimus G
    "PTL21":            [ANDROID,  PANTECH,  MSM8960,   v404,v412,  720,1280, 342,  0, 1024,  5,     0,  GW3L], // VEGA
    "ISW13F":           [ANDROID,  FUJITSU,  AP33,      v403,v403,  720,1280, 322,  0, 1024,  3,     0,  GW3 ], // ARROWS Z
    "IS17SH":           [ANDROID,  SHARP,    MSM8655,   v404,v404,  540,960,  240,  0, 1024,  2,     0,  GW3 ], // AQUOS PHONE CL
    "IS15SH":           [ANDROID,  SHARP,    MSM8655,   v404,v404,  540,960,  298,  0, 1024,  2,     0,  GW3 ], // AQUOS PHONE SL
    "ISW16SH":          [ANDROID,  SHARP,    MSM8660A,  v404,v404,  720,1280, 318,  2, 1024,  2,     0,  GW3 ], // AQUOS PHONE SERIE
    "URBANO PROGRESSO": [ANDROID,  KYOCERA,  MSM8655,   v403,v403,  480,800,  235,  0, 1024,  5,     0,  GW3 ],
    "ISW13HT":          [ANDROID,  HTC,      MSM8660A,  v403,v403,  540,960,  204,  0, 1024,  4,     0,  GW3 ], // HTC J
    "IS12S":            [ANDROID,  SONY,     MSM8660,   v237,v404,  720,1280, 342,  0, 1024, 10,     0,  GW3 ], // Xperia acro HD
    "IS12M":            [ANDROID,  MOTOROLA, OMAP4430,  v236,v404,  540,960,  256,  0, 1024, 10,     0,  GW3 ], // MOTOROLA RAZR
    "INFOBAR C01":      [ANDROID,  SHARP,    MSM8655,   v235,v235,  480,854,  309,  0,  512,  2,     0,  GW3 ], // INFOBAR C01
    "ISW11SC":          [ANDROID,  SAMSUNG,  EXYNOS4210,v236,v404,  720,1080, 315,  2, 1024, 10,     0,  GW3 ], // GALAXY SII WiMAX
    "IS11LG":           [ANDROID,  LG,       AP25H,     v237,v404,  480,800,  235,  0, 1024, 10,     0,  GW3 ], // Optimus X
    "IS12F":            [ANDROID,  FUJITSU,  MSM8655,   v235,v235,  480,800,  235,  0,  512,  4,     0,  GW3 ], // ARROWS ES
    "IS14SH":           [ANDROID,  SHARP,    MSM8655,   v235,v235,  540,960,  298,  0,  512,  2,     0,  GW3 ], // AQUOS PHONE
    "IS11N":            [ANDROID,  NEC,      MSM8655,   v235,v235,  480,800,  262,  0,  512,  5,     0,  GW3 ], // MEDIAS BR
    "ISW11F":           [ANDROID,  FUJITSU,  OMAP4430,  v235,v403,  720,1280, 342,  0, 1024,  3,     0,  GW3 ], // ARROWS Z
    "ISW11K":           [ANDROID,  KYOCERA,  MSM8655,   v235,v235,  480,800,  234,  0, 1024, 10,     0,  GW3 ], // DIGNO
    "IS13SH":           [ANDROID,  SHARP,    MSM8655,   v235,v235,  540,960,  258,  0,  512,  2,     0,  GW3 ], // AQUOS PHONE
    "ISW12HT":          [ANDROID,  HTC,      MSM8660,   v234,v403,  540,960,  256,  0, 1024,  4,     0,  GW3 ], // HTC EVO 3D
    "ISW11M":           [ANDROID,  MOTOROLA, T20,       v234,v234,  540,960,  256,  0, 1024,  2,     0,  GW3 ], // MOTOROLA PHOTON
    "EIS01PT":          [ANDROID,  PANTECH,  MSM8655,   v234,v234,  480,800,  254,  0,  512,  5,     0,  GW3 ],
    "IS11PT":           [ANDROID,  PANTECH,  MSM8655,   v234,v234,  480,800,  254,  0,  512,  5,     0,  GW3 ], // MIRACH
    "IS11T":            [ANDROID,  TOSHIBA,  MSM8655,   v234,v234,  480,854,  243,  0,  512,  3,     0,  GW3 ], // REGZA Phone
    "IS11CA":           [ANDROID,  CASIO,    MSM8655,   v233,v233,  480,800,  262,  0,  512,  5,     0,  GW3 ], // G'zOne
    "INFOBAR A01":      [ANDROID,  SHARP,    MSM8655,   v233,v233,  540,960,  265,1.5,  512,  2,     0,  GW3 ], // INFOBAR A01
    "IS12SH":           [ANDROID,  SHARP,    MSM8655,   v233,v233,  540,960,  263,  0,  512,  2,     0,  GW3 ], // AQUOS PHONE
    "IS11SH":           [ANDROID,  SHARP,    MSM8655,   v233,v233,  540,960,  298,  0,  512,  2,     0,  GW3 ], // AQUOS PHONE
    "IS11S":            [ANDROID,  SONY,     MSM8655,   v233,v234,  480,854,  232,  0,  512,  2,     0,  GW3 ], // Xperia acro
    "ISW11HT":          [ANDROID,  HTC,      QSD8650,   v221,v234,  480,800,  254,1.5,  512,  2,     0,  GW3 ], // HTC EVO WiMAX
    "IS06":             [ANDROID,  PANTECH,  QSD8650,   v221,v221,  480,800,  254,1.5,  512,  5,     0,  GW3 ], // SIRIUS alpha
    "IS05":             [ANDROID,  SHARP,    MSM8655,   v221,v234,  480,854,  290,  0,  512,  2,     0,  GW3 ],
    "IS04":             [ANDROID,  TOSHIBA,  QSD8650,   v210,v222,  480,854,  290,  0,  512,  2,     0,  GW3 ],
    "IS03":             [ANDROID,  SHARP,    QSD8650,   v210,v221,  640,960,  331,  2,  512,  2,     0,  GW3 ],
    "IS01":             [ANDROID,  SHARP,    QSD8650,   v160,v160,  480,960,  213,  1,  256,  1,     0,  GW3 ],
//                       [0]       [1]       [2]         [3] [4]    [5]  [6]  [7] [8]   [9]  [10]  [11] [12]
//                       OS.TYPE,  BRAND     SOC         OS.VER     DISP.SIZE PPI DPR   RAM TOUCH  INCH NFC+GPS+WiFi+3G+LTE+CHROMIUM
// --- SoftBank ---
    "X06HT":            [ANDROID,  HTC,      QSD8250,   v210,v220,  480,800,    0,  1,  512,  2,     0,  GW3 ],
    "001HT":            [ANDROID,  HTC,      MSM8255,   v220,v233,  480,800,    0,1.5,  384,  2,     0,  GW3 ],
    "SBM003SH":         [ANDROID,  SHARP,    MSM8255,   v220,v234,  480,800,    0,1.5,  512,  2,     0,  GW3 ],
    "001DL":            [ANDROID,  DELL,     QSD8250,   v220,v220,  480,800,    0,  0,  512,  2,     0,  GW3 ],
    "003Z":             [ANDROID,  ZTE,      MSM7227,   v220,v220,  480,800,    0,  0,  512,  2,     0,  GW3 ], // Libero
    "DM009SH":          [ANDROID,  SHARP,    MSM8255,   v220,v234,  480,800,    0,  0,  512,  2,     0,  GW3 ],
    "SBM005SH":         [ANDROID,  SHARP,    MSM8255,   v221,v221,  480,800,    0,  0,  512,  2,     0,  GW3 ],
    "SBM006SH":         [ANDROID,  SHARP,    MSM8255,   v233,v233,  540,960,    0,  0,  512,  2,     0,  GW3 ],
    "SBM007SH":         [ANDROID,  SHARP,    MSM8255,   v233,v233,  480,854,  288,  0,  512,  2,     0,  GW3 ],
    "SBM007SHJ":        [ANDROID,  SHARP,    MSM8255,   v233,v233,  480,854,  288,  0,  512,  2,     0,  GW3 ],
    "003P":             [ANDROID,  PANASONIC,OMAP3630,  v233,v233,  480,854,    0,  0,  512,  2,     0,  GW3 ],
    "007HW":            [ANDROID,  HUAWEI,   MSM8255,   v234,v234,  480,800,    0,  0,  512,  2,     0,  GW3 ], // Vision
    "SBM009SH":         [ANDROID,  SHARP,    MSM8255,   v234,v234,  540,960,    0,  0,  512,  2,     0,  GW3 ],
    "SBM007SHK":        [ANDROID,  SHARP,    MSM8255,   v233,v233,  480,854,  288,  0,  512,  2,     0,  GW3 ],
    "SBM009SHY":        [ANDROID,  SHARP,    MSM8255,   v234,v234,  540,960,  288,  0,  512,  2,     0,  GW3 ],
    "DM010SH":          [ANDROID,  SHARP,    MSM8255,   v234,v234,  540,960,    0,  0,  512,  2,     0,  GW3 ],
    "SBM101SH":         [ANDROID,  SHARP,    MSM8255,   v235,v235,  480,854,  288,  0,  512,  2,     0,  GW3 ],
    "DM011SH":          [ANDROID,  SHARP,    MSM8255,   v235,v235,  480,854,  288,  0,  512,  2,     0,  GW3 ],
    "SBM102SH":         [ANDROID,  SHARP,    OMAP4430,  v235,v404,  720,1280, 326,  0, 1024,  2,     0,  GW3 ],
    "101P":             [ANDROID,  PANASONIC,OMAP4430,  v235,v235,  480,854,    0,  0, 1024,  2,     0,  GW3 ],
    "101N":             [ANDROID,  NEC,      MSM8255,   v235,v235,  480,800,    0,  0,  512,  2,     0,  GW3 ],
    "SBM103SH":         [ANDROID,  SHARP,    MSM8255,   v235,v235,  540,960,  275,  0,  512,  2,     0,  GW3 ],
    "101K":             [ANDROID,  KYOCERA,  APE5R,     v234,v234,  480,800,    0,  0,  512,  2,     0,  GW3 ],
    "DM012SH":          [ANDROID,  SHARP,    MSM8255,   v235,v235,  540,960,    0,  0,  512,  2,     0,  GW3 ],
    "SBM104SH":         [ANDROID,  SHARP,    OMAP4460,  v403,v403,  720,1280, 326,  0, 1024,  2,     0,  GW3 ],
    "008Z":             [ANDROID,  ZTE,      MSM8255,   v230,v230,  480,800,    0,  0,  512,  2,     0,  GW3 ],
    "101DL":            [ANDROID,  DELL,     MSM8260,   v235,v235,  540,960,    0,  0, 1024,  2,     0,  GW3 ],
    "102P":             [ANDROID,  PANASONIC,OMAP4430,  v235,v235,  540,960,  275,  0, 1024,  2,     0,  GW3 ],
    "WX04K":            [ANDROID,  KYOCERA,  APE5R,     v234,v411,  480,800,    0,  0, 1024,  2,     0,  GW3 ],
    "SBM106SH":         [ANDROID,  SHARP,    MSM8260A,  v404,v404,  720,1280,   0,  0, 1024,  2,     0,  GW3 ],
    "SBM102SH2":        [ANDROID,  SHARP,    OMAP4430,  v235,v404,  720,1280,   0,  0, 1024,  2,     0,  GW3 ],
    "SBM107SH":         [ANDROID,  SHARP,    MSM8255,   v404,v404,  480,854,    0,  0, 1024,  2,     0,  GW3 ],
    "101F":             [ANDROID,  FUJITSU,  MSM8960,   v404,v412,  540,960,    0,  0, 1024,  2,     0,  GW3 ],
    "WX06K":            [ANDROID,  KYOCERA,  APE5R,     v234,v234,  480,800,    0,  0,  512,  2,     0,  GW3 ],
    "009Z":             [ANDROID,  ZTE,      MSM8255,   v234,v234,  480,800,    0,  0,  512,  2,     0,  GW3 ], // STAR7
    "201HW":            [ANDROID,  HUAWEI,   MSM8960,   v400,v400,  540,960,    0,  0, 1024,  2,     0,  GW3 ],
    "SBM107SHB":        [ANDROID,  SHARP,    MSM8255,   v404,v404,  480,854,    0,  0, 1024,  2,     0,  GW3 ],
    "DM013SH":          [ANDROID,  SHARP,    MSM8255,   v404,v404,  480,854,    0,  0, 1024,  2,     0,  GW3 ],
    "SBM200SH":         [ANDROID,  SHARP,    MSM8960,   v404,v410,  720,1280,   0,  0, 1024,  2,     0,  GW3 ],
    "201K":             [ANDROID,  KYOCERA,  MSM8960,   v412,v412,  480,800,    0,  0, 1024,  2,     0,  GW3 ],
    "201F":             [ANDROID,  FUJITSU,  APQ8064,   v412,v412,  720,1280,   0,  0, 2048,  2,     0,  GW3 ],
    "DM014SH":          [ANDROID,  SHARP,    MSM8960,   v404,v412,  720,1280,   0,  0, 1024,  2,     0,  GW3 ],
    "201M":             [ANDROID,  MOTOROLA, MSM8960,   v400,v410,  540,960,    0,  0, 1024,  2,     0,  GW3 ], // Motorola RAZR
    "SBM203SH":         [ANDROID,  SHARP,    APQ8064,   v412,v412,  720,1280,   0,  0, 2048,  2,     0,  GW3 ],
    "SBM204SH":         [ANDROID,  SHARP,    MSM8255,   v404,v404,  480,800,    0,  0, 1024,  2,     0,  GW3 ],
    "SBM205SH":         [ANDROID,  SHARP,    MSM8960,   v412,v412,  480,854,    0,  0, 1024,  2,     0,  GW3 ],
    "SBM206SH":         [ANDROID,  SHARP,    APQ8064T,  v422,v422, 1080,1920,   0,  0, 2048,  2,     0,  GW3 ],
    "202F":             [ANDROID,  FUJITSU,  APQ8064T,  v422,v422, 1080,1920,   0,  0, 2048,  2,     0,  GW3 ],
    "202K":             [ANDROID,  KYOCERA,  MSM8960,   v422,v422,  720,1280, 340,  0, 1024,  2,     0,  GW3 ],
    "WX10K":            [ANDROID,  KYOCERA,  MSM8960,   v422,v422,  720,1280,   0,  0, 1024,  2,     0,  GW3 ],
    "DM015K":           [ANDROID,  KYOCERA,  MSM8960,   v422,v422,  720,1280,   0,  0, 1536,  2,     0,  GW3 ],
    "EM01F":            [ANDROID,  KYOCERA,  APQ8064,   v412,v412,  720,1280,   0,  0, 2048,  2,     0,  GW3 ],
    "204HW":            [ANDROID,  HUAWEI,   MSM8225,   v410,v410,  480,800,    0,  0, 1024,  2,     0,  GW3 ], // for Silver Age
    "WX04SH":           [ANDROID,  KYOCERA,  MSM8260A,  v412,v412,  480,854,    0,  0, 1024,  2,     0,  GW3 ],
    "301F":             [ANDROID,  FUJITSU,  MSM8974,   v422,v422, 1080,1920,   0,  0, 2048,  2,     0,  GW3L],
    "EM01L":            [ANDROID,  GOOGLE,   MSM8974,   v440,v440, 1080,1920, 445,  3, 2048,  5,     0,  GW3 ], // E-Mobile Nexus 5 EM01L
    "DM016SH":          [ANDROID,  SHARP,    MSM8974,   v422,v422, 1080,1920,   0,  0, 1536,  2,     0, NGW3L],
    "SBM302SH":         [ANDROID,  SHARP,    MSM8974,   v422,v422, 1080,1920,   0,  0, 2048,  5,     0, NGW3L],
    "SBM303SH":         [ANDROID,  SHARP,    MSM8974,   v422,v422, 1080,1920,   0,  0, 2048,  5,     0,  GW3L], // AQUOS PHONE Xx mini 303SH
//}@jp
//                       [0]       [1]       [2]         [3] [4]    [5]  [6]  [7] [8]   [9]  [10]  [11] [12]
//                       OS.TYPE,  BRAND     SOC         OS.VER     DISP.SIZE PPI DPR   RAM TOUCH  INCH NFC+GPS+WiFi+3G+LTE+CHROMIUM
/*
// --- Windows Phone 7.5 ---
// https://www.handsetdetection.com/properties/vendormodel/
// http://en.wikipedia.org/wiki/List_of_Windows_Phone_7_devices
    "Allegro":          [WPHONE,   ACER,     MSM8255,   v750,v750,  480,800,  259,  0,  512,  4,     0,  GW3 ],
//  "OneTouchView":     [WPHONE,   ALCATEL,  MSM7227,   v750,v780,  480,800,    0,  0,  512,  4,     0,  GW3 ],
    "IS12T":            [WPHONE,   FUJITSU,  MSM8655,   v750,v750,  480,800,    0,  0,  512,  4,     0,  GW3 ],
    "Radar":            [WPHONE,   HTC,      MSM8255,   v750,v750,  480,800,  246,  0,  512,  4,     0,  GW3 ],
    "P6800":            [WPHONE,   HTC,      MSM8255T,  v750,v750,  480,800,  198,  0,  512,  4,     0,  GW3 ], // Titan
    "PI86100":          [WPHONE,   HTC,      MSM8255T,  v750,v750,  480,800,  198,  0,  512,  4,     0,  GW3L], // Titan II
    "Lumia 510":        [WPHONE,   NOKIA,    MSM7227,   v750,v750,  480,800,    0,  0,  256,  4,     0,  GW3 ],
    "Lumia 610":        [WPHONE,   NOKIA,    MSM7227,   v750,v750,  480,800,    0,  0,  256,  4,     0,  GW3 ],
    "Lumia 710":        [WPHONE,   NOKIA,    MSM8255,   v750,v750,  480,800,    0,  0,  512,  4,     0,  GW3 ],
    "Lumia 800":        [WPHONE,   NOKIA,    MSM8255,   v750,v750,  480,800,    0,  0,  512,  4,     0,  GW3 ],
    "Lumia 900":        [WPHONE,   NOKIA,    APQ8055,   v750,v750,  480,800,    0,  0,  512,  4,     0,  GW3 ],
    "SGH-i667":         [WPHONE,   SAMSUNG,  MSM8255T,  v750,v750,  480,800,  233,  0,  512,  4,     0,  GW3 ], // Focus 2
    "SGH-i937":         [WPHONE,   SAMSUNG,  MSM8255,   v750,v750,  480,800,  217,  0,  512,  4,     0,  GW3 ], // Focus S
    "GT-S7530":         [WPHONE,   SAMSUNG,  MSM7227,   v750,v750,  480,800,  233,  0,  384,  4,     0,  GW3 ], // Omnia M
    "GT-I8350":         [WPHONE,   SAMSUNG,  MSM8255,   v750,v750,  480,800,  252,  0,  512,  4,     0,  GW3 ], // Omnia W
    "Orbit":            [WPHONE,   ZTE,      MSM7227,   v750,v750,  480,800,  233,  0,  512,  4,     0,  GW3 ],
    "Tania":            [WPHONE,   ZTE,      MSM8255,   v750,v750,  480,800,  217,  0,  512,  4,     0,  GW3 ],
 */
//                       [0]       [1]       [2]         [3] [4]    [5]  [6]  [7] [8]   [9]  [10]  [11] [12]
//                       OS.TYPE,  BRAND     SOC         OS.VER     DISP.SIZE PPI DPR   RAM TOUCH  INCH NFC+GPS+WiFi+3G+LTE+CHROMIUM
// --- Windows Phone 8 ---
// http://en.wikipedia.org/wiki/List_of_Windows_Phone_8_devices
    "8S":               [WPHONE,   HTC,      MSM8627,   v800,v800,  480,800,    0,  0,  512,  4,     0,  GW3 ],
    "8X":               [WPHONE,   HTC,      MSM8960,   v800,v800,  720,1280, 342,  0, 1024,  4,     0, NGW3 ],
    "8XT":              [WPHONE,   HTC,      MSM8930,   v800,v800,  480,800,    0,  0, 1024,  4,     0, NGW3 ],
    "W1-U00":           [WPHONE,   HUAWEI,   MSM8230,   v800,v800,  480,800,    0,  0,  512,  4,     0,  GW3 ], // Ascend W1
    "W2-U00":           [WPHONE,   HUAWEI,   MSM8230,   v800,v800,  480,800,    0,  0,  512,  4,     0,  GW3 ], // Ascend W2
    "Lumia 520":        [WPHONE,   NOKIA,    MSM8227,   v800,v800,  480,800,  235,  0,  512,  4,     0,  GW3 ],
    "Lumia 525":        [WPHONE,   NOKIA,    MSM8227,   v800,v800,  480,800,  235,  0, 1024,  4,     0,  GW3 ],
    "Lumia 620":        [WPHONE,   NOKIA,    MSM8960,   v800,v800,  480,800,  246,  0,  512,  4,     0, NGW3 ],
    "Lumia 625":        [WPHONE,   NOKIA,    MSM8930,   v800,v800,  480,800,  201,  0,  512,  4,     0,  GW3L],
    "Lumia 720":        [WPHONE,   NOKIA,    MSM8227,   v800,v800,  480,800,  217,  0,  512,  4,     0, NGW3 ],
    "Lumia 810":        [WPHONE,   NOKIA,    MSM8260A,  v800,v800,  480,800,  217,  0,  512,  4,     0, NGW3 ],
    "Lumia 820":        [WPHONE,   NOKIA,    MSM8960,   v800,v800,  480,800,  217,  0, 1024,  4,     0, NGW3L],
    "Lumia 822":        [WPHONE,   NOKIA,    MSM8960,   v800,v800,  480,800,  217,  0, 1024,  4,     0, NGW3L],
    "Lumia 920":        [WPHONE,   NOKIA,    MSM8960,   v800,v800,  768,1280, 334,  0, 1024,  4,     0, NGW3L],
    "Lumia 925":        [WPHONE,   NOKIA,    MSM8960,   v800,v800,  768,1280, 334,  0, 1024,  4,     0, NGW3L],
    "Lumia 928":        [WPHONE,   NOKIA,    MSM8960,   v800,v800,  768,1280, 334,  0, 1024,  4,     0, NGW3L],
    "Lumia 1020":       [WPHONE,   NOKIA,    MSM8960,   v800,v800,  768,1280, 334,  0, 2048,  4,     0, NGW3L],
    "Lumia 1320":       [WPHONE,   NOKIA,    MSM8930,   v800,v800,  768,1280, 245,  0, 1024,  4,     0,  GW3L], // SoC 8930AB -> MSM8930
    "Lumia 1520":       [WPHONE,   NOKIA,    MSM8974,   v800,v800, 1080,1920, 367,  0, 2048,  4,     0, NGW3L], // SoC 8974AA -> MSM8974
    "GT-I8750":         [WPHONE,   SAMSUNG,  MSM8960,   v800,v800,  720,1280, 306,  0, 1024,  4,     0, NGW3 ], // ATIV S
    "SGH-T899M":        [WPHONE,   SAMSUNG,  MSM8960,   v800,v800,  720,1280, 306,  0, 1024,  4,     0, NGW3 ], // ATIV S
    "SPH-I800":         [WPHONE,   SAMSUNG,  MSM8930,   v800,v800,  720,1280, 308,  0, 1024,  4,     0, NGW3L], // ATIV S Neo, SoC MSM8930AA -> MSM8930
    "SCH-I930":         [WPHONE,   SAMSUNG,  MSM8960,   v800,v800,  480,800,  233,  0, 1024,  4,     0, NGW3L], // ATIV Odyssey
//                       [0]       [1]       [2]         [3] [4]    [5]  [6]  [7] [8]   [9]  [10]  [11] [12]
//                       OS.TYPE,  BRAND     SOC         OS.VER     DISP.SIZE PPI DPR   RAM TOUCH  INCH NFC+GPS+WiFi+3G+LTE+CHROMIUM
// --- Game Console ---
    "PS 4":             [GAME,     SONY,     HIGHSPEC,  v000,v000,    0,0,      0,  0, 8192,  0,     0,   W  ], // PlayStation 4
    "PS 3":             [GAME,     SONY,     HIGHSPEC,  v000,v000,    0,0,      0,  0,  256,  0,     0,   W  ], // PlayStation 3
    "PS Vita":          [GAME,     SONY,     A5X,       v000,v000,  544,960,  220,  0,  512,  5,     0,  GW3 ], // PlayStation Vita -> Soc: CXD5315GG, ARM, 1.2GHz, 4Core, PowerVR, SGX543MP4+
    "PSP":              [GAME,     SONY,     LOWSPEC,   v000,v000,    0,0,      0,  0,   64,  0,     0,   W  ], // PlayStation Portable
    "Xbox One":         [GAME,     MICROSOFT,HIGHSPEC,  v000,v000,    0,0,      0,  0, 8192,  0,     0,   W  ], // Xbox One
    "Xbox 360":         [GAME,     MICROSOFT,HIGHSPEC,  v000,v000,    0,0,      0,  0,  512,  0,     0,   W  ], // Xbox 360
    "Wii U":            [GAME,     NINTENDO, HIGHSPEC,  v000,v000,    0,0,      0,  0, 2048,  0,     0,   W  ], // Wii U
    "Wii":              [GAME,     NINTENDO, LOWSPEC,   v000,v000,    0,0,      0,  0,   64,  0,     0,   W  ], // Wii
    "3DS":              [GAME,     NINTENDO, LOWSPEC,   v000,v000,    0,0,      0,  0,   64,  0,     0,   W  ]  // 3DS
};

// --- device revision ---
DEVICE_CATALOG["Nexus 7"]["hook"] = function(deviceID, emulate) {
    return ((emulate || global)["devicePixelRatio"] || 1) === 2 ? "Nexus 7 (2013)" // Nexus 7 (2013)
                                                                : "Nexus 7";       // Nexus 7 (2012)
};

var SOC_CATALOG = {
//                [0]    [1]   [2]    [3]       [4]
//                TYPE   CPU   CPU    GPU,      GPU
//                       CLOCK CORES  TYPE      ID
// --- Snapdragon ---
// http://en.wikipedia.org/wiki/Snapdragon_(system_on_chip)
//
//
    "MSM8974AB":  [ARM,  2.3,  4,     ADRENO,   "---"           ],
    "APQ8074":    [ARM,  2.2,  4,     ADRENO,   "330"           ],
    "MSM8974":    [ARM,  2.2,  4,     ADRENO,   "330"           ],
    "MSM8930":    [ARM,  1.2,  2,     ADRENO,   "305"           ],
    "APQ8064T":   [ARM,  1.7,  4,     ADRENO,   "320"           ],
    "APQ8064":    [ARM,  1.5,  4,     ADRENO,   "320"           ],
    "MSM8960":    [ARM,  1.5,  2,     ADRENO,   "225"           ],
    "MSM8660A":   [ARM,  1.5,  2,     ADRENO,   "225"           ],
    "MSM8260A":   [ARM,  1.5,  2,     ADRENO,   "225"           ],
    "APQ8060":    [ARM,  1.2,  2,     ADRENO,   "220"           ],
    "MSM8660":    [ARM,  1.2,  2,     ADRENO,   "220"           ],
    "MSM8655":    [ARM,  1.0,  1,     ADRENO,   "205"           ],
    "MSM8627":    [ARM,  1.0,  2,     ADRENO,   "305"           ],
    "MSM8260":    [ARM,  1.7,  2,     ADRENO,   "220"           ],
    "MSM8255T":   [ARM,  1.4,  1,     ADRENO,   "205"           ],
    "MSM8255":    [ARM,  1.0,  1,     ADRENO,   "205"           ],
    "MSM8230":    [ARM,  1.2,  2,     ADRENO,   "305"           ],
    "MSM8227":    [ARM,  1.0,  2,     ADRENO,   "305"           ],
    "MSM7230":    [ARM,  0.8,  1,     ADRENO,   "205"           ],
    "APQ8055":    [ARM,  1.4,  1,     ADRENO,   "205"           ],
    "MSM8225":    [ARM,  1.2,  1,     ADRENO,   "203"           ],
    "QSD8650":    [ARM,  1.0,  1,     ADRENO,   "200"           ],
    "QSD8250":    [ARM,  1.0,  1,     ADRENO,   "200"           ],
    "MSM7227":    [ARM,  0.6,  1,     ADRENO,   "200"           ],
// --- Tegra ---
// http://en.wikipedia.org/wiki/Tegra
    "T30L":       [ARM,  1.3,  4,     TEGRA,    "T30L"          ],
    "AP37":       [ARM,  1.7,  4,     TEGRA,    "AP37"          ],
    "AP33":       [ARM,  1.5,  4,     TEGRA,    "AP33"          ],
    "AP25H":      [ARM,  1.2,  2,     TEGRA2,   "AP25"          ],
    "T20":        [ARM,  1.0,  2,     TEGRA2,   "T20"           ],
// --- OMAP ---
// http://en.wikipedia.org/wiki/OMAP
    "OMAP4460":   [ARM,  1.2,  2,     POWERVR,  "SGX540"        ],
    "OMAP4430":   [ARM,  1.2,  2,     POWERVR,  "SGX540"        ],
    "OMAP3630":   [ARM,  1.0,  1,     POWERVR,  "SGX530"        ],
// --- Samsung, Exynos ---
// http://ja.wikipedia.org/wiki/Exynos
    "Exynos5250": [ARM,  1.7,  2,     MALI,     "T604"          ],
    "Exynos4412": [ARM,  1.4,  4,     MALI,     "400 MP4"       ],
    "Exynos4210": [ARM,  1.2,  2,     MALI,     "400 MP4"       ],
    "S5PC110":    [ARM,  1.0,  1,     POWERVR,  "SGX540"        ],
    "S5PC100":    [ARM,  0.6,  1,     POWERVR,  "SGX535"        ], // iPhone 3GS, iPod touch 3
    "S5L8900":    [ARM,  0.4,  1,     POWERVR,  "MBX Lite"      ], // iPhone 3G, ARMv6
// --- HiSilicon ---
    "K3V2T":      [ARM,  1.2,  4,     IMMERSION,"Immersion.16"  ],
    "K3V2":       [ARM,  1.2,  4,     IMMERSION,"Immersion.16"  ],
// --- R-Mobile ---  
    "APE5R":      [ARM,  1.2,  2,     POWERVR,  "SGX543MP"      ],
// --- Apple ---
    "A7":         [ARM64,1.3,  2,     POWERVR,  "G6430"         ],
    "A6X":        [ARM,  1.4,  2,     POWERVR,  "SGX554MP4"     ],
    "A6":         [ARM,  1.3,  2,     POWERVR,  "SGX543MP3"     ],
    "A5X":        [ARM,  1.0,  2,     POWERVR,  "SGX543MP4"     ],
    "A5":         [ARM,  0.8,  2,     POWERVR,  "SGX543MP2"     ],
    "A4":         [ARM,  0.8,  1,     POWERVR,  "SGX535"        ],
    "HighSpec":   ["",   2.0,  4,     POWERVR,  ""              ],
    "LowSpec":    ["",   0.5,  1,     POWERVR,  ""              ]
};

//{@assert
function _if(booleanValue, errorMessageString) {
    if (booleanValue) {
        throw new Error(errorMessageString);
    }
}
//}@assert

// --- export ----------------------------------------------
//{@node
if (inNode) {
    module["exports"] = Device;
}
//}@node
global["Device"] ? (global["Device_"] = Device) // already exsists
                 : (global["Device"]  = Device);

})(this.self || global);

