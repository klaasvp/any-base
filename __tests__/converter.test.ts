import { ucs2 } from "punycode";
import { describe, expect, test } from "vitest";
import { anyBase, alphabets } from "../src";

// Standard numeric string tests
describe("Numeric string", () => {
    test('hex2bin(2d5e) === 10110101011110', () => expect(anyBase(alphabets.HEX, alphabets.BIN)('2d5e')).toEqual('10110101011110'));
    test('bin2hex(10110101011110) === 2d5e', () => expect(anyBase(alphabets.BIN, alphabets.HEX)('10110101011110')).toEqual('2d5e'));
    test('dec2hex(11614) === 2d5e', () => expect(anyBase(alphabets.DEC, alphabets.HEX)('11614')).toEqual('2d5e'));
    test('hex2dec(2d5e) === 11614', () => expect(anyBase(alphabets.HEX, alphabets.DEC)('2d5e')).toEqual('11614'));
    test('oct2dec(26536) === 11614', () => expect(anyBase(alphabets.OCT, alphabets.DEC)('26536')).toEqual('11614'));
    test('dec2otc(11614) === 26536', () => expect(anyBase(alphabets.DEC, alphabets.OCT)('11614')).toEqual('26536'));
    test('unshorter(shorter(123456789123456789)) === 123456789123456789', () => {
        const testString = '123456789123456789';
        
        expect(
            anyBase('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-.,', '0123456789')(
                anyBase('0123456789', '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-.,')(testString)
            )
        ).toEqual(testString);
    });
});

// UTF-8 codepoint compatibility tests
describe("UTF-8 Codepoints", () => {
    test('ucs2.encode(dec2moji.convert(ucs2.decode(11614))) === 😄😱😞', () => {
        const dec2moji = anyBase(
            ucs2.decode('0123456789'),
            ucs2.decode('😀😃😄😁😆😅😂🤣☺😊😇🙂🙃😉😌😍😘😗😙😚😋😜😝😛🤑🤗🤓😎😏😒😞😔😟😕🙁☹😣😖😫😩😤😠😡😶😐😑😯😦😧😮😲😵😳😱😨😰😢😥😴🤤😭😓😪🙄')
        );

        expect(ucs2.encode(dec2moji(ucs2.decode('11614')))).toEqual('😄😱😞');
    });
    test('ucs2.encode(hex2moji(ucs2.decode(2d5e))) === 😄😱😞', () => {
        const hex2moji = anyBase(
            ucs2.decode('0123456789abcdef'),
            ucs2.decode('😀😃😄😁😆😅😂🤣☺😊😇🙂🙃😉😌😍😘😗😙😚😋😜😝😛🤑🤗🤓😎😏😒😞😔😟😕🙁☹😣😖😫😩😤😠😡😶😐😑😯😦😧😮😲😵😳😱😨😰😢😥😴🤤😭😓😪🙄')
        );

        expect(ucs2.encode(hex2moji(ucs2.decode('2d5e')))).toEqual('😄😱😞');
    });
    test('ucs2.encode(moji2hex(ucs2.decode(😄😱😞))) === 2d5e', () => {
        const moji2hex = anyBase(
            ucs2.decode('😀😃😄😁😆😅😂🤣☺😊😇🙂🙃😉😌😍😘😗😙😚😋😜😝😛🤑🤗🤓😎😏😒😞😔😟😕🙁☹😣😖😫😩😤😠😡😶😐😑😯😦😧😮😲😵😳😱😨😰😢😥😴🤤😭😓😪🙄'),
            ucs2.decode('0123456789abcdef')
        );
        expect(ucs2.encode(moji2hex(ucs2.decode('😄😱😞')))).toEqual('2d5e');
    });
});

describe("Predefined alphabets", () => {
    test('anyBase.BIN === 01', () => expect(anyBase.BIN).toEqual(alphabets.BIN));
    test('anyBase.OCT === 01234567', () => expect(anyBase.OCT).toEqual(alphabets.OCT));
    test('anyBase.DEC === 0123456789', () => expect(anyBase.DEC).toEqual(alphabets.DEC));
    test('anyBase.HEX === 0123456789abcdef', () => expect(anyBase.HEX).toEqual(alphabets.HEX));
});

describe("Edge cases", () => {
    test("non-alphabetic digits", () => {
        expect(() => anyBase('01', '0123456789abcdef')('01thisshouldntwork')).toThrow(/contains of non-alphabetic digits/);
    });

    test("same alphabet", () => {
        const converter = anyBase('0123456789', '0123456789');
        expect(converter('123456789')).toEqual('123456789');
    });

    test("immutable anybase", () => {
        expect(() => (anyBase as any).BIN = 'notbin').toThrow();
    });
});