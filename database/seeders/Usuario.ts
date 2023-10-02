import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { UsuarioFactory } from 'Database/factories/UsuarioFactory'

export default class extends BaseSeeder {
  public async run () {
    await UsuarioFactory.createMany(2)
  }
}
