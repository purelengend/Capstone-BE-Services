import { Color } from "./../entity/Color";
import { ColorRepository } from "./../repository/ColorRepository";

export class ColorService {
    private colorRepository: ColorRepository;
    
    constructor(colorRepository: ColorRepository) {
        this.colorRepository = colorRepository;
    }

    async findByName(name: string): Promise<Color> {
        return this.colorRepository.findByName(name);
    }

    async createColor(name: string): Promise<Color> {
        return this.colorRepository.createColor(name);
    }

    async updateColor(id: number, name: string): Promise<Color> {
        return this.colorRepository.updateColor(id, name);
    }

    async deleteColor(id: number): Promise<Color> {
        return this.colorRepository.deleteColor(id);
    }
}