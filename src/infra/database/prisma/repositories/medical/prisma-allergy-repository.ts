import { AllergyRepository } from "@/domain/medical/application/repositories/allergy-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { Allergy } from "@/domain/medical/enterprise/entities/allergy";
import { PrismaAllergyMapper } from "../../mappers/medical/prisma-allergy-mapper";

@Injectable()
export class PrismaAllergyRepository implements AllergyRepository {
  constructor (
    private prisma: PrismaService
  ) {}
  
  async create(allergy: Allergy): Promise<void> {
    const data = PrismaAllergyMapper.toPrisma(allergy);

    await this.prisma.allergies.create({
      data,
    });
  }
  
  async findAll(): Promise<Allergy[]> {
    const allergies = await this.prisma.allergies.findMany();

    return allergies.map(PrismaAllergyMapper.toDomain);
  }
  
  async save(allergy: Allergy): Promise<void> {
    const data = PrismaAllergyMapper.toPrisma(allergy);

    await this.prisma.allergies.update({
      where: {
        id: allergy.id.toString(),
      },
      data,
    });
  }
  
  async delete(allergy: Allergy): Promise<void> {
    await this.prisma.allergies.delete({
      where: {
        id: allergy.id.toString(),
      },
    });
  }
  
  async findById(id: string): Promise<Allergy | null> {
    const allergy = await this.prisma.allergies.findUnique({
      where: {
        id,
      },
    });

    if (!allergy) {
      return null;
    }

    return PrismaAllergyMapper.toDomain(allergy);
  }
  
  async findByName(name: string): Promise<Allergy[] | null> {
    const allergies = await this.prisma.allergies.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        }
      },
    });

    if (!allergies) {
      return null;
    }

    return allergies.map(PrismaAllergyMapper.toDomain);
  }
}