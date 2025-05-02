import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagRepository } from './tag.repository';

@Injectable()
export class TagService {
  constructor(private readonly tagRepo: TagRepository) {}

  create(dto: CreateTagDto) {
    return this.tagRepo.create(dto);
  }

  findAll() {
    return this.tagRepo.find({}, { sort: { postCount: -1 } });
  }

  findTrending(limit = 10) {
    return this.tagRepo.find({}, { sort: { postCount: -1 }, limit });
  }

  search(name: string) {
    return this.tagRepo.searchByName(name);
  }

  update(id: string, dto: UpdateTagDto) {
    return this.tagRepo.updateOne({ _id: id }, dto);
  }

  remove(id: string) {
    return this.tagRepo.deleteOne({ _id: id });
  }
}
