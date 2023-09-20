interface ErrorDetails {
    field?: string
    rule?: string
    message: string
}

interface CustomError {
    column: any
    detail?: string
    constraint?: string
    messages?: {
        errors: ErrorDetails[]
    }
    code?: number
    message?: string
}

export const errorsFormat = (errors: CustomError) => {
    return errors
}
