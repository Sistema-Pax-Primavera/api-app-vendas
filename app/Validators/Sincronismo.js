'use strict';

const { schema, rules } = use('Validator');
const Constantes = require('../Utils/Constantes');
const { tipoSexo, portes, localCobranca, tipoContrato } = new Constantes()

class SincronismoValidator {
  constructor(ctx) {
    this.ctx = ctx;
  }

  /**
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   */
  get schema() {
    return schema.create({
      contratos: schema.array().members(
        schema.object().members({
          titular: schema.object().members({
            // ... your schema definitions ...
          }),
          dependentes: schema.array.nullable().members(
            schema.object().members({
              // ... your schema definitions for dependents ...
            })
          ),
          itens: schema.array.nullable().members(
            schema.object().members({
              // ... your schema definitions for items ...
            })
          ),
        })
      ),
    });
  }

  /**
   * Custom messages for validation failures.
   */
  get messages() {
    return {
      required: 'Campo {{field}} é obrigatório',
      array: 'Campo {{field}} deve ser um array',
      enum: 'Campo {{field}} deve ser {{options.choices}}',
      enumSet: 'Campo {{field}} deve ser {{options.choices}}',
      'date.format': 'Campo {{field}} deve ser no formato YYYY-MM-DD',
    };
  }
}

module.exports = SincronismoValidator;
