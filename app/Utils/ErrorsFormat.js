class ErrorsFormat {
    errorsFormat(errors) {
        let errorFormat = {};
        let inputs = [];

        for (let index = 0; index < errors.length; index++) {
            errorFormat[errors[index].field] = errors[index].message;
            inputs.push(`- (${errors[index].field.toUpperCase().replace(/_ID|_/g, ' ')}): ${errors[index].message}\n`);
        }

        errorFormat['message'] = inputs.join('\n');

        return errorFormat;
    }
    async joinObj(a, attr) {
        var out = [];

        for (var i = 0; i < a.length; i++) {
            out.push(a[i][attr]);
        }

        return out.join(", ");
    }

    formatErrorMessage(error) {
        const errorMappings = {
            '23503': (constraint, table) => `Erro: O ${constraint} informado é inválido para a tabela ${table}.`,
        };

        if (errorMappings[error.code]) {
            return errorMappings[error.code](error.constraint, error.table);
        } else {
            return `Erro desconhecido: Código ${error.code} - ${error.message}`;
        }
    }
}

module.exports = ErrorsFormat