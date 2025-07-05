import { DiseaseRepository } from "@/domain/medical/application/repositories/disease-repository";
import { Disease } from "@/domain/medical/enterprise/entities/disease";

export class InMemoryDiseaseRepository implements DiseaseRepository{
    items: Disease[]

    constructor() {
        this.items = []
    }

    async create(disease: Disease): Promise<void> {
        this.items.push(disease)
    }

    async delete(disease: Disease): Promise<void> {
        const diseaseIndex = this.items.findIndex(item => item.id.toString() === disease.id.toString())

        if(diseaseIndex === -1) {
            throw new Error('Disease not found')
        }

        this.items.splice(diseaseIndex, 1)
    }

    async save(disease: Disease): Promise<void> {
        const diseaseIndex = this.items.findIndex(item => item.id.toString() === disease.id.toString())

        if(diseaseIndex === -1) {
            throw new Error('Disease not found')
        }

        this.items[diseaseIndex] = disease
    }

    async findById(id: string): Promise<Disease | null> {
        return this.items.find(item => item.id.toString() === id) || null
    }

    async findByName(name: string): Promise<Disease[] | null> {
        return (
            this.items.filter((item) =>
            item.name.toLowerCase().includes(name.toLowerCase()),
            ) || null
        );
    }
    

    async findAll(): Promise<Disease[] | null> {
        return this.items
    }
}