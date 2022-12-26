import { AppDataSource } from './../data-source';
import { NotFoundError } from './../error/error-type/NotFoundError';
import { Color } from './../entity/Color';
import { EntityNotFoundError } from "typeorm";

export class ColorRepository {

    private repository = AppDataSource.getRepository(Color);

    async getAll(): Promise<Color[]> {
        return this.repository.find();
    }

    async findById(id: number): Promise<Color> {
        try {
            return this.repository.findOneOrFail({
                where: { id },
            });
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(`Color with id ${id} not found`);
            }
            throw new Error(error);
        }
    }

    async findByName(name: string): Promise<Color> {
        try {
            return this.repository.findOneOrFail({
                where: { name },
                relations: {
                    productVariants: true,
                }
            });
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(`Color with name ${name} not found`);
            }
            throw new Error(error);
        }
    }

    async createColor(name: string): Promise<Color> {
        const color = new Color();
        color.name = name;
        return this.repository.save(color);
    }

    async updateColor(id: number, name: string): Promise<Color> {
        try {
            const color = await this.repository.findOneOrFail({where: {id}});
            color.name = name;
            return this.repository.save(color);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(`Color with id ${id} not found`);
            }
            throw new Error(error);
        }
    }

    async deleteColor(id: number): Promise<Color> {
        try {
            const color = await this.repository.findOneOrFail({where: {id}});
            return this.repository.remove(color);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(`Color with id ${id} not found`);
            }
            throw new Error(error);
        }
    }
}