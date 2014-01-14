// @name: Device.js

(function(global) {

// --- define ----------------------------------------------
// --- variable --------------------------------------------
// --- interface -------------------------------------------
function Device(userAgent, // @arg UserAgentString(= navigator.userAgent):
                emulate) { // @arg Object(= null): emulate spec values. { screen:Object, devicePixelRatio }
                           //   emulate.screen.width     - Integer(= 0):
                           //   emulate.screen.height    - Integer(= 0):
                           //   emulate.devicePixelRatio - Number(= 0):
                           // @ret SpecObject: { DEVICE, OS, CPU, GPU, INPUT,
                           //                    MEMORY, DISPLAY, NETWORK, BROWSER }
                           // @help: Device
//{@assert
    if (userAgent !== undefined) {
        _if(typeof userAgent !== "string", "invalid Device(userAgent,)");
    }
    if (emulate !== undefined) {
        _if(emulate.constructor !== ({}).constructor, "invalid Device(,emulate)");
    }
//}@assert

    userAgent = userAgent || (global["navigator"] || {})["userAgent"] || "";

    return _detectDeviceSpec(userAgent, emulate || null);
}

Device["name"] = "Device";
Device["repository"] = "https://github.com/uupaa/Device.js";
Device["SOC_CATALOG"] = SOC_CATALOG;
Device["DEVICE_CATALOG"] = DEVICE_CATALOG;
Device["createSpecObject"] = Device_createSpecObject;
Device["createSpecObjectById"] = Device_createSpecObjectById;

// --- implement -------------------------------------------
function Device_createSpecObject() { // @ret SpecObject: { DEVICE, OS, CPU, GPU, INPUT,
                                     //                    MEMORY, DISPLAY, NETWORK, BROWSER }
    return {
        "DEVICE": {
            valueOf: function() { return this.ID; },
            "ID":    "",        // Device ID.
            "MAYBE": false,     // Maybe Device ID.
            "BRAND": "",        // Device brand or maker name. eg: "Google", "SONY"
            "SOC":   "",        // System on chip name. eg: "MSM8974"
            "GPS":   false      // GPS enable.
        },
        "OS": {
            valueOf: _typeValueOf,
            "TYPE":  "",        // OS type. "Android" or "iOS" or "Windows Phone"
            "VERSION": {
                valueOf: function() { return this.CURRENT.valueOf(); },
                "CURRENT": {    // Current OS Version
                    "MAJOR": 0,
                    "MINOR": 0,
                    "PATCH": 0,
                    valueOf: _versionValueOf
                },
                "PRE": {        // Pre-installed OS Version.
                    "MAJOR": 0,
                    "MINOR": 0,
                    "PATCH": 0,
                    valueOf: _versionValueOf
                },
                "HIGHEST": {    // Highest Supported OS Version.
                    "MAJOR": 0,
                    "MINOR": 0,
                    "PATCH": 0,
                    valueOf: _versionValueOf
                }
            }
        },
        "CPU": {
            valueOf: _typeValueOf,
            "TYPE":  "",        // CPU type. "ARM", "ARM64", "ATOM"
            "CLOCK": 0.0,       // CPU clock (unit: GHz). eg: 1.7
            "CORES": 0,         // CPU cores. eg: 2 (dual core)
            "SIMD":  false      // Enable SIMD (aka ARM-NEON).
        },
        "GPU": {
            valueOf: _typeValueOf,
            "TYPE":  "",        // GPU type. eg: "Adreno"
            "ID":    ""         // GPU ID. eg: "330"
        },
        "INPUT": {
            "TOUCH": false,     // Touch enable.
            "TOUCHES": 0        // Touch points.
        },
        "MEMORY": {
            "RAM":   0.0        // RAM size (unit: GB).
        },
        "DISPLAY": {
            "PPI":   0,         // Display pixel per inch.
            "DPR":   0.0,       // Device pixel ratio.
            "LONG":  0,         // Display long edge.
            "SHORT": 0          // Display short,edge.
        },
        "NETWORK": {
            "3G":    false,     // Enable 3G.
            "LTE":   false,     // Enable LTE.
            "NFC":   false,     // Enable NFC.
            "WIFI":  false      // Enable Wi-Fi.
        },
        "BROWSER": {
            valueOf: function() { return this.USER_AGENT; },
            "USER_AGENT": ""
        }
    };
}

function Device_createSpecObjectById(id) { // @arg String: device-id
                                           // @ret SpecObject: { DEVICE, OS, CPU, ... }
    var specObject = Device_createSpecObject();
    var specData   = DEVICE_CATALOG[id];
    var socCatalog = SOC_CATALOG[ specData[2] ];

    specObject["DEVICE"]["ID"]             = id;
    specObject["DEVICE"]["MAYBE"]          = _maybeDevice(id);
    specObject["DEVICE"]["BRAND"]          = specData[1];
    specObject["DEVICE"]["SOC"]            = specData[2];
    specObject["DEVICE"]["GPS"]            = /GPS/.test(specData[11]);
    specObject["OS"]["VERSION"]["PRE"]     = _parseVersionNumber(specData[3]);
    specObject["OS"]["VERSION"]["HIGHEST"] = _parseVersionNumber(specData[4]);
    specObject["CPU"]["TYPE"]              = socCatalog[0];
    specObject["CPU"]["CLOCK"]             = socCatalog[1];
    specObject["CPU"]["CORES"]             = socCatalog[2];
    specObject["CPU"]["SIMD"]              = socCatalog[3] !== "Tegra2"; // Tegra2 NEON unsupported
    specObject["GPU"]["TYPE"]              = socCatalog[3];
    specObject["GPU"]["ID"]                = socCatalog[4];
    specObject["INPUT"]["TOUCH"]           = !!specData[10]; // to Boolean value
    specObject["INPUT"]["TOUCHES"]         = specData[10];
    specObject["MEMORY"]["RAM"]            = specData[9];
    specObject["DISPLAY"]["PPI"]           = specData[7];
    specObject["DISPLAY"]["DPR"]           = specData[8];
    specObject["DISPLAY"]["LONG"]          = Math.max(specData[5], specData[6]);
    specObject["DISPLAY"]["SHORT"]         = Math.min(specData[5], specData[6]);
    specObject["NETWORK"]["3G"]            = /3G/.test(specData[11]);
    specObject["NETWORK"]["LTE"]           = /LTE/.test(specData[11]);
    specObject["NETWORK"]["NFC"]           = /NFC/.test(specData[11]);
    specObject["NETWORK"]["WIFI"]          = /WIFI/.test(specData[11]);

    return specObject;
}

function _detectDeviceSpec(userAgent, // @arg UserAgentString:
                           emulate) { // @arg Object(= null): emulate spec values. { screen:Object, devicePixelRatio }
                                      // @ret SpecObject: device spec object.
                                      // @desc: detect device spec.

    // "Mozilla/5.0 (Linux; U; Android 4.0.4; ja-jp; SonySO-04D Build/7.0.D.1.117)..."
    //                                                   ~~~~~~
    //                                                  device id
    //
    var os = ""; // OS.TYPE, "Android", "iOS", "Windows Phone"
    var id = ""; // device-id

    if ( /Android/.test(userAgent) ) {
        os = ANDROID;
        id = _getAndroidDevice(userAgent, emulate);
    } else if ( /iPhone|iPad|iPod/.test(userAgent) ) {
        os = IOS;
        id = _getiOSDevice(userAgent, emulate);
    } else if ( /Windows Phone/.test(userAgent) ) {
        os = WPHONE;
        id = _getWindowsPhoneDevice(userAgent, emulate);
    }

    var specData = DEVICE_CATALOG[id] || null; // Array. ["ISW13HT": [ANDROID, HTC, MSM8660A, ...] ]

    if (specData) {
        if (specData["hook"]) { // has hook function.
            id = specData["hook"](id, emulate); // overwrite device id. "Nexus 7" -> "Nexus 7 (2013)"
        }
    }

    var specObject = specData ? Device_createSpecObjectById(id)
                              : Device_createSpecObject();

    specObject["OS"]["TYPE"]               = os;
    specObject["OS"]["VERSION"]["CURRENT"] = _parseVersionNumber(_getCurrentOSVersion(userAgent));
    specObject["BROWSER"]["USER_AGENT"]    = userAgent;
    return specObject;
}

function _getAndroidDevice(userAgent, // @arg String:
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

function _getiOSDevice(userAgent, // @arg String:
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
//  var airPlay = !!global["WebKitPlaybackTargetAvailabilityEvent"]; // AirPlay API. iPhone4s++. iPad2++, iPad mini++, iPod touch 5++
//  var iOSVersion = parseFloat( userAgent.split(/OS /)[1].replace(/_/g, ".") );

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

function _maybeDevice(device) { // @arg String:
                                // @ret Boolean:
    return /iPad 2|iPad 3|iPhone 4|iPhone 5|iPod touch 5/.test(device);
}

function _getWindowsPhoneDevice(userAgent, // @arg String:
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

function _getCurrentOSVersion(userAgent) { // @arg UserAgentString:
                                           // @ret VersionNumber: 999 or 9999

    // Mozilla/5.0 (Linux; U; Android 2.2;   ja-jp; INFOBAR A01        Build/S9081)       AppleWebKit/533.1  (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1
    // Mozilla/5.0 (Linux; U; Android 2.3.3; ja-jp; INFOBAR A01        Build/S9081)       AppleWebKit/533.1  (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1
    //                                ~~~~~
    //                                | | +-- Patch
    //                                | +---- Minor
    //                                +------ Major
    //
    // Mozilla/5.0 (iPhone; CPU iPhone OS 6_0   like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25
    // Mozilla/5.0 (iPod;   CPU iPhone OS 5_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A405 Safari/7534.48.3
    //                                    ~~~~~
    //                                    | | +-- Patch
    //                                    | +---- Minor
    //                                    +------ Major
    var major = 0;
    var minor = 0;
    var patch = 0;
    var ver = null;

    if ( /iPhone|iPad|iPod/.test(userAgent) ) {
        ver = userAgent.split(/OS /)[1].split(" ")[0].split("_");
    } else if ( /Android/.test(userAgent) ) {
        ver = userAgent.split("Android")[1].split(";")[0].split(".");
    } else if ( /Windows Phone/.test(userAgent) ) {
        ver = userAgent.split(/Windows Phone (?:OS )?/)[1].split(";")[0].split(".");
    }
    if (ver) {
        major = parseInt(ver[0]) * 100;
        minor = parseInt(ver[1]) * 10;
        patch = parseInt(ver[2] || 0);
    }
    return parseInt(major + minor + patch);
}

function _parseVersionNumber(version) { // @arg VersionInteger: 3 or 4 digits number. eg: 442, 3106
                                        // @ret DeviceVersionNumberObject: { MAJOR, MINOR, PATCH, valueOf }
                                        //          MAJOR - Integer: OS Major version.
                                        //          MINOR - Integer: OS Minor version.
                                        //          PATCH - Integer: OS Patch version.
                                        //          valueOf - Function:
    // parse os version number:
    //    987 -> { VERSION:  9.8, MAJOR:  9, MINOR: 8, PATCH: 7 }
    //   9876 -> { VERSION: 98.7, MAJOR: 98, MINOR: 7, PATCH: 6 }

    var digits = null, major = 0, minor = 0, patch = 0;

    if (version < 1000) {
        digits = (1000 + version).toString().slice(-3).slice(""); // 12 -> "012" -> ["0", "1", "2"]
        major  = +digits[0]; // "0" -> 0
        minor  = +digits[1]; // "1" -> 1
        patch  = +digits[2]; // "2" -> 2
    } else {
        digits = version.toString().slice(""); // 1234 -> ["1", "2", "3", "4"]
        major  = +(digits[0] + digits[1]);     // "12" -> 12
        minor  = +digits[2];                   // "3"  -> 3
        patch  = +digits[3];                   // "4"  -> 4
    }
    return { "valueOf": _versionValueOf, "MAJOR": major, "MINOR": minor, "PATCH": patch };
}

function _versionValueOf() {
    return parseFloat(this["MAJOR"] + "." + this["MINOR"]);
}

function _typeValueOf() {
    return this["TYPE"];
}

// --- const variable --------------------------------------
// --- OS TYPE ---
var IOS         = "iOS";
var ANDROID     = "Android";
var WPHONE      = "Windows Phone";
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

// --- SoC ---
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

// --- database --------------------------------------------
var DEVICE_CATALOG = {
//                       [0]       [1]       [2]        [3] [4]   [5]  [6]  [7] [8]   [9]  [10]   [11]
//                       OS.TYPE,  BRAND     SOC        OS.VER    DISP.SIZE PPI DPR   RAM TOUCH NFC+GPS+WiFi+3G+LTE
// --- Apple ---
    "iPod touch 3":     [IOS,      APPLE,    S5PC100,   310,511,  640,960,  326,  2,0.125,  5,     W  ], // iPod touch 8GB Model
  //"iPod touch 3":     [IOS,      APPLE,    CortexA8,  310,511,  640,960,  326,  2, 0.25,  5,     W  ], // iPod touch 32/64GB Model
    "iPod touch 4":     [IOS,      APPLE,    A4,        410,615,  640,960,  326,  2, 0.25,  5,     W  ],
    "iPod touch 5":     [IOS,      APPLE,    A5,        600,0,    640,1136, 326,  2,  0.5,  5,     W  ],
    "iPhone 3G":        [IOS,      APPLE,    S5L8900,   200,421,  320,480,  163,  1,0.125,  5,    GW3 ],
    "iPhone 3GS":       [IOS,      APPLE,    S5PC100,   300,615,  320,480,  163,  1, 0.25,  5,    GW3 ],
    "iPhone 4":         [IOS,      APPLE,    A4,        400,0,    640,960,  326,  2,  0.5,  5,    GW3 ],
    "iPhone 4S":        [IOS,      APPLE,    A5,        511,0,    640,960,  326,  2,  0.5,  5,    GW3 ],
    "iPhone 5":         [IOS,      APPLE,    A6,        600,0,    640,1136, 326,  2,    1,  5,    GW3L],
    "iPhone 5c":        [IOS,      APPLE,    A6,        700,0,    640,1136, 326,  2,    1,  5,    GW3L],
    "iPhone 5s":        [IOS,      APPLE,    A7,        700,0,    640,1136, 326,  2,    1,  5,    GW3L],
    "iPad 1":           [IOS,      APPLE,    A4,        320,615,  768,1024, 132,  1, 0.25, 10,    GW  ],
    "iPad 2":           [IOS,      APPLE,    A5,        430,0,    768,1024, 132,  1,  0.5, 10,    GW3 ],
    "iPad 3":           [IOS,      APPLE,    A5X,       510,0,   1536,2048, 264,  2,    1, 10,    GW3 ],
    "iPad 4":           [IOS,      APPLE,    A6X,       600,0,   1536,2048, 264,  2,    1, 10,    GW3L],
    "iPad Air":         [IOS,      APPLE,    A7,        700,0,   1536,2048, 264,  2,    1, 10,    GW3L],
    "iPad mini":        [IOS,      APPLE,    A5,        600,0,    768,1024, 132,  2,  0.5, 10,    GW3 ],
    "iPad mini Retina": [IOS,      APPLE,    A7,        700,0,   1536,2048, 326,  2,    1, 10,    GW3L],
// --- Google ---
    "Nexus One":        [ANDROID,  GOOGLE,   QSD8250,   210,236,  480,800,  252,1.5,  0.5,  2,     GW3 ],
    "Nexus S":          [ANDROID,  GOOGLE,   S5PC110,   232,410,  480,800,    0,1.5,  0.5,  5,    NGW3 ],
    "Galaxy Nexus":     [ANDROID,  GOOGLE,   OMAP4460,  400,422,  720,1280, 316,  2,    1,  2,    NGW3L], // LTE (partial)
    "Nexus 4":          [ANDROID,  GOOGLE,   APQ8064,   420,0,    768,1280, 318,  2,    2,  5,    NGW3L],
    "Nexus 5":          [ANDROID,  GOOGLE,   MSM8974,   440,0,   1080,1920, 445,  3,    2,  5,    NGW3L],
    "Nexus 7":          [ANDROID,  GOOGLE,   T30L,      411,0,    800,1280, 216,.33 ,   1,  5,    NGW3L],
    "Nexus 7 (2013)":   [ANDROID,  GOOGLE,   APQ8064,   430,0,   1200,1920, 323,  2,    2,  5,    NGW3L],
    "Nexus 10":         [ANDROID,  GOOGLE,   EXYNOS5250,420,0,   1600,2560, 300,  2,    2,  5,    NGW  ],
// --- docomo ---
// http://spec.nttdocomo.co.jp/spmss/
    "L-01F":            [ANDROID,  LG,       MSM8974,   422,422, 1080,1776, 480,  0,    2,  5,    NGW3L],
    "SC-01F":           [ANDROID,  SAMSUNG,  MSM8974,   430,433, 1080,1920, 480,  0,    2,  5,    NGW3L],
    "SC-02F":           [ANDROID,  SAMSUNG,  MSM8974,   430,430, 1080,1920, 480,  0,    2,  5,    NGW3L],
    "SH-01F":           [ANDROID,  SHARP,    MSM8974,   422,422, 1080,1776, 480,  0,    2,  5,    NGW3L],
    "SH-01FDQ":         [ANDROID,  SHARP,    MSM8974,   422,422, 1080,1776, 480,  0,    2,  5,    NGW3L],
    "SH-02F":           [ANDROID,  SHARP,    MSM8974,   422,0,   1080,1920, 487,  0,    2,  5,    NGW3L],
    "SH-03F":           [ANDROID,  SHARP,    MSM8960,     0,0,    540,960,    0,  0,    0,  5,    NGW3L], // JUNIOR 2 (no Google Play)
    "SO-01F":           [ANDROID,  SONY,     MSM8974,   422,422, 1080,1776, 480,  3,    2,  5,    NGW3L], // Xperia Z1
    "SO-02F":           [ANDROID,  SONY,     MSM8974,   422,422,  720,1184, 320,  0,    2,  5,    NGW3L],
    "F-01F":            [ANDROID,  FUJITSU,  MSM8974,   422,422, 1080,1776, 480,  0,    2,  5,    NGW3L],
    "F-02F":            [ANDROID,  FUJITSU,  MSM8974,   422,422, 1504,2560, 320,  0,    2,  5,    NGW3L],
    "F-03F":            [ANDROID,  FUJITSU,  MSM8974,   422,422,  720,1184, 320,  0,    2,  5,    NGW3L],
    "F-04F":            [ANDROID,  FUJITSU,  APQ8064T,  422,422,  540,888,  240,  0,    2,  5,     GW3 ],
    "L-05E":            [ANDROID,  LG,       APQ8064T,  422,422,  720,1280, 320,  0,    2,  5,    NGW3L],
    "N-06E":            [ANDROID,  NEC,      APQ8064T,  422,422,  720,1184, 320,  0,    2,  5,    NGW3L],
    "SC-04E":           [ANDROID,  SAMSUNG,  APQ8064T,  422,422, 1080,1920, 480,  0,    2,  5,    NGW3L],
    "SO-04E":           [ANDROID,  SONY,     APQ8064,   412,422,  720,1184, 320,  0,    2,  5,    NGW3L],
    "SO-04EM":          [ANDROID,  SONY,     APQ8064,   422,422,  720,1184, 320,  0,    2,  5,    NGW3L],
    "SH-06E":           [ANDROID,  SHARP,    APQ8064T,  422,422, 1080,1920, 480,  0,    2,  5,    NGW3L],
    "SH-07E":           [ANDROID,  SHARP,    APQ8064T,  422,422,  720,1280, 320,  0,    2,  2,    NGW3L],
    "SH-08E":           [ANDROID,  SHARP,    APQ8064T,  422,422, 1200,1824, 320,  0,    2,  5,    NGW3L],
    "P-03E":            [ANDROID,  PANASONIC,APQ8064T,  422,422, 1080,1920, 480,  0,    2,  5,    NGW3L],
    "F-06E":            [ANDROID,  FUJITSU,  APQ8064T,  422,422, 1080,1776, 480,  0,    2,  5,    NGW3L],
    "F-07E":            [ANDROID,  FUJITSU,  APQ8064T,  422,422,  720,1184, 320,  0,    2,  5,    NGW3L],
    "F-08E":            [ANDROID,  FUJITSU,  APQ8064T,  422,422,  540,867,  240,  0,    2,  5,     GW3L],
    "F-09E":            [ANDROID,  FUJITSU,  APQ8064T,  422,422,  540,888,  240,  0,    2,  5,     GW3L],
    "L-01E":            [ANDROID,  LG,       APQ8064,   404,412,  720,1280, 320,  0,    2,  5,     GW3L],
    "L-02E":            [ANDROID,  LG,       MSM8960,   404,412,  720,1280, 320,  0,    1,  5,     GW3L],
    "L-04E":            [ANDROID,  LG,       APQ8064T,  412,412, 1080,1920, 480,  0,    2,  5,    NGW3L],
    "N-02E":            [ANDROID,  NEC,      MSM8960,   404,412,  480,800,  240,  0,    1,  5,     GW3L],
    "N-03E":            [ANDROID,  NEC,      APQ8064,   404,412,  720,1280, 320,  0,    2,  5,     GW3L],
    "N-04E":            [ANDROID,  NEC,      APQ8064,   412,412,  720,1280, 320,  0,    2,  5,     GW3L],
    "N-05E":            [ANDROID,  NEC,      MSM8960,   412,412,  540,960,  240,  0,    1,  5,     GW3L],
    "SC-01E":           [ANDROID,  SAMSUNG,  APQ8060,   404,404,  800,1280, 160,  0,    1,  5,     GW3L],
    "SC-02E":           [ANDROID,  SAMSUNG,  EXYNOS4412,411,411,  720,1280, 320,  0,    2,  5,     GW3L],
    "SC-03E":           [ANDROID,  SAMSUNG,  EXYNOS4412,411,411,  720,1280, 320,  0,    2,  5,     GW3L],
    "SH-01E":           [ANDROID,  SHARP,    MSM8960,   404,404,  540,888,  240,  0,    1,  2,     GW3L],
    "SH-01EVW":         [ANDROID,  SHARP,    MSM8960,   404,404,  540,888,  240,  0,    1,  2,     GW3L],
    "SH-02E":           [ANDROID,  SHARP,    APQ8064,   404,412,  720,1280, 320,  0,    2,  2,    NGW3L],
    "SH-04E":           [ANDROID,  SHARP,    APQ8064,   412,412,  720,1184, 320,  0,    2,  5,    NGW3L],
    "SH-05E":           [ANDROID,  SHARP,    MSM8960,   404,404,  540,960,  240,  0,    1,  2,      G3L], // JUNIOR (no Google Play, no WiFi)
    "SO-01E":           [ANDROID,  SONY,     MSM8960,   404,412,  720,1184, 320,  0,    1,  5,    NGW3L],
    "SO-02E":           [ANDROID,  SONY,     APQ8064,   412,422,  720,1184, 320,  3,    1,  5,    NGW3L], // Xperia Z
    "SO-03E":           [ANDROID,  SONY,     APQ8064,   412,412, 1128,1920, 240,  0,    2,  5,    NGW3L],
    "P-02E":            [ANDROID,  PANASONIC,APQ8064,   412,412, 1080,1920, 480,  0,    2,  5,    NGW3L],
    "F-02E":            [ANDROID,  FUJITSU,  AP37,      412,412, 1080,1920, 480,  0,    2,  5,    NGW3L],
    "F-03E":            [ANDROID,  FUJITSU,  MSM8960,   404,412,  540,960,  240,  0,    1,  5,    NGW3L],
    "F-04E":            [ANDROID,  FUJITSU,  AP33,      404,422,  720,1280, 320,  0,    2,  5,    NGW3L],
    "F-05E":            [ANDROID,  FUJITSU,  AP37,      404,412, 1200,1920, 240,  0,    2,  5,    NGW3L],
    "HW-01E":           [ANDROID,  HUAWEI,   MSM8960,   404,404,  720,1280, 320,  0,    1,  5,     GW3L],
    "HW-03E":           [ANDROID,  HUAWEI,   K3V2,      412,412,  720,1280, 320,  0,    2,  5,     GW3L],
    "dtab01":           [ANDROID,  HUAWEI,   K3V2T,     412,412,  800,1280, 160,  0,    1,  5,     GW3 ],
    "L-05D":            [ANDROID,  LG,       MSM8960,   404,412,  480,800,  240,1.5,    1,  5,     GW3L], // Optimus it
    "L-06D":            [ANDROID,  LG,       APQ8060,   404,404,  768,1024, 320,  0,    1,  5,     GW3L],
    "L-06DJOJO":        [ANDROID,  LG,       APQ8060,   404,404,  768,1024, 320,  0,    1,  5,     GW3L],
    "N-07D":            [ANDROID,  NEC,      MSM8960,   404,404,  720,1280, 342,  0,    1,  5,     GW3L],
    "N-08D":            [ANDROID,  NEC,      MSM8960,   404,404,  800,1280, 213,  0,    1,  5,     GW3L],
    "SC-06D":           [ANDROID,  SAMSUNG,  MSM8960,   404,412,  720,1280, 320,  2,    2,  5,     GW3L], // Galaxy S III
    "SH-06D":           [ANDROID,  SHARP,    OMAP4460,  235,404,  720,1280, 320,  0,    1,  5,     GW3 ],
    "SH-06DNERV":       [ANDROID,  SHARP,    OMAP4460,  235,404,  720,1280, 320,  0,    1,  2,     GW3 ],
    "SH-07D":           [ANDROID,  SHARP,    MSM8255,   404,404,  480,854,  240,  0,    1,  2,     GW3 ],
    "SH-09D":           [ANDROID,  SHARP,    MSM8960,   404,412,  720,1280, 312,  0,    1,  2,     GW3L],
    "SH-10D":           [ANDROID,  SHARP,    MSM8960,   404,412,  720,1280, 320,  0,    1,  2,     GW3L],
    "SO-04D":           [ANDROID,  SONY,     MSM8960,   404,412,  720,1184, 320,  0,    1,  5,     GW3L],
    "SO-05D":           [ANDROID,  SONY,     MSM8960,   404,412,  540,888,  240,1.5,    1,  5,     GW3L], // Xperia SX
    "P-06D":            [ANDROID,  PANASONIC,OMAP4460,  404,404,  720,1280, 320,  0,    1,  5,     GW3 ],
    "P-07D":            [ANDROID,  PANASONIC,MSM8960,   404,404,  720,1280, 320,  0,    1,  5,     GW3L],
    "P-08D":            [ANDROID,  PANASONIC,OMAP4460,  404,404,  800,1280, 160,  0,    1,  5,     GW3 ],
    "F-09D":            [ANDROID,  FUJITSU,  MSM8255,   403,403,  480,800,  240,  0,    1,  2,     GW3 ],
    "F-10D":            [ANDROID,  FUJITSU,  AP33,      403,422,  720,1280, 323,  2,    1,  5,     GW3L], // ARROWS X
    "F-11D":            [ANDROID,  FUJITSU,  MSM8255,   403,422,  480,800,  240,  0,    1,  5,     GW3 ],
    "F-12D":            [ANDROID,  FUJITSU,  MSM8255,   403,403,  480,800,  235,  0,    1,  5,     GW3 ],
    "T-02D":            [ANDROID,  TOSHIBA,  MSM8960,   404,412,  540,960,  257,  0,    1,  5,     GW3L],
    "L-01D":            [ANDROID,  LG,       APQ8060,   235,404,  720,1280, 320,  0,    1,  5,     GW3L],
    "L-02D":            [ANDROID,  LG,       OMAP4430,  237,404,  480,800,  240,  0,    1,  5,     GW3 ],
    "N-01D":            [ANDROID,  NEC,      MSM8255T,  235,235,  480,800,  235,  0,  0.5,  5,     GW3 ],
    "N-04D":            [ANDROID,  NEC,      APQ8060,   236,404,  720,1280, 342,  0,    1,  5,     GW3L],
    "N-05D":            [ANDROID,  NEC,      MSM8260,   236,404,  720,1280, 320,  0,    1,  5,     GW3 ],
    "N-06D":            [ANDROID,  NEC,      APQ8060,   236,404,  800,1280, 213,  0,    1,  5,     GW3L],
    "SC-01D":           [ANDROID,  SAMSUNG,  APQ8060,   320,404,  800,1200, 160,  0,    1,  5,     GW3L],
    "SC-02D":           [ANDROID,  SAMSUNG,  EXYNOS4210,320,404,  600,1024, 160,  0,    1,  5,     GW3 ],
    "SC-03D":           [ANDROID,  SAMSUNG,  APQ8060,   236,404,  480,800,  240,1.5,    1,  5,    NGW3L], // GALAXY S II LTE
    "SC-04D":           [ANDROID,  SAMSUNG,  OMAP4460,  401,422,  720,1280, 320,  2,    1,  5,    NGW3 ], // Galaxy Nexus
    "SC-05D":           [ANDROID,  SAMSUNG,  APQ8060,   236,412,  800,1280, 320,  0,    1,  5,    NGW3L],
    "SH-01D":           [ANDROID,  SHARP,    OMAP4430,  235,404,  720,1280, 328,  0,    1,  2,     GW3 ],
    "SH-02D":           [ANDROID,  SHARP,    MSM8255,   235,235,  540,960,  300,  0,  0.5,  2,     GW3 ],
    "SH-04D":           [ANDROID,  SHARP,    MSM8255,   234,234,  540,960,  300,  0,  0.5,  2,     GW3 ],
    "SO-01D":           [ANDROID,  SONY,     MSM8255,   234,234,  480,854,  240,1.5,  0.5,  2,     GW3 ], // Xperia Play
    "SO-02D":           [ANDROID,  SONY,     MSM8260,   237,404,  720,1280, 320,  0,    1,  5,     GW3 ],
    "SO-03D":           [ANDROID,  SONY,     MSM8260,   237,404,  720,1280, 320,  0,    1,  5,     GW3 ],
    "P-01D":            [ANDROID,  PANASONIC,MSM8255,   234,234,  480,800,  240,1.5,  0.5,  2,     GW3 ],
    "P-02D":            [ANDROID,  PANASONIC,OMAP4430,  235,404,  540,960,  240,  0,    1,  2,     GW3 ],
    "P-04D":            [ANDROID,  PANASONIC,OMAP4430,  235,404,  540,960,  257,  0,    1,  5,     GW3 ],
    "P-05D":            [ANDROID,  PANASONIC,OMAP4430,  235,404,  540,960,  257,  0,    1,  5,     GW3 ],
    "F-01D":            [ANDROID,  FUJITSU,  OMAP4430,  320,403,  800,1280, 160,  0,    1,  5,     GW3L],
    "F-03D":            [ANDROID,  FUJITSU,  MSM8255,   235,235,  480,800,  240,  0,  0.5,  2,     GW3 ],
    "F-05D":            [ANDROID,  FUJITSU,  OMAP4430,  235,403,  720,1280, 342,  0,    1,  2,     GW3L],
    "F-07D":            [ANDROID,  FUJITSU,  MSM8255,   235,235,  480,800,  235,  0,  0.5,  5,     GW3 ],
    "F-08D":            [ANDROID,  FUJITSU,  OMAP4430,  235,403,  720,1280, 342,  0,    1,  2,     GW3 ],
    "T-01D":            [ANDROID,  TOSHIBA,  OMAP4430,  235,403,  720,1280, 320,  0,    1,  2,     GW3 ],
    "SC-02C":           [ANDROID,  SAMSUNG,  EXYNOS4210,403,403,  480,800,  240,  0,    1,  5,     GW3 ], // Galaxy S II
    "SO-01C":           [ANDROID,  SONY,     MSM8255,   232,234,  480,854,    0,1.5,  0.5,  2,     GW3 ], // Xperia arc
    "SO-02C":           [ANDROID,  SONY,     MSM8255,   233,234,  480,854,    0,  0,  0.5,  2,     GW3 ], // Xperia acro
    "SO-03C":           [ANDROID,  SONY,     MSM8255,   234,234,  480,854,    0,  0,  0.5,  2,     GW3 ], // Xperia acro
    "SH-13C":           [ANDROID,  SHARP,    MSM8255,   234,234,  540,960,    0,  0,  0.5,  2,     GW3 ],
    "SH-12C":           [ANDROID,  SHARP,    MSM8255T,  233,233,  540,960,    0,  0,  0.5,  2,     GW3 ],
    "N-04C":            [ANDROID,  NEC,      MSM7230,   220,233,  480,854,    0,  0,  0.5,  2,     GW3 ],
    "N-06C":            [ANDROID,  NEC,      MSM8255,   230,230,  480,854,    0,  0,  0.5,  2,     GW3 ],
    "P-07C":            [ANDROID,  PANASONIC,OMAP3630,  230,230,  480,800,    0,  0,  0.5,  2,     GW3 ],
    "F-12C":            [ANDROID,  FUJITSU,  MSM8255,   230,230,  480,800,    0,  0,  0.5,  2,     GW3 ],
    "L-04C":            [ANDROID,  LG,       MSM7227,   220,230,  320,480,    0,  0,  0.5,  2,     GW3 ],
    "L-06C":            [ANDROID,  LG,       T20,       300,310,  768,1280,   0,  0,    1,  2,     GW3 ],
    "L-07C":            [ANDROID,  LG,       OMAP3630,  233,233,  480,800,    0,  0,  0.5,  2,     GW3 ],
    "T-01C":            [ANDROID,  TOSHIBA,  QSD8250,   211,222,  480,854,    0,1.5,    0,  2,     GW3 ], // REGZA Phone
    "SH-03C":           [ANDROID,  SONY,     QSD8250,   211,222,  480,800,    0,  0,    0,  2,     GW3 ],
    "SC-01C":           [ANDROID,  SAMSUNG,  S5PC110,   220,236,  600,1024,   0,1.5,    0,  2,     GW3 ], // GALAXY Tab
    "SC-02B":           [ANDROID,  SAMSUNG,  S5PC110,   220,236,  480,800,    0,1.5,    0,  2,     GW3 ], // GALAXY S
    "SH-10B":           [ANDROID,  SHARP,    QSD8250,   160,160,  480,960,    0,  1,    0,  2,     GW3 ], // LYNX
    "SO-01B":           [ANDROID,  SONY,     QSD8250,   160,211,  480,854,    0,1.5,0.375,  1,     GW3 ],// Xperia
//                       [0]       [1]       [2]        [3] [4]   [5]  [6]  [7] [8]   [9]  [10]   [11]
//                       OS.TYPE,  BRAND     SOC        OS.VER    DISP.SIZE PPI DPR   RAM TOUCH NFC+GPS+WiFi+3G+LTE
// --- au ---
// http://www.au.kddi.com/developer/android/
    "FJT21":            [ANDROID,  FUJITSU,  MSM8974,   422,422, 1600,2560, 300,  0,    2, 10,    NGW3L],
    "SOL23":            [ANDROID,  SONY,     MSM8974,   422,422, 1080,1920, 442,  3,    2, 10,    NGW3L], // Xperia Z1
    "SCL22":            [ANDROID,  SAMSUNG,  MSM8974,   430,430, 1080,1920, 386,  0,    3, 10,    NGW3L],
    "KYL22":            [ANDROID,  KYOCERA,  MSM8974,   422,422, 1080,1920, 443,  0,    2,  5,    NGW3L],
    "LGL22":            [ANDROID,  LG,       MSM8974,   422,422, 1080,1920, 422,  0,    2, 10,    NGW3L], // isai
    "SHL23":            [ANDROID,  SHARP,    MSM8974,   422,422, 1080,1920, 460,  0,    2,  5,    NGW3L],
    "FJL22":            [ANDROID,  FUJITSU,  MSM8974,   422,422, 1080,1920, 444,  0,    2, 10,    NGW3L],
    "SHL22":            [ANDROID,  SHARP,    APQ8064T,  422,422,  720,1280, 302,  0,    2,  5,    NGW3L],
    "KYY21":            [ANDROID,  KYOCERA,  MSM8960,   422,422,  720,1280, 314,  0,    2,  5,    NGW3L], // URBANO L01
    "HTL22":            [ANDROID,  HTC,      APQ8064T,  412,422, 1080,1920, 468,  0,    2, 10,    NGW3L], // HTC J One
    "SOL22":            [ANDROID,  SONY,     APQ8064,   412,422, 1080,1920, 443,  0,    2, 10,    NGW3L], // Xperia UL
    "HTX21":            [ANDROID,  HTC,      APQ8064,   411,411,  720,1280, 314,  0,    1, 10,    NGW3L], // INFOBAR A02
    "SHT21":            [ANDROID,  SHARP,    MSM8960,   404,412,  800,1280, 216,  0,    1,  2,    NGW3L], // AQUOS PAD
    "HTL21":            [ANDROID,  HTC,      APQ8064,   411,411, 1080,1920, 444,  3,    2, 10,    NGW3L], // HTC J Butterfly
    "SCL21":            [ANDROID,  SAMSUNG,  MSM8960,   404,412,  720,1280, 306,  0,    2, 10,     GW3L], // GALAXY SIII Progre
    "CAL21":            [ANDROID,  CASIO,    MSM8960,   404,404,  480,800,  236,  0,    1,  5,     GW3L], // G'zOne TYPE-L
    "SHL21":            [ANDROID,  SHARP,    MSM8960,   404,412,  720,1280, 309,  0,    1,  2,     GW3L], // AUOS PHONE SERIE
    "KYL21":            [ANDROID,  KYOCERA,  MSM8960,   404,404,  720,1280, 314,  0,    1,  5,     GW3L], // DIGNO S
    "FJL21":            [ANDROID,  FUJITSU,  MSM8960,   404,404,  720,1280, 342,  2,    1, 10,     GW3L], // ARROWS ef
    "SOL21":            [ANDROID,  SONY,     MSM8960,   404,412,  720,1280, 345,  0,    1, 10,     GW3L], // Xperia VL
    "LGL21":            [ANDROID,  LG,       APQ8064,   404,404,  720,1280, 315,  0,    2, 10,     GW3L], // Optimus G
    "PTL21":            [ANDROID,  PANTECH,  MSM8960,   404,412,  720,1280, 342,  0,    1,  5,     GW3L], // VEGA
    "ISW13F":           [ANDROID,  FUJITSU,  AP33,      403,403,  720,1280, 322,  0,    1,  3,     GW3 ], // ARROWS Z
    "IS17SH":           [ANDROID,  SHARP,    MSM8655,   404,404,  540,960,  240,  0,    1,  2,     GW3 ], // AQUOS PHONE CL
    "IS15SH":           [ANDROID,  SHARP,    MSM8655,   404,404,  540,960,  298,  0,    1,  2,     GW3 ], // AQUOS PHONE SL
    "ISW16SH":          [ANDROID,  SHARP,    MSM8660A,  404,404,  720,1280, 318,  2,    1,  2,     GW3 ], // AQUOS PHONE SERIE
    "URBANO PROGRESSO": [ANDROID,  KYOCERA,  MSM8655,   403,403,  480,800,  235,  0,    1,  5,     GW3 ],
    "ISW13HT":          [ANDROID,  HTC,      MSM8660A,  403,403,  540,960,  204,  0,    1,  4,     GW3 ], // HTC J
    "IS12S":            [ANDROID,  SONY,     MSM8660,   237,404,  720,1280, 342,  0,    1, 10,     GW3 ], // Xperia acro HD
    "IS12M":            [ANDROID,  MOTOROLA, OMAP4430,  236,404,  540,960,  256,  0,    1, 10,     GW3 ], // MOTOROLA RAZR
    "INFOBAR C01":      [ANDROID,  SHARP,    MSM8655,   235,235,  480,854,  309,  0,  0.5,  2,     GW3 ], // INFOBAR C01
    "ISW11SC":          [ANDROID,  SAMSUNG,  EXYNOS4210,236,404,  720,1080, 315,  2,    1, 10,     GW3 ], // GALAXY SII WiMAX
    "IS11LG":           [ANDROID,  LG,       AP25H,     237,404,  480,800,  235,  0,    1, 10,     GW3 ], // Optimus X
    "IS12F":            [ANDROID,  FUJITSU,  MSM8655,   235,235,  480,800,  235,  0,  0.5,  4,     GW3 ], // ARROWS ES
    "IS14SH":           [ANDROID,  SHARP,    MSM8655,   235,235,  540,960,  298,  0,  0.5,  2,     GW3 ], // AQUOS PHONE
    "IS11N":            [ANDROID,  NEC,      MSM8655,   235,235,  480,800,  262,  0,  0.5,  5,     GW3 ], // MEDIAS BR
    "ISW11F":           [ANDROID,  FUJITSU,  OMAP4430,  235,403,  720,1280, 342,  0,    1,  3,     GW3 ], // ARROWS Z
    "ISW11K":           [ANDROID,  KYOCERA,  MSM8655,   235,235,  480,800,  234,  0,    1, 10,     GW3 ], // DIGNO
    "IS13SH":           [ANDROID,  SHARP,    MSM8655,   235,235,  540,960,  258,  0,  0.5,  2,     GW3 ], // AQUOS PHONE
    "ISW12HT":          [ANDROID,  HTC,      MSM8660,   234,403,  540,960,  256,  0,    1,  4,     GW3 ], // HTC EVO 3D
    "ISW11M":           [ANDROID,  MOTOROLA, T20,       234,234,  540,960,  256,  0,    1,  2,     GW3 ], // MOTOROLA PHOTON
    "EIS01PT":          [ANDROID,  PANTECH,  MSM8655,   234,234,  480,800,  254,  0,  0.5,  5,     GW3 ],
    "IS11PT":           [ANDROID,  PANTECH,  MSM8655,   234,234,  480,800,  254,  0,  0.5,  5,     GW3 ], // MIRACH
    "IS11T":            [ANDROID,  TOSHIBA,  MSM8655,   234,234,  480,854,  243,  0,  0.5,  3,     GW3 ], // REGZA Phone
    "IS11CA":           [ANDROID,  CASIO,    MSM8655,   233,233,  480,800,  262,  0,  0.5,  5,     GW3 ], // G'zOne
    "INFOBAR A01":      [ANDROID,  SHARP,    MSM8655,   233,233,  540,960,  265,1.5,  0.5,  2,     GW3 ], // INFOBAR A01
    "IS12SH":           [ANDROID,  SHARP,    MSM8655,   233,233,  540,960,  263,  0,  0.5,  2,     GW3 ], // AQUOS PHONE
    "IS11SH":           [ANDROID,  SHARP,    MSM8655,   233,233,  540,960,  298,  0,  0.5,  2,     GW3 ], // AQUOS PHONE
    "IS11S":            [ANDROID,  SONY,     MSM8655,   233,234,  480,854,  232,  0,  0.5,  2,     GW3 ], // Xperia acro
    "ISW11HT":          [ANDROID,  HTC,      QSD8650,   221,234,  480,800,  254,1.5,  0.5,  2,     GW3 ], // HTC EVO WiMAX
    "IS06":             [ANDROID,  PANTECH,  QSD8650,   221,221,  480,800,  254,1.5,  0.5,  5,     GW3 ], // SIRIUS alpha
    "IS05":             [ANDROID,  SHARP,    MSM8655,   221,234,  480,854,  290,  0,  0.5,  2,     GW3 ],
    "IS04":             [ANDROID,  TOSHIBA,  QSD8650,   210,222,  480,854,  290,  0,  0.5,  2,     GW3 ],
    "IS03":             [ANDROID,  SHARP,    QSD8650,   210,221,  640,960,  331,  2,  0.5,  2,     GW3 ],
    "IS01":             [ANDROID,  SHARP,    QSD8650,   160,160,  480,960,  213,  1, 0.25,  1,     GW3 ],
//                       [0]       [1]       [2]        [3] [4]   [5]  [6]  [7] [8]   [9]  [10]   [11]
//                       OS.TYPE,  BRAND     SOC        OS.VER    DISP.SIZE PPI DPR   RAM TOUCH NFC+GPS+WiFi+3G+LTE
// --- SoftBank ---
    "X06HT":            [ANDROID,  HTC,      QSD8250,   210,220,  480,800,    0,  1,  0.5,  2,     GW3 ],
    "001HT":            [ANDROID,  HTC,      MSM8255,   220,233,  480,800,    0,1.5,0.375,  2,     GW3 ],
    "SBM003SH":         [ANDROID,  SHARP,    MSM8255,   220,234,  480,800,    0,1.5,  0.5,  2,     GW3 ],
    "001DL":            [ANDROID,  DELL,     QSD8250,   220,220,  480,800,    0,  0,  0.5,  2,     GW3 ],
    "003Z":             [ANDROID,  ZTE,      MSM7227,   220,220,  480,800,    0,  0,  0.5,  2,     GW3 ], // Libero
    "DM009SH":          [ANDROID,  SHARP,    MSM8255,   220,234,  480,800,    0,  0,  0.5,  2,     GW3 ],
    "SBM005SH":         [ANDROID,  SHARP,    MSM8255,   221,221,  480,800,    0,  0,  0.5,  2,     GW3 ],
    "SBM006SH":         [ANDROID,  SHARP,    MSM8255,   233,233,  540,960,    0,  0,  0.5,  2,     GW3 ],
    "SBM007SH":         [ANDROID,  SHARP,    MSM8255,   233,233,  480,854,  288,  0,  0.5,  2,     GW3 ],
    "SBM007SHJ":        [ANDROID,  SHARP,    MSM8255,   233,233,  480,854,  288,  0,  0.5,  2,     GW3 ],
    "003P":             [ANDROID,  PANASONIC,OMAP3630,  233,233,  480,854,    0,  0,  0.5,  2,     GW3 ],
    "007HW":            [ANDROID,  HUAWEI,   MSM8255,   234,234,  480,800,    0,  0,  0.5,  2,     GW3 ], // Vision
    "SBM009SH":         [ANDROID,  SHARP,    MSM8255,   234,234,  540,960,    0,  0,  0.5,  2,     GW3 ],
    "SBM007SHK":        [ANDROID,  SHARP,    MSM8255,   233,233,  480,854,  288,  0,  0.5,  2,     GW3 ],
    "SBM009SHY":        [ANDROID,  SHARP,    MSM8255,   234,234,  540,960,  288,  0,  0.5,  2,     GW3 ],
    "DM010SH":          [ANDROID,  SHARP,    MSM8255,   234,234,  540,960,    0,  0,  0.5,  2,     GW3 ],
    "SBM101SH":         [ANDROID,  SHARP,    MSM8255,   235,235,  480,854,  288,  0,  0.5,  2,     GW3 ],
    "DM011SH":          [ANDROID,  SHARP,    MSM8255,   235,235,  480,854,  288,  0,  0.5,  2,     GW3 ],
    "SBM102SH":         [ANDROID,  SHARP,    OMAP4430,  235,404,  720,1280, 326,  0,    1,  2,     GW3 ],
    "101P":             [ANDROID,  PANASONIC,OMAP4430,  235,235,  480,854,    0,  0,    1,  2,     GW3 ],
    "101N":             [ANDROID,  NEC,      MSM8255,   235,235,  480,800,    0,  0,  0.5,  2,     GW3 ],
    "SBM103SH":         [ANDROID,  SHARP,    MSM8255,   235,235,  540,960,  275,  0,  0.5,  2,     GW3 ],
    "101K":             [ANDROID,  KYOCERA,  APE5R,     234,234,  480,800,    0,  0,  0.5,  2,     GW3 ],
    "DM012SH":          [ANDROID,  SHARP,    MSM8255,   235,235,  540,960,    0,  0,  0.5,  2,     GW3 ],
    "SBM104SH":         [ANDROID,  SHARP,    OMAP4460,  403,403,  720,1280, 326,  0,    1,  2,     GW3 ],
    "008Z":             [ANDROID,  ZTE,      MSM8255,   230,230,  480,800,    0,  0,  0.5,  2,     GW3 ],
    "101DL":            [ANDROID,  DELL,     MSM8260,   235,235,  540,960,    0,  0,    1,  2,     GW3 ],
    "102P":             [ANDROID,  PANASONIC,OMAP4430,  235,235,  540,960,  275,  0,    1,  2,     GW3 ],
    "WX04K":            [ANDROID,  KYOCERA,  APE5R,     234,411,  480,800,    0,  0,    1,  2,     GW3 ],
    "SBM106SH":         [ANDROID,  SHARP,    MSM8260A,  404,404,  720,1280,   0,  0,    1,  2,     GW3 ],
    "SBM102SH2":        [ANDROID,  SHARP,    OMAP4430,  235,404,  720,1280,   0,  0,    1,  2,     GW3 ],
    "SBM107SH":         [ANDROID,  SHARP,    MSM8255,   404,404,  480,854,    0,  0,    1,  2,     GW3 ],
    "101F":             [ANDROID,  FUJITSU,  MSM8960,   404,412,  540,960,    0,  0,    1,  2,     GW3 ],
    "WX06K":            [ANDROID,  KYOCERA,  APE5R,     234,234,  480,800,    0,  0,  0.5,  2,     GW3 ],
    "009Z":             [ANDROID,  ZTE,      MSM8255,   234,234,  480,800,    0,  0,  0.5,  2,     GW3 ], // STAR7
    "201HW":            [ANDROID,  HUAWEI,   MSM8960,   400,400,  540,960,    0,  0,    1,  2,     GW3 ],
    "SBM107SHB":        [ANDROID,  SHARP,    MSM8255,   404,404,  480,854,    0,  0,    1,  2,     GW3 ],
    "DM013SH":          [ANDROID,  SHARP,    MSM8255,   404,404,  480,854,    0,  0,    1,  2,     GW3 ],
    "SBM200SH":         [ANDROID,  SHARP,    MSM8960,   404,410,  720,1280,   0,  0,    1,  2,     GW3 ],
    "201K":             [ANDROID,  KYOCERA,  MSM8960,   412,412,  480,800,    0,  0,    1,  2,     GW3 ],
    "201F":             [ANDROID,  FUJITSU,  APQ8064,   412,412,  720,1280,   0,  0,    2,  2,     GW3 ],
    "DM014SH":          [ANDROID,  SHARP,    MSM8960,   404,412,  720,1280,   0,  0,    1,  2,     GW3 ],
    "201M":             [ANDROID,  MOTOROLA, MSM8960,   400,410,  540,960,    0,  0,    1,  2,     GW3 ], // Motorola RAZR
    "SBM203SH":         [ANDROID,  SHARP,    APQ8064,   412,412,  720,1280,   0,  0,    2,  2,     GW3 ],
    "SBM204SH":         [ANDROID,  SHARP,    MSM8255,   404,404,  480,800,    0,  0,    1,  2,     GW3 ],
    "SBM205SH":         [ANDROID,  SHARP,    MSM8960,   412,412,  480,854,    0,  0,    1,  2,     GW3 ],
    "SBM206SH":         [ANDROID,  SHARP,    APQ8064T,  422,422, 1080,1920,   0,  0,    2,  2,     GW3 ],
    "202F":             [ANDROID,  FUJITSU,  APQ8064T,  422,422, 1080,1920,   0,  0,    2,  2,     GW3 ],
    "202K":             [ANDROID,  KYOCERA,  MSM8960,   422,422,  720,1280, 340,  0,    1,  2,     GW3 ],
    "WX10K":            [ANDROID,  KYOCERA,  MSM8960,   422,422,  720,1280,   0,  0,    1,  2,     GW3 ],
    "DM015K":           [ANDROID,  KYOCERA,  MSM8960,   422,422,  720,1280,   0,  0,  1.5,  2,     GW3 ],
    "EM01F":            [ANDROID,  KYOCERA,  APQ8064,   412,412,  720,1280,   0,  0,    2,  2,     GW3 ],
    "204HW":            [ANDROID,  HUAWEI,   MSM8225,   410,410,  480,800,    0,  0,    1,  2,     GW3 ], // for Silver Age
    "WX04SH":           [ANDROID,  KYOCERA,  MSM8260A,  412,412,  480,854,    0,  0,    1,  2,     GW3 ],
    "301F":             [ANDROID,  FUJITSU,  MSM8974,   422,422, 1080,1920,   0,  0,    2,  2,     GW3L],
    "EM01L":            [ANDROID,  GOOGLE,   MSM8974,   440,440, 1080,1920, 445,  3,    2,  5,     GW3 ], // E-Mobile Nexus 5 EM01L
    "DM016SH":          [ANDROID,  SHARP,    MSM8974,   422,422, 1080,1920,   0,  0,  1.5,  2,    NGW3L],
    "SBM302SH":         [ANDROID,  SHARP,    MSM8974,   422,422, 1080,1920,   0,  0,    2,  5,    NGW3L],
    "SBM303SH":         [ANDROID,  SHARP,    MSM8974,   422,422, 1080,1920,   0,  0,    2,  5,     GW3L], // AQUOS PHONE Xx mini 303SH
//                       [0]       [1]       [2]        [3] [4]   [5]  [6]  [7] [8]   [9]  [10]   [11]
//                       OS.TYPE,  BRAND     SOC        OS.VER    DISP.SIZE PPI DPR   RAM TOUCH NFC+GPS+WiFi+3G+LTE
/*
// --- Windows Phone 7.5 ---
// https://www.handsetdetection.com/properties/vendormodel/
// http://en.wikipedia.org/wiki/List_of_Windows_Phone_7_devices
    "Allegro":          [WPHONE,   ACER,     MSM8255,   750,750,  480,800,  259,  0,  0.5,  4,     GW3 ],
//  "OneTouchView":     [WPHONE,   ALCATEL,  MSM7227,   750,780,  480,800,    0,  0,  0.5,  4,     GW3 ],
    "IS12T":            [WPHONE,   FUJITSU,  MSM8655,   750,750,  480,800,    0,  0,  0.5,  4,     GW3 ],
    "Radar":            [WPHONE,   HTC,      MSM8255,   750,750,  480,800,  246,  0,  0.5,  4,     GW3 ],
    "P6800":            [WPHONE,   HTC,      MSM8255T,  750,750,  480,800,  198,  0,  0.5,  4,     GW3 ], // Titan
    "PI86100":          [WPHONE,   HTC,      MSM8255T,  750,750,  480,800,  198,  0,  0.5,  4,     GW3L], // Titan II
    "Lumia 510":        [WPHONE,   NOKIA,    MSM7227,   750,750,  480,800,    0,  0,  0.25, 4,     GW3 ],
    "Lumia 610":        [WPHONE,   NOKIA,    MSM7227,   750,750,  480,800,    0,  0,  0.25, 4,     GW3 ],
    "Lumia 710":        [WPHONE,   NOKIA,    MSM8255,   750,750,  480,800,    0,  0,  0.5,  4,     GW3 ],
    "Lumia 800":        [WPHONE,   NOKIA,    MSM8255,   750,750,  480,800,    0,  0,  0.5,  4,     GW3 ],
    "Lumia 900":        [WPHONE,   NOKIA,    APQ8055,   750,750,  480,800,    0,  0,  0.5,  4,     GW3 ],
    "SGH-i667":         [WPHONE,   SAMSUNG,  MSM8255T,  750,750,  480,800,  233,  0,  0.5,  4,     GW3 ], // Focus 2
    "SGH-i937":         [WPHONE,   SAMSUNG,  MSM8255,   750,750,  480,800,  217,  0,  0.5,  4,     GW3 ], // Focus S
    "GT-S7530":         [WPHONE,   SAMSUNG,  MSM7227,   750,750,  480,800,  233,  0,  0.375,4,     GW3 ], // Omnia M
    "GT-I8350":         [WPHONE,   SAMSUNG,  MSM8255,   750,750,  480,800,  252,  0,  0.5,  4,     GW3 ], // Omnia W
    "Orbit":            [WPHONE,   ZTE,      MSM7227,   750,750,  480,800,  233,  0,  0.5,  4,     GW3 ],
    "Tania":            [WPHONE,   ZTE,      MSM8255,   750,750,  480,800,  217,  0,  0.5,  4,     GW3 ],
 */
// --- Windows Phone 8 ---
// http://en.wikipedia.org/wiki/List_of_Windows_Phone_8_devices
    "8S":               [WPHONE,   HTC,      MSM8627,   800,800,  480,800,    0,  0,  0.5,  4,     GW3 ],
    "8X":               [WPHONE,   HTC,      MSM8960,   800,800,  720,1280, 342,  0,    1,  4,    NGW3 ],
    "8XT":              [WPHONE,   HTC,      MSM8930,   800,800,  480,800,    0,  0,    1,  4,    NGW3 ],
    "W1-U00":           [WPHONE,   HUAWEI,   MSM8230,   800,800,  480,800,    0,  0,  0.5,  4,     GW3 ], // Ascend W1
    "W2-U00":           [WPHONE,   HUAWEI,   MSM8230,   800,800,  480,800,    0,  0,  0.5,  4,     GW3 ], // Ascend W2
    "Lumia 520":        [WPHONE,   NOKIA,    MSM8227,   800,800,  480,800,  235,  0,  0.5,  4,     GW3 ],
    "Lumia 525":        [WPHONE,   NOKIA,    MSM8227,   800,800,  480,800,  235,  0,    1,  4,     GW3 ],
    "Lumia 620":        [WPHONE,   NOKIA,    MSM8960,   800,800,  480,800,  246,  0,  0.5,  4,    NGW3 ],
    "Lumia 625":        [WPHONE,   NOKIA,    MSM8930,   800,800,  480,800,  201,  0,  0.5,  4,     GW3L],
    "Lumia 720":        [WPHONE,   NOKIA,    MSM8227,   800,800,  480,800,  217,  0,  0.5,  4,    NGW3 ],
    "Lumia 810":        [WPHONE,   NOKIA,    MSM8260A,  800,800,  480,800,  217,  0,  0.5,  4,    NGW3 ],
    "Lumia 820":        [WPHONE,   NOKIA,    MSM8960,   800,800,  480,800,  217,  0,    1,  4,    NGW3L],
    "Lumia 822":        [WPHONE,   NOKIA,    MSM8960,   800,800,  480,800,  217,  0,    1,  4,    NGW3L],
    "Lumia 920":        [WPHONE,   NOKIA,    MSM8960,   800,800,  768,1280, 334,  0,    1,  4,    NGW3L],
    "Lumia 925":        [WPHONE,   NOKIA,    MSM8960,   800,800,  768,1280, 334,  0,    1,  4,    NGW3L],
    "Lumia 928":        [WPHONE,   NOKIA,    MSM8960,   800,800,  768,1280, 334,  0,    1,  4,    NGW3L],
    "Lumia 1020":       [WPHONE,   NOKIA,    MSM8960,   800,800,  768,1280, 334,  0,    2,  4,    NGW3L],
    "Lumia 1320":       [WPHONE,   NOKIA,    MSM8930,   800,800,  768,1280, 245,  0,    1,  4,     GW3L], // SoC 8930AB -> MSM8930
    "Lumia 1520":       [WPHONE,   NOKIA,    MSM8974,   800,800, 1080,1920, 367,  0,    2,  4,    NGW3L], // SoC 8974AA -> MSM8974
    "GT-I8750":         [WPHONE,   SAMSUNG,  MSM8960,   800,800,  720,1280, 306,  0,    1,  4,    NGW3 ], // ATIV S
    "SGH-T899M":        [WPHONE,   SAMSUNG,  MSM8960,   800,800,  720,1280, 306,  0,    1,  4,    NGW3 ], // ATIV S
    "SPH-I800":         [WPHONE,   SAMSUNG,  MSM8930,   800,800,  720,1280, 308,  0,    1,  4,    NGW3L], // ATIV S Neo, SoC MSM8930AA -> MSM8930
    "SCH-I930":         [WPHONE,   SAMSUNG,  MSM8960,   800,800,  480,800,  233,  0,    1,  4,    NGW3L], // ATIV Odyssey
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
    "MSM8974":    [ARM,  2.2,  4,     ADRENO,   "330",          ],
    "MSM8930":    [ARM,  1.2,  2,     ADRENO,   "305",          ],
    "APQ8064T":   [ARM,  1.7,  4,     ADRENO,   "320",          ],
    "APQ8064":    [ARM,  1.5,  4,     ADRENO,   "320",          ],
    "MSM8960":    [ARM,  1.5,  2,     ADRENO,   "225",          ],
    "MSM8660A":   [ARM,  1.5,  2,     ADRENO,   "225",          ],
    "MSM8260A":   [ARM,  1.5,  2,     ADRENO,   "225",          ],
    "APQ8060":    [ARM,  1.2,  2,     ADRENO,   "220",          ],
    "MSM8660":    [ARM,  1.2,  2,     ADRENO,   "220",          ],
    "MSM8655":    [ARM,  1.0,  1,     ADRENO,   "205",          ],
    "MSM8627":    [ARM,  1.0,  2,     ADRENO,   "305",          ],
    "MSM8260":    [ARM,  1.7,  2,     ADRENO,   "220",          ],
    "MSM8255T":   [ARM,  1.4,  1,     ADRENO,   "205",          ],
    "MSM8255":    [ARM,  1.0,  1,     ADRENO,   "205",          ],
    "MSM8230":    [ARM,  1.2,  2,     ADRENO,   "305",          ],
    "MSM8227":    [ARM,  1.0,  2,     ADRENO,   "305",          ],
    "MSM7230":    [ARM,  0.8,  1,     ADRENO,   "205",          ],
    "APQ8055":    [ARM,  1.4,  1,     ADRENO,   "205",          ],
    "MSM8225":    [ARM,  1.2,  1,     ADRENO,   "203",          ],
    "QSD8650":    [ARM,  1.0,  1,     ADRENO,   "200",          ],
    "QSD8250":    [ARM,  1.0,  1,     ADRENO,   "200",          ],
    "MSM7227":    [ARM,  0.6,  1,     ADRENO,   "200",          ],
// --- Tegra ---
// http://en.wikipedia.org/wiki/Tegra
    "T30L":       [ARM,  1.3,  4,     TEGRA,    "T30L",         ],
    "AP37":       [ARM,  1.7,  4,     TEGRA,    "AP37",         ],
    "AP33":       [ARM,  1.5,  4,     TEGRA,    "AP33",         ],
    "AP25H":      [ARM,  1.2,  2,     TEGRA2,   "AP25",         ],
    "T20":        [ARM,  1.0,  2,     TEGRA2,   "T20",          ],
// --- OMAP ---
// http://en.wikipedia.org/wiki/OMAP
    "OMAP4460":   [ARM,  1.2,  2,     POWERVR,  "SGX540",       ],
    "OMAP4430":   [ARM,  1.2,  2,     POWERVR,  "SGX540",       ],
    "OMAP3630":   [ARM,  1.0,  1,     POWERVR,  "SGX530",       ],
// --- Samsung, Exynos ---
// http://ja.wikipedia.org/wiki/Exynos
    "Exynos5250": [ARM,  1.7,  2,     MALI,     "T604",         ],
    "Exynos4412": [ARM,  1.4,  4,     MALI,     "400 MP4",      ],
    "Exynos4210": [ARM,  1.2,  2,     MALI,     "400 MP4",      ],
    "S5PC110":    [ARM,  1.0,  1,     POWERVR,  "SGX540",       ],
    "S5PC100":    [ARM,  0.6,  1,     POWERVR,  "SGX535",       ], // iPhone 3GS, iPod touch 3
    "S5L8900":    [ARM,  0.4,  1,     POWERVR,  "MBX Lite",     ], // iPhone 3G, ARMv6
// --- HiSilicon ---
    "K3V2T":      [ARM,  1.2,  4,     IMMERSION,"Immersion.16", ],
    "K3V2":       [ARM,  1.2,  4,     IMMERSION,"Immersion.16", ],
// --- R-Mobile ---  
    "APE5R":      [ARM,  1.2,  2,     POWERVR,  "SGX543MP",     ],
// --- Apple ---
    "A7":         [ARM64,1.3,  2,     POWERVR,  "G6430",        ],
    "A6X":        [ARM,  1.4,  2,     POWERVR,  "SGX554MP4",    ],
    "A6":         [ARM,  1.3,  2,     POWERVR,  "SGX543MP3",    ],
    "A5X":        [ARM,  1.0,  2,     POWERVR,  "SGX543MP4",    ],
    "A5":         [ARM,  0.8,  2,     POWERVR,  "SGX543MP2",    ],
    "A4":         [ARM,  0.8,  1,     POWERVR,  "SGX535",       ],
//                [0]    [1]   [2]    [3]       [4]
//                TYPE   CPU   CPU    GPU,      GPU
//                       CLOCK CORES  TYPE      ID
};

//{@assert
function _if(booleanValue, errorMessageString) {
    if (booleanValue) {
        throw new Error(errorMessageString);
    }
}
//}@assert

// --- export ----------------------------------------------
if (global.process) { // node.js
    module.exports = Device;
}
global.Device = Device;

})(this.self || global);

