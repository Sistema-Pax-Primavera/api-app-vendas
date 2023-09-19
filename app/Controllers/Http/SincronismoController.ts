// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SincronismosController {

    public async sincronismo({ request, response, auth }) {
        try {
            return response.status(200).send(request.body)
        } catch (error) {
            return response.status(500).send({
                status: false,
                message: error.message
            })
        }
    }
}
