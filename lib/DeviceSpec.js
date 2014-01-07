// @name: DeviceSpec.js

(function(global) {

// --- define ----------------------------------------------
var DEVICE_CATALOG = {
// --- Google ---
//               BRAND,      SOC,       OS(release, last) WIDTH HEIGHT PPI RAM
    "Nexus One":["GOOGLE",   "QSD8250",   "2.1.0, 2.3.6",  480,  800,   0, 0.5],
    "Nexus S":  ["GOOGLE",   "S5PC110",   "2.3.2, 4.1.0",  800,  480,   0, 0.5],
    "Galaxy Nexus":
                ["GOOGLE",   "OMAP4460",  "4.0.0, 4.2.2", 1280,  720, 316, 1],
    "Nexus 4":  ["GOOGLE",   "APQ8064",   "4.2.0",        1280,  768, 318, 2],
    "Nexus 5":  ["GOOGLE",   "MSM8974",   "4.4.0",        1920, 1080, 445, 2],
    "Nexus 7":  ["GOOGLE",   "T30L",      "4.1.1",        1280,  800, 216, 1],
//  "Nexus 7":  ["GOOGLE",   "APQ8064",   "4.3.0",        1920, 1200, 323, 2],
    "Nexus 10": ["GOOGLE",   "Exynos5250","4.2.0",        2560, 1600, 300, 2],
// --- docomo: http://spec.nttdocomo.co.jp/spmss/ ---
//               BRAND,      SOC,       OS(release, last) WIDTH HEIGHT PPI RAM
    "L-01F":    ["LG",       "MSM8974",   "4.2.2",        1080, 1776, 480, 2],
    "SC-01F":   ["SAMSUMG",  "MSM8974",   "4.3.0",        1080, 1920, 480, 2],
    "SC-02F":   ["SAMSUMG",  "MSM8974",   "4.3.0",        1080, 1920, 480, 2],
    "SH-01F":   ["SHARP",    "MSM8974",   "4.2.2",        1080, 1776, 480, 2],
    "SH-01FDQ": ["SHARP",    "MSM8974",   "4.2.2",        1080, 1776, 480, 2],
    "SO-01F":   ["SONY",     "MSM8974",   "4.2.2",        1080, 1776, 480, 2],
    "SO-02F":   ["SONY",     "MSM8974",   "4.2.2",         720, 1184, 320, 2],
    "F-01F":    ["FUJITSU",  "MSM8974",   "4.2.2",        1080, 1776, 480, 2],
    "F-02F":    ["FUJITSU",  "MSM8974",   "4.2.2",        2560, 1504, 320, 2],
    "F-03F":    ["FUJITSU",  "MSM8974",   "4.2.2",         720, 1184, 320, 2],
    "F-04F":    ["FUJITSU",  "APQ8064T",  "4.2.2",         540,  888, 240, 2],
    "L-05E":    ["LG",       "APQ8064T",  "4.2.2",         720, 1280, 320, 2],
    "N-06E":    ["NEC",      "APQ8064T",  "4.2.2",         720, 1184, 320, 2],
    "SC-04E":   ["SAMSUMG",  "APQ8064T",  "4.2.2",        1080, 1920, 480, 2],
    "SO-04E":   ["SONY",     "APQ8064",   "4.1.2, 4.2.2",  720, 1184, 320, 2],
    "SO-04EM":  ["SONY",     "APQ8064",   "4.2.2",         720, 1184, 320, 2],
    "SH-06E":   ["SHARP",    "APQ8064T",  "4.2.2",        1080, 1920, 480, 2],
    "SH-07E":   ["SHARP",    "APQ8064T",  "4.2.2",         720, 1280, 320, 2],
    "SH-08E":   ["SHARP",    "APQ8064T",  "4.2.2",        1200, 1824, 320, 2],
    "P-03E":    ["PANASONIC","APQ8064T",  "4.2.2",        1080, 1920, 480, 2],
    "F-06E":    ["FUJITSU",  "APQ8064T",  "4.2.2",        1080, 1776, 480, 2],
    "F-07E":    ["FUJITSU",  "APQ8064T",  "4.2.2",         720, 1184, 320, 2],
    "F-08E":    ["FUJITSU",  "APQ8064T",  "4.2.2",         540,  867, 240, 2],
    "F-09E":    ["FUJITSU",  "APQ8064T",  "4.2.2",         540,  888, 240, 2],
    "L-01E":    ["LG",       "APQ8064",   "4.0.4, 4.1.2",  720, 1280, 320, 2],
    "L-02E":    ["LG",       "MSM8960",   "4.0.4, 4.1.2",  720, 1280, 320, 1],
    "L-04E":    ["LG",       "APQ8064T",  "4.1.2",        1080, 1920, 480, 2],
    "N-02E":    ["NEC",      "MSM8960",   "4.0.4, 4.1.2",  480,  800, 240, 1],
    "N-03E":    ["NEC",      "APQ8064",   "4.0.4, 4.1.2",  720, 1280, 320, 2],
    "N-04E":    ["NEC",      "APQ8064",   "4.1.2",         720, 1280, 320, 2],
    "N-05E":    ["NEC",      "MSM8960",   "4.1.2",         540,  960, 240, 1],
    "SC-01E":   ["SAMSUMG",  "APQ8060",   "4.0.4",         800, 1280, 160, 1],
    "SC-02E":   ["SAMSUMG",  "Exynos4412","4.1.1",         720, 1280, 320, 2],
    "SC-03E":   ["SAMSUMG",  "Exynos4412","4.1.1",         720, 1280, 320, 2],
    "SH-01E":   ["SHARP",    "MSM8960",   "4.0.4",         540,  888, 240, 1],
    "SH-01EVW": ["SHARP",    "MSM8960",   "4.0.4",         540,  888, 240, 1],
    "SH-02E":   ["SHARP",    "APQ8064",   "4.0.4, 4.1.2",  720, 1280, 320, 2],
    "SH-04E":   ["SHARP",    "APQ8064",   "4.1.2",         720, 1184, 320, 2],
    "SH-05E":   ["SHARP",    "MSM8960",   "4.0.4",         540,  960, 240, 1],
    "SO-01E":   ["SONY",     "MSM8960",   "4.0.4, 4.1.2",  720, 1184, 320, 1],
    "SO-02E":   ["SONY",     "APQ8064",   "4.1.2, 4.2.2",  720, 1184, 320, 1],
    "SO-03E":   ["SONY",     "APQ8064",   "4.1.2",        1920, 1128, 240, 2],
    "P-02E":    ["PANASONIC","APQ8064",   "4.1.2",        1080, 1920, 480, 2],
    "F-02E":    ["FUJITSU",  "AP37",      "4.1.2",        1080, 1920, 480, 2],
    "F-03E":    ["FUJITSU",  "MSM8960",   "4.0.4, 4.1.2",  540,  960, 240, 1],
    "F-04E":    ["FUJITSU",  "AP33",      "4.0.4, 4.2.2",  720, 1280, 320, 2],
    "F-05E":    ["FUJITSU",  "AP37",      "4.0.4, 4.1.2", 1920, 1200, 240, 2],
    "HW-01E":   ["HUAWEI",   "MSM8960",   "4.0.4",         720, 1280, 320, 1],
    "HW-03E":   ["HUAWEI",   "K3V2",      "4.1.2",         720, 1280, 320, 2],
    "dtab01":   ["HUAWEI",   "K3V2T",     "4.1.2",        1280,  800, 160, 1],
    "L-05D":    ["LG",       "MSM8960",   "4.0.4, 4.1.2",  480,  800, 240, 1],
    "L-06D":    ["LG",       "APQ8060",   "4.0.4",         768, 1024, 320, 1],
    "L-06DJOJO":["LG",       "APQ8060",   "4.0.4",         768, 1024, 320, 1],
    "N-07D":    ["NEC",      "MSM8960",   "4.0.4",         720, 1280, 342, 1],
    "N-08D":    ["NEC",      "MSM8960",   "4.0.4",         800, 1280, 213, 1],
    "SC-06D":   ["SAMSUMG",  "MSM8960",   "4.0.4, 4.1.2",  720, 1280, 320, 2],
    "SH-06D":   ["SHARP",    "OMAP4460",  "2.3.5, 4.0.4",  720, 1280, 320, 1],
    "SH-06DNERV":["SHARP",   "OMAP4460",  "2.3.5, 4.0.4",  720, 1280, 320, 1],
    "SH-07D":   ["SHARP",    "MSM8255",   "4.0.4",         480,  854, 240, 1],
    "SH-09D":   ["SHARP",    "MSM8960",   "4.0.4, 4.1.2",  720, 1280, 312, 1],
    "SH-10D":   ["SHARP",    "MSM8960",   "4.0.4, 4.1.2",  720, 1280, 320, 1],
    "SO-04D":   ["SONY",     "MSM8960",   "4.0.4, 4.1.2",  720, 1184, 320, 1],
    "SO-05D":   ["SONY",     "MSM8960",   "4.0.4, 4.1.2",  540,  888, 240, 1],
    "P-06D":    ["PANASONIC","OMAP4460",  "4.0.4",         720, 1280, 320, 1],
    "P-07D":    ["PANASONIC","MSM8960",   "4.0.4",         720, 1280, 320, 1],
    "P-08D":    ["PANASONIC","OMAP4460",  "4.0.4",        1280,  800, 160, 1],
    "F-09D":    ["FUJITSU",  "MSM8255",   "4.0.3",         480,  800, 240, 1],
    "F-10D":    ["FUJITSU",  "AP33",      "4.0.3, 4.2.2",  720, 1280, 323, 1],
    "F-11D":    ["FUJITSU",  "MSM8255",   "4.0.3, 4.2.2",  480,  800, 240, 1],
    "F-12D":    ["FUJITSU",  "MSM8255",   "4.0.3",         480,  800, 235, 1],
    "T-02D":    ["TOSHIBA",  "MSM8960",   "4.0.4, 4.1.2",  540,  960, 257, 1],
    "L-01D":    ["LG",       "APQ8060",   "2.3.5, 4.0.4",  720, 1280, 320, 1],
    "L-02D":    ["LG",       "OMAP4430",  "2.3.7, 4.0.4",  480,  800, 240, 1],
    "N-01D":    ["NEC",      "MSM8255T",  "2.3.5",         480,  800, 235, 0.5],
    "N-04D":    ["NEC",      "APQ8060",   "2.3.6, 4.0.4",  720, 1280, 342, 1],
    "N-05D":    ["NEC",      "MSM8260",   "2.3.6, 4.0.4",  720, 1280, 320, 1],
    "N-06D":    ["NEC",      "APQ8060",   "2.3.6, 4.0.4", 1280,  800, 213, 1],
    "SC-01D":   ["SAMSUMG",  "APQ8060",   "3.2.0, 4.0.4", 1200,  800, 160, 1],
    "SC-02D":   ["SAMSUMG",  "Exynos4210","3.2.0, 4.0.4",  600, 1024, 160, 1],
    "SC-03D":   ["SAMSUMG",  "APQ8060",   "2.3.6, 4.0.4",  480,  800, 240, 1],
    "SC-04D":   ["SAMSUMG",  "OMAP4460",  "4.0.1, 4.2.2",  720, 1280, 320, 1], // GALAXY NEXUS
    "SC-05D":   ["SAMSUMG",  "APQ8060",   "2.3.6, 4.1.2",  800, 1280, 320, 1],
    "SH-01D":   ["SHARP",    "OMAP4430",  "2.3.5, 4.0.4",  720, 1280, 328, 1],
    "SH-02D":   ["SHARP",    "MSM8255",   "2.3.5",         540,  960, 300, 0.5],
    "SH-04D":   ["SHARP",    "MSM8255",   "2.3.4",         540,  960, 300, 0.5],
    "SO-01D":   ["SONY",     "MSM8255",   "2.3.4",         480,  854, 240, 0.5],
    "SO-02D":   ["SONY",     "MSM8260",   "2.3.7, 4.0.4",  720, 1280, 320, 1],
    "SO-03D":   ["SONY",     "MSM8260",   "2.3.7, 4.0.4",  720, 1280, 320, 1],
    "P-01D":    ["PANASONIC","MSM8255",   "2.3.4",         480,  800, 240, 0.5],
    "P-02D":    ["PANASONIC","OMAP4430",  "2.3.5, 4.0.4",  540,  960, 240, 1],
    "P-04D":    ["PANASONIC","OMAP4430",  "2.3.5, 4.0.4",  540,  960, 257, 1],
    "P-05D":    ["PANASONIC","OMAP4430",  "2.3.5, 4.0.4",  540,  960, 257, 1],
    "F-01D":    ["FUJITSU",  "OMAP4430",  "3.2.0, 4.0.3", 1280,  800, 160, 1],
    "F-03D":    ["FUJITSU",  "MSM8255",   "2.3.5",         480,  800, 240, 0.5],
    "F-05D":    ["FUJITSU",  "OMAP4430",  "2.3.5, 4.0.3",  720, 1280, 342, 1],
    "F-07D":    ["FUJITSU",  "MSM8255",   "2.3.5",         480,  800, 235, 0.5],
    "F-08D":    ["FUJITSU",  "OMAP4430",  "2.3.5, 4.0.3",  720, 1280, 342, 1],
    "T-01D":    ["TOSHIBA",  "OMAP4430",  "2.3.5, 4.0.3",  720, 1280, 320, 1],

    "SC-02C":   ["SAMSUMG",  "Exynos4210","4.0.3",         480,  800, 240, 1], // Galaxy S II
    "SO-01C":   ["SONY",     "MSM8255",   "2.3.2, 2.3.4",  480,  854,   0, 0.5], // Xperia arc
    "SO-02C":   ["SONY",     "MSM8255",   "2.3.3, 2.3.4",  480,  854,   0, 0.5], // Xperia acro
    "SO-03C":   ["SONY",     "MSM8255",   "2.3.4",         480,  854,   0, 0.5], // Xperia acro
    "P-07C":    ["PANASONIC","OMAP3630",  "2.3.0",         480,  800,   0, 0.5],
    "F-12C":    ["FUJITSU",  "MSM8255",   "2.3.0",         480,  800,   0, 0.5],
    "SH-12C":   ["SHARP",    "MSM8255T",  "2.3.3",         540,  960,   0, 0.5],
    "SH-13C":   ["SHARP",    "MSM8255",   "2.3.4",         540,  960,   0, 0.5],
    "N-04C":    ["NEC",      "MSM7230",   "2.2.0, 2.3.3",  480,  854,   0, 0.5],
    "N-06C":    ["NEC",      "MSM8255",   "2.3.0",         480,  854,   0, 0.5],
    "L-04C":    ["LG",       "MSM7227",   "2.2.0",         320,  480,   0, 0.5],
    "L-06C":    ["LG",       "T250",      "3.0.0, 3.1.0", 1280,  768,   0, 1], // Xperia arc
    "L-07C":    ["LG",       "OMAP3630",  "2.3.3",         800,  480,   0, 0.5],
    "T-01C":    ["TOSHIBA",  "",          "2.1.1, 2.2.2", ], // REGZA Phone
    "SH-03C":   ["SONY",     "",          "2.1.1, 2.2.2", ],
    "SC-01C":   ["SAMSUMG",  "",          "2.2.0, 2.3.6", ], // GALAXY Tab
    "SC-02B":   ["SAMSUMG",  "",          "2.2.0, 2.3.6", ], // GALAXY S
    "SH-10B":   ["SHARP",    "",          "1.6.0"         ],
    "SO-01B":   ["SONY",     "",          "1.6.0, 2.1.1", ],
// --- au ---
//               BRAND,      SOC,       OS(release, last) WIDTH HEIGHT PPI RAM
    "FJT21":    ["FUJITSU",  "MSM8974",   "4.2.2",        1600, 2560, 300, 2],
    "SOL23":    ["SONY",     "MSM8974",   "4.2.2",        1080, 1920, 442, 2],
    "SCL22":    ["SAMSUMG",  "MSM8974",   "4.3.0",        1080, 1920, 386, 3],
    "KYL22":    ["KYOCERA",  "MSM8974",   "4.2.2",        1080, 1920, 443, 2],
    "LGL22":    ["LG",       "MSM8974",   "4.2.2",        1080, 1920, 422, 2],
    "SHL23":    ["SHARP",    "MSM8974",   "4.2.2",        1080, 1920, 460, 2],
    "FJL22":    ["FUJITSU",  "MSM8974",   "4.2.2",        1080, 1920, 444, 2],
    "SHL22":    ["SHARP",    "APQ8064T",  "4.2.2",         720, 1280, 302, 2],
    "KYY21":    ["KYOCERA",  "MSM8960",   "4.2.2",         720, 1280, 314, 2],
    "HTL22":    ["HTC",      "APQ8064T",  "4.1.2, 4.2.2", 1080, 1920, 468, 2],
    "SOL22":    ["SONY",     "APQ8064",   "4.1.2, 4.2.2", 1080, 1920, 443, 2],
    "HTX21":    ["HTC",      "APQ8064",   "4.1.1",         720, 1280, 314, 1], // INFOBAR A02
    "SHT21":    ["SHARP",    "MSM8960",   "4.0.4, 4.1.2",  800, 1280, 216, 1],
    "HTL21":    ["HTC",      "APQ8064",   "4.1.1",        1080, 1920, 444, 2],
    "SCL21":    ["SAMSUMG",  "MSM8960",   "4.0.4, 4.1.2",  720, 1280, 306, 2],
    "CAL21":    ["CASIO",    "MSM8960",   "4.0.4",         480,  800, 236, 1],
    "SHL21":    ["SHARP",    "MSM8960",   "4.0.4, 4.1.2",  720, 1280, 309, 1],
    "KYL21":    ["KYOCERA",  "MSM8960",   "4.0.4",         720, 1280, 314, 1],
    "FJL21":    ["FUJITSU",  "MSM8960",   "4.0.4",         720, 1280, 342, 1],
    "SOL21":    ["SONY",     "MSM8960",   "4.0.4, 4.1.2",  720, 1280, 345, 1],
    "LGL21":    ["LG",       "APQ8064",   "4.0.4",         720, 1280, 315, 2],
    "PTL21":    ["PANTECH",  "MSM8960",   "4.0.4, 4.1.2",  720, 1280, 342, 1],
    "ISW13F":   ["FUJITSU",  "AP33",      "4.0.3",         720, 1280, 322, 1],
    "IS17SH":   ["SHARP",    "MSM8655",   "4.0.4",         540,  960, 240, 1],
    "IS15SH":   ["SHARP",    "MSM8655",   "4.0.4",         540,  960, 298, 1],
    "ISW16SH":  ["SHARP",    "MSM8660A",  "4.0.4",         720, 1280, 318, 1],
    "URBANO PROGRESSO":
                ["KYOCERA",  "MSM8655",   "4.0.3",         480,  800, 235, 1],
    "ISW13HT":  ["HTC",      "MSM8660A",  "4.0.3",         540,  960, 204, 1],
    "IS12S":    ["SONY",     "MSM8660",   "2.3.7, 4.0.4",  720, 1280, 342, 1],
    "IS12M":    ["MOTOROLA", "OMAP4430",  "2.3.6, 4.0.4",  540,  960, 256, 1],
    "INFOBAR C01":["SHARP",  "MSM8655",   "2.3.5",         480,  854, 309, 0.5],
    "ISW11SC":  ["SAMSUMG",  "Exynos4210","2.3.6, 4.0.4",  720, 1080, 315, 1],
    "IS11LG":   ["LG",       "AP25H",     "2.3.7, 4.0.4",  480,  800, 235, 1],
    "IS12F":    ["FUJITSU",  "MSM8655",   "2.3.5",         480,  800, 235, 0.5],
    "IS14SH":   ["SHARP",    "MSM8655",   "2.3.5",         540,  960, 298, 0.5],
    "IS11N":    ["NEC",      "MSM8655",   "2.3.5",         480,  800, 262, 0.5],
    "ISW11F":   ["FUJITSU",  "OMAP4430",  "2.3.5, 4.0.3",  720, 1280, 342, 1],
    "ISW11K":   ["KYOCERA",  "MSM8655",   "2.3.5",         480,  800, 234, 1],
    "IS13SH":   ["SHARP",    "MSM8655",   "2.3.5",         540,  960, 258, 0.5],
    "ISW12HT":  ["HTC",      "MSM8660",   "2.3.4, 4.0.3",  540,  960, 256, 1],
    "ISW11M":   ["MOTOROLA", "T250",      "2.3.4",         540,  960, 256, 1],
    "EIS01PT":  ["PANTECH",  "MSM8655",   "2.3.4",         480,  800, 254, 0.5],
    "IS11PT":   ["PANTECH",  "MSM8655",   "2.3.4",         480,  800, 254, 0.5],
    "IS11T":    ["TOSHIBA",  "MSM8655",   "2.3.4",         480,  854, 243, 0.5],
    "IS11CA":   ["CASIO",    "MSM8655",   "2.3.3",         480,  800, 262, 0.5],
    "INFOBAR A01":["SHARP",  "MSM8655",   "2.3.3",         540,  960, 265, 0.5],
    "IS12SH":   ["SHARP",    "MSM8655",   "2.3.3",         540,  960, 263, 0.5],
    "IS11SH":   ["SHARP",    "MSM8655",   "2.3.3",         540,  960, 298, 0.5],
    "IS11S":    ["SONY",     "MSM8655",   "2.3.3, 2.3.4",  480,  854, 232, 0.5],
    "ISW11HT":  ["HTC",      "QSD8650",   "2.2.1, 2.3.4",  480,  800, 254, 0.5],
    "IS06":     ["PANTECH",  "QSD8650",   "2.2.1",         480,  800, 254, 0.5],
    "IS05":     ["SHARP",    "MSM8655",   "2.2.1, 2.3.4",  480,  854, 290, 0.5],
    "IS04":     ["TOSHIBA",  "QSD8650",   "2.1.0, 2.2.2",  480,  854, 290, 0.5],
    "IS03":     ["SHARP",    "QSD8650",   "2.1.0, 2.2.1",  640,  960, 331, 0.5],
    "IS01":     ["SHARP",    "QSD8650",   "1.6.0",         480,  960, 213, 0.25],
// --- SoftBank ---
//               BRAND,      SOC,       OS(release, last) WIDTH HEIGHT PPI RAM
    "001HT":    ["HTC",      "MSM8255",   "2.2.0, 2.3.3",  800,  480,   0, 0.75],
    "X06HT":    ["HTC",      "QSD8250",   "2.1.0, 2.2.0",  800,  480,   0, 0.5],
    "003SH":    ["SHARP",    "MSM8255",   "2.2.0, 2.3.0",  800,  480,   0, 0.5],
    "005SH":    ["SHARP",    "MSM8255",   "2.2.0, 2.3.0",  800,  480,   0, 0.5],
    "006SH":    ["SHARP",    "MSM8255T",  "2.3.4",         540,  960,   0, 0.5],
    "007SH":    ["SHARP",    "MSM8255",   "2.3.3",         854,  480, 288, 1],
    "009SH":    ["SHARP",    "MSM8255T",  "2.3.0",         540,  960,   0, 0.5],
    "101SH":    ["SHARP",    "MSM8255",   "2.3.0",         854,  480, 288, 0.5],
    "102SH":    ["SHARP",    "OMAP4430",  "2.3.0, 4.0.0", 1280,  720, 326, 1],
    "103SH":    ["SHARP",    "MSM8255T",  "2.3.0",         540,  960, 275, 0.5],
    "104SH":    ["SHARP",    "OMAP4460",  "4.0.3",        1280,  720, 326, 1],
    "106SH":    ["SHARP",    "MSM8260A",  "4.0.0",        1280,  720,   0, 1],
    "107SH":    ["SHARP",    "MSM8255",   "4.0.0",         480,  854,   0, 1],
    "200SH":    ["SHARP",    "MSM8960",   "4.0.0, 4.1.0", 1280,  720,   0, 1],
    "203SH":    ["SHARP",    "APQ8064",   "4.1.0",        1280,  720,   0, 2],
    "204SH":    ["SHARP",    "MSM8255",   "4.0.0",         800,  480,   0, 1],
    "205SH":    ["SHARP",    "MSM8960",   "4.1.0",         854,  480,   0, 1],
    "206SH":    ["SHARP",    "APQ8064T",  "4.2.0",        1920, 1080,   0, 2],
    "302SH":    ["SHARP",    "MSM8974",   "4.2.0",        1920, 1080,   0, 2],
    "303SH":    ["SHARP",    "MSM8974",   "4.2.0",        1920, 1080,   0, 2],
    "003P":     ["PANASONIC","OMAP3630",  "2.3.0",         854,  480,   0, 0.5],
    "101P":     ["PANASONIC","OMAP4430",  "2.3.0",         540,  960, 275, 1],
    "101N":     ["NEC",      "MSM8255",   "2.3.0",         480,  800,   0, 0.5],
    "202K":     ["KYOCERA",  "MSM8960",   "4.2.0",        1280,  720, 340, 1.5],
    "201K":     ["KYOCERA",  "MSM8960",   "4.1.0",         800,  480,   0, 1],
    "101K":     ["KYOCERA",  "APE5R",     "2.3.0",         480,  800,   0, 0.5],
    "007HW":    ["HUAWEI",   "MSM8255",   "2.3.4",         800,  480,   0, 0.5],
    "201HW":    ["HUAWEI",   "MSM8960",   "4.0.0",         540,  960,   0, 1],
    "003Z":     ["ZTE",      "MSM7227",   "2.2.0",         800,  480,   0, 0.5],
    "008Z":     ["ZTE",      "MSM8255",   "2.3.0",         480,  800,   0, 0.5],
    "009Z":     ["ZTE",      "MSM8255",   "2.3.4",         480,  800,   0, 0.5],
    "001DL":    ["DELL",     "QSD8250",   "2.2.0",         800,  480,   0, 0.5],
    "101DL":    ["DELL",     "MSM8260",   "2.3.0",         540,  960,   0, 1],
    "101F":     ["FUJITSU",  "MSM8960",   "4.0.0",         540,  960,   0, 1],
    "201F":     ["FUJITSU",  "APQ8064",   "4.1.0",        1280,  720,   0, 2],
    "202F":     ["FUJITSU",  "APQ8064T",  "4.2.0",        1920, 1080,   0, 2],
    "301F":     ["FUJITSU",  "MSM8974",   "4.2.0",        1920, 1080,   0, 2],
    "201M":     ["MOTOROLA", "MSM8960",   "4.0.0, 4.1.0",  540,  960,   0, 1],
};

// --- add special flags ---
// noAndroidBrowser: has not Android Browser.
DEVICE_CATALOG["SO-01F"].noAndroidBrowser = true;
// noGooglePlay: has not Google Account;
DEVICE_CATALOG["F-04F"].noGooglePlay = true;
DEVICE_CATALOG["F-08E"].noGooglePlay = true;

var SOC_CATALOG = {
//                CPU_CLOCK CPU_CORES NEON   GPU_TYPE,   GPU_NAME
// --- Snapdragon ---
    "MSM8974":    [2.2,     4,        true,  "Adreno",   "Adreno 330"       ],
    "APQ8064T":   [1.7,     4,        true,  "Adreno",   "Adreno 320"       ],
    "APQ8064":    [1.5,     4,        true,  "Adreno",   "Adreno 320"       ],
    "MSM8660A":   [1.5,     2,        true,  "Adreno",   "Adreno 225"       ],
    "MSM8960":    [1.5,     2,        true,  "Adreno",   "Adreno 225"       ],
    "APQ8060":    [1.2,     2,        true,  "Adreno",   "Adreno 220"       ],
    "MSM8660":    [1.2,     2,        true,  "Adreno",   "Adreno 220"       ],
    "MSM8655":    [1.0,     1,        true,  "Adreno",   "Adreno 205"       ],
    "MSM8255T":   [1.4,     1,        true,  "Adreno",   "Adreno 205"       ],
    "MSM8255":    [1.0,     1,        true,  "Adreno",   "Adreno 205"       ],
    "MSM7230":    [0.8,     1,        true,  "Adreno",   "Adreno 205"       ],
    "QSD8650":    [1.0,     1,        true,  "Adreno",   "Adreno 200"       ],
    "QSD8250":    [1.0,     1,        true,  "Adreno",   "Adreno 200"       ],
    "MSM7227":    [0.6,     1,        true,  "Adreno",   "Adreno 200"       ],
// --- Tegra ---
    "T30L":       [1.3,     4,        true,  "Tegra",    "Tegra3 T30L"      ],
    "AP37":       [1.7,     4,        true,  "Tegra",    "Tegra3 AP37"      ],
    "AP33":       [1.5,     4,        true,  "Tegra",    "Tegra3 AP33"      ],
    "AP25H":      [1.2,     2,        false, "Tegra",    "Tegra250 3D AP25" ],
    "T250":       [1.0,     2,        false, "Tegra",    "Tegra250"         ],
// --- OMAP ---
    "OMAP4460":   [1.2,     2,        true,  "PowerVR",  "PowerVR SGX540"   ],
    "OMAP4430":   [1.2,     2,        true,  "PowerVR",  "PowerVR SGX540"   ],
    "OMAP3630":   [1.0,     1,        true,  "PowerVR",  "PowerVR SGX530"   ],
// --- Exynos ---
    "Exynos5250": [1.7,     2,        true,  "Mali",     "Mali-T604"        ],
    "Exynos4412": [1.4,     4,        true,  "Mali",     "Mali-400 MP4"     ],
    "Exynos4210": [1.2,     2,        true,  "Mali",     "Mali-400 MP4"     ],
    "S5PC110":    [1.0,     1,        true,  "PowerVR",  "PowerVR SGX540"   ],
// --- HiSilicon ---
    "K3V2T":      [1.2,     4,        true,  "Immersion","Immersion.16"     ],
    "K3V2":       [1.2,     4,        true,  "Immersion","Immersion.16"     ],
// --- R-Mobile ---
    "APE5R":      [1.2,     2,        true,  "PowerVR",  "PowerVR SGX543 MP"],
};

// --- variable --------------------------------------------
// --- interface -------------------------------------------
function DeviceSpec() {
}
DeviceSpec.name = "DeviceSpec";
DeviceSpec.repository = "https://github.com/uupaa/DeviceSpec.js";
DeviceSpec.detect         = detect;         // DeviceSpec.detect(token:String):Object
DeviceSpec.getDeviceToken = getDeviceToken; // DeviceSpec.getDeviceToken(userAgent:String = navigator.userAgent):String

// --- implement -------------------------------------------
function detect(device) { // @arg String(= ""): device token.
                          // @ret Object: { OS, SOC, CPU, GPU, RAM, BRAND, DEVICE, DISPLAY, }
                          //     OS      - String: Relese and Last OS Version(s). eg: "2.3.3", "2.3.4, 4.0.3"
                          //     SOC     - String: System on chip name. eg: "MSM8974"
                          //     CPU     - Object: { CLOCK: Number, CORES: Integer, NEON: Boolean }
                          //     GPU     - Object: { TYPE: String, NAME: String }
                          //     RAM     - Integer: RAM size (unit: GB).
                          //     BRAND   - String: Brand name. eg: "GOOGLE", "SONY"
                          //     DEVICE  - String: device token.
                          //     DISPLAY - Object: { PPI: Number, WIDTH: Integer, HEIGHT: Integer }
                          //
                          //     CPU.TYPE       - Number(= 0): CPU base clock. zero in no-data. eg: 1.7
                          //     CPU.CORES      - Integer(= 0): CPU Cores. zero in no-data. eg: 2 (dual core)
                          //     GPU.TYPE       - String(= ""): GPU type. "" in no-data. eg: "Adreno"
                          //     GPU.NAME       - String(= ""): GPU name. "" in no-data. eg: "Adreno 330"
                          //     DISPLAY.PPI    - Integer(= 0): display pixel per inch. zero in no-data.
                          //     DISPLAY.WIDTH  - Integer(= 0): display width, or long edge. zero is no-data.
                          //     DISPLAY.HEIGHT - Integer(= 0): display width, or short edge. zero is no-data.
                          //
                          // @desc: detect mobile device specs.
                          // @help: DeviceSpec
    device = device || getDeviceToken();

    var result = {
            OS:     "",
            SOC:    "",
            CPU:    { CLOCK: 0, CORES: 0, NEON: false },
            GPU:    { TYPE: "", NAME: "" },
            RAM:    0,
            BRAND:  "",
            DISPLAY: { PPI: 0, WIDTH: 0, HEIGHT: 0 }
        };

    if (device in DEVICE_CATALOG) {
        var spec = DEVICE_CATALOG[device];

        result.DEVICE         = device;
        result.BRAND          = spec[0];
        result.SOC            = spec[1];
        result.OS             = spec[2];
        result.DISPLAY.WIDTH  = spec[3];
        result.DISPLAY.HEIGHT = spec[4];
        result.DISPLAY.PPI    = spec[5];
        result.RAM            = spec[6];

        if (result.SOC in SOC_CATALOG) {
            var soc = SOC_CATALOG[result.SOC];

            result.CPU.CLOCK = soc[0];
            result.CPU.CORES = soc[1];
            result.CPU.NEON  = soc[2];
            result.GPU.TYPE  = soc[3];
            result.GPU.NAME  = soc[4];
        }
    }
    return result;
}

function getDeviceToken(userAgent) { // @arg String(= navigator.userAgent):
                                     //         "Mozilla/5.0 (Linux; U; Android 4.0.4; ja-jp; SonySO-04D Build/7.0.D.1.117)..."
                                     // @ret String: device token. eg: "SO-04D "
    // Examples.
    //                                                device token
    //                                              ~~~~~~~~~~~~~~~~
    // Mozilla/5.0 (Linux; U; Android 1.5;   ja-jp; GDDJ-09            Build/CDB56)       AppleWebKit/528.5+ (KHTML, like Gecko) Version/3.1.2 Mobile Safari/525.20.1
    // Mozilla/5.0 (Linux; U; Android 2.3.3; ja-jp; INFOBAR A01        Build/S9081)       AppleWebKit/533.1  (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1
    // Mozilla/5.0 (Linux; U; Android 3.2;   ja-jp; SC-01D             Build/MASTER)      AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13
    // Mozilla/5.0 (Linux; U; Android 4.0.1; ja-jp; Galaxy Nexus       Build/ITL41D)      AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30
    // Mozilla/5.0 (Linux; U; Android 4.0.3; ja-jp; URBANO PROGRESSO   Build/010.0.3000)  AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30
    // Mozilla/5.0 (Linux; U; Android 3.2;   ja-jp; Sony Tablet S      Build/THMAS11000)  AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13
    // Mozilla/5.0 (Linux; U; Android 2.3;   ja-jp; SonyEricssonSO-01C Build/3.0.A.1.34)  AppleWebKit/533.1  (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1
    // Mozilla/5.0 (Linux; U; Android 4.0.4; ja-jp; SonySO-04D         Build/7.0.D.1.117) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30
    userAgent = userAgent || (global.navigator || {}).userAgent || "";

    var deviceToken = userAgent.split("Build/")[0].split(";").slice(-1).join().trim();

    if ( /^Sony/.test(deviceToken) ) {
        if ( /Tablet/.test(deviceToken) ) {
            ;
        } else {
            // remove "Sony" and "Ericsson" prefixes.
            deviceToken = deviceToken.replace(/^Sony/, "").
                                      replace(/^Ericsson/, "");
        }
    }
    return deviceToken;
}

// --- export ----------------------------------------------
if (global.process) { // node.js
    module.exports = DeviceSpec;
}
global.DeviceSpec = DeviceSpec;

})(this.self || global);

