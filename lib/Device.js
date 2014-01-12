// @name: Device.js

(function(global) {

// --- define ----------------------------------------------
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

// --- implement -------------------------------------------
function _createSpecObject() { // @ret SpecObject: { DEVICE, OS, CPU, GPU, INPUT,
                               //                    MEMORY, DISPLAY, NETWORK, BROWSER }
    return {
        "DEVICE": {
            "ID":    "",        // Device ID.
            "MAYBE": false,     // Maybe Device ID.
            "BRAND": "",        // Device brand or maker name. eg: "Google", "SONY"
            "SOC":   "",        // System on chip name. eg: "MSM8974"
            "GPS":   false      // GPS enable.
        },
        "OS": {
            "TYPE":  "",        // OS type. "Android" or "iOS"
            "VERSION": {
                "CURRENT": {    // Current OS Version
                    "MAJOR": 0,
                    "MINOR": 0,
                    "PATCH": 0,
                    valueOf: _valueOf
                },
                "PRE": {        // Pre-installed OS Version.
                    "MAJOR": 0,
                    "MINOR": 0,
                    "PATCH": 0,
                    valueOf: _valueOf
                },
                "HIGHEST": {    // Highest Supported OS Version.
                    "MAJOR": 0,
                    "MINOR": 0,
                    "PATCH": 0,
                    valueOf: _valueOf
                },
                valueOf: function() { return this.CURRENT.valueOf(); }
            }
        },
        "CPU": {
            "TYPE":  "",        // CPU type. "ARM", "ARM64", "ATOM"
            "CLOCK": 0.0,       // CPU clock (unit: GHz). eg: 1.7
            "CORES": 0,         // CPU cores. eg: 2 (dual core)
            "SIMD":  false      // Enable SIMD (aka ARM-NEON).
        },
        "GPU": {
            "TYPE": "",         // GPU type. eg: "Adreno"
            "ID":   ""          // GPU ID. eg: "330"
        },
        "INPUT": {
            "TOUCH":   false,   // Touch enable.
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
            "USER_AGENT": ""
        }
    };
}

function _detectDeviceSpec(userAgent, // @arg UserAgentString:
                           emulate) { // @arg Object(= null): emulate spec values. { screen:Object, devicePixelRatio }
                                      // @ret SpecObject: device spec object.
                                      // @desc: detect device spec.

    // "Mozilla/5.0 (Linux; U; Android 4.0.4; ja-jp; SonySO-04D Build/7.0.D.1.117)..."
    //                                                   ~~~~~~
    //                                                  device id
    //
    var os = "", device = { id: "", maybe: false }, catalog = null;
    var spec = _createSpecObject();

    if ( /Android/.test(userAgent) ) {
        os      = "Android";
        device  = _getAndroidDevice(userAgent, emulate);
        catalog = DEVICE_CATALOG[device.id];
    } else if ( /iPhone|iPad|iPod/.test(userAgent) ) {
        os      = "iOS";
        device  = _getiOSDevice(userAgent, emulate);
        catalog = DEVICE_CATALOG[device.id];
    }
    if (catalog) {
        if (catalog["hook"]) { // has hook function.
            device.id    = catalog["hook"](device.id, emulate); // overwrite device id. "Nexus 7" -> "Nexus 7 (2013)"
            device.maybe = false;
            catalog      = DEVICE_CATALOG[device.id];  // catalog re-search
        }
        var socCatalog = SOC_CATALOG[ catalog[1] ];

        spec["DEVICE"]["ID"]             = device.id;
        spec["DEVICE"]["MAYBE"]          = device.maybe;
        spec["DEVICE"]["BRAND"]          = catalog[0];
        spec["DEVICE"]["SOC"]            = catalog[1];
        spec["DEVICE"]["GPS"]            = /GPS/.test(catalog[10]);
        spec["OS"]["TYPE"]               = os;
        spec["OS"]["VERSION"]["CURRENT"] = _version(_current(userAgent));
        spec["OS"]["VERSION"]["PRE"]     = _version(catalog[2]);
        spec["OS"]["VERSION"]["HIGHEST"] = _version(catalog[3]);
        spec["CPU"]["TYPE"]              = socCatalog[0];
        spec["CPU"]["CLOCK"]             = socCatalog[1];
        spec["CPU"]["CORES"]             = socCatalog[2];
        spec["CPU"]["SIMD"]              = socCatalog[3] !== "Tegra2"; // Tegra2 NEON unsupported
        spec["GPU"]["TYPE"]              = socCatalog[3];
        spec["GPU"]["ID"]                = socCatalog[4];
        spec["INPUT"]["TOUCH"]           = !!catalog[9]; // to Boolean value
        spec["INPUT"]["TOUCHES"]         = catalog[9];
        spec["MEMORY"]["RAM"]            = catalog[8];
        spec["DISPLAY"]["PPI"]           = catalog[6];
        spec["DISPLAY"]["DPR"]           = catalog[7];
        spec["DISPLAY"]["LONG"]          = Math.max(catalog[4], catalog[5]);
        spec["DISPLAY"]["SHORT"]         = Math.min(catalog[4], catalog[5]);
        spec["NETWORK"]["3G"]            = /3G/.test(catalog[10]);
        spec["NETWORK"]["LTE"]           = /LTE/.test(catalog[10]);
        spec["NETWORK"]["NFC"]           = /NFC/.test(catalog[10]);
        spec["NETWORK"]["WIFI"]          = /WIFI/.test(catalog[10]);
        spec["BROWSER"]["USER_AGENT"]    = userAgent;
    }
    return spec;
}

function _getAndroidDevice(userAgent, // @arg String:
                           emulate) { // @arg Object(= null): emulate spec values. { screen:Object, devicePixelRatio }
                                      // @ret Object: { id: String, maybe: Boolean }
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
    return { id: id, maybe: false };
}

function _getiOSDevice(userAgent, // @arg String:
                       emulate) { // @arg Object(= null): emulate spec values. { screen:Object, devicePixelRatio }
                                  // @ret Object: { id: String, maybe: Boolean }
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
    var maybe = 0;
    var dpr = deviceInfo["devicePixelRatio"] || 1;
    var longEdge = Math.max( (deviceInfo["screen"] || {})["width"]  || 0,
                             (deviceInfo["screen"] || {})["height"] || 0 ); // iPhone 4S: 480, iPhone 5: 568
//  var airPlay = !!global["WebKitPlaybackTargetAvailabilityEvent"]; // AirPlay API. iPhone4s++. iPad2++, iPad mini++, iPod touch 5++
//  var iOSVersion = parseFloat( userAgent.split(/OS /)[1].replace(/_/g, ".") );

    switch (id) {
    case "iPad":
        id = (dpr === 1) ? (++maybe, "iPad 2")  // maybe, candidate: iPad 2, iPad mini
                         : (++maybe, "iPad 3"); // maybe, candidate: iPad 3, iPad 4, iPad Air, iPad mini Retina, ...
        break;
    case "iPhone":
        id = (dpr === 1)      ? "iPhone 3GS"
           : (longEdge > 480) ? (++maybe, "iPhone 5")   // maybe, candidate: iPhone 5, iPhone 5c, iPhone 5s, iPhone 6...
                              : (++maybe, "iPhone 4");  // maybe, condidate: iPhone 4, iPhone 4S
        break;
    case "iPod":
        id = (longEdge > 480) ? (++maybe, "iPod touch 5")  // maybe, candidate: iPod touch 5, iPod touch 6...
           : (dpr === 2)      ? "iPod touch 4"
                              : "iPod touch 3";
    }
    return { id: id, maybe: !!maybe };
}

function _current(userAgent) { // @arg UserAgentString:
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
    }
    if (ver) {
        major = parseInt(ver[0]) * 100;
        minor = parseInt(ver[1]) * 10;
        patch = parseInt(ver[2] || 0);
    }
    return parseInt(major + minor + patch);
}

function _version(version) { // @arg VersionInteger: 3 or 4 digits number. eg: 442, 3106
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
    return { valueOf: _valueOf, MAJOR: major, MINOR: minor, PATCH: patch };
}

function _valueOf() {
    return parseFloat(this.MAJOR + "." + this.MINOR);
}

// --- const variable --------------------------------------
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

// --- SoC ---
var MSM8974     = "MSM8974";
var APQ8064T    = "APQ8064T";
var APQ8064     = "APQ8064";
var MSM8960     = "MSM8960";
var MSM8660A    = "MSM8660A";
var MSM8260A    = "MSM8260A";
var APQ8060     = "APQ8060";
var MSM8660     = "MSM8660";
var MSM8655     = "MSM8655";
var MSM8260     = "MSM8260";
var MSM8255T    = "MSM8255T";
var MSM8255     = "MSM8255";
var MSM7230     = "MSM7230";
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
//                       [0]       [1]        [2] [3]  [4]  [5]   [6] [7]   [8]  [9]    [10]
//                       BRAND     SOC        OS       SIZE       PPI DPR   RAM TOUCHES NFC+GPS+WiFi+3G+LTE
// --- Apple ---
    "iPod touch 3":     [APPLE,    S5PC100,   310,511,  640,960,  326,  2,0.125,  5,     W  ], // iPod touch 8GB Model
  //"iPod touch 3":     [APPLE,    CortexA8,  310,511,  640,960,  326,  2, 0.25,  5,     W  ], // iPod touch 32/64GB Model
    "iPod touch 4":     [APPLE,    A4,        410,615,  640,960,  326,  2, 0.25,  5,     W  ],
    "iPod touch 5":     [APPLE,    A5,        600,0,    640,1136, 326,  2,  0.5,  5,     W  ],
    "iPhone 3G":        [APPLE,    S5L8900,   200,421,  320,480,  163,  1,0.125,  5,    GW3 ],
    "iPhone 3GS":       [APPLE,    S5PC100,   300,615,  320,480,  163,  1, 0.25,  5,    GW3 ],
    "iPhone 4":         [APPLE,    A4,        400,0,    640,960,  326,  2,  0.5,  5,    GW3 ],
    "iPhone 4S":        [APPLE,    A5,        511,0,    640,960,  326,  2,  0.5,  5,    GW3 ],
    "iPhone 5":         [APPLE,    A6,        600,0,    640,1136, 326,  2,    1,  5,    GW3L],
    "iPhone 5c":        [APPLE,    A6,        700,0,    640,1136, 326,  2,    1,  5,    GW3L],
    "iPhone 5s":        [APPLE,    A7,        700,0,    640,1136, 326,  2,    1,  5,    GW3L],
    "iPad 1":           [APPLE,    A4,        320,615,  768,1024, 132,  1, 0.25, 10,    GW  ],
    "iPad 2":           [APPLE,    A5,        430,0,    768,1024, 132,  1,  0.5, 10,    GW3 ],
    "iPad 3":           [APPLE,    A5X,       510,0,   1536,2048, 264,  2,    1, 10,    GW3 ],
    "iPad 4":           [APPLE,    A6X,       600,0,   1536,2048, 264,  2,    1, 10,    GW3L],
    "iPad Air":         [APPLE,    A7,        700,0,   1536,2048, 264,  2,    1, 10,    GW3L],
    "iPad mini":        [APPLE,    A5,        600,0,    768,1024, 132,  2,  0.5, 10,    GW3 ],
    "iPad mini Retina": [APPLE,    A7,        700,0,   1536,2048, 326,  2,    1, 10,    GW3L],
// --- Google ---
    "Nexus One":        [GOOGLE,   QSD8250,   210,236,  480,800,  252,1.5,  0.5,  2,     GW3 ],
    "Nexus S":          [GOOGLE,   S5PC110,   232,410,  480,800,    0,1.5,  0.5,  5,    NGW3 ],
    "Galaxy Nexus":     [GOOGLE,   OMAP4460,  400,422,  720,1280, 316,  2,    1,  2,    NGW3L], // LTE (partial)
    "Nexus 4":          [GOOGLE,   APQ8064,   420,0,    768,1280, 318,  2,    2,  5,    NGW3L],
    "Nexus 5":          [GOOGLE,   MSM8974,   440,0,   1080,1920, 445,  3,    2,  5,    NGW3L],
    "Nexus 7":          [GOOGLE,   T30L,      411,0,    800,1280, 216,.33 ,   1,  5,    NGW3L],
    "Nexus 7 (2013)":   [GOOGLE,   APQ8064,   430,0,   1200,1920, 323,  2,    2,  5,    NGW3L],
    "Nexus 10":         [GOOGLE,   EXYNOS5250,420,0,   1600,2560, 300,  2,    2,  5,    NGW  ],
// --- docomo --- http://spec.nttdocomo.co.jp/spmss/
    "L-01F":            [LG,       MSM8974,   422,422, 1080,1776, 480,  0,    2,  5,    NGW3L],
    "SC-01F":           [SAMSUNG,  MSM8974,   430,433, 1080,1920, 480,  0,    2,  5,    NGW3L],
    "SC-02F":           [SAMSUNG,  MSM8974,   430,430, 1080,1920, 480,  0,    2,  5,    NGW3L],
    "SH-01F":           [SHARP,    MSM8974,   422,422, 1080,1776, 480,  0,    2,  5,    NGW3L],
    "SH-01FDQ":         [SHARP,    MSM8974,   422,422, 1080,1776, 480,  0,    2,  5,    NGW3L],
    "SH-02F":           [SHARP,    MSM8974,   422,0,   1080,1920, 487,  0,    2,  5,    NGW3L],
    "SH-03F":           [SHARP,    MSM8960,     0,0,    540,960,    0,  0,    0,  5,    NGW3L], // JUNIOR 2 (no Google Play)
    "SO-01F":           [SONY,     MSM8974,   422,422, 1080,1776, 480,  3,    2,  5,    NGW3L], // Xperia Z1
    "SO-02F":           [SONY,     MSM8974,   422,422,  720,1184, 320,  0,    2,  5,    NGW3L],
    "F-01F":            [FUJITSU,  MSM8974,   422,422, 1080,1776, 480,  0,    2,  5,    NGW3L],
    "F-02F":            [FUJITSU,  MSM8974,   422,422, 1504,2560, 320,  0,    2,  5,    NGW3L],
    "F-03F":            [FUJITSU,  MSM8974,   422,422,  720,1184, 320,  0,    2,  5,    NGW3L],
    "F-04F":            [FUJITSU,  APQ8064T,  422,422,  540,888,  240,  0,    2,  5,     GW3 ],
    "L-05E":            [LG,       APQ8064T,  422,422,  720,1280, 320,  0,    2,  5,    NGW3L],
    "N-06E":            [NEC,      APQ8064T,  422,422,  720,1184, 320,  0,    2,  5,    NGW3L],
    "SC-04E":           [SAMSUNG,  APQ8064T,  422,422, 1080,1920, 480,  0,    2,  5,    NGW3L],
    "SO-04E":           [SONY,     APQ8064,   412,422,  720,1184, 320,  0,    2,  5,    NGW3L],
    "SO-04EM":          [SONY,     APQ8064,   422,422,  720,1184, 320,  0,    2,  5,    NGW3L],
    "SH-06E":           [SHARP,    APQ8064T,  422,422, 1080,1920, 480,  0,    2,  5,    NGW3L],
    "SH-07E":           [SHARP,    APQ8064T,  422,422,  720,1280, 320,  0,    2,  2,    NGW3L],
    "SH-08E":           [SHARP,    APQ8064T,  422,422, 1200,1824, 320,  0,    2,  5,    NGW3L],
    "P-03E":            [PANASONIC,APQ8064T,  422,422, 1080,1920, 480,  0,    2,  5,    NGW3L],
    "F-06E":            [FUJITSU,  APQ8064T,  422,422, 1080,1776, 480,  0,    2,  5,    NGW3L],
    "F-07E":            [FUJITSU,  APQ8064T,  422,422,  720,1184, 320,  0,    2,  5,    NGW3L],
    "F-08E":            [FUJITSU,  APQ8064T,  422,422,  540,867,  240,  0,    2,  5,     GW3L],
    "F-09E":            [FUJITSU,  APQ8064T,  422,422,  540,888,  240,  0,    2,  5,     GW3L],
    "L-01E":            [LG,       APQ8064,   404,412,  720,1280, 320,  0,    2,  5,     GW3L],
    "L-02E":            [LG,       MSM8960,   404,412,  720,1280, 320,  0,    1,  5,     GW3L],
    "L-04E":            [LG,       APQ8064T,  412,412, 1080,1920, 480,  0,    2,  5,    NGW3L],
    "N-02E":            [NEC,      MSM8960,   404,412,  480,800,  240,  0,    1,  5,     GW3L],
    "N-03E":            [NEC,      APQ8064,   404,412,  720,1280, 320,  0,    2,  5,     GW3L],
    "N-04E":            [NEC,      APQ8064,   412,412,  720,1280, 320,  0,    2,  5,     GW3L],
    "N-05E":            [NEC,      MSM8960,   412,412,  540,960,  240,  0,    1,  5,     GW3L],
    "SC-01E":           [SAMSUNG,  APQ8060,   404,404,  800,1280, 160,  0,    1,  5,     GW3L],
    "SC-02E":           [SAMSUNG,  EXYNOS4412,411,411,  720,1280, 320,  0,    2,  5,     GW3L],
    "SC-03E":           [SAMSUNG,  EXYNOS4412,411,411,  720,1280, 320,  0,    2,  5,     GW3L],
    "SH-01E":           [SHARP,    MSM8960,   404,404,  540,888,  240,  0,    1,  2,     GW3L],
    "SH-01EVW":         [SHARP,    MSM8960,   404,404,  540,888,  240,  0,    1,  2,     GW3L],
    "SH-02E":           [SHARP,    APQ8064,   404,412,  720,1280, 320,  0,    2,  2,    NGW3L],
    "SH-04E":           [SHARP,    APQ8064,   412,412,  720,1184, 320,  0,    2,  5,    NGW3L],
    "SH-05E":           [SHARP,    MSM8960,   404,404,  540,960,  240,  0,    1,  2,      G3L], // JUNIOR (no Google Play, no WiFi)
    "SO-01E":           [SONY,     MSM8960,   404,412,  720,1184, 320,  0,    1,  5,    NGW3L],
    "SO-02E":           [SONY,     APQ8064,   412,422,  720,1184, 320,  3,    1,  5,    NGW3L], // Xperia Z
    "SO-03E":           [SONY,     APQ8064,   412,412, 1128,1920, 240,  0,    2,  5,    NGW3L],
    "P-02E":            [PANASONIC,APQ8064,   412,412, 1080,1920, 480,  0,    2,  5,    NGW3L],
    "F-02E":            [FUJITSU,  AP37,      412,412, 1080,1920, 480,  0,    2,  5,    NGW3L],
    "F-03E":            [FUJITSU,  MSM8960,   404,412,  540,960,  240,  0,    1,  5,    NGW3L],
    "F-04E":            [FUJITSU,  AP33,      404,422,  720,1280, 320,  0,    2,  5,    NGW3L],
    "F-05E":            [FUJITSU,  AP37,      404,412, 1200,1920, 240,  0,    2,  5,    NGW3L],
    "HW-01E":           [HUAWEI,   MSM8960,   404,404,  720,1280, 320,  0,    1,  5,     GW3L],
    "HW-03E":           [HUAWEI,   K3V2,      412,412,  720,1280, 320,  0,    2,  5,     GW3L],
    "dtab01":           [HUAWEI,   K3V2T,     412,412,  800,1280, 160,  0,    1,  5,     GW3 ],
    "L-05D":            [LG,       MSM8960,   404,412,  480,800,  240,1.5,    1,  5,     GW3L], // Optimus it
    "L-06D":            [LG,       APQ8060,   404,404,  768,1024, 320,  0,    1,  5,     GW3L],
    "L-06DJOJO":        [LG,       APQ8060,   404,404,  768,1024, 320,  0,    1,  5,     GW3L],
    "N-07D":            [NEC,      MSM8960,   404,404,  720,1280, 342,  0,    1,  5,     GW3L],
    "N-08D":            [NEC,      MSM8960,   404,404,  800,1280, 213,  0,    1,  5,     GW3L],
    "SC-06D":           [SAMSUNG,  MSM8960,   404,412,  720,1280, 320,  2,    2,  5,     GW3L], // Galaxy S III
    "SH-06D":           [SHARP,    OMAP4460,  235,404,  720,1280, 320,  0,    1,  5,     GW3 ],
    "SH-06DNERV":       [SHARP,    OMAP4460,  235,404,  720,1280, 320,  0,    1,  2,     GW3 ],
    "SH-07D":           [SHARP,    MSM8255,   404,404,  480,854,  240,  0,    1,  2,     GW3 ],
    "SH-09D":           [SHARP,    MSM8960,   404,412,  720,1280, 312,  0,    1,  2,     GW3L],
    "SH-10D":           [SHARP,    MSM8960,   404,412,  720,1280, 320,  0,    1,  2,     GW3L],
    "SO-04D":           [SONY,     MSM8960,   404,412,  720,1184, 320,  0,    1,  5,     GW3L],
    "SO-05D":           [SONY,     MSM8960,   404,412,  540,888,  240,1.5,    1,  5,     GW3L], // Xperia SX
    "P-06D":            [PANASONIC,OMAP4460,  404,404,  720,1280, 320,  0,    1,  5,     GW3 ],
    "P-07D":            [PANASONIC,MSM8960,   404,404,  720,1280, 320,  0,    1,  5,     GW3L],
    "P-08D":            [PANASONIC,OMAP4460,  404,404,  800,1280, 160,  0,    1,  5,     GW3 ],
    "F-09D":            [FUJITSU,  MSM8255,   403,403,  480,800,  240,  0,    1,  2,     GW3 ],
    "F-10D":            [FUJITSU,  AP33,      403,422,  720,1280, 323,  2,    1,  5,     GW3L], // ARROWS X
    "F-11D":            [FUJITSU,  MSM8255,   403,422,  480,800,  240,  0,    1,  5,     GW3 ],
    "F-12D":            [FUJITSU,  MSM8255,   403,403,  480,800,  235,  0,    1,  5,     GW3 ],
    "T-02D":            [TOSHIBA,  MSM8960,   404,412,  540,960,  257,  0,    1,  5,     GW3L],
    "L-01D":            [LG,       APQ8060,   235,404,  720,1280, 320,  0,    1,  5,     GW3L],
    "L-02D":            [LG,       OMAP4430,  237,404,  480,800,  240,  0,    1,  5,     GW3 ],
    "N-01D":            [NEC,      MSM8255T,  235,235,  480,800,  235,  0,  0.5,  5,     GW3 ],
    "N-04D":            [NEC,      APQ8060,   236,404,  720,1280, 342,  0,    1,  5,     GW3L],
    "N-05D":            [NEC,      MSM8260,   236,404,  720,1280, 320,  0,    1,  5,     GW3 ],
    "N-06D":            [NEC,      APQ8060,   236,404,  800,1280, 213,  0,    1,  5,     GW3L],
    "SC-01D":           [SAMSUNG,  APQ8060,   320,404,  800,1200, 160,  0,    1,  5,     GW3L],
    "SC-02D":           [SAMSUNG,  EXYNOS4210,320,404,  600,1024, 160,  0,    1,  5,     GW3 ],
    "SC-03D":           [SAMSUNG,  APQ8060,   236,404,  480,800,  240,1.5,    1,  5,    NGW3L], // GALAXY S II LTE
    "SC-04D":           [SAMSUNG,  OMAP4460,  401,422,  720,1280, 320,  2,    1,  5,    NGW3 ], // Galaxy Nexus
    "SC-05D":           [SAMSUNG,  APQ8060,   236,412,  800,1280, 320,  0,    1,  5,    NGW3L],
    "SH-01D":           [SHARP,    OMAP4430,  235,404,  720,1280, 328,  0,    1,  2,     GW3 ],
    "SH-02D":           [SHARP,    MSM8255,   235,235,  540,960,  300,  0,  0.5,  2,     GW3 ],
    "SH-04D":           [SHARP,    MSM8255,   234,234,  540,960,  300,  0,  0.5,  2,     GW3 ],
    "SO-01D":           [SONY,     MSM8255,   234,234,  480,854,  240,1.5,  0.5,  2,     GW3 ], // Xperia Play
    "SO-02D":           [SONY,     MSM8260,   237,404,  720,1280, 320,  0,    1,  5,     GW3 ],
    "SO-03D":           [SONY,     MSM8260,   237,404,  720,1280, 320,  0,    1,  5,     GW3 ],
    "P-01D":            [PANASONIC,MSM8255,   234,234,  480,800,  240,1.5,  0.5,  2,     GW3 ],
    "P-02D":            [PANASONIC,OMAP4430,  235,404,  540,960,  240,  0,    1,  2,     GW3 ],
    "P-04D":            [PANASONIC,OMAP4430,  235,404,  540,960,  257,  0,    1,  5,     GW3 ],
    "P-05D":            [PANASONIC,OMAP4430,  235,404,  540,960,  257,  0,    1,  5,     GW3 ],
    "F-01D":            [FUJITSU,  OMAP4430,  320,403,  800,1280, 160,  0,    1,  5,     GW3L],
    "F-03D":            [FUJITSU,  MSM8255,   235,235,  480,800,  240,  0,  0.5,  2,     GW3 ],
    "F-05D":            [FUJITSU,  OMAP4430,  235,403,  720,1280, 342,  0,    1,  2,     GW3L],
    "F-07D":            [FUJITSU,  MSM8255,   235,235,  480,800,  235,  0,  0.5,  5,     GW3 ],
    "F-08D":            [FUJITSU,  OMAP4430,  235,403,  720,1280, 342,  0,    1,  2,     GW3 ],
    "T-01D":            [TOSHIBA,  OMAP4430,  235,403,  720,1280, 320,  0,    1,  2,     GW3 ],
    "SC-02C":           [SAMSUNG,  EXYNOS4210,403,403,  480,800,  240,  0,    1,  5,     GW3 ], // Galaxy S II
    "SO-01C":           [SONY,     MSM8255,   232,234,  480,854,    0,1.5,  0.5,  2,     GW3 ], // Xperia arc
    "SO-02C":           [SONY,     MSM8255,   233,234,  480,854,    0,  0,  0.5,  2,     GW3 ], // Xperia acro
    "SO-03C":           [SONY,     MSM8255,   234,234,  480,854,    0,  0,  0.5,  2,     GW3 ], // Xperia acro
    "SH-13C":           [SHARP,    MSM8255,   234,234,  540,960,    0,  0,  0.5,  2,     GW3 ],
    "SH-12C":           [SHARP,    MSM8255T,  233,233,  540,960,    0,  0,  0.5,  2,     GW3 ],
    "N-04C":            [NEC,      MSM7230,   220,233,  480,854,    0,  0,  0.5,  2,     GW3 ],
    "N-06C":            [NEC,      MSM8255,   230,230,  480,854,    0,  0,  0.5,  2,     GW3 ],
    "P-07C":            [PANASONIC,OMAP3630,  230,230,  480,800,    0,  0,  0.5,  2,     GW3 ],
    "F-12C":            [FUJITSU,  MSM8255,   230,230,  480,800,    0,  0,  0.5,  2,     GW3 ],
    "L-04C":            [LG,       MSM7227,   220,230,  320,480,    0,  0,  0.5,  2,     GW3 ],
    "L-06C":            [LG,       T20,       300,310,  768,1280,   0,  0,    1,  2,     GW3 ],
    "L-07C":            [LG,       OMAP3630,  233,233,  480,800,    0,  0,  0.5,  2,     GW3 ],
    "T-01C":            [TOSHIBA,  QSD8250,   211,222,  480,854,    0,1.5,    0,  2,     GW3 ], // REGZA Phone
    "SH-03C":           [SONY,     QSD8250,   211,222,  480,800,    0,  0,    0,  2,     GW3 ],
    "SC-01C":           [SAMSUNG,  S5PC110,   220,236,  600,1024,   0,1.5,    0,  2,     GW3 ], // GALAXY Tab
    "SC-02B":           [SAMSUNG,  S5PC110,   220,236,  480,800,    0,1.5,    0,  2,     GW3 ], // GALAXY S
    "SH-10B":           [SHARP,    QSD8250,   160,160,  480,960,    0,  1,    0,  2,     GW3 ], // LYNX
    "SO-01B":           [SONY,     QSD8250,   160,211,  480,854,    0,1.5,0.375,  1,     GW3 ],// Xperia
//                       [0]       [1]        [2] [3]  [4]  [5]   [6] [7]   [8]  [9]    [10]
//                       BRAND     SOC        OS       SIZE       PPI DPR   RAM TOUCHES NFC+GPS+WiFi+3G+LTE
// --- au --- http://www.au.kddi.com/developer/android/
    "FJT21":            [FUJITSU,  MSM8974,   422,422, 1600,2560, 300,  0,    2, 10,    NGW3L],
    "SOL23":            [SONY,     MSM8974,   422,422, 1080,1920, 442,  3,    2, 10,    NGW3L], // Xperia Z1
    "SCL22":            [SAMSUNG,  MSM8974,   430,430, 1080,1920, 386,  0,    3, 10,    NGW3L],
    "KYL22":            [KYOCERA,  MSM8974,   422,422, 1080,1920, 443,  0,    2,  5,    NGW3L],
    "LGL22":            [LG,       MSM8974,   422,422, 1080,1920, 422,  0,    2, 10,    NGW3L], // isai
    "SHL23":            [SHARP,    MSM8974,   422,422, 1080,1920, 460,  0,    2,  5,    NGW3L],
    "FJL22":            [FUJITSU,  MSM8974,   422,422, 1080,1920, 444,  0,    2, 10,    NGW3L],
    "SHL22":            [SHARP,    APQ8064T,  422,422,  720,1280, 302,  0,    2,  5,    NGW3L],
    "KYY21":            [KYOCERA,  MSM8960,   422,422,  720,1280, 314,  0,    2,  5,    NGW3L], // URBANO L01
    "HTL22":            [HTC,      APQ8064T,  412,422, 1080,1920, 468,  0,    2, 10,    NGW3L], // HTC J One
    "SOL22":            [SONY,     APQ8064,   412,422, 1080,1920, 443,  0,    2, 10,    NGW3L], // Xperia UL
    "HTX21":            [HTC,      APQ8064,   411,411,  720,1280, 314,  0,    1, 10,    NGW3L], // INFOBAR A02
    "SHT21":            [SHARP,    MSM8960,   404,412,  800,1280, 216,  0,    1,  2,    NGW3L], // AQUOS PAD
    "HTL21":            [HTC,      APQ8064,   411,411, 1080,1920, 444,  3,    2, 10,    NGW3L], // HTC J Butterfly
    "SCL21":            [SAMSUNG,  MSM8960,   404,412,  720,1280, 306,  0,    2, 10,     GW3L], // GALAXY SIII Progre
    "CAL21":            [CASIO,    MSM8960,   404,404,  480,800,  236,  0,    1,  5,     GW3L], // G'zOne TYPE-L
    "SHL21":            [SHARP,    MSM8960,   404,412,  720,1280, 309,  0,    1,  2,     GW3L], // AUOS PHONE SERIE
    "KYL21":            [KYOCERA,  MSM8960,   404,404,  720,1280, 314,  0,    1,  5,     GW3L], // DIGNO S
    "FJL21":            [FUJITSU,  MSM8960,   404,404,  720,1280, 342,  2,    1, 10,     GW3L], // ARROWS ef
    "SOL21":            [SONY,     MSM8960,   404,412,  720,1280, 345,  0,    1, 10,     GW3L], // Xperia VL
    "LGL21":            [LG,       APQ8064,   404,404,  720,1280, 315,  0,    2, 10,     GW3L], // Optimus G
    "PTL21":            [PANTECH,  MSM8960,   404,412,  720,1280, 342,  0,    1,  5,     GW3L], // VEGA
    "ISW13F":           [FUJITSU,  AP33,      403,403,  720,1280, 322,  0,    1,  3,     GW3 ], // ARROWS Z
    "IS17SH":           [SHARP,    MSM8655,   404,404,  540,960,  240,  0,    1,  2,     GW3 ], // AQUOS PHONE CL
    "IS15SH":           [SHARP,    MSM8655,   404,404,  540,960,  298,  0,    1,  2,     GW3 ], // AQUOS PHONE SL
    "ISW16SH":          [SHARP,    MSM8660A,  404,404,  720,1280, 318,  2,    1,  2,     GW3 ], // AQUOS PHONE SERIE
    "URBANO PROGRESSO": [KYOCERA,  MSM8655,   403,403,  480,800,  235,  0,    1,  5,     GW3 ],
    "ISW13HT":          [HTC,      MSM8660A,  403,403,  540,960,  204,  0,    1,  4,     GW3 ], // HTC J
    "IS12S":            [SONY,     MSM8660,   237,404,  720,1280, 342,  0,    1, 10,     GW3 ], // Xperia acro HD
    "IS12M":            [MOTOROLA, OMAP4430,  236,404,  540,960,  256,  0,    1, 10,     GW3 ], // MOTOROLA RAZR
    "INFOBAR C01":      [SHARP,    MSM8655,   235,235,  480,854,  309,  0,  0.5,  2,     GW3 ], // INFOBAR C01
    "ISW11SC":          [SAMSUNG,  EXYNOS4210,236,404,  720,1080, 315,  2,    1, 10,     GW3 ], // GALAXY SII WiMAX
    "IS11LG":           [LG,       AP25H,     237,404,  480,800,  235,  0,    1, 10,     GW3 ], // Optimus X
    "IS12F":            [FUJITSU,  MSM8655,   235,235,  480,800,  235,  0,  0.5,  4,     GW3 ], // ARROWS ES
    "IS14SH":           [SHARP,    MSM8655,   235,235,  540,960,  298,  0,  0.5,  2,     GW3 ], // AQUOS PHONE
    "IS11N":            [NEC,      MSM8655,   235,235,  480,800,  262,  0,  0.5,  5,     GW3 ], // MEDIAS BR
    "ISW11F":           [FUJITSU,  OMAP4430,  235,403,  720,1280, 342,  0,    1,  3,     GW3 ], // ARROWS Z
    "ISW11K":           [KYOCERA,  MSM8655,   235,235,  480,800,  234,  0,    1, 10,     GW3 ], // DIGNO
    "IS13SH":           [SHARP,    MSM8655,   235,235,  540,960,  258,  0,  0.5,  2,     GW3 ], // AQUOS PHONE
    "ISW12HT":          [HTC,      MSM8660,   234,403,  540,960,  256,  0,    1,  4,     GW3 ], // HTC EVO 3D
    "ISW11M":           [MOTOROLA, T20,       234,234,  540,960,  256,  0,    1,  2,     GW3 ], // MOTOROLA PHOTON
    "EIS01PT":          [PANTECH,  MSM8655,   234,234,  480,800,  254,  0,  0.5,  5,     GW3 ],
    "IS11PT":           [PANTECH,  MSM8655,   234,234,  480,800,  254,  0,  0.5,  5,     GW3 ], // MIRACH
    "IS11T":            [TOSHIBA,  MSM8655,   234,234,  480,854,  243,  0,  0.5,  3,     GW3 ], // REGZA Phone
    "IS11CA":           [CASIO,    MSM8655,   233,233,  480,800,  262,  0,  0.5,  5,     GW3 ], // G'zOne
    "INFOBAR A01":      [SHARP,    MSM8655,   233,233,  540,960,  265,1.5,  0.5,  2,     GW3 ], // INFOBAR A01
    "IS12SH":           [SHARP,    MSM8655,   233,233,  540,960,  263,  0,  0.5,  2,     GW3 ], // AQUOS PHONE
    "IS11SH":           [SHARP,    MSM8655,   233,233,  540,960,  298,  0,  0.5,  2,     GW3 ], // AQUOS PHONE
    "IS11S":            [SONY,     MSM8655,   233,234,  480,854,  232,  0,  0.5,  2,     GW3 ], // Xperia acro
    "ISW11HT":          [HTC,      QSD8650,   221,234,  480,800,  254,1.5,  0.5,  2,     GW3 ], // HTC EVO WiMAX
    "IS06":             [PANTECH,  QSD8650,   221,221,  480,800,  254,1.5,  0.5,  5,     GW3 ], // SIRIUS alpha
    "IS05":             [SHARP,    MSM8655,   221,234,  480,854,  290,  0,  0.5,  2,     GW3 ],
    "IS04":             [TOSHIBA,  QSD8650,   210,222,  480,854,  290,  0,  0.5,  2,     GW3 ],
    "IS03":             [SHARP,    QSD8650,   210,221,  640,960,  331,  2,  0.5,  2,     GW3 ],
    "IS01":             [SHARP,    QSD8650,   160,160,  480,960,  213,  1, 0.25,  1,     GW3 ],
//                       [0]       [1]        [2] [3]  [4]  [5]   [6] [7]   [8]  [9]    [10]
//                       BRAND     SOC        OS       SIZE       PPI DPR   RAM TOUCHES NFC+GPS+WiFi+3G+LTE
// --- SoftBank ---
    "X06HT":            [HTC,      QSD8250,   210,220,  480,800,    0,  1,  0.5,  2,     GW3 ],
    "001HT":            [HTC,      MSM8255,   220,233,  480,800,    0,1.5,0.375,  2,     GW3 ],
    "SBM003SH":         [SHARP,    MSM8255,   220,234,  480,800,    0,1.5,  0.5,  2,     GW3 ],
    "001DL":            [DELL,     QSD8250,   220,220,  480,800,    0,  0,  0.5,  2,     GW3 ],
    "003Z":             [ZTE,      MSM7227,   220,220,  480,800,    0,  0,  0.5,  2,     GW3 ], // Libero
    "DM009SH":          [SHARP,    MSM8255,   220,234,  480,800,    0,  0,  0.5,  2,     GW3 ],
    "SBM005SH":         [SHARP,    MSM8255,   221,221,  480,800,    0,  0,  0.5,  2,     GW3 ],
    "SBM006SH":         [SHARP,    MSM8255,   233,233,  540,960,    0,  0,  0.5,  2,     GW3 ],
    "SBM007SH":         [SHARP,    MSM8255,   233,233,  480,854,  288,  0,  0.5,  2,     GW3 ],
    "SBM007SHJ":        [SHARP,    MSM8255,   233,233,  480,854,  288,  0,  0.5,  2,     GW3 ],
    "003P":             [PANASONIC,OMAP3630,  233,233,  480,854,    0,  0,  0.5,  2,     GW3 ],
    "007HW":            [HUAWEI,   MSM8255,   234,234,  480,800,    0,  0,  0.5,  2,     GW3 ], // Vision
    "SBM009SH":         [SHARP,    MSM8255,   234,234,  540,960,    0,  0,  0.5,  2,     GW3 ],
    "SBM007SHK":        [SHARP,    MSM8255,   233,233,  480,854,  288,  0,  0.5,  2,     GW3 ],
    "SBM009SHY":        [SHARP,    MSM8255,   234,234,  540,960,  288,  0,  0.5,  2,     GW3 ],
    "DM010SH":          [SHARP,    MSM8255,   234,234,  540,960,    0,  0,  0.5,  2,     GW3 ],
    "SBM101SH":         [SHARP,    MSM8255,   235,235,  480,854,  288,  0,  0.5,  2,     GW3 ],
    "DM011SH":          [SHARP,    MSM8255,   235,235,  480,854,  288,  0,  0.5,  2,     GW3 ],
    "SBM102SH":         [SHARP,    OMAP4430,  235,404,  720,1280, 326,  0,    1,  2,     GW3 ],
    "101P":             [PANASONIC,OMAP4430,  235,235,  480,854,    0,  0,    1,  2,     GW3 ],
    "101N":             [NEC,      MSM8255,   235,235,  480,800,    0,  0,  0.5,  2,     GW3 ],
    "SBM103SH":         [SHARP,    MSM8255,   235,235,  540,960,  275,  0,  0.5,  2,     GW3 ],
    "101K":             [KYOCERA,  APE5R,     234,234,  480,800,    0,  0,  0.5,  2,     GW3 ],
    "DM012SH":          [SHARP,    MSM8255,   235,235,  540,960,    0,  0,  0.5,  2,     GW3 ],
    "SBM104SH":         [SHARP,    OMAP4460,  403,403,  720,1280, 326,  0,    1,  2,     GW3 ],
    "008Z":             [ZTE,      MSM8255,   230,230,  480,800,    0,  0,  0.5,  2,     GW3 ],
    "101DL":            [DELL,     MSM8260,   235,235,  540,960,    0,  0,    1,  2,     GW3 ],
    "102P":             [PANASONIC,OMAP4430,  235,235,  540,960,  275,  0,    1,  2,     GW3 ],
    "WX04K":            [KYOCERA,  APE5R,     234,411,  480,800,    0,  0,    1,  2,     GW3 ],
    "SBM106SH":         [SHARP,    MSM8260A,  404,404,  720,1280,   0,  0,    1,  2,     GW3 ],
    "SBM102SH2":        [SHARP,    OMAP4430,  235,404,  720,1280,   0,  0,    1,  2,     GW3 ],
    "SBM107SH":         [SHARP,    MSM8255,   404,404,  480,854,    0,  0,    1,  2,     GW3 ],
    "101F":             [FUJITSU,  MSM8960,   404,412,  540,960,    0,  0,    1,  2,     GW3 ],
    "WX06K":            [KYOCERA,  APE5R,     234,234,  480,800,    0,  0,  0.5,  2,     GW3 ],
    "009Z":             [ZTE,      MSM8255,   234,234,  480,800,    0,  0,  0.5,  2,     GW3 ], // STAR7
    "201HW":            [HUAWEI,   MSM8960,   400,400,  540,960,    0,  0,    1,  2,     GW3 ],
    "SBM107SHB":        [SHARP,    MSM8255,   404,404,  480,854,    0,  0,    1,  2,     GW3 ],
    "DM013SH":          [SHARP,    MSM8255,   404,404,  480,854,    0,  0,    1,  2,     GW3 ],
    "SBM200SH":         [SHARP,    MSM8960,   404,410,  720,1280,   0,  0,    1,  2,     GW3 ],
    "201K":             [KYOCERA,  MSM8960,   412,412,  480,800,    0,  0,    1,  2,     GW3 ],
    "201F":             [FUJITSU,  APQ8064,   412,412,  720,1280,   0,  0,    2,  2,     GW3 ],
    "DM014SH":          [SHARP,    MSM8960,   404,412,  720,1280,   0,  0,    1,  2,     GW3 ],
    "201M":             [MOTOROLA, MSM8960,   400,410,  540,960,    0,  0,    1,  2,     GW3 ], // Motorola RAZR
    "SBM203SH":         [SHARP,    APQ8064,   412,412,  720,1280,   0,  0,    2,  2,     GW3 ],
    "SBM204SH":         [SHARP,    MSM8255,   404,404,  480,800,    0,  0,    1,  2,     GW3 ],
    "SBM205SH":         [SHARP,    MSM8960,   412,412,  480,854,    0,  0,    1,  2,     GW3 ],
    "SBM206SH":         [SHARP,    APQ8064T,  422,422, 1080,1920,   0,  0,    2,  2,     GW3 ],
    "202F":             [FUJITSU,  APQ8064T,  422,422, 1080,1920,   0,  0,    2,  2,     GW3 ],
    "202K":             [KYOCERA,  MSM8960,   422,422,  720,1280, 340,  0,    1,  2,     GW3 ],
    "WX10K":            [KYOCERA,  MSM8960,   422,422,  720,1280,   0,  0,    1,  2,     GW3 ],
    "DM015K":           [KYOCERA,  MSM8960,   422,422,  720,1280,   0,  0,  1.5,  2,     GW3 ],
    "EM01F":            [KYOCERA,  APQ8064,   412,412,  720,1280,   0,  0,    2,  2,     GW3 ],
    "204HW":            [HUAWEI,   MSM8225,   410,410,  480,800,    0,  0,    1,  2,     GW3 ], // for Silver Age
    "WX04SH":           [KYOCERA,  MSM8260A,  412,412,  480,854,    0,  0,    1,  2,     GW3 ],
    "301F":             [FUJITSU,  MSM8974,   422,422, 1080,1920,   0,  0,    2,  2,     GW3L],
    "EM01L":            [GOOGLE,   MSM8974,   440,440, 1080,1920, 445,  3,    2,  5,     GW3 ], // Nexus 5 EM01L
    "DM016SH":          [SHARP,    MSM8974,   422,422, 1080,1920,   0,  0,  1.5,  2,    NGW3L],
    "SBM302SH":         [SHARP,    MSM8974,   422,422, 1080,1920,   0,  0,    2,  5,    NGW3L],
    "SBM303SH":         [SHARP,    MSM8974,   422,422, 1080,1920,   0,  0,    2,  5,     GW3L], // AQUOS PHONE Xx mini 303SH
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
// --- Snapdragon --- http://en.wikipedia.org/wiki/Snapdragon_(system_on_chip)
 // "xxxxxxxx":   [ARM,  2.5,  4,     ADRENO,   "420",          ],
    "MSM8974":    [ARM,  2.2,  4,     ADRENO,   "330",          ],
    "APQ8064T":   [ARM,  1.7,  4,     ADRENO,   "320",          ],
    "APQ8064":    [ARM,  1.5,  4,     ADRENO,   "320",          ],
    "MSM8960":    [ARM,  1.5,  2,     ADRENO,   "225",          ],
    "MSM8660A":   [ARM,  1.5,  2,     ADRENO,   "225",          ],
    "MSM8260A":   [ARM,  1.5,  2,     ADRENO,   "225",          ],
    "APQ8060":    [ARM,  1.2,  2,     ADRENO,   "220",          ],
    "MSM8660":    [ARM,  1.2,  2,     ADRENO,   "220",          ],
    "MSM8655":    [ARM,  1.0,  1,     ADRENO,   "205",          ],
    "MSM8260":    [ARM,  1.7,  2,     ADRENO,   "220",          ],
    "MSM8255T":   [ARM,  1.4,  1,     ADRENO,   "205",          ],
    "MSM8255":    [ARM,  1.0,  1,     ADRENO,   "205",          ],
    "MSM7230":    [ARM,  0.8,  1,     ADRENO,   "205",          ],
    "MSM8225":    [ARM,  1.2,  1,     ADRENO,   "203",          ],
    "QSD8650":    [ARM,  1.0,  1,     ADRENO,   "200",          ],
    "QSD8250":    [ARM,  1.0,  1,     ADRENO,   "200",          ],
    "MSM7227":    [ARM,  0.6,  1,     ADRENO,   "200",          ],
// --- Tegra --- http://en.wikipedia.org/wiki/Tegra
    "T30L":       [ARM,  1.3,  4,     TEGRA,    "T30L",         ],
    "AP37":       [ARM,  1.7,  4,     TEGRA,    "AP37",         ],
    "AP33":       [ARM,  1.5,  4,     TEGRA,    "AP33",         ],
    "AP25H":      [ARM,  1.2,  2,     TEGRA2,   "AP25",         ],
    "T20":        [ARM,  1.0,  2,     TEGRA2,   "T20",          ],
// --- OMAP --- http://en.wikipedia.org/wiki/OMAP
    "OMAP4460":   [ARM,  1.2,  2,     POWERVR,  "SGX540",       ],
    "OMAP4430":   [ARM,  1.2,  2,     POWERVR,  "SGX540",       ],
    "OMAP3630":   [ARM,  1.0,  1,     POWERVR,  "SGX530",       ],
// --- Samsung, Exynos --- http://ja.wikipedia.org/wiki/Exynos
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
//                [0]    [1]   [2]    [3]       [4]
//                TYPE   CPU   CPU    GPU,      GPU
//                       CLOCK CORES  TYPE      ID
// --- Apple ---
    "A7":         [ARM64,1.3,  2,     POWERVR,  "G6430",        ],
    "A6X":        [ARM,  1.4,  2,     POWERVR,  "SGX554MP4",    ],
    "A6":         [ARM,  1.3,  2,     POWERVR,  "SGX543MP3",    ],
    "A5X":        [ARM,  1.0,  2,     POWERVR,  "SGX543MP4",    ],
    "A5":         [ARM,  0.8,  2,     POWERVR,  "SGX543MP2",    ],
    "A4":         [ARM,  0.8,  1,     POWERVR,  "SGX535",       ],
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

