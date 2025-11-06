#!/usr/bin/env node
import GetM3u8File from "./functions/GetM3u8File";
import M3u8ToMp4 from "./functions/M3u8ToMp4";
import { exec } from "child_process";

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
  exec("ffmpeg -version", async (error, stdout, stderr) => {
    if (error) {
      console.log("FFmpeg is not installed. Please install FFmpeg from https://ffmpeg.org/download.html and make sure it's in your PATH.");
      process.exit(1);
    }

    if (!url || url.trim() === "") {
      return console.log("Invalid URL, command example: node index.js URL");
    }

    let m3u8File: any = await GetM3u8File(url);

    if (isJSON(m3u8File)) {
      let fileUrl = m3u8File.file;
      let fileName = m3u8File.name;

      if (!fileUrl || !fileName) return console.log("Error fetching the VOD");

      await M3u8ToMp4({
        name: fileName,
        url: fileUrl,
      });
      return process.exit();
    } else {
      return console.log("Error fetching the VOD");
    };
  });
})(args ? args.toString() : "");