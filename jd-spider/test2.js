import puppeteer from "puppeteer";

// 调用 launch 跑一个浏览器实例，指定 headless 为 false 也就是有界面。
const browser = await puppeteer.launch({
  headless: false,
  // defaultView 设置 width、height 为 0 是网页内容充满整个窗口。
  defaultViewport: {
    width: 0,
    height: 0,
  },
});

const page = await browser.newPage();

await page.goto(
  "https://www.zhipin.com/web/geek/job?query=前端&city=100010000"
);

await page.waitForSelector(".job-list-box");

// await page.click('.job-list-box .job-card-wrapper:first-child');

// $eval 第一个参数是选择器，第二个参数是对选择出的元素做一些处理后返回
const totalPage = await page.$eval(".options-pages a:nth-last-child(2)", (el) =>
  parseInt(el.textContent)
);
console.log("totalPage", totalPage);

const allJobs = [];
for (let i = 1; i <= totalPage; i++) {
  const pageUrl = `https://www.zhipin.com/web/geek/job?query=前端&city=100010000&page=${i}`;
  await page.goto(pageUrl);
  await page.waitForSelector(".job-list-box");

  const jobList = await page.$eval(".job-list-box", (el) => {
    return Array.from(el.querySelectorAll(".job-card-wrapper")).map((item) => {
      // 具体的信息都是从 dom 去拿的：
      const name = item.querySelector(".job-title .job-name").textContent;
      const salary = item.querySelector(".job-info .salary").textContent;
      const area = item.querySelector(
        ".job-area-wrapper .job-area"
      ).textContent;
      const link = item.querySelector("a.job-card-left").href;
      const companyName = item.querySelector(".company-name").textContent;
      const company = {
        name: companyName,
      };
      const job = {
        name,
        area,
        salary,
      };
      return {
        job,
        link,
        company,
      };
    });
  });
  allJobs.push(...jobList);

  for (const job of allJobs) {
    await page.goto(allJobs[i].link);
    // try catch 是因为有的页面可能打开会超时导致中止，这种就直接跳过好了
    try {
        await page.waitForSelector('.job-sec-text');
        const desc = await page.$eval('.job-sec-text', (el) => {
            return el.textContent;
        });
        job.desc = desc;
        console.log('job', job);
    } catch (error) {
        console.error('error', error);
    }
  }
}

console.log(allJobs);
