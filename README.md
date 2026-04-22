# any-base-module

[![NPM](https://nodei.co/npm/any-base-module.svg?style=flat&data=n,v,d&color=blue)](https://www.npmjs.com/package/any-base-module)

Convert numbers between any base/alphabet — including UTF-8 codepoints. The base is determined by the alphabet you provide, giving you full flexibility.

Based on the original [any-base](https://www.npmjs.com/package/any-base) from Kamil Harasimowicz.


## Installation

```
npm install any-base-module --save
```

## Usage

### API — `anyBase()`

Create a reusable converter function by specifying source and destination alphabets:

```ts
import { anyBase, alphabets } from "any-base-module";

const dec2hex = anyBase(alphabets.DEC, alphabets.HEX);
const shortId = anyBase(alphabets.DEC, "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-+!@#$^");
const longId  = anyBase("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-+!@#$^", alphabets.DEC);

dec2hex("123456");      // "1e240"
shortId("1234567890");  // "PtmIa"
longId("PtmIa");        // "1234567890"
```

#### Parameters

| Parameter              | Type     | Description                         |
| ---------------------- | -------- | ----------------------------------- |
| `srcAlphabet`          | `string \| ReadonlyArray<number>` | Source alphabet, digits smallest → largest |
| `dstAlphabet`          | `string \| ReadonlyArray<number>` | Destination alphabet, digits smallest → largest |

#### Return value

A converter **function** `(number) => convertedNumber` that converts a value from the source base to the destination base.

### Built-in alphabets

| Constant        | Legacy constant        | Alphabet              |
| --------------- | --------------- | --------------------- |
| `alphabets.BIN` | `anyBase.BIN`   | `01`                  |
| `alphabets.OCT` | `anyBase.OCT`   | `01234567`            |
| `alphabets.DEC` | `anyBase.DEC`   | `0123456789`          |
| `alphabets.HEX` | `anyBase.HEX`   | `0123456789abcdef`    |

### UTF-8 codepoint support

Alphabets can also be arrays of Unicode codepoints, allowing emoji or other multi-byte characters as digits:

```ts
import { ucs2 } from "punycode";
import { anyBase } from "any-base-module";

const dec2moji = anyBase(
  ucs2.decode("0123456789"),
  ucs2.decode("😀😃😄😁😆😅😂🤣☺😊😇🙂🙃😉😌😍😘😗😙😚😋😜😝😛🤑🤗🤓😎😏😒😞😔😟😕🙁☹😣😖😫😩😤😠😡😶😐😑😯😦😧😮😲😵😳😱😨😰😢😥😴🤤😭😓😪🙄")
);

ucs2.encode(dec2moji(ucs2.decode("11614"))); // "😄😱😞"
```

## License

MIT
