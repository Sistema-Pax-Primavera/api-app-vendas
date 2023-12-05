export const errorsFormat = (errors) => {
    return errors.messages?.errors ?? errors.message
}

export const formatErrorMessage = (error) => {
    const errorMappings = {
        '23503': (constraint, table) => `Erro: O ${constraint} informado é inválido para a tabela ${table}.`,
    };

    if (errorMappings[error.code]) {
        return errorMappings[error.code](error.constraint, error.table);
    } else {
        return `Erro desconhecido: Código ${error.code} - ${error.message}`;
    }
}