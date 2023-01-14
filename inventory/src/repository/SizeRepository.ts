import { AppDataSource } from '../data-source';
import { NotFoundError } from '../error/error-type/NotFoundError';
import { Size } from '../entity/Size';
import { EntityNotFoundError } from 'typeorm';

export class SizeRepository {
    private repository = AppDataSource.getRepository(Size);

    async getAll(): Promise<Size[]> {
        return this.repository.find();
    }

    async findByName(name: string): Promise<Size> {
        try {
            return this.repository.findOneOrFail({
                where: { name },
                relations: {
                    productVariants: true,
                },
            });
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(`Size with name ${name} not found`);
            }
            throw new Error(error);
        }
    }

    async findById(id: number): Promise<Size> {
        try {
            return this.repository.findOneOrFail({
                where: { id },
            });
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(`Size with id ${id} not found`);
            }
            throw new Error(error);
        }
    }

    async createSize(name: string): Promise<Size> {
        const size = new Size();
        size.name = name;
        return this.repository.save(size);
    }

    async updateSize(id: number, name: string): Promise<Size> {
        try {
            const size = await this.repository.findOneOrFail({ where: { id } });
            size.name = name;
            return this.repository.save(size);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(`Size with id ${id} not found`);
            }
            throw new Error(error);
        }
    }

    async deleteSize(id: number): Promise<Size> {
        try {
            const size = await this.repository.findOneOrFail({ where: { id } });
            return this.repository.remove(size);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(`Size with id ${id} not found`);
            }
            throw new Error(error);
        }
    }
}
