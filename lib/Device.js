// @name: Device.js

(function(global) {

// --- define ----------------------------------------------
// --- interface -------------------------------------------
function Device() { // @help: Device
}

Device.name = "Device";
Device.repository = "https://github.com/uupaa/Device.js";
Device.spec  = Device_spec;  // Device.spec(token:String = ""):Object
Device.token = Device_token; // Device.token(userAgent:String = navigator.userAgent):String

// --- implement -------------------------------------------
function Device_spec(device) { // @arg String(= ""): device token.
                               // @ret Object: { OS, SOC, CPU, GPU, RAM, BRAND, DEVICE, DISPLAY }
                               //     OS        - Object: { BEGIN, END }
                               //        .BEGIN - String(= ""): begin OS version(release version).
                               //        .END   - String(= ""): end OS version.
                               //     SOC       - String: System on chip name. eg: "MSM8974"
                               //     CPU       - Object: { CLOCK, CORES, NEON }
                               //        .CLOCK - Number(= 0): CPU base clock. eg: 1.7
                               //        .CORES - Integer(= 0): CPU cores. eg: 2 (dual core)
                               //        .NEON  - Boolean(= false): Enable NEON.
                               //     GPU       - Object: { TYPE, NAME }
                               //        .TYPE  - String(= ""): GPU type. eg: "Adreno"
                               //        .NAME  - String(= ""): GPU name. eg: "Adreno 330"
                               //     RAM       - Integer: RAM size (unit: GB).
                               //     BRAND     - String: Brand name. eg: "GOOGLE", "SONY"
                               //     DEVICE    - String: device token(device name and revisions). eg: "Nexus 7 (2013)"
                               //     DISPLAY   - Object: { PPI, DPR, LONG, SHORT, TOUCH }
                               //        .PPI   - Integer(= 0): display pixel per inch.
                               //        .DPR   - Integer(= 0): device pixel ratio.
                               //        .LONG  - Integer(= 0): display SHORT, or short edge.
                               //        .SHORT - Integer(= 0): display SHORT, or long edge.
                               //        .TOUCH - Integer: Touch points.
                               // @desc: detect mobile device specs.
                               // @help: Device.spec
    device = device || Device_token();

    var result = {
            OS:     { BEGIN: "", END: "" },
            SOC:    "",
            CPU:    { CLOCK: 0, CORES: 0, NEON: false },
            GPU:    { TYPE: "", NAME: "" },
            RAM:    0,
            BRAND:  "",
            DEVICE: "",
            DISPLAY:{ PPI: 0, DPR: 0, SHORT: 0, LONG: 0, TOUCH: 0 }
        };

    if (device in DEVICE_CATALOG) {
        var spec = DEVICE_CATALOG[device];

        // rewrite device token
        if (spec.hook) {
            device = spec.hook(device); // "Nexus 7" -> "Nexus 7 (2013)"
            spec = DEVICE_CATALOG[device];
        }

        result.DEVICE         = device;
        result.BRAND          = spec[0];
        result.SOC            = spec[1];
        result.OS             = { BEGIN: spec[2], END: spec[3] };
        result.DISPLAY.LONG   = Math.max(spec[4], spec[5]);
        result.DISPLAY.SHORT  = Math.min(spec[4], spec[5]);
        result.DISPLAY.PPI    = spec[6];
        result.DISPLAY.DPR    = spec[7];
        result.RAM            = spec[8];
        result.DISPLAY.TOUCH  = spec[9];

        if (result.SOC in SOC_CATALOG) {
            var soc = SOC_CATALOG[result.SOC];

            result.CPU.CLOCK = soc[0];
            result.CPU.CORES = soc[1];
            result.GPU.TYPE  = soc[2];
            result.GPU.NAME  = soc[3];

            result.CPU.NEON  = true;
            if (/Tegra2/.test(result.GPU.NAME)) { // Tegra2 NEON disabled.
                result.CPU.NEON = false;
            }
        }
    }
    return result;
}

function Device_token(userAgent) { // @arg String(= navigator.userAgent):
                                   // @ret String: device token.
                                   // @help: Device.token

    // "Mozilla/5.0 (Linux; U; Android 4.0.4; ja-jp; SonySO-04D Build/7.0.D.1.117)..."
    //                                                   ~~~~~~
    //                                                    this
    //
    userAgent = userAgent || (global.navigator || {}).userAgent || "";

    return /Android/.test(userAgent)          ? _getAndroidDeviceToken(userAgent)
         : /iPhone|iPad|iPod/.test(userAgent) ? _getiOSDeviceToken(userAgent)
                                              : "";
}

function _getAndroidDeviceToken(userAgent) { // @arg String:
                                             // @ret String: device token.
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
    //                                                device token

    var deviceToken = userAgent.split("Build/")[0].split(";").slice(-1).join().trim();

    if ( /^Sony/.test(deviceToken) ) {
        if ( /Tablet/.test(deviceToken) ) {
            ;
        } else {
            // Remove "Sony" and "Ericsson" prefixes.
            deviceToken = deviceToken.replace(/^Sony/, "").
                                      replace(/^Ericsson/, "");
        }
    }
    return deviceToken;
}

function _getiOSDeviceToken(userAgent) { // @arg String:
                                         // @ret String: device token.
    // Examples.
    //
    // Mozilla/5.0 (iPad;   CPU        OS 6_0   like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25
    // Mozilla/5.0 (iPod;   CPU iPhone OS 5_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A405 Safari/7534.48.3
    // Mozilla/5.0 (iPhone; CPU iPhone OS 6_0   like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25
    //              ~~~~~~
    //            device token

    var deviceToken = /iPad/.test(userAgent) ? "iPad"
                    : /iPod/.test(userAgent) ? "iPod"
                                             : "iPhone";

    var iOSVersion = _detectiOSVersion(userAgent);
    var devicePixelRatio = global.devicePixelRatio || 1;
    var longEdge = Math.max(global.innerWidth  || 0, global.innerHeight || 0);

    switch (deviceToken) {
    case "iPad":
        deviceToken = (devicePixelRatio === 1 && iOSVersion < 4.2) ? "iPad 1"
                    : (devicePixelRatio === 1 && iOSVersion < 8.0) ? "iPad 2"
                    : (devicePixelRatio !== 1)                     ? "iPad 3"  // maybe, candidate: iPad 3, iPad 4, iPad Air, iPad mini Retina, ...
                                                                   : "iPad 2"; // maybe, candidate: iPad2, iPad mini
        break;
    case "iPhone":
        deviceToken = (devicePixelRatio === 1) ? "iPhone 3GS"
                    : (longEdge > 960)         ? "iPhone 5"   // maybe, candidate: iPhone 5, iPhone 5c, iPhone 5s, iPhone 6...
                    : (iOSVersion < 5.1)       ? "iPhone 4"
                                               : "iPhone 4S";
        break;
    case "iPod":
        deviceToken = (longEdge > 960) ? "iPod touch 5"  // maybe, candidate: iPod touch 5, iPod touch 6...
                                       : "iPod touch 4"; // maybe
    }
    return deviceToken;
}

function _detectiOSVersion(userAgent) { // @arg String:
                                        // @ret Number: iOS version.
    if ( /iPhone|iPad|iPod/.test(userAgent) ) {
        return parseFloat(userAgent.split(/OS /)[1].replace("_", ".")) || 0;
    }
    return 0;
}

// --- const variable --------------------------------------

// --- BRAND ---
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

// --- SOC ---
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
var T250        = "T250";
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
var S5PC100     = "S5PC100";
var A4          = "A4";
var A5          = "A5";
var A5X         = "A5X";
var A6          = "A6";
var A6X         = "A6X";
var A7          = "A7";

// --- GPU_TYPE ---
var ADRENO      = "Adreno";
var TEGRA       = "Tegra";
var POWERVR     = "PowerVR";
var MALI        = "Mali";
var IMMERSION   = "Immersion";

// --- database --------------------------------------------
var DEVICE_CATALOG = {
// --- Google ---
//               BRAND     SOC      BEGIN,END  SHORT,LONG   PPI   DPR   RAM   TOUCH
    "Nexus One":[GOOGLE,   QSD8250,   210,236,   480,800,   252,  1.5,  0.5,  2],
    "Nexus S":  [GOOGLE,   S5PC110,   232,410,   480,800,     0,  1.5,  0.5,  5],
    "Galaxy Nexus":
                [GOOGLE,   OMAP4460,  400,422,   720,1280,  316,    2,    1,  2],
    "Nexus 4":  [GOOGLE,   APQ8064,   420,0,     768,1280,  318,    2,    2,  5],
    "Nexus 5":  [GOOGLE,   MSM8974,   440,0,    1080,1920,  445,    3,    2,  5],
    "Nexus 7":  [GOOGLE,   T30L,      411,0,     800,1280,  216, 1.33 ,   1,  5],
    "Nexus 7 (2013)":
                [GOOGLE,   APQ8064,   430,0,    1200,1920,  323,    2,    2,  5],
    "Nexus 10": [GOOGLE,   EXYNOS5250,420,0,    1600,2560,  300,    2,    2,  5],
// --- Apple ---
//               BRAND     SOC      BEGIN,END  SHORT,LONG   PPI   DPR   RAM   TOUCH
    "iPod touch 4":[APPLE, A4,        410,615,   640,960,   326,    2, 0.25,  5],
    "iPod touch 5":[APPLE, A5,        600,0,     640,1136,  326,    2,  0.5,  5],
    "iPhone 3GS":[APPLE,   S5PC100,   300,615,   320,480,   163,    1, 0.25,  5],
    "iPhone 4": [APPLE,    A4,        400,0,     640,960,   326,    2,  0.5,  5],
    "iPhone 4S":[APPLE,    A5,        511,0,     640,960,   326,    2,  0.5,  5],
    "iPhone 5": [APPLE,    A6,        600,0,     640,1136,  326,    2,    1,  5],
    "iPhone 5c":[APPLE,    A6,        700,0,     640,1136,  326,    2,    1,  5],
    "iPhone 5s":[APPLE,    A7,        700,0,     640,1136,  326,    2,    1,  5],
    "iPad 1":   [APPLE,    A4,        320,615,   768,1024,  132,    1, 0.25, 10],
    "iPad 2":   [APPLE,    A5,        430,0,     768,1024,  132,    1,  0.5, 10],
    "iPad 3":   [APPLE,    A5X,       510,0,    1536,2048,  264,    2,    1, 10],
    "iPad 4":   [APPLE,    A6X,       600,0,    1536,2048,  264,    2,    1, 10],
    "iPad Air": [APPLE,    A7,        700,0,    1536,2048,  264,    2,    1, 10],
    "iPad mini":[APPLE,    A5,        600,0,     768,1024,  132,    2,  0.5, 10],
    "iPad mini Retina":
                [APPLE,    A7,        700,0,    1536,2048,  326,    2,    1, 10],
// --- docomo --- http://spec.nttdocomo.co.jp/spmss/
//               BRAND     SOC      BEGIN,END  SHORT,LONG   PPI   DPR   RAM   TOUCH
    "L-01F":    [LG,       MSM8974,   422,422,  1080,1776,  480,    0,    2,  5],
    "SC-01F":   [SAMSUNG,  MSM8974,   430,433,  1080,1920,  480,    0,    2,  5],
    "SC-02F":   [SAMSUNG,  MSM8974,   430,430,  1080,1920,  480,    0,    2,  5],
    "SH-01F":   [SHARP,    MSM8974,   422,422,  1080,1776,  480,    0,    2,  5],
    "SH-01FDQ": [SHARP,    MSM8974,   422,422,  1080,1776,  480,    0,    2,  5],
    "SO-01F":   [SONY,     MSM8974,   422,422,  1080,1776,  480,    3,    2,  5], // Xperia Z1
    "SO-02F":   [SONY,     MSM8974,   422,422,   720,1184,  320,    0,    2,  5],
    "F-01F":    [FUJITSU,  MSM8974,   422,422,  1080,1776,  480,    0,    2,  5],
    "F-02F":    [FUJITSU,  MSM8974,   422,422,  1504,2560,  320,    0,    2,  5],
    "F-03F":    [FUJITSU,  MSM8974,   422,422,   720,1184,  320,    0,    2,  5],
    "F-04F":    [FUJITSU,  APQ8064T,  422,422,   540,888,   240,    0,    2,  5],
    "L-05E":    [LG,       APQ8064T,  422,422,   720,1280,  320,    0,    2,  5],
    "N-06E":    [NEC,      APQ8064T,  422,422,   720,1184,  320,    0,    2,  5],
    "SC-04E":   [SAMSUNG,  APQ8064T,  422,422,  1080,1920,  480,    0,    2,  5],
    "SO-04E":   [SONY,     APQ8064,   412,422,   720,1184,  320,    0,    2,  5],
    "SO-04EM":  [SONY,     APQ8064,   422,422,   720,1184,  320,    0,    2,  5],
    "SH-06E":   [SHARP,    APQ8064T,  422,422,  1080,1920,  480,    0,    2,  5],
    "SH-07E":   [SHARP,    APQ8064T,  422,422,   720,1280,  320,    0,    2,  2],
    "SH-08E":   [SHARP,    APQ8064T,  422,422,  1200,1824,  320,    0,    2,  5],
    "P-03E":    [PANASONIC,APQ8064T,  422,422,  1080,1920,  480,    0,    2,  5],
    "F-06E":    [FUJITSU,  APQ8064T,  422,422,  1080,1776,  480,    0,    2,  5],
    "F-07E":    [FUJITSU,  APQ8064T,  422,422,   720,1184,  320,    0,    2,  5],
    "F-08E":    [FUJITSU,  APQ8064T,  422,422,   540,867,   240,    0,    2,  5],
    "F-09E":    [FUJITSU,  APQ8064T,  422,422,   540,888,   240,    0,    2,  5],
    "L-01E":    [LG,       APQ8064,   404,412,   720,1280,  320,    0,    2,  5],
    "L-02E":    [LG,       MSM8960,   404,412,   720,1280,  320,    0,    1,  5],
    "L-04E":    [LG,       APQ8064T,  412,412,  1080,1920,  480,    0,    2,  5],
    "N-02E":    [NEC,      MSM8960,   404,412,   480,800,   240,    0,    1,  5],
    "N-03E":    [NEC,      APQ8064,   404,412,   720,1280,  320,    0,    2,  5],
    "N-04E":    [NEC,      APQ8064,   412,412,   720,1280,  320,    0,    2,  5],
    "N-05E":    [NEC,      MSM8960,   412,412,   540,960,   240,    0,    1,  5],
    "SC-01E":   [SAMSUNG,  APQ8060,   404,404,   800,1280,  160,    0,    1,  5],
    "SC-02E":   [SAMSUNG,  EXYNOS4412,411,411,   720,1280,  320,    0,    2,  5],
    "SC-03E":   [SAMSUNG,  EXYNOS4412,411,411,   720,1280,  320,    0,    2,  5],
    "SH-01E":   [SHARP,    MSM8960,   404,404,   540,888,   240,    0,    1,  2],
    "SH-01EVW": [SHARP,    MSM8960,   404,404,   540,888,   240,    0,    1,  2],
    "SH-02E":   [SHARP,    APQ8064,   404,412,   720,1280,  320,    0,    2,  2],
    "SH-04E":   [SHARP,    APQ8064,   412,412,   720,1184,  320,    0,    2,  5],
    "SH-05E":   [SHARP,    MSM8960,   404,404,   540,960,   240,    0,    1,  2],
    "SO-01E":   [SONY,     MSM8960,   404,412,   720,1184,  320,    0,    1,  5],
    "SO-02E":   [SONY,     APQ8064,   412,422,   720,1184,  320,    3,    1,  5], // Xperia Z
    "SO-03E":   [SONY,     APQ8064,   412,412,  1128,1920,  240,    0,    2,  5],
    "P-02E":    [PANASONIC,APQ8064,   412,412,  1080,1920,  480,    0,    2,  5],
    "F-02E":    [FUJITSU,  AP37,      412,412,  1080,1920,  480,    0,    2,  5],
    "F-03E":    [FUJITSU,  MSM8960,   404,412,   540,960,   240,    0,    1,  5],
    "F-04E":    [FUJITSU,  AP33,      404,422,   720,1280,  320,    0,    2,  5],
    "F-05E":    [FUJITSU,  AP37,      404,412,  1200,1920,  240,    0,    2,  5],
    "HW-01E":   [HUAWEI,   MSM8960,   404,404,   720,1280,  320,    0,    1,  5],
    "HW-03E":   [HUAWEI,   K3V2,      412,412,   720,1280,  320,    0,    2,  5],
    "dtab01":   [HUAWEI,   K3V2T,     412,412,   800,1280,  160,    0,    1,  5],
    "L-05D":    [LG,       MSM8960,   404,412,   480,800,   240,  1.5,    1,  5], // Optimus it
    "L-06D":    [LG,       APQ8060,   404,404,   768,1024,  320,    0,    1,  5],
    "L-06DJOJO":[LG,       APQ8060,   404,404,   768,1024,  320,    0,    1,  5],
    "N-07D":    [NEC,      MSM8960,   404,404,   720,1280,  342,    0,    1,  5],
    "N-08D":    [NEC,      MSM8960,   404,404,   800,1280,  213,    0,    1,  5],
    "SC-06D":   [SAMSUNG,  MSM8960,   404,412,   720,1280,  320,    2,    2,  5], // Galaxy S III
    "SH-06D":   [SHARP,    OMAP4460,  235,404,   720,1280,  320,    0,    1,  5],
    "SH-06DNERV":[SHARP,   OMAP4460,  235,404,   720,1280,  320,    0,    1,  2],
    "SH-07D":   [SHARP,    MSM8255,   404,404,   480,854,   240,    0,    1,  2],
    "SH-09D":   [SHARP,    MSM8960,   404,412,   720,1280,  312,    0,    1,  2],
    "SH-10D":   [SHARP,    MSM8960,   404,412,   720,1280,  320,    0,    1,  2],
    "SO-04D":   [SONY,     MSM8960,   404,412,   720,1184,  320,    0,    1,  5],
    "SO-05D":   [SONY,     MSM8960,   404,412,   540,888,   240,  1.5,    1,  5], // Xperia SX
    "P-06D":    [PANASONIC,OMAP4460,  404,404,   720,1280,  320,    0,    1,  5],
    "P-07D":    [PANASONIC,MSM8960,   404,404,   720,1280,  320,    0,    1,  5],
    "P-08D":    [PANASONIC,OMAP4460,  404,404,   800,1280,  160,    0,    1,  5],
    "F-09D":    [FUJITSU,  MSM8255,   403,403,   480,800,   240,    0,    1,  2],
    "F-10D":    [FUJITSU,  AP33,      403,422,   720,1280,  323,    2,    1,  5], // ARROWS X
    "F-11D":    [FUJITSU,  MSM8255,   403,422,   480,800,   240,    0,    1,  5],
    "F-12D":    [FUJITSU,  MSM8255,   403,403,   480,800,   235,    0,    1,  5],
    "T-02D":    [TOSHIBA,  MSM8960,   404,412,   540,960,   257,    0,    1,  5],
    "L-01D":    [LG,       APQ8060,   235,404,   720,1280,  320,    0,    1,  5],
    "L-02D":    [LG,       OMAP4430,  237,404,   480,800,   240,    0,    1,  5],
    "N-01D":    [NEC,      MSM8255T,  235,235,   480,800,   235,    0,  0.5,  5],
    "N-04D":    [NEC,      APQ8060,   236,404,   720,1280,  342,    0,    1,  5],
    "N-05D":    [NEC,      MSM8260,   236,404,   720,1280,  320,    0,    1,  5],
    "N-06D":    [NEC,      APQ8060,   236,404,   800,1280,  213,    0,    1,  5],
    "SC-01D":   [SAMSUNG,  APQ8060,   320,404,   800,1200,  160,    0,    1,  5],
    "SC-02D":   [SAMSUNG,  EXYNOS4210,320,404,   600,1024,  160,    0,    1,  5],
    "SC-03D":   [SAMSUNG,  APQ8060,   236,404,   480,800,   240,  1.5,    1,  5], // GALAXY S II LTE
    "SC-04D":   [SAMSUNG,  OMAP4460,  401,422,   720,1280,  320,    2,    1,  5], // Galaxy Nexus
    "SC-05D":   [SAMSUNG,  APQ8060,   236,412,   800,1280,  320,    0,    1,  5],
    "SH-01D":   [SHARP,    OMAP4430,  235,404,   720,1280,  328,    0,    1,  2],
    "SH-02D":   [SHARP,    MSM8255,   235,235,   540,960,   300,    0,  0.5,  2],
    "SH-04D":   [SHARP,    MSM8255,   234,234,   540,960,   300,    0,  0.5,  2],
    "SO-01D":   [SONY,     MSM8255,   234,234,   480,854,   240,  1.5,  0.5,  2], // Xperia Play
    "SO-02D":   [SONY,     MSM8260,   237,404,   720,1280,  320,    0,    1,  5],
    "SO-03D":   [SONY,     MSM8260,   237,404,   720,1280,  320,    0,    1,  5],
    "P-01D":    [PANASONIC,MSM8255,   234,234,   480,800,   240,  1.5,  0.5,  2],
    "P-02D":    [PANASONIC,OMAP4430,  235,404,   540,960,   240,    0,    1,  2],
    "P-04D":    [PANASONIC,OMAP4430,  235,404,   540,960,   257,    0,    1,  5],
    "P-05D":    [PANASONIC,OMAP4430,  235,404,   540,960,   257,    0,    1,  5],
    "F-01D":    [FUJITSU,  OMAP4430,  320,403,   800,1280,  160,    0,    1,  5],
    "F-03D":    [FUJITSU,  MSM8255,   235,235,   480,800,   240,    0,  0.5,  2],
    "F-05D":    [FUJITSU,  OMAP4430,  235,403,   720,1280,  342,    0,    1,  2],
    "F-07D":    [FUJITSU,  MSM8255,   235,235,   480,800,   235,    0,  0.5,  5],
    "F-08D":    [FUJITSU,  OMAP4430,  235,403,   720,1280,  342,    0,    1,  2],
    "T-01D":    [TOSHIBA,  OMAP4430,  235,403,   720,1280,  320,    0,    1,  2],
    "SC-02C":   [SAMSUNG,  EXYNOS4210,403,403,   480,800,   240,    0,    1,  5], // Galaxy S II
    "SO-01C":   [SONY,     MSM8255,   232,234,   480,854,     0,  1.5,  0.5,  2], // Xperia arc
    "SO-02C":   [SONY,     MSM8255,   233,234,   480,854,     0,    0,  0.5,  2], // Xperia acro
    "SO-03C":   [SONY,     MSM8255,   234,234,   480,854,     0,    0,  0.5,  2], // Xperia acro
    "SH-13C":   [SHARP,    MSM8255,   234,234,   540,960,     0,    0,  0.5,  2],
    "SH-12C":   [SHARP,    MSM8255T,  233,233,   540,960,     0,    0,  0.5,  2],
    "N-04C":    [NEC,      MSM7230,   220,233,   480,854,     0,    0,  0.5,  2],
    "N-06C":    [NEC,      MSM8255,   230,230,   480,854,     0,    0,  0.5,  2],
    "P-07C":    [PANASONIC,OMAP3630,  230,230,   480,800,     0,    0,  0.5,  2],
    "F-12C":    [FUJITSU,  MSM8255,   230,230,   480,800,     0,    0,  0.5,  2],
    "L-04C":    [LG,       MSM7227,   220,230,   320,480,     0,    0,  0.5,  2],
    "L-06C":    [LG,       T250,      300,310,   768,1280,    0,    0,    1,  2],
    "L-07C":    [LG,       OMAP3630,  233,233,   480,800,     0,    0,  0.5,  2],
    "T-01C":    [TOSHIBA,  QSD8250,   211,222,   480,854,     0,  1.5,    0,  2], // REGZA Phone
    "SH-03C":   [SONY,     QSD8250,   211,222,   480,800,     0,    0,    0,  2],
    "SC-01C":   [SAMSUNG,  S5PC110,   220,236,   600,1024,    0,  1.5,    0,  2], // GALAXY Tab
    "SC-02B":   [SAMSUNG,  S5PC110,   220,236,   480,800,     0,  1.5,    0,  2], // GALAXY S
    "SH-10B":   [SHARP,    QSD8250,   160,160,   480,960,     0,    1,    0,  2], // LYNX
    "SO-01B":   [SONY,     QSD8250,   160,211,   480,854,     0,  1.5,0.375,  1],// Xperia
// --- au --- http://www.au.kddi.com/developer/android/
//               BRAND     SOC      BEGIN,END  SHORT,LONG   PPI   DPR   RAM   TOUCH
    "FJT21":    [FUJITSU,  MSM8974,   422,422,  1600,2560,  300,    0,    2, 10],
    "SOL23":    [SONY,     MSM8974,   422,422,  1080,1920,  442,    3,    2, 10], // Xperia Z1
    "SCL22":    [SAMSUNG,  MSM8974,   430,430,  1080,1920,  386,    0,    3, 10],
    "KYL22":    [KYOCERA,  MSM8974,   422,422,  1080,1920,  443,    0,    2,  5],
    "LGL22":    [LG,       MSM8974,   422,422,  1080,1920,  422,    0,    2, 10], // isai
    "SHL23":    [SHARP,    MSM8974,   422,422,  1080,1920,  460,    0,    2,  5],
    "FJL22":    [FUJITSU,  MSM8974,   422,422,  1080,1920,  444,    0,    2, 10],
    "SHL22":    [SHARP,    APQ8064T,  422,422,   720,1280,  302,    0,    2,  5],
    "KYY21":    [KYOCERA,  MSM8960,   422,422,   720,1280,  314,    0,    2,  5], // URBANO L01
    "HTL22":    [HTC,      APQ8064T,  412,422,  1080,1920,  468,    0,    2, 10], // HTC J One
    "SOL22":    [SONY,     APQ8064,   412,422,  1080,1920,  443,    0,    2, 10], // Xperia UL
    "HTX21":    [HTC,      APQ8064,   411,411,   720,1280,  314,    0,    1, 10], // INFOBAR A02
    "SHT21":    [SHARP,    MSM8960,   404,412,   800,1280,  216,    0,    1,  2], // AQUOS PAD
    "HTL21":    [HTC,      APQ8064,   411,411,  1080,1920,  444,    3,    2, 10], // HTC J Butterfly
    "SCL21":    [SAMSUNG,  MSM8960,   404,412,   720,1280,  306,    0,    2, 10], // GALAXY SIII Progre
    "CAL21":    [CASIO,    MSM8960,   404,404,   480,800,   236,    0,    1,  5], // G'zOne TYPE-L
    "SHL21":    [SHARP,    MSM8960,   404,412,   720,1280,  309,    0,    1,  2], // AUOS PHONE SERIE
    "KYL21":    [KYOCERA,  MSM8960,   404,404,   720,1280,  314,    0,    1,  5], // DIGNO S
    "FJL21":    [FUJITSU,  MSM8960,   404,404,   720,1280,  342,    2,    1, 10], // ARROWS ef
    "SOL21":    [SONY,     MSM8960,   404,412,   720,1280,  345,    0,    1, 10], // Xperia VL
    "LGL21":    [LG,       APQ8064,   404,404,   720,1280,  315,    0,    2, 10], // Optimus G
    "PTL21":    [PANTECH,  MSM8960,   404,412,   720,1280,  342,    0,    1,  5], // VEGA
    "ISW13F":   [FUJITSU,  AP33,      403,403,   720,1280,  322,    0,    1,  3], // ARROWS Z
    "IS17SH":   [SHARP,    MSM8655,   404,404,   540,960,   240,    0,    1,  2], // AQUOS PHONE CL
    "IS15SH":   [SHARP,    MSM8655,   404,404,   540,960,   298,    0,    1,  2], // AQUOS PHONE SL
    "ISW16SH":  [SHARP,    MSM8660A,  404,404,   720,1280,  318,    2,    1,  2], // AQUOS PHONE SERIE
    "URBANO PROGRESSO":
                [KYOCERA,  MSM8655,   403,403,   480,800,   235,    0,    1,  5],
    "ISW13HT":  [HTC,      MSM8660A,  403,403,   540,960,   204,    0,    1,  4], // HTC J
    "IS12S":    [SONY,     MSM8660,   237,404,   720,1280,  342,    0,    1, 10], // Xperia acro HD
    "IS12M":    [MOTOROLA, OMAP4430,  236,404,   540,960,   256,    0,    1, 10], // MOTOROLA RAZR
    "INFOBAR C01":[SHARP,  MSM8655,   235,235,   480,854,   309,    0,  0.5,  2], // INFOBAR C01
    "ISW11SC":  [SAMSUNG,  EXYNOS4210,236,404,   720,1080,  315,    2,    1, 10], // GALAXY SII WiMAX
    "IS11LG":   [LG,       AP25H,     237,404,   480,800,   235,    0,    1, 10], // Optimus X
    "IS12F":    [FUJITSU,  MSM8655,   235,235,   480,800,   235,    0,  0.5,  4], // ARROWS ES
    "IS14SH":   [SHARP,    MSM8655,   235,235,   540,960,   298,    0,  0.5,  2], // AQUOS PHONE
    "IS11N":    [NEC,      MSM8655,   235,235,   480,800,   262,    0,  0.5,  5], // MEDIAS BR
    "ISW11F":   [FUJITSU,  OMAP4430,  235,403,   720,1280,  342,    0,    1,  3], // ARROWS Z
    "ISW11K":   [KYOCERA,  MSM8655,   235,235,   480,800,   234,    0,    1, 10], // DIGNO
    "IS13SH":   [SHARP,    MSM8655,   235,235,   540,960,   258,    0,  0.5,  2], // AQUOS PHONE
    "ISW12HT":  [HTC,      MSM8660,   234,403,   540,960,   256,    0,    1,  4], // HTC EVO 3D
    "ISW11M":   [MOTOROLA, T250,      234,234,   540,960,   256,    0,    1,  2], // MOTOROLA PHOTON
    "EIS01PT":  [PANTECH,  MSM8655,   234,234,   480,800,   254,    0,  0.5,  5],
    "IS11PT":   [PANTECH,  MSM8655,   234,234,   480,800,   254,    0,  0.5,  5], // MIRACH
    "IS11T":    [TOSHIBA,  MSM8655,   234,234,   480,854,   243,    0,  0.5,  3], // REGZA Phone
    "IS11CA":   [CASIO,    MSM8655,   233,233,   480,800,   262,    0,  0.5,  5], // G'zOne
    "INFOBAR A01":[SHARP,  MSM8655,   233,233,   540,960,   265,  1.5,  0.5,  2], // INFOBAR A01
    "IS12SH":   [SHARP,    MSM8655,   233,233,   540,960,   263,    0,  0.5,  2], // AQUOS PHONE
    "IS11SH":   [SHARP,    MSM8655,   233,233,   540,960,   298,    0,  0.5,  2], // AQUOS PHONE
    "IS11S":    [SONY,     MSM8655,   233,234,   480,854,   232,    0,  0.5,  2], // Xperia acro
    "ISW11HT":  [HTC,      QSD8650,   221,234,   480,800,   254,  1.5,  0.5,  2], // HTC EVO WiMAX
    "IS06":     [PANTECH,  QSD8650,   221,221,   480,800,   254,  1.5,  0.5,  5], // SIRIUS alpha
    "IS05":     [SHARP,    MSM8655,   221,234,   480,854,   290,    0,  0.5,  2],
    "IS04":     [TOSHIBA,  QSD8650,   210,222,   480,854,   290,    0,  0.5,  2],
    "IS03":     [SHARP,    QSD8650,   210,221,   640,960,   331,    2,  0.5,  2],
    "IS01":     [SHARP,    QSD8650,   160,160,   480,960,   213,    1, 0.25,  1],
// --- SoftBank ---
//               BRAND     SOC      BEGIN,END  SHORT,LONG   PPI   DPR   RAM   TOUCH
    "X06HT":    [HTC,      QSD8250,   210,220,   480,800,     0,    1,  0.5,  2],
    "001HT":    [HTC,      MSM8255,   220,233,   480,800,     0,  1.5,0.375,  2],
    "SBM003SH": [SHARP,    MSM8255,   220,234,   480,800,     0,  1.5,  0.5,  2],
    "001DL":    [DELL,     QSD8250,   220,220,   480,800,     0,    0,  0.5,  2],
    "003Z":     [ZTE,      MSM7227,   220,220,   480,800,     0,    0,  0.5,  2], // Libero
    "DM009SH":  [SHARP,    MSM8255,   220,234,   480,800,     0,    0,  0.5,  2],
    "SBM005SH": [SHARP,    MSM8255,   221,221,   480,800,     0,    0,  0.5,  2],
    "SBM006SH": [SHARP,    MSM8255,   233,233,   540,960,     0,    0,  0.5,  2],
    "SBM007SH": [SHARP,    MSM8255,   233,233,   480,854,   288,    0,  0.5,  2],
    "SBM007SHJ":[SHARP,    MSM8255,   233,233,   480,854,   288,    0,  0.5,  2],
    "003P":     [PANASONIC,OMAP3630,  233,233,   480,854,     0,    0,  0.5,  2],
    "007HW":    [HUAWEI,   MSM8255,   234,234,   480,800,     0,    0,  0.5,  2], // Vision
    "SBM009SH": [SHARP,    MSM8255,   234,234,   540,960,     0,    0,  0.5,  2],
    "SBM007SHK":[SHARP,    MSM8255,   233,233,   480,854,   288,    0,  0.5,  2],
    "SBM009SHY":[SHARP,    MSM8255,   234,234,   540,960,   288,    0,  0.5,  2],
    "DM010SH":  [SHARP,    MSM8255,   234,234,   540,960,     0,    0,  0.5,  2],
    "SBM101SH": [SHARP,    MSM8255,   235,235,   480,854,   288,    0,  0.5,  2],
    "DM011SH":  [SHARP,    MSM8255,   235,235,   480,854,   288,    0,  0.5,  2],
    "SBM102SH": [SHARP,    OMAP4430,  235,404,   720,1280,  326,    0,    1,  2],
    "101P":     [PANASONIC,OMAP4430,  235,235,   480,854,     0,    0,    1,  2],
    "101N":     [NEC,      MSM8255,   235,235,   480,800,     0,    0,  0.5,  2],
    "SBM103SH": [SHARP,    MSM8255,   235,235,   540,960,   275,    0,  0.5,  2],
    "101K":     [KYOCERA,  APE5R,     234,234,   480,800,     0,    0,  0.5,  2],
    "DM012SH":  [SHARP,    MSM8255,   235,235,   540,960,     0,    0,  0.5,  2],
    "SBM104SH": [SHARP,    OMAP4460,  403,403,   720,1280,  326,    0,    1,  2],
    "008Z":     [ZTE,      MSM8255,   230,230,   480,800,     0,    0,  0.5,  2],
    "101DL":    [DELL,     MSM8260,   235,235,   540,960,     0,    0,    1,  2],
    "102P":     [PANASONIC,OMAP4430,  235,235,   540,960,   275,    0,    1,  2],
    "WX04K":    [KYOCERA,  APE5R,     234,411,   480,800,     0,    0,    1,  2],
    "SBM106SH": [SHARP,    MSM8260A,  404,404,   720,1280,    0,    0,    1,  2],
    "SBM102SH2":[SHARP,    OMAP4430,  235,404,   720,1280,    0,    0,    1,  2],
    "SBM107SH": [SHARP,    MSM8255,   404,404,   480,854,     0,    0,    1,  2],
    "101F":     [FUJITSU,  MSM8960,   404,412,   540,960,     0,    0,    1,  2],
    "WX06K":    [KYOCERA,  APE5R,     234,234,   480,800,     0,    0,  0.5,  2],
    "009Z":     [ZTE,      MSM8255,   234,234,   480,800,     0,    0,  0.5,  2], // STAR7
    "201HW":    [HUAWEI,   MSM8960,   400,400,   540,960,     0,    0,    1,  2],
    "SBM107SHB":[SHARP,    MSM8255,   404,404,   480,854,     0,    0,    1,  2],
    "DM013SH":  [SHARP,    MSM8255,   404,404,   480,854,     0,    0,    1,  2],
    "SBM200SH": [SHARP,    MSM8960,   404,410,   720,1280,    0,    0,    1,  2],
    "201K":     [KYOCERA,  MSM8960,   412,412,   480,800,     0,    0,    1,  2],
    "201F":     [FUJITSU,  APQ8064,   412,412,   720,1280,    0,    0,    2,  2],
    "DM014SH":  [SHARP,    MSM8960,   404,412,   720,1280,    0,    0,    1,  2],
    "201M":     [MOTOROLA, MSM8960,   400,410,   540,960,     0,    0,    1,  2], // Motorola RAZR
    "SBM203SH": [SHARP,    APQ8064,   412,412,   720,1280,    0,    0,    2,  2],
    "SBM204SH": [SHARP,    MSM8255,   404,404,   480,800,     0,    0,    1,  2],
    "SBM205SH": [SHARP,    MSM8960,   412,412,   480,854,     0,    0,    1,  2],
    "SBM206SH": [SHARP,    APQ8064T,  422,422,  1080,1920,    0,    0,    2,  2],
    "202F":     [FUJITSU,  APQ8064T,  422,422,  1080,1920,    0,    0,    2,  2],
    "202K":     [KYOCERA,  MSM8960,   422,422,   720,1280,  340,    0,    1,  2],
    "WX10K":    [KYOCERA,  MSM8960,   422,422,   720,1280,    0,    0,    1,  2],
    "DM015K":   [KYOCERA,  MSM8960,   422,422,   720,1280,    0,    0,  1.5,  2],
    "EM01F":    [KYOCERA,  APQ8064,   412,412,   720,1280,    0,    0,    2,  2],
    "204HW":    [HUAWEI,   MSM8225,   410,410,   480,800,     0,    0,    1,  2], // for Silver Age
    "WX04SH":   [KYOCERA,  MSM8260A,  412,412,   480,854,     0,    0,    1,  2],
    "301F":     [FUJITSU,  MSM8974,   422,422,  1080,1920,    0,    0,    2,  2],
    "EM01L":    [GOOGLE,   MSM8974,   440,440,  1080,1920,  445,    3,    2,  5], // Nexus 5 EM01L
    "SBM302SH": [SHARP,    MSM8974,   422,422,  1080,1920,    0,    0,    2,  5],
    "SBM303SH": [SHARP,    MSM8974,   422,422,  1080,1920,    0,    0,    2,  5], // AQUOS PHONE Xx mini 303SH
};

// --- device revision ---
DEVICE_CATALOG["Nexus 7"].hook = function(device) {
    return (global.devicePixelRatio || 1) === 2 ? "Nexus 7 (2013)" // Nexus 7 (2013)
                                                : "Nexus 7";       // Nexus 7 (2012)
};

var SOC_CATALOG = {
//                CPU    CPU    GPU,      GPU
//                CLOCK, CORES, TYPE,     NAME
// --- Snapdragon --- http://en.wikipedia.org/wiki/Snapdragon_(system_on_chip)
    "MSM8974":    [2.2,  4,     ADRENO,   "Adreno 330"       ],
    "APQ8064T":   [1.7,  4,     ADRENO,   "Adreno 320"       ],
    "APQ8064":    [1.5,  4,     ADRENO,   "Adreno 320"       ],
    "MSM8960":    [1.5,  2,     ADRENO,   "Adreno 225"       ],
    "MSM8660A":   [1.5,  2,     ADRENO,   "Adreno 225"       ],
    "MSM8260A":   [1.5,  2,     ADRENO,   "Adreno 225"       ],
    "APQ8060":    [1.2,  2,     ADRENO,   "Adreno 220"       ],
    "MSM8660":    [1.2,  2,     ADRENO,   "Adreno 220"       ],
    "MSM8655":    [1.0,  1,     ADRENO,   "Adreno 205"       ],
    "MSM8260":    [1.7,  2,     ADRENO,   "Adreno 220"       ],
    "MSM8255T":   [1.4,  1,     ADRENO,   "Adreno 205"       ],
    "MSM8255":    [1.0,  1,     ADRENO,   "Adreno 205"       ],
    "MSM7230":    [0.8,  1,     ADRENO,   "Adreno 205"       ],
    "MSM8225":    [1.2,  1,     ADRENO,   "Adreno 203"       ],
    "QSD8650":    [1.0,  1,     ADRENO,   "Adreno 200"       ],
    "QSD8250":    [1.0,  1,     ADRENO,   "Adreno 200"       ],
    "MSM7227":    [0.6,  1,     ADRENO,   "Adreno 200"       ],
// --- Tegra --- http://en.wikipedia.org/wiki/Tegra
    "T30L":       [1.3,  4,     TEGRA,    "Tegra3 T30L"      ],
    "AP37":       [1.7,  4,     TEGRA,    "Tegra3 AP37"      ],
    "AP33":       [1.5,  4,     TEGRA,    "Tegra3 AP33"      ],
    "AP25H":      [1.2,  2,     TEGRA,    "Tegra250 3D AP25" ],
    "T250":       [1.0,  2,     TEGRA,    "Tegra250"         ],
// --- OMAP --- http://en.wikipedia.org/wiki/OMAP
    "OMAP4460":   [1.2,  2,     POWERVR,  "PowerVR SGX540"   ],
    "OMAP4430":   [1.2,  2,     POWERVR,  "PowerVR SGX540"   ],
    "OMAP3630":   [1.0,  1,     POWERVR,  "PowerVR SGX530"   ],
// --- Exynos --- http://ja.wikipedia.org/wiki/Exynos
    "Exynos5250": [1.7,  2,     MALI,     "Mali-T604"        ],
    "Exynos4412": [1.4,  4,     MALI,     "Mali-400 MP4"     ],
    "Exynos4210": [1.2,  2,     MALI,     "Mali-400 MP4"     ],
    "S5PC110":    [1.0,  1,     POWERVR,  "PowerVR SGX540"   ],
// --- HiSilicon ---
    "K3V2T":      [1.2,  4,     IMMERSION,"Immersion.16"     ],
    "K3V2":       [1.2,  4,     IMMERSION,"Immersion.16"     ],
// --- R-Mobile ---
    "APE5R":      [1.2,  2,     POWERVR,  "PowerVR SGX543 MP"],
// --- Apple ---
    "S5PC100":    [0.6,  1,     POWERVR,  "PowerVR SGX535"   ],
    "A4":         [0.8,  1,     POWERVR,  "PowerVR SGX535"   ],
    "A5":         [0.8,  2,     POWERVR,  "PowerVR SGX543MP2"],
    "A5X":        [1.0,  2,     POWERVR,  "PowerVR SGX543MP4"],
    "A6":         [1.3,  2,     POWERVR,  "PowerVR SGX543MP3"],
    "A6X":        [1.4,  2,     POWERVR,  "PowerVR SGX554MP4"],
    "A7":         [1.3,  2,     POWERVR,  "PowerVR G6430"    ],
};

// --- export ----------------------------------------------
if (global.process) { // node.js
    module.exports = Device;
}
global.Device = Device;

})(this.self || global);

