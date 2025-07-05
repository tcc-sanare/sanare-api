import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Disease, DiseaseProps } from "@/domain/medical/enterprise/entities/disease";
import { faker } from "@faker-js/faker";

export function makeDisease(
    override?: Partial<DiseaseProps>,
    id?: UniqueEntityID
) {
    const disease = Disease.create({
        name: faker.lorem.words({min: 1, max: 3}),
        description: faker.lorem.paragraph(),
        ...override
    }, id)

    return disease
}