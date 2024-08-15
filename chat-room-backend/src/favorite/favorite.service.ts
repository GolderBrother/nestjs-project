import { Inject, Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoriteService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  create(createFavoriteDto: CreateFavoriteDto) {
    return 'This action adds a new favorite';
  }

  findAll() {
    return `This action returns all favorite`;
  }

  findOne(id: number) {
    return `This action returns a #${id} favorite`;
  }

  update(id: number, updateFavoriteDto: UpdateFavoriteDto) {
    return `This action updates a #${id} favorite`;
  }

  remove(id: number) {
    return `This action removes a #${id} favorite`;
  }

  async list(userId: number) {
    const favorites = await this.prismaService.favorite.findMany({
      where: {
        userId: userId,
      },
    });
    const res = [];
    for (let i = 0; i < favorites.length; i++) {
      const chatHistory = await this.prismaService.chatHistory.findUnique({
        where: {
          id: favorites[i].chatHistoryId,
        },
      });
      res.push({
        ...favorites[i],
        chatHistory,
      });
    }
    return res;
  }

  async add(userId: number, chatHistoryId: number) {
    return this.prismaService.favorite.create({
      data: {
        userId,
        chatHistoryId,
      },
    });
  }

  async del(id: number) {
    return this.prismaService.favorite.deleteMany({
      where: {
        id,
      },
    });
  }
}
