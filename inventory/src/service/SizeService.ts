import { Size } from '../entity/Size';
import { SizeRepository } from '../repository/SizeRepository';
export class SizeService {
    private sizeRepository: SizeRepository;

    constructor() {
        this.sizeRepository = new SizeRepository();
    }

    async findByName(name: string): Promise<Size> {
        return this.sizeRepository.findByName(name);
    }

    async findById(id: number): Promise<Size> {
        return this.sizeRepository.findById(id);
    }

    async createSize(name: string): Promise<Size> {
        return this.sizeRepository.createSize(name);
    }

    async updateSize(id: number, name: string): Promise<Size> {
        return this.sizeRepository.updateSize(id, name);
    }

    async deleteSize(id: number): Promise<Size> {
        return this.sizeRepository.deleteSize(id);
    }

    async getAll(): Promise<Size[]> {
        return this.sizeRepository.getAll();
    }

    async findSizesByNameList(names: string[]): Promise<Size[]> {
        return await this.sizeRepository.findSizesByNameList(names);
    }
}
