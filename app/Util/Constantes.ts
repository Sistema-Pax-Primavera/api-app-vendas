/**
     * Representa os gêneros aceitos.
     *
     */
export const tipoSexo: { id: number, descricao: string }[] = [
    { id: 1, descricao: 'MASCULINO' },
    { id: 2, descricao: 'FEMININO' },
    { id: 3, descricao: 'NÃO BINÁRIO' },
    { id: 4, descricao: 'INDEFINIDO' }
]

/**
 * Representa os locais de cobrança aceitos.
 *
 */
export const localCobranca: { id: number, descricao: string }[] = [
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
export const portes: string[] = ['P', 'M', 'G', 'GG']