import { chromium } from 'playwright';

export default async (url: string): Promise<string | { file: string, name: string } > => {
  if (!url || url.trim() === "") return "invalid url";

  let urlInfo = url.match(/kick\.com\/([^\/]+)\/videos\/([a-f0-9-]+)/);

  if(!urlInfo) return "invalid url";

  let user = urlInfo[1];
  let uuid = urlInfo[2];

  let browser = await chromium.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--disable-extensions',
      '--disable-popup-blocking',
      '--window-size=1920,1080',
    ],
  });

  let context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    acceptDownloads: false,
    baseURL: 'https://kick.com',
  });

  await context.setDefaultTimeout(180000);

  let page = await context.newPage();

  await page.goto(`https://kick.com/api/v1/channels/${user}`);
  await page.waitForLoadState('networkidle');

  let bodyContent = await page.evaluate(() => {
    return document.body.innerHTML;
  });

  let bodyJson = JSON.parse(bodyContent);

  let vod: any;
  let ls: any;

  (bodyJson.previous_livestreams || []).forEach((l: { video?: { uuid: string } }) => {
    if (l.video?.uuid === uuid) {
      [vod, ls] = [l.video, l];
    };
  });

  if (!vod && bodyJson.livestream?.video?.uuid === uuid) {
    [vod, ls] = [bodyJson.livestream.video, bodyJson.livestream];
  };

  await page.goto(`https://kick.com/api/v1/video/${uuid}`);
  await page.waitForLoadState('networkidle');

  let bodyContentVideo = await page.evaluate(() => {
    return document.body.innerHTML;
  });

  let bodyContentVideoJson = JSON.parse(bodyContentVideo);

  if (!vod) vod = bodyContentVideoJson;

  let thumb = ls?.thumbnail?.src || vod.thumbnail?.src || vod.thumbnail?.url;

  const matchThumb = thumb.match(/video_thumbnails\/([^\/]+)\/([^\/]+)\//);

  if (!matchThumb) return 'Thumbnail ID extraction failed';

  let session = matchThumb[1];
  let segment = matchThumb[2];

  let date = new Date(ls?.created_at || ls?.start_time || vod.created_at || vod.start_time);
  let time =  [date.getFullYear(), date.getMonth()+1, date.getDate(), date.getHours(), date.getMinutes()].join('/');


  await browser.close();

  return {
    file: `https://stream.kick.com/ivs/v1/196233775518/${session}/${time}/${segment}/media/hls/master.m3u8`,
    name: bodyContentVideoJson.livestream.session_title
  };
};