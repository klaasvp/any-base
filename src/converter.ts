export type TAlphabet = string | ReadonlyArray<number>;
export type TAlphabetType<T> = T extends string ? string : T extends Array<number> ? Array<number> : T;

type AlphabetType = Pick<TAlphabet, "length"> & {
    indexOf: (searchString: any) => number,
    concat: (...arg0: any) => AlphabetType,
    slice: (start: number, end?: number) => AlphabetType
};

export class Converter <T extends TAlphabet, TDst extends TAlphabetType<T>> {
    private srcAlphabet: AlphabetType;
    private dstAlphabet: AlphabetType;

    constructor (
        srcAlphabet: T, 
        dstAlphabet: TDst
    ) {

        this.srcAlphabet = srcAlphabet;
        this.dstAlphabet = dstAlphabet;
    }

    /**
     * Convert number from source alphabet to destination alphabet
     *
     * @param number - number represented as a string or array of points
     */
    convert (number: TAlphabetType<T>): TAlphabetType<T> {
        const 
            numberMap: Record<number, number> = {},
            fromBase = this.srcAlphabet.length,
            toBase = this.dstAlphabet.length;

        let i, divide, newlen,
            length: number = number.length,
            result = (typeof number === "string" ? '' : []) as AlphabetType;

        if (!this.isValid(number)) {
            throw new Error('Number "' + number + '" contains of non-alphabetic digits (' + this.srcAlphabet + ')');
        }

        if (this.srcAlphabet === this.dstAlphabet) {
            return number;
        }

        for (i = 0; i < length; i++) {
            numberMap[i] = this.srcAlphabet.indexOf(number[i]);
        }

        do {
            divide = 0;
            newlen = 0;

            for (i = 0; i < length; i++) {
                divide = divide * fromBase + numberMap[i];

                if (divide >= toBase) {
                    numberMap[newlen++] = parseInt(`${divide / toBase}`, 10);
                    divide = divide % toBase;
                } else if (newlen > 0) {
                    numberMap[newlen++] = 0;
                }
            }

            length = newlen;
            result = this.dstAlphabet.slice(divide, divide + 1).concat(result);
        } while (newlen !== 0);

        return result as TAlphabetType<T>;
    }

    /**
     * Valid number with source alphabet
     */
    private isValid (number: TAlphabet): boolean {
        let i = 0;
        for (; i < number.length; ++i) {
            if (this.srcAlphabet.indexOf(number[i]) === -1) {
                return false;
            }
        }
        return true;
    }
}

export default Converter;