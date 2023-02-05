import { Color } from '../entity/Color';
import { ColorRepository } from '../repository/ColorRepository';

export class ColorService {
    private colorRepository: ColorRepository;

    constructor() {
        this.colorRepository = new ColorRepository();
    }

    async getAll(): Promise<Color[]> {
        return this.colorRepository.getAll();
    }

    async findByName(name: string): Promise<Color> {
        return this.colorRepository.findByName(name);
    }

    async findById(id: number): Promise<Color> {
        return this.colorRepository.findById(id);
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

    async findColorsByNameList(names: string[]): Promise<Color[]> {
        return await this.colorRepository.findColorsByNameList(names);
    }
}
