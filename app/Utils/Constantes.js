class Constantes {
    /**
     * Representa os gêneros aceitos.
     *
     */
    tipoSexo = [
        { id: 1, descricao: 'MASCULINO' },
        { id: 2, descricao: 'FEMININO' },
        { id: 3, descricao: 'NÃO BINÁRIO' },
        { id: 4, descricao: 'INDEFINIDO' }
    ]

    /**
     * Representa os locais de cobrança aceitos.
     *
     */
    localCobranca = [
        { id: 1, descricao: 'ESCRITORIO' },
        { id: 2, descricao: 'BOLETO' },
        { id: 3, descricao: 'COBRANÇA RESIDENCIAL' },
        { id: 4, descricao: 'COBRANÇA COMERCIAL' },
        { id: 5, descricao: 'PAGAMENTO RECORRENTE' }
    ]

    /**
     * Representa os portes aceitos. Os valores possíveis são 'P' (Pequeno), 'M' (Médio),
     * 'G' (Grande) e 'GG' (Extra Grande).
     *
     */
    portes = ['P', 'M', 'G', 'GG']

    tipoContrato = [
        { id: 1, descricao: "CONTRATO NOVO" },
        { id: 2, descricao: "TRANSFERÊNCIA DE FILIAL" },
        { id: 3, descricao: "TRANSFERÊNCIA DE PLANO" },
        { id: 4, descricao: "INCLUSÃO DE DEPENDENTE" },
        { id: 5, descricao: "INCLUSÃO DE ADICIONAL" },
        { id: 6, descricao: "REMOÃO DE DEPENDENTE" },
        { id: 7, descricao: "REMOÇÃO DE ADICIONAL" },
        { id: 8, descricao: "TRANSFERÊNCIA DE TITULAR" },
        { id: 9, descricao: "TRANSFERÊNCIA DE TITULAR COM OBITO" }
    ]
}

module.exports = Constantes