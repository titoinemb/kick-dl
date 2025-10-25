import GetM3u8File from "./functions/GetM3u8File";
import M3u8ToMp4 from "./functions/M3u8ToMp4";

let args = process.argv[2];

function isJSON(input: any): boolean {
  if (typeof input === 'string') {
    try {
      JSON.parse(input);

      return true;
    } catch (e) {
      return false;
    };
  };

  return true;
};

(async (url: string): Promise<void> => {
  if (!url || url.trim() === "") return console.log("invalid url, command exemple: node index.js URL");

  let m3u8File: any = await GetM3u8File(url);

  if(isJSON(m3u8File)) {
    let fileUrl = m3u8File.file;
    let fileName = m3u8File.name;

    if (!fileUrl || !fileName) return console.log("Error for fetch the vod");

    await M3u8ToMp4({
      name: fileName,
      url: fileUrl,
    });
    return;
  } else {
    return console.log("Error for fetch the vod");
  };

})(args ? args.toString() : "");