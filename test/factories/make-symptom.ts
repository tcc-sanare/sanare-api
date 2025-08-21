import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Symptom, SymptomProps } from "@/domain/medical/enterprise/entities/symptom";
import { faker } from "@faker-js/faker";

export function makeSymptom(
    override?: Partial<SymptomProps>,
    id?: UniqueEntityID
) {
    const symptom = Symptom.create({
        name: faker.lorem.words({min: 1, max: 3}),
        description: faker.lorem.paragraph(),
        ...override
    }, id)

    return symptom
}