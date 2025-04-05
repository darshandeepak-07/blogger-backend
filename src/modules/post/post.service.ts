import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
import mongoose from 'mongoose';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    return this.postRepository.create({
      ...createPostDto,
      author: mongoose.Types.ObjectId.createFromHexString(userId),
    });
  }

  async findAll(filter = {}) {
    return this.postRepository.findWithAuthor(filter);
  }

  async findOne(id: string) {
    return this.postRepository.findByIdWithAuthor(id);
  }

  async update(id: string, userId: string, updateDto: UpdatePostDto) {
    const post = await this.postRepository.findById(id);
    if (!post || post.author.toString() !== userId) {
      throw new ForbiddenException('Not allowed to update this post');
    }
    return this.postRepository.findByIdAndUpdate(id, updateDto, { new: true });
  }

  async remove(id: string, userId: string) {
    const post = await this.postRepository.findById(id);
    if (!post || post.author.toString() !== userId) {
      throw new ForbiddenException('Not allowed to delete this post');
    }
    return this.postRepository.findByIdAndDelete(id);
  }
}
