import { Inject, Injectable } from '@nestjs/common';
import { ExamAddDto } from './dto/exam-add.dto';
import { PrismaService } from '@app/prisma';
import { ExamSaveDto } from './dto/exam-save.dto';
import { ExcelService } from '@app/excel';

@Injectable()
export class ExamService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  @Inject(ExcelService)
  private excelService: ExcelService;

  getHello(): string {
    return 'Hello World!';
  }
  async add(dto: ExamAddDto, userId: number) {
    // throw new Error('Method not implemented.');
    const res = this.prismaService.exam.create({
      data: {
        name: dto.name,
        content: '',
        createUser: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return res;
  }

  async save(dto: ExamSaveDto) {
    return await this.prismaService.exam.update({
      where: {
        id: dto.id,
      },
      data: {
        content: dto.content,
      },
    });
  }

  async list(userId: number, bin: string) {
    return await this.prismaService.exam.findMany({
      where:
        bin !== undefined
          ? {
              createUserId: userId,
              isDelete: true, // 查询回收站
            }
          : {
              createUserId: userId, // 否则返回正常的列表
            },
    });
  }
  async delete(userId: number, id: number) {
    return await this.prismaService.exam.update({
      where: {
        id,
        createUserId: userId,
      },
      // 因为有回收站功能，所以这里只做逻辑删除，把 isDelete 设置为 true 就行
      data: {
        isDelete: true,
      },
    });
  }
  async publish(userId: number, id: number) {
    return await this.prismaService.exam.update({
      where: {
        id,
        createUserId: userId,
      },
      data: {
        isPublish: true,
      },
    });
  }
  async unpublish(userId: number, id: number) {
    return await this.prismaService.exam.update({
      where: {
        id,
        createUserId: userId,
      },
      data: {
        isPublish: false,
      },
    });
  }
  async find(id: number) {
    return await this.prismaService.exam.findUnique({
      where: {
        id,
      },
    });
  }
}
