import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new CustomErrorException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class CustomErrorException extends Exception {
    public async handle(error: any, ctx: HttpContextContract): Promise<any> {
        
        if (error.code === 'E_VALIDATION_FAILURE') {
            return ctx.response.status(400).send(error.messages)
        }

        return ctx.response.status(error.status).send(error.message)
    }
}
