/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

    /**
   * Autenticação de Usuário
   *
   * Esta rota permite que um usuário se autentique e obtenha um token de acesso.
   * Método HTTP: POST
   * Endpoint: /v1/app-vendas/
   */
    Route.post('/', 'AutenticacaoController.autenticacao')

    /**
   * Envio de Instrução
   *
   * Esta rota permite o envio de instruções.
   * Método HTTP: GET
   * Endpoint: /v1/app-vendas/envio-instrucao
   * Middleware: auth:api (Requer autenticação)
   */
    Route.get('/envio-instrucao', 'EnvioController.envioInstrucao').middleware('auth:api')

    /**
   * Sincronismo
   *
   * Esta rota permite a sincronização de dados.
   * Método HTTP: POST
   * Endpoint: /v1/app-vendas/sincronismo
   * Middleware: auth:api (Requer autenticação)
   */
    Route.post('/sincronismo', 'SincronismoController.sincronismo').middleware('auth:api')

    /**
   * Upload de Arquivo em Base64
   *
   * Esta rota permite o upload de um arquivo em formato Base64.
   * Método HTTP: POST
   * Endpoint: /v1/app-vendas/upload
   * Middleware: auth:api (Requer autenticação)
   */
    Route.post('/upload', 'SincronismoController.uploadArquivoBase64').middleware('auth:api')

}).prefix('v1/app-vendas')
