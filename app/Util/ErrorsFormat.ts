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

export default class ErrorsFormat {
    public async errorsFormat(errors: CustomError) {
        return errors
    }
}