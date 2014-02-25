// @name: WindowsPhone.js

(function(global) {

// --- variable --------------------------------------------
var Device = global["Device"] || require("uupaa.device.js");

// --- define ----------------------------------------------
// --- OS TYPE ---
var WPHONE      = "Windows Phone";

// --- Device Brand / Maker ---
var FUJITSU     = "Fujitsu";
var ACER        = "Acer";
var NOKIA       = "Nokia";
var SAMSUNG     = "Samsung";
var HUAWEI      = "Huawei";
var HTC         = "HTC";
var ZTE         = "ZTE";

// --- SoC ---
var APQ8055     = "APQ8055";
var MSM7227     = "MSM7227";
var MSM8227     = "MSM8227";
var MSM8230     = "MSM8230";
var MSM8255     = "MSM8255";
var MSM8255T    = "MSM8255T";
var MSM8260A    = "MSM8260A";
var MSM8627     = "MSM8627";
var MSM8655     = "MSM8655";
var MSM8930     = "MSM8930";
var MSM8960     = "MSM8960";
var MSM8974     = "MSM8974";

// --- NFC, GPS, WiFi, 3G, LTE ---
var NGW3L       = "NFC_GPS_WIFI_3G_LTE";
var NGW3        = "NFC_GPS_WIFI_3G";
var GW3L        = "GPS_WIFI_3G_LTE";
var GW3         = "GPS_WIFI_3G";

// --- OS Version ---
var v750        = "7.5.0";
var v800        = "8.0.0";

// --- interface -------------------------------------------
// --- implement -------------------------------------------
var WINDOWS_PHONE_DEVICES = {
//                       [0]       [1]       [2]         [3] [4]    [5]  [6]  [7] [8]   [9]  [10]  [11] [12]
//                       OS.TYPE,  BRAND     SOC         OS.VER     DISP.SIZE PPI DPR   RAM TOUCH  INCH NFC+GPS+WiFi+3G+LTE+CHROMIUM
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
    "SCH-I930":         [WPHONE,   SAMSUNG,  MSM8960,   v800,v800,  480,800,  233,  0, 1024,  4,     0, NGW3L]  // ATIV Odyssey
};

Device["add"](WINDOWS_PHONE_DEVICES);

if (global["Device_"]) {
    global["Device_"]["add"](WINDOWS_PHONE_DEVICES);
}

})(this.self || global);

