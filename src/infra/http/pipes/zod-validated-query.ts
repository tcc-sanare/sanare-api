// common/decorators/zod-validated-query.decorator.ts
import { applyDecorators, UsePipes } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { z, ZodObject, ZodEffects, ZodTypeAny, ZodType } from 'zod';

export function ZodValidatedQuery<T extends ZodObject<any> | ZodEffects<any>>(schema: T) {
  const unwrappedSchema = unwrapSchema(schema);

  const shape = (unwrappedSchema as ZodObject<any>).shape;

  const decorators = Object.entries(shape).map(([key, zodType]) => {
    const isOptional = (zodType as ZodTypeAny).safeParse(undefined).success;
    const swaggerType = resolveSwaggerType(zodType as ZodTypeAny);
    const metadata = (zodType as ZodTypeAny)._def.openapi?.metadata;

    return ApiQuery({
      name: key,
      required: !isOptional,
      type: swaggerType,
      ...metadata
    });
  });

  return applyDecorators(
    ...decorators,
    UsePipes(new ZodValidationPipe(schema))
  );
}

function unwrapSchema(schema: ZodTypeAny): ZodObject<any> {
  if (schema instanceof z.ZodEffects) {
    const inner = schema._def.schema;
    if (inner instanceof z.ZodObject) {
      return inner;
    }
    throw new Error('Nested schema inside ZodEffects must be a ZodObject');
  }

  if (schema instanceof z.ZodObject) {
    return schema;
  }

  throw new Error('Schema must be a ZodObject or ZodEffects<ZodObject>');
}

function resolveSwaggerType(zodType: ZodTypeAny): any {
  const baseType = zodType._def.typeName;

  switch (baseType) {
    case 'ZodString':
      return String;
    case 'ZodNumber':
    case 'ZodNaN':
      return Number;
    case 'ZodBoolean':
      return Boolean;
    case 'ZodDate':
      return Date;
    case 'ZodEnum':
      return String;
    default:
      return String;
  }
}
