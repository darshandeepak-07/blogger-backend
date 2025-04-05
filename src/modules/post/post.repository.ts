import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/repository';
import { Post } from 'src/schemas/post.schema';

@Injectable()
export class PostRepository extends BaseRepository<Post> {
  constructor(@InjectModel(Post.name) model: Model<Post>) {
    super(model);
  }

  async findWithAuthor(filter = {}) {
    return this.model
      .find(filter)
      .populate('author', 'username email')
      .lean<Post[]>();
  }

  async findByIdWithAuthor(id: string) {
    return this.model
      .findById(id)
      .populate('author', 'username email')
      .lean<Post | null>();
  }
}
