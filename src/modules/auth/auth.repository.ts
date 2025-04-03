import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "src/repository";
import { User } from "src/schemas/user.schema";

@Injectable()
export class AuthRepository extends BaseRepository<User> {
    constructor(@InjectModel(User.name) model: Model<User>) {
        super(model);
    }
}