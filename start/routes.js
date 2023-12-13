'use strict'

const MensagemMobile = use('App/Models/MensagemMobile')
const ChatController = require('../app/Controllers/Http/ChatController')

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {

    Route.post('/', 'AutenticacaoController.autenticacao')

    Route.post('upload', 'SincronismoController.uploadArquivoBase64').middleware('auth')

    Route.post('sincronismo', 'SincronismoController.sincronismo').middleware('auth')

}).prefix('api/v1/app-vendas')

// Chama a função de envio das mensagens a cada 1 minuto.
setInterval(async () => {
    try {
        // Busca as mensagens pendentes.
        const mensagens = await MensagemMobile.query().where('enviado', false).fetch()

        if (mensagens && mensagens.rows.length > 0) {
            const chat = new ChatController()
            await chat.enviar(mensagens.toJSON())
        }
    } catch (error) {
        console.error('Erro ao enviar mensagens:', error.message)
    }
}, 60 * 1000);