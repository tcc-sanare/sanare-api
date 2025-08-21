import { SymptomRepository } from "@/domain/medical/application/repositories/symptom-repository"
import { Symptom } from "@/domain/medical/enterprise/entities/symptom"

export class InMemorySymptomRepository implements SymptomRepository{
    items: Symptom[]

    constructor() {
        this.items = []
    }

    async create(symptom: Symptom): Promise<void> {
        this.items.push(symptom)
    }

    async delete(symptom: Symptom): Promise<void> {
        const symptomIndex = this.items.findIndex(item => item.id.toString() === symptom.id.toString())

        if(symptomIndex === -1) {
            throw new Error('Symptom not found')
        }

        this.items.splice(symptomIndex, 1)
    }

    async save(symptom: Symptom): Promise<void> {
        const symptomIndex = this.items.findIndex(item => item.id.toString() === symptom.id.toString())

        if(symptomIndex === -1) {
            throw new Error('Symptom not found')
        }

        this.items[symptomIndex] = symptom
    }

    async findById(id: string): Promise<Symptom | null> {
        return this.items.find(item => item.id.toString() === id) || null
    }

    async findByName(name: string): Promise<Symptom[] | null> {
        return (
            this.items.filter((item) =>
            item.name.toLowerCase().includes(name.toLowerCase()),
            ) || null
        );
    }
    

    async findAll(): Promise<Symptom[] | null> {
        return this.items
    }
}