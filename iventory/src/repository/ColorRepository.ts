import { NotFoundError } from './../error/error-type/NotFoundError';
import { Color } from './../entity/Color';
import { EntityNotFoundError, Repository } from "typeorm";

export class ColorRepository extends Repository<Color> {
    async findByName(name: string): Promise<Color> {
        try {
            return this.findOneOrFail({
                where: { name },
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
        return this.save(color);
    }

    async updateColor(id: number, name: string): Promise<Color> {
        try {
            const color = await this.findOneOrFail({where: {id}});
            color.name = name;
            return this.save(color);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(`Color with id ${id} not found`);
            }
            throw new Error(error);
        }
    }

    async deleteColor(id: number): Promise<Color> {
        try {
            const color = await this.findOneOrFail({where: {id}});
            return this.remove(color);
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new NotFoundError(`Color with id ${id} not found`);
            }
            throw new Error(error);
        }
    }
}