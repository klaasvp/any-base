import { ucs2 } from "punycode";
import { describe, expect, test } from "vitest";
import Converter from "../src/converter";
import { anyBase } from "../src";

// Standard numeric string tests
describe("Numeric string", () => {
    test('hex2bin(2d5e) === 10110101011110', () => expect(new Converter('0123456789abcdef', '01').convert('2d5e')).toEqual('10110101011110'));
    test('bin2hex(10110101011110) === 2d5e', () => expect(new Converter('01', '0123456789abcdef').convert('10110101011110')).toEqual('2d5e'));
    test('dec2hex(11614) === 2d5e', () => expect(new Converter('0123456789', '0123456789abcdef').convert('11614')).toEqual('2d5e'));
    test('hex2dec(2d5e) === 11614', () => expect(new Converter('0123456789abcdef', '0123456789').convert('2d5e')).toEqual('11614'));
    test('oct2dec(26536) === 11614', () => expect(new Converter('01234567', '0123456789').convert('26536')).toEqual('11614'));
    test('dec2otc(11614) === 26536', () => expect(new Converter('0123456789', '01234567').convert('11614')).toEqual('26536'));
    test('unshorter(shorter(123456789123456789)) === 123456789123456789', () => {
        const testString = '123456789123456789';
        
        expect(
            new Converter('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-.,', '0123456789').convert(
                new Converter('0123456789', '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-.,').convert(testString)
            )
        ).toEqual(testString);
    });
});

// UTF-8 codepoint compatibility tests
describe("UTF-8 Codepoints", () => {
    test('ucs2.encode(dec2moji.convert(ucs2.decode(11614))) === 😄😱😞', () => {
        const dec2moji = new Converter(
            ucs2.decode('0123456789'),
            ucs2.decode('😀😃😄😁😆😅😂🤣☺😊😇🙂🙃😉😌😍😘😗😙😚😋😜😝😛🤑🤗🤓😎😏😒😞😔😟😕🙁☹😣😖😫😩😤😠😡😶😐😑😯😦😧😮😲😵😳😱😨😰😢😥😴🤤😭😓😪🙄')
        );

        expect(ucs2.encode(dec2moji.convert(ucs2.decode('11614')))).toEqual('😄😱😞');
    });
    test('ucs2.encode(hex2moji.convert(ucs2.decode(2d5e))) === 😄😱😞', () => {
        const hex2moji = new Converter(
            ucs2.decode('0123456789abcdef'),
            ucs2.decode('😀😃😄😁😆😅😂🤣☺😊😇🙂🙃😉😌😍😘😗😙😚😋😜😝😛🤑🤗🤓😎😏😒😞😔😟😕🙁☹😣😖😫😩😤😠😡😶😐😑😯😦😧😮😲😵😳😱😨😰😢😥😴🤤😭😓😪🙄')
        );

        expect(ucs2.encode(hex2moji.convert(ucs2.decode('2d5e')))).toEqual('😄😱😞');
    });
    test('ucs2.encode(moji2hex.convert(ucs2.decode(😄😱😞))) === 2d5e', () => {
        const moji2hex = new Converter(
            ucs2.decode('😀😃😄😁😆😅😂🤣☺😊😇🙂🙃😉😌😍😘😗😙😚😋😜😝😛🤑🤗🤓😎😏😒😞😔😟😕🙁☹😣😖😫😩😤😠😡😶😐😑😯😦😧😮😲😵😳😱😨😰😢😥😴🤤😭😓😪🙄'),
            ucs2.decode('0123456789abcdef')
        );
        expect(ucs2.encode(moji2hex.convert(ucs2.decode('😄😱😞')))).toEqual('2d5e');
    });
});

describe("Edge cases", () => {
    test("non-alphabetic digits", () => {
        expect(() => new Converter('01', '0123456789abcdef').convert('01thisshouldntwork')).toThrow(/contains of non-alphabetic digits/);
    });

    test("same alphabet", () => {
        const converter = new Converter('0123456789', '0123456789');
        expect(converter.convert('123456789')).toEqual('123456789');
    });

    test("immutable anybase", () => {
        expect(() => (anyBase as any).BIN = 'notbin').toThrow();
    });
});
