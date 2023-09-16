import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from "@ioc:Adonis/Core/Validator";

export default class AutenticacaosController {

    public async autenticacao({ request, response, auth }: HttpContextContract) {
        try {

            return response.status(200).send({})
        } catch (error) {
            return response.status(500).send({
                status: false,
                message: error
            })
        }
    }
}
