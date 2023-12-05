const { DateTime } = use('luxon')
const { isValid, parse, parseISO } = use('date-fns')
const { ptBR } = use('date-fns/locale')

class Format {

    formatarString(value) {
        if (!value || typeof value !== 'string') return null
        return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()
    }

    formatarNumero(value) {
        if (!value || typeof value !== 'string') return null;
        return value.replace(/\D/g, '')
    }

    formatarDecimal(value) {
        const input = String(value);

        if (!/^\d+(\.\d+)?$/.test(input)) {
            return null
        }

        const numero = parseFloat(input);

        const numeroFormatado = numero.toFixed(2);

        return parseFloat(numeroFormatado);
    }

    formatarData(value) {

        if (!value) return null

        value = typeof value !== 'string' ? String(value) : value

        const formats = [
            'dd/MM/yyyy',
            'MM/yyyy',
            'dd/MM/yyyy HH:mm:ss',
            'yyyy-MM-dd',
            'yyyy-MM',
            'yyyy-MM-dd HH:mm:ss'
        ];

        const formatsTime = [
            'HH:mm:ss', 'HH:mm'
        ];

        for (const format of formats) {
            const parsedDate = parse(value, format, new Date(), { locale: ptBR })
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate;
            }
        }

        for (const format of formatsTime) {
            const parsedTime = parse(value, format, new Date(), { locale: ptBR })
            if (isValid(parsedTime)) {
                return parsedTime.toISOString();
            }
        }

        try {
            const isoDate = parseISO(value).toISOString();
            return DateTime.fromISO(isoDate).toJSDate();
        } catch (error) {
            throw new Error('Formato de data ou horário inválido');
        }
    }

    validaCpf(value) {
        const cpfFormatado = formatarNumero(value)
        const invalidos = ['00000000000', '11111111111', '22222222222', '33333333333', '44444444444', '55555555555', '66666666666', '77777777777', '88888888888', '99999999999']

        if (!cpfFormatado || cpfFormatado.length !== 11 || invalidos.includes(cpfFormatado)) return false

        let soma = 0
        let resto

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

    validaCnpj(value) {
        const cnpjFormatado = formatarNumero(value)
        const invalidos = ['00000000000000', '11111111111111', '22222222222222', '33333333333333', '44444444444444', '55555555555555', '66666666666666', '77777777777777', '88888888888888', '99999999999999']

        if (cnpjFormatado?.length === 14 && !invalidos.includes(cnpjFormatado)) {
            let tamanho = cnpjFormatado?.length - 2;
            let numeros = cnpjFormatado?.substring(0, tamanho);
            let digitos = cnpjFormatado?.substring(tamanho);
            let soma = 0;
            let pos = tamanho - 7;

            for (let i = tamanho; i >= 1; i--) {
                soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
                if (pos < 2) pos = 9;
            }

            let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado !== parseInt(digitos.charAt(0))) return false;

            tamanho = tamanho + 1;
            numeros = cnpjFormatado?.substring(0, tamanho);
            soma = 0;
            pos = tamanho - 7;

            for (let i = tamanho; i >= 1; i--) {
                soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
                if (pos < 2) pos = 9;
            }

            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado !== parseInt(digitos.charAt(1))) return false;

            return true;
        } else {
            return false;
        }
    }

    formatarExtras(extras) {
        const extrasLimpos = {};
        for (const key in extras) {
            if (Object.prototype.hasOwnProperty.call(extras, key)) {
                const chaveLimpa = key.replace(/^pivot_/, '');
                extrasLimpos[chaveLimpa] = extras[key];
            }
        }
        return extrasLimpos;
    }

}

module.exports = Format