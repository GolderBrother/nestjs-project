import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { Observable, Subscriber } from 'rxjs';
// import * as pptxgen from 'pptxgenjs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pptxgen = require('pptxgenjs');

export interface IUniversity {
  name: string;
  img: string;
  link: string;
  desc?: string;
}

let cache: IUniversity[] = [];

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  public async getUniversityData() {
    if (cache?.length) return cache;

    async function getData(observer: Subscriber<Record<string, any>>) {
      const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: {
          width: 0,
          height: 0,
        },
      });

      const page = await browser.newPage();

      await page.goto('https://www.icourse163.org/university/view/all.htm');

      await page.waitForSelector('.u-usitys');

      const universityList = await page.$eval('.u-usitys', (el) => {
        return [...el.querySelectorAll('.u-usity')].map((item) => {
          return {
            name: item.querySelector('img').alt,
            img: item.querySelector('img').src,
            link: item.getAttribute('href'),
          } as IUniversity;
        });
      });
      const ppt = new pptxgen();
      // console.log('universityList', universityList);
      console.log('start');
      for (const university of universityList) {
        await page.goto(`https://www.icourse163.org${university.link}`);

        await page.waitForSelector('.m-cnt');

        const desc = await page.$eval('.m-cnt p', (el) => el.textContent);
        const img = await page.$eval('.g-doc img', (el) =>
          el.getAttribute('src'),
        );
        university.desc = desc;
        university.img = img;

        observer.next({ data: university });

        const slide = ppt.addSlide();

        slide.addText(university.name, {
          x: '10%',
          y: '10%',
          color: '#ff0000',
          fontSize: 30,
          align: ppt.AlignH.center,
        });

        slide.addImage({
          path: university.img,
          x: '42%',
          y: '25%',
        });

        slide.addText(university.desc, {
          x: '10%',
          y: '60%',
          color: '#000000',
          fontSize: 14,
        });
      }

      console.log('end');
      await browser.close();

      await ppt.writeFile({
        fileName: '中国所有大学.pptx',
      });

      cache = universityList;

      // return universityList;
    }

    return new Observable((observer) => {
      getData(observer);
    });
  }
}
