/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import { validator } from "@ioc:Adonis/Core/Validator";
import { validaCpf, validaCnpj } from "App/Util/Format";

validator.rule('cpfCnpj', (value, _, options) => {
    const cpf = validaCpf(value)
    const cnpj = validaCnpj(value)
    if(!cpf && !cnpj){
        options.errorReporter.report(options.pointer,
            'cpfCnpj',
            'O CPF ou CNPJ informado é inválido',
            options.arrayExpressionPointer)
    }
})

validator.rule('cpf', (value, _, options) => {
    const valida = validaCpf(value)
    if (!valida) {
        options.errorReporter.report(options.pointer, 'cpf', 'Campo cpf inválido')
    }
})

declare module '@ioc:Adonis/Core/Validator' {
    interface Rules {
        cpf(): Rule
        cpfCnpj(): Rule
    }
}