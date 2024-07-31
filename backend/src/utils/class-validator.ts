import {
    IsNotEmpty as _IsNotEmpty,
    IsString as _IsString,
    IsEmail as _IsEmail,
    MinLength as _MinLength,
    IsEnum as _IsEnum,
    IsInt as _IsInt,
    IsBoolean as _IsBoolean,
    Min as _Min,
    Max as _Max,
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
export const Min = (value: number, options?: ValidationOptions) =>
    _Min(value, {
        ...options,
        message: (args) => `${args.property} deve ser maior ou igual a ${value}.`,
    })
export const Max = (value: number, options?: ValidationOptions) =>
    _Max(value, {
        ...options,
        message: (args) => `${args.property} deve ser menor ou igual a ${value}.`,
    })