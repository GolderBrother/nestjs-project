import { Injectable } from '@nestjs/common';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Dog } from './entities/dog.entity';
import { Model } from 'mongoose';

@Injectable()
export class DogService {
  @InjectModel(Dog.name) // 实体类名
  private readonly dogModel: Model<Dog>;

  create(createDogDto: CreateDogDto) {
    console.log('create createDogDto:', createDogDto);
    const dog = new this.dogModel(createDogDto);
    return dog.save();
  }

  findAll() {
    return this.dogModel.find();
  }

  // mongodb 的 id 是 string：
  findOne(id: string) {
    return this.dogModel.findById(id);
  }

  update(id: string, updateDogDto: UpdateDogDto) {
    return this.dogModel.findByIdAndUpdate(id, updateDogDto);
  }

  remove(id: string) {
    return this.dogModel.findByIdAndDelete(id);
  }
}
