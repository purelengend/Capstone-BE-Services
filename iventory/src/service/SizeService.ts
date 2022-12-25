import { Size } from './../entity/Size';
import { SizeRepository } from './../repository/SizeRepository';
export class SizeService {
    private sizeRepository: SizeRepository;
    
    constructor() {
        this.sizeRepository = new SizeRepository();
    }

    async findByName(name: string): Promise<Size> {
        return this.sizeRepository.findByName(name);
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
}