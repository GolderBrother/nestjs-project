import puppeteer from 'puppeteer';

// 调用 launch 跑一个浏览器实例，指定 headless 为 false 也就是有界面。
const browser = await puppeteer.launch({
    headless: false,
    // defaultView 设置 width、height 为 0 是网页内容充满整个窗口。
    defaultViewport: {
        width: 0,
        height: 0
    }
});

const page = await browser.newPage();

// 进入 zhipin.com 网站
await page.goto('https://www.zhipin.com/web/geek/job');

// 首先进入职位搜索页面，等 job-list-box 这个元素出现之后，也就是列表加载完成了
await page.waitForSelector('.job-list-box');

// 点击城市选择按钮
await page.click('.city-label', {
    delay: 500
});

// 选择全国
await page.click('.city-list-hot > li:first-child', {
    delay: 500
})

await page.focus('.search-input-box > .input-wrap.input-wrap-text > input.input')

// 在输入框输入前端
await page.keyboard.type('前端', {
    delay: 500
})

// 点击搜索按钮
await page.click('.search-btn', {
    delay: 1000
})

