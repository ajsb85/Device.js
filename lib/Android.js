// @name: Android.js

(function(global) {
"use strict";

// --- variable --------------------------------------------
var Device = global["Device"] || require("uupaa.device.js");

// --- define ----------------------------------------------
// --- OS TYPE ---
var ANDROID     = "Android";

// --- Device Brand / Maker ---
var GOOGLE      = "Google";
var AMAZON      = "Amazon";
//var MICROSOFT   = "MicroSoft";
//var NINTENDO    = "Nintendo";
var SONY        = "SONY";
var SHARP       = "SHARP";
var FUJITSU     = "Fujitsu";
var NEC         = "NEC";
var PANASONIC   = "Panasonic";
var TOSHIBA     = "TOSHIBA";
var KYOCERA     = "Kyocera";
var CASIO       = "CASIO";
var DELL        = "DELL";
//var ACER        = "Acer";
//var NOKIA       = "Nokia";
var SAMSUNG     = "Samsung";
var HUAWEI      = "Huawei";
var PANTECH     = "Pantech";
var LG          = "LG";
var HTC         = "HTC";
//var ZTE         = "ZTE";
var MOTOROLA    = "Motorola";
var OTHER       = "Other";

// --- SoC ---
var T20         = "T20";
var T30L        = "T30L";
var AP25H       = "AP25H";
var AP33        = "AP33";
var AP37        = "AP37";
var APE5R       = "APE5R";
var K3V2        = "K3V2";
var K3V2T       = "K3V2T";
var MTK8125     = "MTK8125";
var OMAP3630    = "OMAP3630";
var OMAP4430    = "OMAP4430";
var OMAP4460    = "OMAP4460";
var OMAP4470    = "OMAP4470";
//var S5PC100     = "S5PC100";
var S5PC110     = "S5PC110";
//var S5L8900     = "S5L8900";
var EXYNOS4210  = "Exynos4210";
var EXYNOS4412  = "Exynos4412";
var EXYNOS5250  = "Exynos5250";
var QSD8250     = "QSD8250";
var QSD8650     = "QSD8650";
//var APQ8055     = "APQ8055";
var APQ8060     = "APQ8060";
var APQ8064     = "APQ8064";
var APQ8064T    = "APQ8064T";
var APQ8064AB   = "APQ8064AB";
var APQ8074     = "APQ8074";
var MSM7227     = "MSM7227";
var MSM7230     = "MSM7230";
var MSM8225     = "MSM8225";
//var MSM8227     = "MSM8227";
//var MSM8230     = "MSM8230";
var MSM8255     = "MSM8255";
var MSM8255T    = "MSM8255T";
var MSM8260     = "MSM8260";
var MSM8260A    = "MSM8260A";
//var MSM8627     = "MSM8627";
var MSM8655     = "MSM8655";
var MSM8660     = "MSM8660";
var MSM8660A    = "MSM8660A";
//var MSM8930     = "MSM8930";
var MSM8960     = "MSM8960";
var MSM8974     = "MSM8974";
//var MSM8974AB   = "MSM8974AB";

// --- NFC, GPS, WiFi, 3G, LTE ---
var NGW3L       = "NFC_GPS_WIFI_3G_LTE";
var NGW3        = "NFC_GPS_WIFI_3G";
var NGW         = "NFC_GPS_WIFI";
var GW3L        = "GPS_WIFI_3G_LTE";
var GW3         = "GPS_WIFI_3G";
var G3L         = "GPS_3G_LTE";
var GW          = "GPS_WIFI";
var W3L         = "WIFI_3G_LTE";
var W           = "WIFI";

// --- OS Version ---
var v000        = "0.0.0";
var v160        = "1.6.0";
var v210        = "2.1.0";
var v211        = "2.1.1";
var v220        = "2.2.0";
var v221        = "2.2.1";
var v222        = "2.2.2";
var v230        = "2.3.0";
var v232        = "2.3.2";
var v233        = "2.3.3";
var v234        = "2.3.4";
var v235        = "2.3.5";
var v236        = "2.3.6";
var v237        = "2.3.7";
var v300        = "3.0.0";
var v310        = "3.1.0";
var v320        = "3.2.0";
var v400        = "4.0.0";
var v401        = "4.0.1";
var v403        = "4.0.3";
var v404        = "4.0.4";
var v410        = "4.1.0";
var v411        = "4.1.1";
var v412        = "4.1.2";
var v420        = "4.2.0";
var v421        = "4.2.1";
var v422        = "4.2.2";
var v430        = "4.3.0";
var v433        = "4.3.3";
var v440        = "4.4.0";
var v442        = "4.4.2";

var ANDROID_DEVICES = {
//                       [0]       [1]       [2]         [3] [4]    [5]  [6]  [7] [8]   [9]  [10]  [11] [12]
//                       OS.TYPE,  BRAND     SOC         OS.VER     DISP.SIZE PPI DPR   RAM TOUCH  INCH NFC+GPS+WiFi+3G+LTE+CHROMIUM
// --- Google Play Edition ---
    "C6806":            [ANDROID,  SONY,     MSM8974,   v422,v440, 1080,1920, 342,  0, 2048,  5,   6.4, NGW3L], // Xperia Z Ultra Google Edition
    "HTC6500LVW":       [ANDROID,  HTC,      APQ8064T,  v422,v440, 1080,1920, 468,  0, 2048, 10,   4.7, NGW3L], // HTC One Google Play Edition
    "GT-I9505G":        [ANDROID,  SAMSUNG,  APQ8064AB, v422,v442, 1080,1920, 441,  0, 2048,  5,     5, NGW3L], // Galaxy S4 Google Play Edition
// --- Google Nexus ---
    "Nexus 10":         [ANDROID,  GOOGLE,   EXYNOS5250,v420,v000, 1600,2560, 300,  2, 2048,  5,    10, NGW  ],
    "Nexus 7 (2013)":   [ANDROID,  GOOGLE,   APQ8064,   v430,v000, 1200,1920, 323,  2, 2048,  5,     7, NGW3L],
    "Nexus 7":          [ANDROID,  GOOGLE,   T30L,      v411,v000,  800,1280, 216,1.33,1024,  5,     7, NGW3L],
    "Nexus 5":          [ANDROID,  GOOGLE,   MSM8974,   v440,v000, 1080,1920, 445,  3, 2048,  5,     5, NGW3L],
    "Nexus 4":          [ANDROID,  GOOGLE,   APQ8064,   v420,v000,  768,1280, 318,  2, 2048,  5,   4.7, NGW3L],
    "Galaxy Nexus":     [ANDROID,  GOOGLE,   OMAP4460,  v400,v422,  720,1280, 316,  2, 1024,  2,   4.7, NGW3L], // LTE (partial)
    "Nexus S":          [ANDROID,  GOOGLE,   S5PC110,   v232,v410,  480,800,  233,1.5,  512,  5,     4, NGW3 ],
    "Nexus One":        [ANDROID,  GOOGLE,   QSD8250,   v210,v236,  480,800,  252,1.5,  512,  2,   3.7,  GW3 ],
// --- Sony ---
    "SGP412JP":         [ANDROID,  SONY,     APQ8074,   v420,v000, 1080,1920, 342,  0, 2048,  5,   6.4, NGW  ], // Xperia Z Ultra WiFi Edition
//
//                       [0]       [1]       [2]         [3] [4]    [5]  [6]  [7] [8]   [9]  [10]  [11] [12]
//                       OS.TYPE,  BRAND     SOC         OS.VER     DISP.SIZE PPI DPR   RAM TOUCH  INCH NFC+GPS+WiFi+3G+LTE+CHROMIUM
    "KFOT":             [ANDROID,  AMAZON,   OMAP4430,  v234,v234,  600,1024,   0,  0,  512,  5,     7,   W  ], // Kindle Fire
    "KFTT":             [ANDROID,  AMAZON,   OMAP4460,  v403,v403,  800,1280,   0,  0, 1024,  5,     7,   W  ], // Kindle Fire HD
    "KFJWI":            [ANDROID,  AMAZON,   OMAP4470,  v403,v403, 1200,1920,   0,  0, 1024,  5,   8.9,   W3L], // Kindle Fire HD 8.9
    "KFJWA":            [ANDROID,  AMAZON,   OMAP4470,  v403,v403, 1200,1920,   0,  0, 1024,  5,   8.9,   W3L], // Kindle Fire HD 8.9 4G
    "KFSOWI":           [ANDROID,  AMAZON,   OMAP4470,  v422,v422,  800,1280,   0,  0, 1024,  5,     7,   W  ], // Kindle Fire HD 7 (2nd)
    "KFTHWI":           [ANDROID,  AMAZON,   MSM8974,   v422,v422, 1200,1920,   0,  0, 2048,  5,     7,   W3L], // Kindle Fire HDX 7 (3rd)
    "KFTHWA":           [ANDROID,  AMAZON,   MSM8974,   v422,v422, 1200,1920,   0,  0, 2048,  5,     7,   W3L], // Kindle Fire HDX 7 (3rd) 4G
    "KFAPWI":           [ANDROID,  AMAZON,   MSM8974,   v422,v422, 1600,2560,   0,  0, 2048,  5,   8.9,   W3L], // Kindle Fire HDX 8.9 (3rd)
    "KFAPWA":           [ANDROID,  AMAZON,   MSM8974,   v422,v422, 1600,2560,   0,  0, 2048,  5,   8.9,   W3L], // Kindle Fire HDX 8.9 (3rd) 4G
//
//{@androidjp
// --- docomo ---
// http://spec.nttdocomo.co.jp/spmss/
    // 2013 winter
    "L-01F":            [ANDROID,  LG,       MSM8974,   v422,v422, 1080,1776, 480,  0, 2048,  5,   5.2, NGW3L], // G2 L-01F
    "SC-01F":           [ANDROID,  SAMSUNG,  MSM8974,   v430,v433, 1080,1920, 480,  0, 2048,  5,   5.7, NGW3L], // GALAXY Note 3, S Browser
    "SC-02F":           [ANDROID,  SAMSUNG,  MSM8974,   v430,v430, 1080,1920, 480,  0, 2048,  5,     5, NGW3L], // GALAXY J SC-02F, S Browser
    "SH-01F":           [ANDROID,  SHARP,    MSM8974,   v422,v422, 1080,1776, 480,  0, 2048,  5,     5, NGW3L], // AQUOS PHONE ZETA SH-01F
    "SH-01FDQ":         [ANDROID,  SHARP,    MSM8974,   v422,v422, 1080,1776, 480,  0, 2048,  5,     5, NGW3L], // SH-01F DRAGON QUEST
    "SH-02F":           [ANDROID,  SHARP,    MSM8974,   v422,v422, 1080,1920, 487,  0, 2048,  5,   4.5, NGW3L], // AQUOS PHONE EX SH-02F
    "SH-03F":           [ANDROID,  SHARP,    MSM8960,   v404,v404,  540,888,  268,  0,  680,  5,   4.1,  GW3L], // JUNIOR 2 (no Google Play)
    "SO-01F":           [ANDROID,  SONY,     MSM8974,   v422,v422, 1080,1776, 480,  3, 2048,  5,     5, NGW3L], // Xperia Z1
    "SO-02F":           [ANDROID,  SONY,     MSM8974,   v422,v422,  720,1184, 320,  0, 2048,  5,   4.3, NGW3L], // Xperia Z1 f SO-02F
//  "SO-03F":           [ANDROID,  SONY,     MSM8974AB, v442,v442, 1080,1920,   0,  0, 3072,  5,   5.2, NGW3L], // Xperia Z2 (Sirius)
    "F-01F":            [ANDROID,  FUJITSU,  MSM8974,   v422,v422, 1080,1776, 480,  0, 2048,  5,     5, NGW3L], // ARROWS NX F-01F
    "F-02F":            [ANDROID,  FUJITSU,  MSM8974,   v422,v422, 1504,2560, 320,  0, 2048,  5,  10.1, NGW3L], // ARROWS Tab F-02F
    "F-03F":            [ANDROID,  FUJITSU,  MSM8974,   v422,v422,  720,1184, 320,  0, 2048,  5,   4.7, NGW3L], // Disney Mobile on docomo F-03F
    "F-04F":            [ANDROID,  FUJITSU,  APQ8064T,  v422,v422,  540,888,  240,  0, 2048,  5,   4.3,  GW3 ], // (no Google Play)
    // 2013 summer
    "L-05E":            [ANDROID,  LG,       APQ8064T,  v422,v422,  720,1280, 320,  0, 2048,  5,   4.5, NGW3L],
    "N-06E":            [ANDROID,  NEC,      APQ8064T,  v422,v422,  720,1184, 320,  0, 2048,  5,   4.7, NGW3L],
    "SC-04E":           [ANDROID,  SAMSUNG,  APQ8064T,  v422,v422, 1080,1920, 441,  0, 2048,  5,     5, NGW3L], // Galaxy S4, S Browser
    "SO-04E":           [ANDROID,  SONY,     APQ8064,   v412,v422,  720,1184, 320,  0, 2048,  5,   4.6, NGW3L], // Xperia A SO-04E
    "SO-04EM":          [ANDROID,  SONY,     APQ8064,   v422,v422,  720,1184, 320,  0, 2048,  5,   4.6, NGW3L], // Xperia feat. HATSUNE MIKU SO-04E
    "SH-06E":           [ANDROID,  SHARP,    APQ8064T,  v422,v422, 1080,1920, 480,  0, 2048,  5,   4.8, NGW3L], // 
    "SH-07E":           [ANDROID,  SHARP,    APQ8064T,  v422,v422,  720,1280, 320,  0, 2048,  2,   4.3, NGW3L],
    "SH-08E":           [ANDROID,  SHARP,    APQ8064T,  v422,v422, 1200,1824, 320,  0, 2048,  5,     7, NGW3L],
    "P-03E":            [ANDROID,  PANASONIC,APQ8064T,  v422,v422, 1080,1920, 480,  0, 2048,  5,   4.7, NGW3L],
    "F-06E":            [ANDROID,  FUJITSU,  APQ8064T,  v422,v422, 1080,1776, 480,  0, 2048,  5,   5.2, NGW3L],
    "F-07E":            [ANDROID,  FUJITSU,  APQ8064T,  v422,v422,  720,1184, 320,  0, 2048,  5,   4.7, NGW3L],
    "F-08E":            [ANDROID,  FUJITSU,  APQ8064T,  v422,v422,  540,867,  240,  0, 2048,  5,   4.3,  GW3L],
    "F-09E":            [ANDROID,  FUJITSU,  APQ8064T,  v422,v422,  540,888,  240,  0, 2048,  5,   4.3,  GW3L],
    // 2012 Q3
    "L-01E":            [ANDROID,  LG,       APQ8064,   v404,v412,  720,1280, 320,  0, 2048,  5,   4.7,  GW3L],
    "L-02E":            [ANDROID,  LG,       MSM8960,   v404,v412,  720,1280, 320,  0, 1024,  5,   4.5,  GW3L],
    "L-04E":            [ANDROID,  LG,       APQ8064T,  v412,v412, 1080,1920, 480,  0, 2048,  5,     5, NGW3L],
    "N-02E":            [ANDROID,  NEC,      MSM8960,   v404,v412,  480,800,  240,  0, 1024,  5,     4,  GW3L],
    "N-03E":            [ANDROID,  NEC,      APQ8064,   v404,v412,  720,1280, 320,  0, 2048,  5,   4.7,  GW3L],
    "N-04E":            [ANDROID,  NEC,      APQ8064,   v412,v412,  720,1280, 320,  0, 2048,  5,   4.7,  GW3L],
    "N-05E":            [ANDROID,  NEC,      MSM8960,   v412,v412,  540,960,  240,  0, 1024,  5,   4.3,  GW3L],
    "SC-01E":           [ANDROID,  SAMSUNG,  APQ8060,   v404,v404,  800,1280, 160,  0, 1024,  5,   7.7,  GW3L],
    "SC-02E":           [ANDROID,  SAMSUNG,  EXYNOS4412,v411,v411,  720,1280, 320,  0, 2048,  5,   5.5,  GW3L],
    "SC-03E":           [ANDROID,  SAMSUNG,  EXYNOS4412,v411,v411,  720,1280, 320,  0, 2048,  5,   4.8,  GW3L],
    "SH-01E":           [ANDROID,  SHARP,    MSM8960,   v404,v412,  540,888,  240,  0, 1024,  2,   4.1,  GW3L],
    "SH-01EVW":         [ANDROID,  SHARP,    MSM8960,   v404,v412,  540,888,  240,  0, 1024,  2,   4.1,  GW3L],
    "SH-02E":           [ANDROID,  SHARP,    APQ8064,   v404,v412,  720,1280, 320,  0, 2048,  2,   4.9, NGW3L],
    "SH-04E":           [ANDROID,  SHARP,    APQ8064,   v412,v412,  720,1184, 320,  0, 2048,  5,   4.5, NGW3L],
    "SH-05E":           [ANDROID,  SHARP,    MSM8960,   v404,v404,  540,960,  240,  0, 1024,  2,   4.1,  G3L ], // JUNIOR (no Google Play, no WiFi)
    "SO-01E":           [ANDROID,  SONY,     MSM8960,   v404,v412,  720,1184, 320,  0, 1024,  5,   4.3, NGW3L],
    "SO-02E":           [ANDROID,  SONY,     APQ8064,   v412,v422,  720,1184, 320,  3, 1024,  5,     5, NGW3L], // Xperia Z
    "SO-03E":           [ANDROID,  SONY,     APQ8064,   v412,v412, 1128,1920, 240,  0, 2048,  5,  10.1, NGW3L],
    "P-02E":            [ANDROID,  PANASONIC,APQ8064,   v412,v412, 1080,1920, 480,  0, 2048,  5,     5, NGW3L],
    "F-02E":            [ANDROID,  FUJITSU,  AP37,      v412,v412, 1080,1920, 480,  0, 2048,  5,     5, NGW3L],
    "F-03E":            [ANDROID,  FUJITSU,  MSM8960,   v404,v412,  540,960,  240,  0, 1024,  5,     4, NGW3L],
    "F-04E":            [ANDROID,  FUJITSU,  AP33,      v404,v422,  720,1280, 320,  0, 2048,  5,   4.7, NGW3L],
    "F-05E":            [ANDROID,  FUJITSU,  AP37,      v404,v412, 1200,1920, 240,  0, 2048,  5,  10.1, NGW3L],
    "HW-01E":           [ANDROID,  HUAWEI,   MSM8960,   v404,v404,  720,1280, 320,  0, 1024,  5,   4.5,  GW3L],
    "HW-03E":           [ANDROID,  HUAWEI,   K3V2,      v412,v412,  720,1280, 320,  0, 2048,  5,   4.7,  GW3L],
    "dtab01":           [ANDROID,  HUAWEI,   K3V2T,     v412,v412,  800,1280, 160,  0, 1024,  5,  10.1,  GW3 ], // dtab
    // 2012 Q1
    "L-05D":            [ANDROID,  LG,       MSM8960,   v404,v412,  480,800,  240,1.5, 1024,  5,     4,  GW3L], // Optimus it
    "L-06D":            [ANDROID,  LG,       APQ8060,   v404,v404,  768,1024, 320,  0, 1024,  5,     5,  GW3L],
    "L-06DJOJO":        [ANDROID,  LG,       APQ8060,   v404,v404,  768,1024, 320,  0, 1024,  5,     5,  GW3L],
    "N-07D":            [ANDROID,  NEC,      MSM8960,   v404,v412,  720,1280, 342,  0, 1024,  5,   4.3,  GW3L],
    "N-08D":            [ANDROID,  NEC,      MSM8960,   v404,v404,  800,1280, 213,  0, 1024,  5,     7,  GW3L],
    "SC-06D":           [ANDROID,  SAMSUNG,  MSM8960,   v404,v412,  720,1280, 320,  2, 2048,  5,   4.8,  GW3L], // Galaxy S III
    "SH-06D":           [ANDROID,  SHARP,    OMAP4460,  v235,v404,  720,1280, 320,  0, 1024,  5,   4.5,  GW3 ],
    "SH-06DNERV":       [ANDROID,  SHARP,    OMAP4460,  v235,v404,  720,1280, 320,  0, 1024,  2,   4.5,  GW3 ],
    "SH-07D":           [ANDROID,  SHARP,    MSM8255,   v404,v404,  480,854,  240,  0, 1024,  2,   3.4,  GW3 ],
    "SH-09D":           [ANDROID,  SHARP,    MSM8960,   v404,v412,  720,1280, 312,  0, 1024,  2,   4.7,  GW3L],
    "SH-10D":           [ANDROID,  SHARP,    MSM8960,   v404,v412,  720,1280, 320,  0, 1024,  2,   4.5,  GW3L],
    "SO-04D":           [ANDROID,  SONY,     MSM8960,   v404,v412,  720,1184, 320,  0, 1024,  5,   4.6,  GW3L],
    "SO-05D":           [ANDROID,  SONY,     MSM8960,   v404,v412,  540,888,  240,1.5, 1024,  5,   3.7,  GW3L], // Xperia SX
    "P-06D":            [ANDROID,  PANASONIC,OMAP4460,  v404,v404,  720,1280, 320,  0, 1024,  5,   4.6,  GW3 ],
    "P-07D":            [ANDROID,  PANASONIC,MSM8960,   v404,v404,  720,1280, 320,  0, 1024,  5,     5,  GW3L],
    "P-08D":            [ANDROID,  PANASONIC,OMAP4460,  v404,v404,  800,1280, 160,  0, 1024,  5,  10.1,  GW3 ],
    "F-09D":            [ANDROID,  FUJITSU,  MSM8255,   v403,v403,  480,800,  240,  0, 1024,  2,   3.7,  GW3 ],
    "F-10D":            [ANDROID,  FUJITSU,  AP33,      v403,v422,  720,1280, 323,  2, 1024,  5,   4.6,  GW3L], // ARROWS X
    "F-11D":            [ANDROID,  FUJITSU,  MSM8255,   v403,v422,  480,800,  240,  0, 1024,  5,   3.7,  GW3 ],
    "F-12D":            [ANDROID,  FUJITSU,  MSM8255,   v403,v403,  480,800,  235,  0, 1024,  5,   4.0,  GW3 ],
    "T-02D":            [ANDROID,  TOSHIBA,  MSM8960,   v404,v412,  540,960,  257,  0, 1024,  5,   4.3,  GW3L],
    // 2011 Q3
    "L-01D":            [ANDROID,  LG,       APQ8060,   v235,v404,  720,1280, 320,  0, 1024,  5,   4.5,  GW3L],
    "L-02D":            [ANDROID,  LG,       OMAP4430,  v237,v404,  480,800,  240,  0, 1024,  5,   4.3,  GW3 ],
    "N-01D":            [ANDROID,  NEC,      MSM8255T,  v235,v235,  480,800,  235,  0,  512,  5,     4,  GW3 ],
    "N-04D":            [ANDROID,  NEC,      APQ8060,   v236,v404,  720,1280, 342,  0, 1024,  5,   4.3,  GW3L],
    "N-05D":            [ANDROID,  NEC,      MSM8260,   v236,v404,  720,1280, 320,  0, 1024,  5,   4.3,  GW3 ],
    "N-06D":            [ANDROID,  NEC,      APQ8060,   v236,v404,  800,1280, 213,  0, 1024,  5,     7,  GW3L],
    "SC-01D":           [ANDROID,  SAMSUNG,  APQ8060,   v320,v404,  800,1200, 160,  0, 1024,  5,  10.1,  GW3L],
    "SC-02D":           [ANDROID,  SAMSUNG,  EXYNOS4210,v320,v404,  600,1024, 160,  0, 1024,  5,     7,  GW3 ],
    "SC-03D":           [ANDROID,  SAMSUNG,  APQ8060,   v236,v404,  480,800,  240,1.5, 1024,  5,   4.5, NGW3L], // GALAXY S II LTE
    "SC-04D":           [ANDROID,  SAMSUNG,  OMAP4460,  v401,v422,  720,1280, 320,  2, 1024,  5,   4.7, NGW3 ], // Galaxy Nexus
    "SC-05D":           [ANDROID,  SAMSUNG,  APQ8060,   v236,v412,  800,1280, 320,  0, 1024,  5,   5.3, NGW3L],
    "SH-01D":           [ANDROID,  SHARP,    OMAP4430,  v235,v404,  720,1280, 328,  0, 1024,  2,   4.5,  GW3 ],
    "SH-02D":           [ANDROID,  SHARP,    MSM8255,   v235,v235,  540,960,  300,  0,  512,  2,   3.7,  GW3 ],
    "SH-04D":           [ANDROID,  SHARP,    MSM8255,   v234,v234,  540,960,  300,  0,  512,  2,   3.7,  GW3 ],
    "SO-01D":           [ANDROID,  SONY,     MSM8255,   v234,v234,  480,854,  240,1.5,  512,  2,     4,  GW3 ], // Xperia Play
    "SO-02D":           [ANDROID,  SONY,     MSM8260,   v237,v404,  720,1280, 320,  0, 1024,  5,   4.3,  GW3 ],
    "SO-03D":           [ANDROID,  SONY,     MSM8260,   v237,v404,  720,1280, 320,  0, 1024,  5,   4.3,  GW3 ],
    "P-01D":            [ANDROID,  PANASONIC,MSM8255,   v234,v234,  480,800,  240,1.5,  512,  2,   3.2,  GW3 ],
    "P-02D":            [ANDROID,  PANASONIC,OMAP4430,  v235,v404,  540,960,  240,  0, 1024,  2,     4,  GW3 ],
    "P-04D":            [ANDROID,  PANASONIC,OMAP4430,  v235,v404,  540,960,  257,  0, 1024,  5,   4.3,  GW3 ],
    "P-05D":            [ANDROID,  PANASONIC,OMAP4430,  v235,v404,  540,960,  257,  0, 1024,  5,   4.3,  GW3 ],
    "F-01D":            [ANDROID,  FUJITSU,  OMAP4430,  v320,v403,  800,1280, 160,  0, 1024,  5,  10.1,  GW3L],
    "F-03D":            [ANDROID,  FUJITSU,  MSM8255,   v235,v235,  480,800,  240,  0,  512,  2,   3.7,  GW3 ],
    "F-05D":            [ANDROID,  FUJITSU,  OMAP4430,  v235,v403,  720,1280, 342,  0, 1024,  2,   4.3,  GW3L],
    "F-07D":            [ANDROID,  FUJITSU,  MSM8255,   v235,v235,  480,800,  235,  0,  512,  5,     4,  GW3 ],
    "F-08D":            [ANDROID,  FUJITSU,  OMAP4430,  v235,v403,  720,1280, 342,  0, 1024,  2,   4.3,  GW3 ],
    "T-01D":            [ANDROID,  TOSHIBA,  OMAP4430,  v235,v403,  720,1280, 320,  0, 1024,  2,   4.3,  GW3 ],
    // 2011 Q1
    "SC-02C":           [ANDROID,  SAMSUNG,  EXYNOS4210,v403,v403,  480,800,  240,  0, 1024,  5,   4.3,  GW3 ], // Galaxy S II
    "SO-01C":           [ANDROID,  SONY,     MSM8255,   v232,v234,  480,854,    0,1.5,  512,  2,   4.2,  GW3 ], // Xperia arc
    "SO-02C":           [ANDROID,  SONY,     MSM8255,   v233,v234,  480,854,    0,  0,  512,  2,   4.2,  GW3 ], // Xperia acro
    "SO-03C":           [ANDROID,  SONY,     MSM8255,   v234,v234,  480,854,    0,  0,  512,  2,   3.3,  GW3 ], // Xperia acro
    "SH-12C":           [ANDROID,  SHARP,    MSM8255T,  v233,v233,  540,960,    0,  0,  512,  2,   4.2,  GW3 ],
    "SH-13C":           [ANDROID,  SHARP,    MSM8255,   v234,v234,  540,960,    0,  0,  512,  2,   3.7,  GW3 ],
    "N-04C":            [ANDROID,  NEC,      MSM7230,   v220,v233,  480,854,    0,  0,  512,  2,     4,  GW3 ],
    "N-06C":            [ANDROID,  NEC,      MSM8255,   v230,v230,  480,854,    0,  0,  512,  2,     4,  GW3 ],
    "P-07C":            [ANDROID,  PANASONIC,OMAP3630,  v230,v230,  480,800,    0,  0,  512,  2,   4.3,  GW3 ],
    "F-12C":            [ANDROID,  FUJITSU,  MSM8255,   v230,v230,  480,800,    0,  0,  512,  2,   3.7,  GW3 ],
    "L-04C":            [ANDROID,  LG,       MSM7227,   v220,v230,  320,480,    0,  0,  512,  2,   3.2,  GW3 ],
    "L-06C":            [ANDROID,  LG,       T20,       v300,v310,  768,1280,   0,  0, 1024,  2,   8.9,  GW3 ],
    "L-07C":            [ANDROID,  LG,       OMAP3630,  v233,v233,  480,800,    0,  0,  512,  2,     4,  GW3 ],
    "T-01C":            [ANDROID,  TOSHIBA,  QSD8250,   v211,v222,  480,854,    0,1.5,    0,  2,     4,  GW3 ], // REGZA Phone
    "SH-03C":           [ANDROID,  SONY,     QSD8250,   v211,v222,  480,800,    0,  0,    0,  2,   3.8,  GW3 ],
    "SC-01C":           [ANDROID,  SAMSUNG,  S5PC110,   v220,v236,  600,1024,   0,1.5,    0,  2,     7,  GW3 ], // GALAXY Tab
    "SC-02B":           [ANDROID,  SAMSUNG,  S5PC110,   v220,v236,  480,800,    0,1.5,    0,  2,     4,  GW3 ], // GALAXY S
    "SH-10B":           [ANDROID,  SHARP,    QSD8250,   v160,v160,  480,960,    0,  1,    0,  2,     5,  GW3 ], // LYNX
    "SO-01B":           [ANDROID,  SONY,     QSD8250,   v160,v211,  480,854,    0,1.5,  384,  1,     4,  GW3 ], // Xperia
//                       [0]       [1]       [2]         [3] [4]    [5]  [6]  [7] [8]   [9]  [10]  [11] [12]
//                       OS.TYPE,  BRAND     SOC         OS.VER     DISP.SIZE PPI DPR   RAM TOUCH  INCH NFC+GPS+WiFi+3G+LTE+CHROMIUM
// --- au ---
// http://www.au.kddi.com/developer/android/
    // 2014 spring
    "SHT22":            [ANDROID,  SHARP,    MSM8974,   v422,v000, 1200,1920, 322,  0, 2048, 10,     7, NGW3L], // AQUOS PAD SHT22
    "SHL24":            [ANDROID,  SHARP,    MSM8974,   v422,v000, 1080,1920, 486,  0, 2048, 10,   4.5, NGW3L], // AQUOS PHONE SERIE mini SHL24
    "URBANO L02":       [ANDROID,  KYOCERA,  MSM8960,   v422,v000,  720,1280, 314,  0, 2048, 10,   4.7, NGW3L], // URBANO L02
    "LGL23":            [ANDROID,  LG,       MSM8974,   v422,v000,  720,1280, 246,  0, 2048, 10,     6, NGW3L], // G Flex LGL23
    "SOL24":            [ANDROID,  SONY,     MSM8974,   v422,v000, 1080,1920, 341,  0, 2048, 10,   6.4, NGW3L], // Xperia Z Ultra SOL24
    // 2013 winter
    "FJT21":            [ANDROID,  FUJITSU,  MSM8974,   v422,v422, 1600,2560, 300,  0, 2048, 10,  10.1, NGW3L],
    "SOL23":            [ANDROID,  SONY,     MSM8974,   v422,v422, 1080,1920, 442,  3, 2048, 10,     5, NGW3L], // Xperia Z1
    "SCL22":            [ANDROID,  SAMSUNG,  MSM8974,   v430,v430, 1080,1920, 386,  0, 3072, 10,   5.7, NGW3L], // S Browser
    "KYL22":            [ANDROID,  KYOCERA,  MSM8974,   v422,v422, 1080,1920, 443,  0, 2048,  5,     5, NGW3L],
    "LGL22":            [ANDROID,  LG,       MSM8974,   v422,v422, 1080,1920, 422,  0, 2048, 10,   5.2, NGW3L], // isai
    "SHL23":            [ANDROID,  SHARP,    MSM8974,   v422,v422, 1080,1920, 460,  0, 2048,  5,   4.8, NGW3L],
    "FJL22":            [ANDROID,  FUJITSU,  MSM8974,   v422,v422, 1080,1920, 444,  0, 2048, 10,     5, NGW3L],
    // 2013 summer
    "SHL22":            [ANDROID,  SHARP,    APQ8064T,  v422,v422,  720,1280, 302,  0, 2048,  5,   4.9, NGW3L],
    "KYY21":            [ANDROID,  KYOCERA,  MSM8960,   v422,v422,  720,1280, 314,  0, 2048,  5,   4.7, NGW3L], // URBANO L01
    "HTL22":            [ANDROID,  HTC,      APQ8064T,  v412,v422, 1080,1920, 468,  0, 2048, 10,   4.7, NGW3L], // HTC J One
    "SOL22":            [ANDROID,  SONY,     APQ8064,   v412,v422, 1080,1920, 443,  0, 2048, 10,     5, NGW3L], // Xperia UL
    // 2013 spring
    "HTX21":            [ANDROID,  HTC,      APQ8064,   v411,v411,  720,1280, 314,  0, 1024, 10,   4.7, NGW3L], // INFOBAR A02
    // 2012 fall and winter
    "SHT21":            [ANDROID,  SHARP,    MSM8960,   v404,v412,  800,1280, 216,  0, 1024,  2,     7, NGW3L], // AQUOS PAD
    "HTL21":            [ANDROID,  HTC,      APQ8064,   v411,v411, 1080,1920, 444,  3, 2048, 10,     5, NGW3L], // HTC J Butterfly
    "SCL21":            [ANDROID,  SAMSUNG,  MSM8960,   v404,v412,  720,1280, 306,  0, 2048, 10,   4.8,  GW3L], // GALAXY SIII Progre
    "CAL21":            [ANDROID,  CASIO,    MSM8960,   v404,v404,  480,800,  236,  0, 1024,  5,     4,  GW3L], // G'zOne TYPE-L
    "SHL21":            [ANDROID,  SHARP,    MSM8960,   v404,v412,  720,1280, 309,  0, 1024,  2,   4.7,  GW3L], // AUOS PHONE SERIE
    "KYL21":            [ANDROID,  KYOCERA,  MSM8960,   v404,v404,  720,1280, 314,  0, 1024,  5,   4.7,  GW3L], // DIGNO S
    "FJL21":            [ANDROID,  FUJITSU,  MSM8960,   v404,v404,  720,1280, 342,  2, 1024, 10,   4.3,  GW3L], // ARROWS ef
    "SOL21":            [ANDROID,  SONY,     MSM8960,   v404,v412,  720,1280, 345,  0, 1024, 10,   4.3,  GW3L], // Xperia VL
    "LGL21":            [ANDROID,  LG,       APQ8064,   v404,v404,  720,1280, 315,  0, 2048, 10,   4.7,  GW3L], // Optimus G
    "PTL21":            [ANDROID,  PANTECH,  MSM8960,   v404,v412,  720,1280, 342,  0, 1024,  5,   4.3,  GW3L], // VEGA
    // 2012 summer
    "ISW13F":           [ANDROID,  FUJITSU,  AP33,      v403,v403,  720,1280, 322,  0, 1024,  3,   4.6,  GW3 ], // ARROWS Z ISW13F
    "IS17SH":           [ANDROID,  SHARP,    MSM8655,   v404,v404,  540,960,  240,  0, 1024,  2,   4.2,  GW3 ], // AQUOS PHONE CL
    "IS15SH":           [ANDROID,  SHARP,    MSM8655,   v404,v404,  540,960,  298,  0, 1024,  2,   3.7,  GW3 ], // AQUOS PHONE SL
    "ISW16SH":          [ANDROID,  SHARP,    MSM8660A,  v404,v404,  720,1280, 318,  2, 1024,  2,   4.6,  GW3 ], // AQUOS PHONE SERIE
    "URBANO PROGRESSO": [ANDROID,  KYOCERA,  MSM8655,   v403,v403,  480,800,  235,  0, 1024,  5,     4,  GW3 ],
    "ISW13HT":          [ANDROID,  HTC,      MSM8660A,  v403,v403,  540,960,  204,  0, 1024,  4,   4.3,  GW3 ], // HTC J
    // 2012 spring
    "IS12S":            [ANDROID,  SONY,     MSM8660,   v237,v404,  720,1280, 342,  0, 1024, 10,   4.3,  GW3 ], // Xperia acro HD
    "IS12M":            [ANDROID,  MOTOROLA, OMAP4430,  v236,v404,  540,960,  256,  0, 1024, 10,   4.3,  GW3 ], // MOTOROLA RAZR
    "INFOBAR C01":      [ANDROID,  SHARP,    MSM8655,   v235,v235,  480,854,  309,  0,  512,  2,   3.2,  GW3 ], // INFOBAR C01
    "ISW11SC":          [ANDROID,  SAMSUNG,  EXYNOS4210,v236,v404,  720,1080, 315,  2, 1024, 10,   4.7,  GW3 ], // GALAXY SII WiMAX
    "IS11LG":           [ANDROID,  LG,       AP25H,     v237,v404,  480,800,  235,  0, 1024, 10,     4,  GW3 ], // Optimus X
    "IS12F":            [ANDROID,  FUJITSU,  MSM8655,   v235,v235,  480,800,  235,  0,  512,  4,     4,  GW3 ], // ARROWS ES
    // 2011 fall and winter
    "IS14SH":           [ANDROID,  SHARP,    MSM8655,   v235,v235,  540,960,  298,  0,  512,  2,   3.7,  GW3 ], // AQUOS PHONE
    "IS11N":            [ANDROID,  NEC,      MSM8655,   v235,v235,  480,800,  262,  0,  512,  5,   3.6,  GW3 ], // MEDIAS BR
    "ISW11F":           [ANDROID,  FUJITSU,  OMAP4430,  v235,v403,  720,1280, 342,  0, 1024,  3,   4.3,  GW3 ], // ARROWS Z
    "ISW11K":           [ANDROID,  KYOCERA,  MSM8655,   v235,v235,  480,800,  234,  0, 1024, 10,     4,  GW3 ], // DIGNO
    "IS13SH":           [ANDROID,  SHARP,    MSM8655,   v235,v235,  540,960,  258,  0,  512,  2,   4.2,  GW3 ], // AQUOS PHONE
    "ISW12HT":          [ANDROID,  HTC,      MSM8660,   v234,v403,  540,960,  256,  0, 1024,  4,   4.3,  GW3 ], // HTC EVO 3D
    "ISW11M":           [ANDROID,  MOTOROLA, T20,       v234,v234,  540,960,  256,  0, 1024,  2,   4.3,  GW3 ], // MOTOROLA PHOTON
    // 2011 summer
    "EIS01PT":          [ANDROID,  PANTECH,  MSM8655,   v234,v234,  480,800,  254,  0,  512,  5,   3.7,  GW3 ],
    "IS11PT":           [ANDROID,  PANTECH,  MSM8655,   v234,v234,  480,800,  254,  0,  512,  5,   3.7,  GW3 ], // MIRACH
    "IS11T":            [ANDROID,  TOSHIBA,  MSM8655,   v234,v234,  480,854,  243,  0,  512,  3,     4,  GW3 ], // REGZA Phone
    "IS11CA":           [ANDROID,  CASIO,    MSM8655,   v233,v233,  480,800,  262,  0,  512,  5,   3.6,  GW3 ], // G'zOne
    "INFOBAR A01":      [ANDROID,  SHARP,    MSM8655,   v233,v233,  540,960,  265,1.5,  512,  2,   3.7,  GW3 ], // INFOBAR A01
    "IS12SH":           [ANDROID,  SHARP,    MSM8655,   v233,v233,  540,960,  263,  0,  512,  2,   4.2,  GW3 ], // AQUOS PHONE
    "IS11SH":           [ANDROID,  SHARP,    MSM8655,   v233,v233,  540,960,  298,  0,  512,  2,   3.7,  GW3 ], // AQUOS PHONE
    "IS11S":            [ANDROID,  SONY,     MSM8655,   v233,v234,  480,854,  232,  0,  512,  2,   4.2,  GW3 ], // Xperia acro
    // 2011 spring and legacy
    "ISW11HT":          [ANDROID,  HTC,      QSD8650,   v221,v234,  480,800,  254,1.5,  512,  2,   4.3,  GW3 ], // HTC EVO WiMAX
    "IS06":             [ANDROID,  PANTECH,  QSD8650,   v221,v221,  480,800,  254,1.5,  512,  5,   3.7,  GW3 ], // SIRIUS alpha
    "IS05":             [ANDROID,  SHARP,    MSM8655,   v221,v234,  480,854,  290,  0,  512,  2,   3.4,  GW3 ],
    "IS04":             [ANDROID,  TOSHIBA,  QSD8650,   v210,v222,  480,854,  290,  0,  512,  2,   4.0,  GW3 ],
    "IS03":             [ANDROID,  SHARP,    QSD8650,   v210,v221,  640,960,  331,  2,  512,  2,   3.5,  GW3 ],
    "IS01":             [ANDROID,  SHARP,    QSD8650,   v160,v160,  480,960,  213,  1,  256,  1,   5.0,  GW3 ],
//                       [0]       [1]       [2]         [3] [4]    [5]  [6]  [7] [8]   [9]  [10]  [11] [12]
//                       OS.TYPE,  BRAND     SOC         OS.VER     DISP.SIZE PPI DPR   RAM TOUCH  INCH NFC+GPS+WiFi+3G+LTE+CHROMIUM
// --- SoftBank ---
    // https://www.support.softbankmobile.co.jp/partner/smp_info/smp_info_search_t.cfm
    "SBM303SH":         [ANDROID,  SHARP,    MSM8974,   v422,v422, 1080,1920,   0,  0, 2048,  5,   4.5, NGW3L], // AQUOS PHONE Xx mini 303SH
    "DM016SH":          [ANDROID,  SHARP,    MSM8974,   v422,v422, 1080,1920,   0,  0, 2048,  2,   5.2, NGW3L],
    "301F":             [ANDROID,  FUJITSU,  MSM8974,   v422,v422, 1080,1920,   0,  0, 2048,  2,     5, NGW3L],
    "SBM302SH":         [ANDROID,  SHARP,    MSM8974,   v422,v422, 1080,1920,   0,  0, 2048,  5,   5.2, NGW3L],
//  "EM01L":            [ANDROID,  GOOGLE,   MSM8974,   v440,v440, 1080,1920, 445,  3, 2048,  5,     5, NGW3L], // E-Mobile Nexus 5 EM01L
    "101F":             [ANDROID,  FUJITSU,  MSM8960,   v404,v412,  540,960,    0,  0, 1024,  2,   4.3, NGW3 ],
    "WX04SH":           [ANDROID,  KYOCERA,  MSM8260A,  v412,v412,  480,854,    0,  0, 1024,  2,     4, NGW3 ],
    "204HW":            [ANDROID,  HUAWEI,   MSM8225,   v410,v410,  480,800,    0,  0, 1024,  2,     4,  GW3 ], // for Silver Age
    "EM01F":            [ANDROID,  KYOCERA,  APQ8064,   v412,v412,  720,1280,   0,  0, 2048,  2,   4.7,  GW3 ],
    "DM015K":           [ANDROID,  KYOCERA,  MSM8960,   v422,v422,  720,1280,   0,  0, 1536,  2,   4.3,  GW3 ],
    "WX10K":            [ANDROID,  KYOCERA,  MSM8960,   v422,v422,  720,1280,   0,  0, 1024,  2,   4.7,  GW3 ],
    "202K":             [ANDROID,  KYOCERA,  MSM8960,   v422,v422,  720,1280, 340,  0, 1024,  2,   4.3,  GW3 ],
    "202F":             [ANDROID,  FUJITSU,  APQ8064T,  v422,v422, 1080,1920,   0,  0, 2048,  2,     5,  GW3 ],
    "SBM206SH":         [ANDROID,  SHARP,    APQ8064T,  v422,v422, 1080,1920,   0,  0, 2048,  2,     5,  GW3 ],
    "SBM205SH":         [ANDROID,  SHARP,    MSM8960,   v412,v412,  480,854,    0,  0, 1024,  2,     4,  GW3 ],
    "DM014SH":          [ANDROID,  SHARP,    MSM8960,   v404,v412,  720,1280,   0,  0, 1024,  2,   4.5,  GW3 ],
    "SBM204SH":         [ANDROID,  SHARP,    MSM8255,   v404,v404,  480,800,    0,  0, 1024,  2,     4,  GW3 ],
    "WX04K":            [ANDROID,  KYOCERA,  APE5R,     v234,v411,  480,800,    0,  0, 1024,  2,     4,  GW3 ],
    "SBM203SH":         [ANDROID,  SHARP,    APQ8064,   v412,v412,  720,1280,   0,  0, 2048,  2,   4.9, NGW3 ],
    "201F":             [ANDROID,  FUJITSU,  APQ8064,   v412,v412,  720,1280,   0,  0, 2048,  2,   4.7, NGW3 ],
    "201K":             [ANDROID,  KYOCERA,  MSM8960,   v412,v412,  480,800,    0,  0, 1024,  2,   3.7,  GW3 ],
    "SBM200SH":         [ANDROID,  SHARP,    MSM8960,   v404,v410,  720,1280,   0,  0, 1024,  2,   4.5, NGW3 ],
    "DM013SH":          [ANDROID,  SHARP,    MSM8255,   v404,v404,  480,854,    0,  0, 1024,  2,   3.7,  GW3 ],
    "SBM107SHB":        [ANDROID,  SHARP,    MSM8255,   v404,v404,  480,854,    0,  0, 1024,  2,   3.7,  GW3 ],
    "WX06K":            [ANDROID,  KYOCERA,  APE5R,     v234,v234,  480,800,    0,  0,  512,  2,   3.5,  GW3 ],
    "SBM107SH":         [ANDROID,  SHARP,    MSM8255,   v404,v404,  480,854,    0,  0, 1024,  2,   3.7,  GW3 ],
    "SBM102SH2":        [ANDROID,  SHARP,    OMAP4430,  v235,v404,  720,1280,   0,  0, 1024,  2,   4.5,  GW3 ],
    "SBM106SH":         [ANDROID,  SHARP,    MSM8260A,  v404,v404,  720,1280,   0,  0, 1024,  2,   4.7,  GW3 ],
    "102P":             [ANDROID,  PANASONIC,OMAP4430,  v235,v235,  540,960,  275,  0, 1024,  2,   4.3,  GW3 ],
    "101DL":            [ANDROID,  DELL,     MSM8260,   v235,v235,  540,960,    0,  0, 1024,  2,   4.3,  GW3 ],
    "SBM104SH":         [ANDROID,  SHARP,    OMAP4460,  v403,v403,  720,1280, 326,  0, 1024,  2,   4.5,  GW3 ],
    "DM012SH":          [ANDROID,  SHARP,    MSM8255,   v235,v235,  540,960,    0,  0,  512,  2,     4,  GW3 ],
    "101K":             [ANDROID,  KYOCERA,  APE5R,     v234,v234,  480,800,    0,  0,  512,  2,   3.5,  GW3 ],
    "SBM103SH":         [ANDROID,  SHARP,    MSM8255,   v235,v235,  540,960,  275,  0,  512,  2,     4,  GW3 ],
    "101N":             [ANDROID,  NEC,      MSM8255,   v235,v235,  480,800,    0,  0,  512,  2,     4,  GW3 ],
    "101P":             [ANDROID,  PANASONIC,OMAP4430,  v235,v235,  480,854,    0,  0, 1024,  2,     4,  GW3 ],
    "SBM102SH":         [ANDROID,  SHARP,    OMAP4430,  v235,v404,  720,1280, 326,  0, 1024,  2,   4.5,  GW3 ],
    "DM011SH":          [ANDROID,  SHARP,    MSM8255,   v235,v235,  480,854,  288,  0,  512,  2,   3.4,  GW3 ],
    "SBM101SH":         [ANDROID,  SHARP,    MSM8255,   v235,v235,  480,854,  288,  0,  512,  2,   3.4,  GW3 ],
    "DM010SH":          [ANDROID,  SHARP,    MSM8255,   v234,v234,  540,960,    0,  0,  512,  2,     4,  GW3 ],
    "DM009SH":          [ANDROID,  SHARP,    MSM8255,   v220,v234,  480,800,    0,  0,  512,  2,     4,  GW3 ],
    "SBM009SHY":        [ANDROID,  SHARP,    MSM8255,   v234,v234,  540,960,  288,  0,  512,  2,     4,  GW3 ],
    "SBM007SHK":        [ANDROID,  SHARP,    MSM8255,   v233,v233,  480,854,  288,  0,  512,  2,   3.4,  GW3 ],
    "SBM009SH":         [ANDROID,  SHARP,    MSM8255,   v234,v234,  540,960,    0,  0,  512,  2,     4,  GW3 ],
    "003P":             [ANDROID,  PANASONIC,OMAP3630,  v233,v233,  480,854,    0,  0,  512,  2,   4.3,  GW3 ],
    "SBM007SHJ":        [ANDROID,  SHARP,    MSM8255,   v233,v233,  480,854,  288,  0,  512,  2,   3.4,  GW3 ],
    "SBM007SH":         [ANDROID,  SHARP,    MSM8255,   v233,v233,  480,854,  288,  0,  512,  2,   3.4,  GW3 ],
    "SBM006SH":         [ANDROID,  SHARP,    MSM8255,   v233,v233,  540,960,    0,  0,  512,  2,   4.2,  GW3 ],
    "SBM005SH":         [ANDROID,  SHARP,    MSM8255,   v221,v221,  480,800,    0,  0,  512,  2,   3.8,  GW3 ],
    "001DL":            [ANDROID,  DELL,     QSD8250,   v220,v220,  480,800,    0,  0,  512,  2,     5,  GW3 ],
    "SBM003SH":         [ANDROID,  SHARP,    MSM8255,   v220,v234,  480,800,    0,1.5,  512,  2,   3.8,  GW3 ],
    "001HT":            [ANDROID,  HTC,      MSM8255,   v220,v233,  480,800,    0,1.5,  384,  2,   4.3,  GW3 ],
//  "SBM201HW":         [ANDROID,  HUAWEI,   MSM8960,   v400,v400,  540,960,    0,  0, 1024,  2,   4.3,  GW3 ],
//  "SBM007HW":         [ANDROID,  HUAWEI,   MSM8255,   v234,v234,  480,800,    0,  0,  512,  2,   3.7,  GW3 ], // Vision
//  "X06HT":            [ANDROID,  HTC,      QSD8250,   v210,v220,  480,800,    0,  1,  512,  2,   3.7,  GW3 ],
//  "009Z":             [ANDROID,  ZTE,      MSM8255,   v234,v234,  480,800,    0,  0,  512,  2,   3.8,  GW3 ], // STAR7
//  "008Z":             [ANDROID,  ZTE,      MSM8255,   v230,v230,  480,800,    0,  0,  512,  2,   3.8,  GW3 ],
//  "003Z":             [ANDROID,  ZTE,      MSM7227,   v220,v220,  480,800,    0,  0,  512,  2,   3.5,  GW3 ], // Libero
//  "201M":             [ANDROID,  MOTOROLA, MSM8960,   v400,v410,  540,960,    0,  0, 1024,  2,   4.3,  GW3 ], // Motorola RAZR
//}@androidjp
//                       [0]       [1]       [2]         [3] [4]    [5]  [6]  [7] [8]   [9]  [10]  [11] [12]
//                       OS.TYPE,  BRAND     SOC         OS.VER     DISP.SIZE PPI DPR   RAM TOUCH  INCH NFC+GPS+WiFi+3G+LTE+CHROMIUM
// --- WiFi tablet ---
    "Kobo Arc 7":       [ANDROID,  OTHER,    MTK8125,   v422,v422,  600,1024,   0,  0, 1024,  5,     7,   W  ], // Kobo Arc 7
    "MeMo Pad HD7":     [ANDROID,  OTHER,    MTK8125,   v421,v421,  800,1280,   0,  0, 1024, 10,     7,  GW  ]  // MeMo Pad HD7
};

Device["add"](ANDROID_DEVICES);

if (global["Device_"]) {
    global["Device_"]["add"](ANDROID_DEVICES);
}

})((this || 0).self || global);

