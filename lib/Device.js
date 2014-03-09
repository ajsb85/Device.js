// @name: Device.js

(function(global) {
"use strict";

// --- variable --------------------------------------------
var _inNode = "process" in global;

var Spec = global["Spec"] || require("uupaa.spec.js");

// --- define ----------------------------------------------
var SOC_DATA    = 1;
var DEVICE_DATA = 2;
var QUERY_MAP   = {
        "CPU.TYPE":             [SOC_DATA,     0],
        "CPU.CLOCK":            [SOC_DATA,     1],
        "CPU.CORES":            [SOC_DATA,     2],
        "GPU.TYPE":             [SOC_DATA,     3],
        "GPU.ID":               [SOC_DATA,     4],
        "OS.TYPE":              [DEVICE_DATA,  0],
        "DEVICE.BRAND":         [DEVICE_DATA,  1],
        "DEVICE.SOC":           [DEVICE_DATA,  2],
        "OS.VERSION.PRE":       [DEVICE_DATA,  3, function(v) { return _parseVersionNumber(v).valueOf(); }],
        "OS.VERSION.HIGHEST":   [DEVICE_DATA,  4, function(v) { return _parseVersionNumber(v).valueOf(); }],
        "DISPLAY.SHORT":        [DEVICE_DATA,  5],
        "DISPLAY.LONG":         [DEVICE_DATA,  6],
        "DISPLAY.PPI":          [DEVICE_DATA,  7],
        "DISPLAY.DPR":          [DEVICE_DATA,  8],
        "MEMORY.RAM":           [DEVICE_DATA,  9],
        "INPUT.TOUCHES":        [DEVICE_DATA,  10]
    };

// --- interface -------------------------------------------
function Device(spec) { // @arg SpecObject: SpecObject
                        // @ret SpecObject: { DEVICE, OS, ... }
                        // @help: Device
                        // @desc: Detect device spec.
//{@assert
    _if(!_type(spec, "Object"), "Device(spec)");
//}@assert

    var id = spec["DEVICE"]["ID"];

    if (id in DEVICE_CATALOG) {
        return _applyDeviceData(id, spec);
    }
    return spec;
}

Device["name"] = "Device";
Device["repository"] = "https://github.com/uupaa/Device.js";

Device["id"]      = Device_id;      // Device.id(id:DeviceIDString):SpecObject
//Device["soc"]     = Device_soc;     // Device.soc(socID:SoCIDString):SpecObject
Device["add"]     = Device_add;     // Device.add(data:Object):void
Device["has"]     = Device_has;     // Device.has(id:DeviceIDString):Boolean
Device["query"]   = Device_query;   // Device.query(selector:DeviceQueryString, caseSensitive:Boolean = false):IDArray

// --- implement -------------------------------------------
function _applyDeviceData(id,     // @arg String: DEVICE ID
                          spec) { // @arg SpecObject:
                                  // @ret SpecObject: { DEVICE, OS, CPU, ... }
    var data = DEVICE_CATALOG[id];
    var soc  = SOC_CATALOG[ data[2] ];

    var DEVICE  = spec["DEVICE"];
    var OS      = spec["OS"];
    var CPU     = spec["CPU"];
    var GPU     = spec["GPU"];
    var INPUT   = spec["INPUT"];
    var MEMORY  = spec["MEMORY"];
    var DISPLAY = spec["DISPLAY"];
    var NETWORK = spec["NETWORK"];

    DEVICE["ID"]     = id;
    DEVICE["MAYBE"]  = /iPad 2|iPad 3|iPhone 4|iPhone 5|iPod touch 5/.test(id);
    DEVICE["BRAND"]  = data[1];
    DEVICE["SOC"]    = data[2];
    DEVICE["GPS"]    = /GPS/.test( data[12] );
    OS["TYPE"]       = data[0];
    CPU["TYPE"]      = soc[0];
    CPU["CLOCK"]     = soc[1];
    CPU["CORES"]     = soc[2];
    CPU["SIMD"]      = soc[3] !== "Tegra2"; // Tegra2 NEON unsupported
    GPU["TYPE"]      = soc[3];
    GPU["ID"]        = soc[4];
    INPUT["TOUCH"]   = !!data[10]; // to Boolean value
    INPUT["TOUCHES"] = data[10];
    MEMORY["RAM"]    = data[9];
    DISPLAY["PPI"]   = data[7];
    DISPLAY["DPR"]   = data[8];
    DISPLAY["INCH"]  = data[11];
    DISPLAY["LONG"]  = Math.max(data[5], data[6]);
    DISPLAY["SHORT"] = Math.min(data[5], data[6]);
    NETWORK["3G"]    = /3G/.test(   data[12] );
    NETWORK["LTE"]   = /LTE/.test(  data[12] );
    NETWORK["NFC"]   = /NFC/.test(  data[12] );
    NETWORK["WIFI"]  = /WIFI/.test( data[12] );

    var pre     = data[3].split(".");
    var highest = data[4].split(".");
    var OS_VERSION_PRE     = OS["VERSION"]["PRE"];
    var OS_VERSION_HIGHEST = OS["VERSION"]["HIGHEST"];

    OS_VERSION_PRE["MAJOR"]     = parseInt(pre[0], 10);
    OS_VERSION_PRE["MINOR"]     = parseInt(pre[1], 10);
    OS_VERSION_PRE["PATCH"]     = parseInt(pre[2], 10);
    OS_VERSION_HIGHEST["MAJOR"] = parseInt(highest[0], 10);
    OS_VERSION_HIGHEST["MINOR"] = parseInt(highest[1], 10);
    OS_VERSION_HIGHEST["PATCH"] = parseInt(highest[2], 10);

    return spec;
}

function Device_id(id) { // @arg DeviceIDString:
                         // @ret SpecObject:
                         // @help: Device.id
//{@assert
    _if(!_type(id, "String"), "Device.id(id)");
//}@assert

    return (id in DEVICE_CATALOG) ? _applyDeviceData(id, Spec()) : Spec();
}

/*
function Device_soc(socID) { // @arg SoCIDString:
                             // @ret SpecObject:
                             // @help: Device.soc
//{@assert
    _if(!_type(socID, "String"), "Device.soc(socID)");
//}@assert

    var spec = Spec();

    if (socID in SOC_CATALOG) {
        var data = SOC_CATALOG[socID];
        var CPU = spec["CPU"];
        var GPU = spec["GPU"];

        CPU["TYPE"]  = data[0];
        CPU["CLOCK"] = data[1];
        CPU["CORES"] = data[2];
        CPU["SIMD"]  = data[3] !== "Tegra2"; // Tegra2 NEON unsupported
        GPU["TYPE"]  = data[3];
        GPU["ID"]    = data[4];
    }
    return spec;
}
 */

function Device_add(data) { // @arg Object:
                            // @help: Device.merge
//{@assert
    _if(!_type(data, "Object"), "Device.add(data)");
//}@assert

    for (var key in data) {
        DEVICE_CATALOG[key] = data[key];
    }
}

function Device_has(id) { // @arg DeviceIDString:
                          // @ret Boolean:
//{@assert
    _if(!_type(id, "String"), "Device.has(id)");
//}@assert

    return id in DEVICE_CATALOG;
}

function Device_query(selector,        // @arg DeviceQueryString: query string. "GPU.TYPE=Adreno;GPU.ID=330"
                      caseSensitive) { // @arg Boolean(= false): true is case-sensitive, false is ignore case.
                                       // @ret IDArray: [id, ...]
                                       // @help: Device.query
                                       // @desc: Query device catlog.
//{@assert
    _if(!_type(selector, "String"), "Device.query(selector): " + selector);
    _if(!_type(caseSensitive, "Boolean/omit"), "Device.query(,caseSensitive)");
//}@assert

    return _filter( _parse(selector), caseSensitive || false );
}

function _parse(selector) {
    return selector.replace(/[; ]*$/, "").trim().split(/\s*;\s*/).reduce(_tokenize, []);

    function _tokenize(result, token) {
        if (token) {
            var keyValue = token.split(/\s*(==|=|<=|>=|<|>)\s*/); // ["DEVICE.SOC", "=", "MSM8974"]
            var keyword  = keyValue[0].toUpperCase();
            var operator = keyValue[1] || "";
            var value    = keyValue[2] || "";

            if (keyword in QUERY_MAP) {
                // Device.query("DEVICE.SOC=" + Device.id("SHL24")) -> Device.query("DEVICE.SOC=SHL24")
                if (value in DEVICE_CATALOG) {
                    value = keyword.split(".").reduce(function(spec, key) {
                        return spec[key];
                    }, Device["id"](value));
                    if (value.constructor === ({}).constructor) { // isObject? OS.VERSION.PRE, OS.VERSION.HIGHEST
                        value = value.valueOf();
                    }
                }
                result.push([keyword, operator, value]); // result: [ ["DEVICE.SOC", "=", "MSM8974"], ... ]
            } else {
                throw new Error("Device.query token: " + token);
            }
        }
        return result;
    }
}

function _filter(parts, caseSensitive) {
    var lastData = 0; // 0 or DEVICE_DATA or SOC_DATA

    // --- query phase ---
    var result = parts.reduce(function(prev, queryArray, index) { // "GPU.TYPE=Adreno"
        var keyword  = queryArray[0]; // "GPU.TYPE"
        var operator = queryArray[1]; // "="
        var value    = queryArray[2]; // "Adreno"

        if ( lastData === SOC_DATA && QUERY_MAP[keyword][0] === DEVICE_DATA) {
            // convert SoCID list to DeviceID list. query( SOC_DATA -> DEVICE_DATA )
            prev = _convertSoCIDToDeviceID(prev);
        } else if ( lastData === DEVICE_DATA && QUERY_MAP[keyword][0] === SOC_DATA) {
            // convert DeviceID list to SoCID list. query( DEVICE_DATA -> SOC_DATA )
            prev = _convertDeviceIDToSoCID(prev);
        }
        lastData = QUERY_MAP[keyword][0];

        var rv = _find( QUERY_MAP[keyword], operator, value, caseSensitive );

        return index ? _and(prev, rv)
                     : rv;
    }, []);

    return result;
}

function _convertSoCIDToDeviceID(socList) {
    return socList.reduce(function(prev, socID) {
        for (var deviceID in DEVICE_CATALOG) {
            if (DEVICE_CATALOG[deviceID][2] === socID) {
                prev.push(deviceID);
            }
        }
        return prev;
    }, []);
}

function _convertDeviceIDToSoCID(deviceList) {
    return deviceList.reduce(function(prev, deviceID) {
        var deviceSoC = DEVICE_CATALOG[deviceID][2];

        for (var socID in SOC_CATALOG) {
            if (socID === deviceSoC) {
                prev.push(socID);
            }
        }
        return prev;
    }, []);
}

function _find(map,             // @arg Array: [catalog, index, preprocess]
               operator,        // @arg String: operator. "=", "==", ">=", "<=", "<", ">"
               value,           // @arg String: query value.
               caseSensitive) { // @arg Boolean(= false): true is case-sensitive, false is ignore case.
                                // @ret Array: matched id. [id, ...]
    var rv = [];
    var catalog = map[0] === SOC_DATA ? SOC_CATALOG
                                      : DEVICE_CATALOG;
    var index = map[1];
    var preprocess = map[2] || null;

    if (!caseSensitive) {
        value = (value + "").toLowerCase();
    }
    for (var id in catalog) {
        var compare = catalog[id][index];

        if (preprocess) {
            compare = preprocess(compare);
        }
        if (!caseSensitive && typeof compare === "string") {
            compare = compare.toLowerCase();
        }
        if (compare) { // 0, 0.0, false, "" are skip
            switch (operator) {
            case "=":
            case "==": if (compare == value) { rv.push(id); } break;
            case "<=": if (compare <= value) { rv.push(id); } break;
            case ">=": if (compare >= value) { rv.push(id); } break;
            case "<":  if (compare <  value) { rv.push(id); } break;
            case ">":  if (compare >  value) { rv.push(id); }
            }
        }
    }
    return rv;
}

function _and(source,    // @arg Array: source array
              compare) { // @arg Array: compare array
                         // @ret Array:
                         // @desc: Array.and
    var rv = [], pos = 0;
    var copiedSource = source.concat();
    var compareValue = null, compareIndex = 0, compareLength = compare.length;

    for (; compareIndex < compareLength; ++compareIndex) { // loop compare
        if (compareIndex in compare) {
            compareValue = compare[compareIndex];

            pos = copiedSource.indexOf(compareValue);
            if (pos >= 0) { // copiedSource has compareValue
                rv.push(compareValue);
                copiedSource.splice(pos, 1);
            }
        }
    }
    return rv;
}

function _parseVersionNumber(version) { // @arg String: "MAJOR.MINOR.PATCH"
                                        // @ret DeviceVersionNumberObject: { MAJOR, MINOR, PATCH, valueOf }
                                        //          MAJOR - Integer: OS Major version.
                                        //          MINOR - Integer: OS Minor version.
                                        //          PATCH - Integer: OS Patch version.
                                        //          valueOf - Function:
    var ary = version.split(".");

    return { "valueOf": _versionValueOf, "MAJOR": +ary[0], "MINOR": +ary[1], "PATCH": +ary[2] };
}

function _versionValueOf() {
    return parseFloat(this["MAJOR"] + "." + this["MINOR"]);
}

// --- OS TYPE ---
var IOS         = "iOS";
var GAME        = "Game";

// --- Device Brand / Maker ---
var APPLE       = "Apple";
var MICROSOFT   = "MicroSoft";
var NINTENDO    = "Nintendo";
var SONY        = "SONY";

// --- SoC ---
var A4          = "A4";
var A5          = "A5";
var A5X         = "A5X";
var A6          = "A6";
var A6X         = "A6X";
var A7          = "A7";
var S5PC100     = "S5PC100";
var S5L8900     = "S5L8900";
var CXD5315GG   = "CXD5315GG";
var HIGHSPEC    = "HighSpec";  // HighSpec Game Console
var LOWSPEC     = "LowSpec";   // LowSpec Game Console

// --- NFC, GPS, WiFi, 3G, LTE ---
var GW3L        = "GPS_WIFI_3G_LTE";
var GW3         = "GPS_WIFI_3G";
var GW          = "GPS_WIFI";
var W           = "WIFI";

// --- OS Version ---
var v000        = "0.0.0";
var v200        = "2.0.0";
var v300        = "3.0.0";
var v310        = "3.1.0";
var v320        = "3.2.0";
var v400        = "4.0.0";
var v410        = "4.1.0";
var v421        = "4.2.1";
var v430        = "4.3.0";
var v510        = "5.1.0";
var v511        = "5.1.1";
var v600        = "6.0.0";
var v615        = "6.1.5";
var v700        = "7.0.0";

// --- CPU type ---
var ARM         = "ARM";
var ARM64       = "ARM64";

// --- GPU type ---
var ADRENO      = "Adreno";
var TEGRA       = "Tegra";
var TEGRA2      = "Tegra2";
var POWERVR     = "PowerVR";
var MALI        = "Mali";
var IMMERSION   = "Immersion";

// Device list: https://www.handsetdetection.com/properties/vendormodel/
var DEVICE_CATALOG = {
//                       [0]       [1]       [2]         [3] [4]    [5]  [6]  [7] [8]   [9]  [10]  [11] [12]
//                       OS.TYPE,  BRAND     SOC         OS.VER     DISP.SIZE PPI DPR   RAM TOUCH  INCH NFC+GPS+WiFi+3G+LTE+CHROMIUM
// --- Apple ---
    "iPhone 5s":        [IOS,      APPLE,    A7,        v700,v000,  640,1136, 326,  2, 1024,  5,     4,  GW3L],
    "iPhone 5c":        [IOS,      APPLE,    A6,        v700,v000,  640,1136, 326,  2, 1024,  5,     4,  GW3L],
    "iPhone 5":         [IOS,      APPLE,    A6,        v600,v000,  640,1136, 326,  2, 1024,  5,     4,  GW3L],
    "iPhone 4S":        [IOS,      APPLE,    A5,        v511,v000,  640,960,  326,  2,  512,  5,   3.5,  GW3 ],
    "iPhone 4":         [IOS,      APPLE,    A4,        v400,v000,  640,960,  326,  2,  512,  5,   3.5,  GW3 ],
    "iPhone 3GS":       [IOS,      APPLE,    S5PC100,   v300,v615,  320,480,  163,  1,  256,  5,   3.5,  GW3 ],
    "iPhone 3G":        [IOS,      APPLE,    S5L8900,   v200,v421,  320,480,  163,  1,  128,  5,   3.5,  GW3 ],
    "iPad Air":         [IOS,      APPLE,    A7,        v700,v000, 1536,2048, 264,  2, 1024, 10,   9.7,  GW3L],
    "iPad 4":           [IOS,      APPLE,    A6X,       v600,v000, 1536,2048, 264,  2, 1024, 10,   9.7,  GW3L],
    "iPad 3":           [IOS,      APPLE,    A5X,       v510,v000, 1536,2048, 264,  2, 1024, 10,   9.7,  GW3 ],
    "iPad 2":           [IOS,      APPLE,    A5,        v430,v000,  768,1024, 132,  1,  512, 10,   9.7,  GW3 ],
    "iPad 1":           [IOS,      APPLE,    A4,        v320,v615,  768,1024, 132,  1,  256, 10,   9.7,  GW  ],
    "iPad mini Retina": [IOS,      APPLE,    A7,        v700,v000, 1536,2048, 326,  2, 1024, 10,   7.9,  GW3L],
    "iPad mini":        [IOS,      APPLE,    A5,        v600,v000,  768,1024, 132,  2,  512, 10,   7.9,  GW3 ],
    "iPod touch 5":     [IOS,      APPLE,    A5,        v600,v000,  640,1136, 326,  2,  512,  5,     4,   W  ],
    "iPod touch 4":     [IOS,      APPLE,    A4,        v410,v615,  640,960,  326,  2,  256,  5,     4,   W  ],
  //"iPod touch 3":     [IOS,      APPLE,    CortexA8,  v310,v511,  640,960,  326,  2,  256,  5,   3.5,   W  ], // iPod touch 32/64GB Model
    "iPod touch 3":     [IOS,      APPLE,    S5PC100,   v310,v511,  640,960,  326,  2,  128,  5,   3.5,   W  ], // iPod touch 8GB Model
//                       [0]       [1]       [2]         [3] [4]    [5]  [6]  [7] [8]   [9]  [10]  [11] [12]
//                       OS.TYPE,  BRAND     SOC         OS.VER     DISP.SIZE PPI DPR   RAM TOUCH  INCH NFC+GPS+WiFi+3G+LTE+CHROMIUM
// --- Game Console ---
    "PS 4":             [GAME,     SONY,     HIGHSPEC,  v000,v000,    0,0,      0,  0, 8192,  0,     0,   W  ], // PlayStation 4
    "PS 3":             [GAME,     SONY,     HIGHSPEC,  v000,v000,    0,0,      0,  0,  256,  0,     0,   W  ], // PlayStation 3
    "PS Vita":          [GAME,     SONY,     CXD5315GG, v000,v000,  544,960,  220,  0,  512,  5,     0,  GW3 ], // PlayStation Vita
    "PSP":              [GAME,     SONY,     LOWSPEC,   v000,v000,    0,0,      0,  0,   64,  0,     0,   W  ], // PlayStation Portable
    "Xbox One":         [GAME,     MICROSOFT,HIGHSPEC,  v000,v000,    0,0,      0,  0, 8192,  0,     0,   W  ], // Xbox One
    "Xbox 360":         [GAME,     MICROSOFT,HIGHSPEC,  v000,v000,    0,0,      0,  0,  512,  0,     0,   W  ], // Xbox 360
    "Wii U":            [GAME,     NINTENDO, HIGHSPEC,  v000,v000,    0,0,      0,  0, 2048,  0,     0,   W  ], // Wii U
    "Wii":              [GAME,     NINTENDO, LOWSPEC,   v000,v000,    0,0,      0,  0,   64,  0,     0,   W  ], // Wii
    "3DS":              [GAME,     NINTENDO, LOWSPEC,   v000,v000,    0,0,      0,  0,   64,  0,     0,   W  ]  // 3DS
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
    "APQ8064AB":  [ARM,  1.9,  4,     ADRENO,   "320"           ],
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
// http://en.wikipedia.org3wiki/OMAP
    "OMAP4470":   [ARM,  1.3,  2,     POWERVR,  "SGX544"        ],
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
// --- MediaTek ---
    "MTK8125":    [ARM,  1.2,  4,     POWERVR,  "SGX544"        ], // MeMo Pad HD7, Kobo Arc 7
// --- R-Mobile ---  
    "APE5R":      [ARM,  1.2,  2,     POWERVR,  "SGX543MP"      ],
// --- Apple ---
    "A7":         [ARM64,1.3,  2,     POWERVR,  "G6430"         ],
    "A6X":        [ARM,  1.4,  2,     POWERVR,  "SGX554MP4"     ],
    "A6":         [ARM,  1.3,  2,     POWERVR,  "SGX543MP3"     ],
    "A5X":        [ARM,  1.0,  2,     POWERVR,  "SGX543MP4"     ],
    "A5":         [ARM,  0.8,  2,     POWERVR,  "SGX543MP2"     ],
    "A4":         [ARM,  0.8,  1,     POWERVR,  "SGX535"        ],
// --- Other ---
    "CXD5315GG":  [ARM,  1.2,  4,     POWERVR,  "SGX543MP4+"    ],
    "HighSpec":   ["",   2.0,  4,     POWERVR,  ""              ],
    "LowSpec":    ["",   0.5,  1,     POWERVR,  ""              ]
};

//{@assert
function _type(value, types, keys) {
    return types.split(/[\|\/]/).some(judge);

    function judge(type) {
        switch (type.toLowerCase()) {
        case "omit":    return value === undefined || value === null;
        case "array":   return Array.isArray(value);
        case "integer": return typeof value === "number" && Math.ceil(value) === value;
        case "object":  return (keys && value && !hasKeys(value, keys)) ? false
                             : (value || 0).constructor === ({}).constructor;
        default:        return Object.prototype.toString.call(value) === "[object " + type + "]";
        }
    }
    function hasKeys(value, keys) {
        var ary = keys ? keys.split(",") : null;

        return Object.keys(value).every(function(key) {
            return ary.indexOf(key) >= 0;
        });
    }
}
function _if(value, msg) {
    if (value) {
        throw new Error(msg);
    }
}
//}@assert

// --- export ----------------------------------------------
//{@node
if (_inNode) {
    module["exports"] = Device;
}
//}@node
if (global["Device"]) {
    global["Device_"] = Device; // already exsists
} else {
    global["Device"]  = Device;
}

})((this || 0).self || global);

