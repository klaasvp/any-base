import Converter, { TAlphabet, TAlphabetType } from "./converter.js";

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

anyBase.BIN = '01';
anyBase.OCT = '01234567';
anyBase.DEC = '0123456789';
anyBase.HEX = '0123456789abcdef';

export default anyBase;