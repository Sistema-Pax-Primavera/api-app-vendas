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
    return errors.messages?.errors ?? errors.message
}

export const formatErrorMessage = (error: { code: string | number; constraint: any; table: any; message: any }) => {
    const errorMappings = {
        '23503': (constraint: any, table: any) => `Erro: O ${constraint} informado é inválido para a tabela ${table}.`,
    };

    if (errorMappings[error.code]) {
        return errorMappings[error.code](error.constraint, error.table);
    } else {
        return `Erro desconhecido: Código ${error.code} - ${error.message}`;
    }
}
