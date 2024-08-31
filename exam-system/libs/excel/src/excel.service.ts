import { Injectable, StreamableFile } from '@nestjs/common';
import { Column, Workbook } from 'exceljs';
import { PassThrough } from 'stream';

@Injectable()
export class ExcelService {
  async export(
    columns: Partial<Column>[],
    data: Array<Record<string, any>>,
    filename: string,
  ) {
    const workbook = new Workbook();

    const worksheet = workbook.addWorksheet('james111');

    worksheet.columns = columns;

    worksheet.addRows(data);

    // stream 是 node 内置模块，new PassThrough 创建一个流
    const stream = new PassThrough();

    await workbook.xlsx.write(stream);

    // 返回 StreamalbeFile，这个处理了 transfer-encoding:chunked，也就是支持流式传输
    return new StreamableFile(stream, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: `attachment; filename=${filename}`,
    });
  }
}
