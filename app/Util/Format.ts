export const formatarString = (value: string | null): string | null => {
    if (!value || typeof value !== 'string') return null
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()
}

export const formatarNumero = (value: string): string => {
    return value.replace(/\D/g, '')
}

export const validaCpf = (value: string): boolean => {
    const cpfFormatado = formatarNumero(value)
    const invalidos = ['00000000000', '11111111111', '22222222222', '33333333333', '44444444444', '55555555555', '66666666666', '77777777777', '88888888888', '99999999999']

    if (!cpfFormatado || cpfFormatado.length !== 11 || invalidos.includes(cpfFormatado)) return false

    let soma = 0
    let resto: number

    for (let i = 1; i <= 9; i++) soma += parseInt(cpfFormatado?.substring(i - 1, i)) * (11 - i)
    resto = (soma * 10) % 11

    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpfFormatado?.substring(9, 10))) return false

    soma = 0
    for (let i = 1; i <= 10; i++) soma += parseInt(cpfFormatado?.substring(i - 1, i)) * (12 - i)
    resto = (soma * 10) % 11

    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpfFormatado?.substring(10, 11))) return false

    return true
}