import Converter, { TAlphabet, TAlphabetType } from "./converter.js";

export const alphabets = {
    BIN: '01',
    OCT: '01234567',
    DEC: '0123456789',
    HEX: '0123456789abcdef'
} as const;

/**
 * Function get source and destination alphabet and return convert function
 */
export function anyBase <T extends TAlphabet, TDst extends TAlphabetType<T>> (srcAlphabet: T, dstAlphabet: TDst) {
    const converter = new Converter(srcAlphabet, dstAlphabet);
    
    /**
     * Convert function
     */
    return function (number: TAlphabetType<T>) {
        return converter.convert(number);
    }
};

// Predefined alphabets for compatibility with existing code
anyBase.BIN = alphabets.BIN;
anyBase.OCT = alphabets.OCT;
anyBase.DEC = alphabets.DEC;
anyBase.HEX = alphabets.HEX;

Object.freeze(anyBase);

export default anyBase;