import GetM3u8File from "../functions/GetM3u8File"

describe('Get the m8u3 file from kick vod', () => {
  test('should provide a valid m3u8 link', async () => {
    expect(await GetM3u8File("https://kick.com/xqc/videos/bc3ccd03-7f2d-4dbf-a43c-4bf0e75a8e11")).toBe({
      file: "https://stream.kick.com/ivs/v1/196233775518/DsuAwCgUc9Bh/2025/9/21/23/18/WuEcGoCFJOmu/media/hls/master.m3u8",
      name: "18+ #ad 👨‍💻LIVE👨‍💻DRAMA👨‍💻NEWS👨‍💻VIDEOS👨‍💻REACTS👨‍💻STUFF👨‍💻CLICK👨‍💻NOW👨‍💻QUICK👨‍💻BEFORE I LOSE MY MARBLES👨‍💻WAHHHHHHHHHHHHHH👨"
    });
  });
});