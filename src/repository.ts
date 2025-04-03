import { Model, FilterQuery, UpdateQuery, QueryOptions, SaveOptions } from 'mongoose';

export abstract class BaseRepository<T> {
    constructor(protected readonly model: Model<T>) { }

    async create(doc: Partial<T>, options?: SaveOptions) {
        const createdDoc = new this.model(doc);
        return createdDoc.save(options);
    }

    async find(filter: FilterQuery<T> = {}, options?: QueryOptions): Promise<T[]> {
        return this.model.find(filter, null, options).lean<T[]>();
    }

    async findWithPagination(
        filter: FilterQuery<T> = {},
        skip: number,
        limit: number,
        sort: any = { createdAt: -1 },
        options?: QueryOptions,
    ): Promise<T[]> {
        return this.model.find(filter, null, options).sort(sort).skip(skip).limit(limit).lean<T[]>();
    }

    async count(filter: FilterQuery<T>): Promise<number> {
        return this.model.countDocuments(filter).exec();
    }

    async findOne(filter: FilterQuery<T>, options?: QueryOptions): Promise<T | null> {
        return this.model.findOne(filter, null, options).lean<T | null>();
    }

    async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>, options?: QueryOptions) {
        return this.model.findOneAndUpdate(filter, update, {
            new: true,
            runValidators: true,
            upsert: false,
            ...options,
        });
    }

    async deleteOne(filter: FilterQuery<T>, options?: QueryOptions) {
        return this.model.findOneAndDelete(filter, options);
    }
}
