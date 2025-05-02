import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ChronicDisease } from '../../../enterprise/entities/chronic-disease';
import { ChronicDiseaseRepository } from '../../repositories/chronic-disease-repository';
import { Storage } from '@/domain/application/storage';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface UpdateChronicDiseaseUseCaseRequest {
  chronicDiseaseId: string;
  name?: string;
  description?: string;
  icon?: {
    fileName: string;
    fileType: string;
    buffer: Buffer;
  } | null;
}

type UpdateChronicDiseaseUseCaseResponse = Either<
  NotAllowedError<UpdateChronicDiseaseUseCaseRequest>,
  {
    chronicDisease: ChronicDisease;
  }
>;

@Injectable()
export class UpdateChronicDiseaseUseCase {
  constructor(
    private chronicDiseaseRepository: ChronicDiseaseRepository,
    private storage: Storage,
  ) {}

  async execute(
    request: UpdateChronicDiseaseUseCaseRequest,
  ): Promise<UpdateChronicDiseaseUseCaseResponse> {
    const chronicDisease = await this.chronicDiseaseRepository.findById(
      request.chronicDiseaseId,
    );

    if (!chronicDisease) {
      return left(new NotAllowedError<UpdateChronicDiseaseUseCaseRequest>({
        statusCode: 400,
        errors: [
          {
            message: 'Doença crônica não encontrada',
          },
        ],
      }));
    }

    request.name && (chronicDisease.name = request.name);
    request.description && (chronicDisease.description = request.description);

    if (request.icon !== undefined) {
      if (!request.icon && chronicDisease.iconKey) {
        await this.storage.delete(chronicDisease.iconKey);
      }

      chronicDisease.iconKey = request.icon
        ? await this.storage.upload(request.icon).then((res) => res.fileKey)
        : null;
    }

    await this.chronicDiseaseRepository.save(chronicDisease);

    return right({ chronicDisease });
  }
}
