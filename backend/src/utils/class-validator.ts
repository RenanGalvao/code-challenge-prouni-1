import {
    IsNotEmpty as _IsNotEmpty,
    IsString as _IsString,
    IsEmail as _IsEmail,
    MinLength as _MinLength,
    IsEnum as _IsEnum,
    IsInt as _IsInt,
    ValidationOptions,
} from 'class-validator'

export const IsNotEmpty = (options?: ValidationOptions) =>
    _IsNotEmpty({
        ...options,
        message: (args) => `${args.property} é obrigatório.`,
    })
export const IsString = (options?: ValidationOptions) =>
    _IsString({
        ...options,
        message: (args) => `${args.property} deve ser um texto válido.`,
    })
export const IsInt = (options?: ValidationOptions) =>
    _IsInt({
        ...options,
        message: (args) => `${args.property} deve ser um inteiro válido.`,
    })