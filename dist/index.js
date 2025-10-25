"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GetM3u8File_1 = __importDefault(require("./functions/GetM3u8File"));
const M3u8ToMp4_1 = __importDefault(require("./functions/M3u8ToMp4"));
let args = process.argv[2];
function isJSON(input) {
    if (typeof input === 'string') {
        try {
            JSON.parse(input);
            return true;
        }
        catch (e) {
            return false;
        }
        ;
    }
    ;
    return true;
}
;
(async (url) => {
    if (!url || url.trim() === "")
        return console.log("invalid url, command exemple: node index.js URL");
    let m3u8File = await (0, GetM3u8File_1.default)(url);
    if (isJSON(m3u8File)) {
        let fileUrl = m3u8File.file;
        let fileName = m3u8File.name;
        if (!fileUrl || !fileName)
            return console.log("Error for fetch the vod");
        await (0, M3u8ToMp4_1.default)({
            name: fileName,
            url: fileUrl,
        });
        return;
    }
    else {
        return console.log("Error for fetch the vod");
    }
    ;
})(args ? args.toString() : "");
