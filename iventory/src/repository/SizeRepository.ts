import { NotFoundError } from './../error/error-type/NotFoundError';
import { Size } from './../entity/Size';
import { EntityNotFoundError, Repository } from "typeorm";

export class SizeRepository extends Repository<Size> {
    async findByName(name: string): Promise<Size> {
        try {
            return this.findOneOrFail({
                where: { name },
            });
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(`Size with name ${name} not found`);
            }
            throw new Error(error);
        }
    }

    async createSize(name: string): Promise<Size> {
        const size = new Size();
        size.name = name;
        return this.save(size);
    }

    async updateSize(id: number, name: string): Promise<Size> {
        try {
            const size = await this.findOneOrFail({where: {id}});
            size.name = name;
            return this.save(size);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(`Size with id ${id} not found`);
            }
            throw new Error(error);
        }
    }

    async deleteSize(id: number): Promise<Size> {
        try {
            const size = await this.findOneOrFail({where: {id}});
            return this.remove(size);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(`Size with id ${id} not found`);
            }
            throw new Error(error);
        }
    }
}