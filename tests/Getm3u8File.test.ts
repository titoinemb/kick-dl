import GetM3u8File from "../src/functions/GetM3u8File";

describe('Get the m8u3 file from kick vod', () => {
  test('should provide a valid m3u8 link', async () => {
    expect(await GetM3u8File("https://kick.com/ryu7z/videos/065a9f84-2f99-49be-ad26-17b858e00f0d")).toStrictEqual({
      file: 'https://stream.kick.com/ivs/v1/196233775518/XStkaiafvVIw/2025/10/30/20/8/nJZAc8xEn1WL/media/hls/master.m3u8',
      name: 'La Grande Cassosserie 2 en Direct !    !clip !bestof'
    });
  });
});