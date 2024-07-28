import { ValidationError } from 'class-validator'

// mock a ValidationError object to be thrown as an error to exception.middleware
// based on generateValidationError from ValidationExecutor class from class-validator
function createValidationError(property: string, constraints: { [key: string]: string }) {
    const validationError = new ValidationError()
    validationError.property = property
    validationError.children = [];
    validationError.constraints = constraints;
    return [validationError]
}

export function throwValidationError(property: string, messages: string[]) {
    const messagesToConstraints = messages.reduce((prev, curr, index) => ({ ...prev, [index]: curr }), {})
    throw createValidationError(property, messagesToConstraints)
}