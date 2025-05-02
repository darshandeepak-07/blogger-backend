import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/repository';
import { Tag } from 'src/schemas/tag.schema';

@Injectable()
export class TagRepository extends BaseRepository<Tag> {
  constructor(@InjectModel(Tag.name) model: Model<Tag>) {
    super(model);
  }

  async searchByName(name: string) {
    return this.model
      .find({ name: { $regex: name, $options: 'i' } })
      .limit(10)
      .lean();
  }

  async incrementPostCount(tagId: string) {
    return this.model.findByIdAndUpdate(tagId, { $inc: { postCount: 1 } });
  }

  async incrementFollowerCount(tagId: string) {
    return this.model.findByIdAndUpdate(tagId, { $inc: { followerCount: 1 } });
  }
}
