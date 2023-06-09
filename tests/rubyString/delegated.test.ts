import ruby from "../../src/ruby.js"
import RubyString from "../../src/rubyString.js";
import RubyObject from "../../src/rubyObject.js";
import RubyNil from "../../src/rubyNil.js";

describe('Delegated function to JS string', () => {
    test('String#length', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length
        expect(ruby('Life, the universe and everything. Answer:', s => s.length)).toBe(42);
        expect(ruby('Mozilla', s => s.length)).toBe(7);
        expect(ruby('', s => s.length)).toBe(0);
        expect(ruby('😄', s => s.length)).toBe(2);
        expect(ruby('∀𝑥∈ℝ,𝑥²≥0', s => s.length)).toBe(11);
    });

    test('String#at', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/at
        const sentence = 'The quick brown fox jumps over the lazy dog.';
        expect(ruby(sentence, s => s.at(5))).toBe('u');
        expect(ruby(sentence, s => s.at(-4))).toBe('d');
        expect(ruby('myinvoice01', s => s.at(-1))).toBe('1');
        expect(ruby('myinvoice02', s => s.at(-1))).toBe('2');

        expect(ruby(sentence, s => s.at(100))).toBe(undefined);
    });

    test('String#charAt', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt
        const sentence = 'The quick brown fox jumps over the lazy dog.';
        expect(ruby(sentence, s => s.charAt(4))).toBe('q');
        const anyString = 'Brave new world';
        expect(ruby(anyString, s => s.charAt())).toBe('B');
        expect(ruby(anyString, s => s.charAt(0))).toBe('B');
        expect(ruby(anyString, s => s.charAt(1))).toBe('r');
        expect(ruby(anyString, s => s.charAt(2))).toBe('a');
        expect(ruby(anyString, s => s.charAt(3))).toBe('v');
        expect(ruby(anyString, s => s.charAt(4))).toBe('e');
        expect(ruby(anyString, s => s.charAt(999))).toBe('');

        expect(ruby(sentence, s => s.char_at(4))).toBe('q');
    });

    test('String#charCodeAt', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
        const sentence = 'The quick brown fox jumps over the lazy dog.';
        expect(ruby(sentence, s => s.charCodeAt(4))).toBe(113);
        expect(ruby('ABC', s => s.charCodeAt(0))).toBe(65);

        expect(ruby(sentence, s => s.charCodeAt(100))).toBe(NaN);
        expect(ruby(sentence, s => s.char_code_at(4))).toBe(113);
    });

    test('String#codePointAt', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt
        const icons = '☃★♲';
        expect(ruby(icons, s => s.codePointAt(1))).toBe(9733);
        expect(ruby('ABC', s => s.codePointAt(0))).toBe(65);
        expect(ruby('😍', s => s.codePointAt(0))).toBe(128525);
        expect(ruby('\ud83d\ude0d', s => s.codePointAt(0))).toBe(128525);
        expect(ruby('😍', s => s.codePointAt(1))).toBe(56845);
        expect(ruby('\ud83d\ude0d', s => s.codePointAt(1))).toBe(56845);
        expect(ruby('ABC', s => s.codePointAt(42))).toBe(undefined);

        expect(ruby(icons, s => s.code_point_at(1))).toBe(9733);
    });

    test('String#concat renamed to jsConcat', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/concat
        expect(ruby('Hello', s => s.jsConcat(' ', 'World'))).toBe('Hello World');
        expect(ruby('Hello', s => s.js_concat(' ', 'World'))).toBe('Hello World');
        expect(ruby('World', s => s.jsConcat(', ', 'Hello'))).toBe('World, Hello');
        expect(ruby('Hello, ', s => s.jsConcat('Kevin', '. Have a nice day.')))
            .toBe('Hello, Kevin. Have a nice day.');
        const greetList = ["Hello", " ", "Venkat", "!"];
        expect(ruby('', s => s.jsConcat(...greetList))).toBe('Hello Venkat!');
        expect(ruby('', s => s.jsConcat({}))).toBe('[object Object]');
        expect(ruby('', s => s.jsConcat([]))).toBe('');
        expect(ruby('', s => s.jsConcat(null))).toBe('null');
        expect(ruby('', s => s.jsConcat(true))).toBe('true');
        expect(ruby('', s => s.jsConcat(4, 5))).toBe('45');
    });

    test('String#endsWith', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
        const str1 = 'Cats are the best!';
        expect(ruby(str1, s => s.endsWith('best!'))).toBe(true);
        expect(ruby(str1, s => s.endsWith('best', 17))).toBe(true);
        expect(ruby(str1, s => s.ends_with('best', 17))).toBe(true);
        expect(ruby('Is this a question?', s => s.endsWith('question'))).toBe(false);
        const str = 'To be, or not to be, that is the question.';
        expect(ruby(str, s => s.endsWith('question.'))).toBe(true);
        expect(ruby(str, s => s.endsWith('to be'))).toBe(false);
        expect(ruby(str, s => s.endsWith('to be', 19))).toBe(true);
    });

    // static methods
    test('String.fromCharCode', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode
        expect(ruby(() => RubyString.fromCharCode(189, 43, 190, 61))).toBe('½+¾=');
        expect(ruby(() => RubyString.fromCharCode(65, 66, 67))).toBe('ABC');
        expect(ruby(() => RubyString.fromCharCode(0x2014))).toBe('—');
        expect(ruby(() => RubyString.fromCharCode(0x12014))).toBe('—');
        expect(ruby(() => RubyString.fromCharCode(0xd83c, 0xdf03))).toBe('\uD83C\uDF03'); // Code Point U+1F303 "Night with Stars" === "\uD83C\uDF03"
        expect(ruby(() => RubyString.fromCharCode(55356, 57091))).toBe('\uD83C\uDF03');
        expect(ruby(() => RubyString.fromCharCode(0xd834, 0xdf06, 0x61, 0xd834, 0xdf07))).toBe('\uD834\uDF06a\uD834\uDF07');

        expect(ruby(() => RubyString.from_char_code(189, 43, 190, 61))).toBe('½+¾=');
    });

    test('String.fromCodePoint', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint
        expect(ruby(() => RubyString.fromCodePoint(9731, 9733, 9842, 0x2f804))).toBe('☃★♲你');
        expect(ruby(() => RubyString.fromCodePoint(42))).toBe('*');
        expect(ruby(() => RubyString.fromCodePoint(65, 90))).toBe('AZ');
        expect(ruby(() => RubyString.fromCodePoint(0x404))).toBe('Є');
        expect(ruby(() => RubyString.fromCodePoint(0x2f804))).toBe('你');
        expect(ruby(() => RubyString.fromCodePoint(194564))).toBe('\uD87E\uDC04');
        expect(ruby(() => RubyString.fromCodePoint(0x1d306, 0x61, 0x1d307))).toBe('\uD834\uDF06a\uD834\uDF07');
        expect(ruby(() => RubyString.fromCodePoint(0xd83c, 0xdf03))).toBe('\uD83C\uDF03'); // Code Point U+1F303 "Night with Stars" === "\uD83C\uDF03"
        expect(ruby(() => RubyString.fromCodePoint(55356, 57091))).toBe('\uD83C\uDF03');
    });

    test('String#includes', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
        const sentence = 'The quick brown fox jumps over the lazy dog.';
        expect(ruby(sentence, s => s.includes('fox'))).toBe(true);
        const str = "To be, or not to be, that is the question.";
        expect(ruby(str, s => s.includes('To be'))).toBe(true);
        expect(ruby(str, s => s.includes('question'))).toBe(true);
        expect(ruby(str, s => s.includes('nonexistent'))).toBe(false);
        expect(ruby(str, s => s.includes('To be', 1))).toBe(false);
        expect(ruby(str, s => s.includes('TO BE'))).toBe(false);
        expect(ruby(str, s => s.includes(''))).toBe(true);
    });

    test('String#indexOf', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf
        const paragraph = 'The quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy?';
        const indexOfFirst = ruby(paragraph, s => s.indexOf('dog'));
        expect(indexOfFirst).toBe(40);
        expect(ruby(paragraph, s => s.indexOf('dog', indexOfFirst + 1))).toBe(52);
        expect(ruby('hello world', s => s.indexOf(''))).toBe(0);
        expect(ruby('hello world', s => s.indexOf('', 0))).toBe(0);
        expect(ruby('hello world', s => s.indexOf('', 3))).toBe(3);
        expect(ruby('hello world', s => s.indexOf('', 8))).toBe(8);
        expect(ruby('hello world', s => s.indexOf('', 11))).toBe(11);
        expect(ruby('hello world', s => s.indexOf('', 13))).toBe(11);
        expect(ruby('hello world', s => s.indexOf('', 22))).toBe(11);
        expect(ruby('Blue Whale', s => s.indexOf('Blue'))).toBe(0);
        expect(ruby('Blue Whale', s => s.indexOf('Blut'))).toBe(-1);
        expect(ruby('Blue Whale', s => s.indexOf('Whale', 0))).toBe(5);
        expect(ruby('Blue Whale', s => s.indexOf('Whale', 5))).toBe(5);
        expect(ruby('Blue Whale', s => s.indexOf('Whale', 7))).toBe(-1);
        expect(ruby('Blue Whale', s => s.indexOf(''))).toBe(0);
        expect(ruby('Blue Whale', s => s.indexOf('', 9))).toBe(9);
        expect(ruby('Blue Whale', s => s.indexOf('', 10))).toBe(10);
        expect(ruby('Blue Whale', s => s.indexOf('', 11))).toBe(10);
        expect(ruby('Blue Whale', s => s.indexOf('blue'))).toBe(-1);
        expect(ruby('Brave new world', s => s.indexOf('w'))).toBe(8);
        expect(ruby('Brave new world', s => s.indexOf('new'))).toBe(6);
        expect(ruby('brie, pepper jack, cheddar', s => s.indexOf('cheddar'))).toBe(19);
        expect(ruby('Brie, Pepper Jack, Cheddar', s => s.indexOf('cheddar'))).toBe(-1);

        expect(ruby('brie, pepper jack, cheddar', s => s.index_of('cheddar'))).toBe(19);
    });

    test('String#lastIndexOf', () => {
        const paragraph = 'The quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy?';
        expect(ruby(paragraph, s => s.lastIndexOf('dog'))).toBe(52);
        expect(ruby('canal', s => s.lastIndexOf('a'))).toBe(3);
        expect(ruby('canal', s => s.lastIndexOf('a', 2))).toBe(1);
        expect(ruby('canal', s => s.last_index_of('a', 2))).toBe(1);
        expect(ruby('canal', s => s.lastIndexOf('a', 0))).toBe(-1);
        expect(ruby('canal', s => s.lastIndexOf('x'))).toBe(-1);
        expect(ruby('canal', s => s.lastIndexOf('c', -5))).toBe(0);
        expect(ruby('canal', s => s.lastIndexOf(''))).toBe(5);
        expect(ruby('canal', s => s.lastIndexOf('', 2))).toBe(2);
        expect(ruby('Blue Whale, Killer Whale', s => s.lastIndexOf('blue'))).toBe(-1);
        expect(ruby('Brave, Brave New World', s => s.lastIndexOf('Brave'))).toBe(7);
    });

    test('String#localeCompare', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
        const a = 'réservé'; // With accents, lowercase
        const b = 'RESERVE'; // No accents, uppercase
        expect(ruby(a, s => s.localeCompare(b, 'en'))).toBe(1);
        expect(ruby(a, s => s.localeCompare(b, 'en', { sensitivity: 'base' }))).toBe(0);
        expect(ruby(a, s => s.locale_compare(b, 'en', { sensitivity: 'base' }))).toBe(0);
        expect(ruby('a', s => s.localeCompare('c'))).toBeLessThan(0);
        expect(ruby('check', s => s.localeCompare('against'))).toBeGreaterThan(0);
        expect(ruby('a', s => s.localeCompare('a'))).toBe(0);
        expect(ruby('ä', s => s.localeCompare('z', 'de'))).toBeLessThan(0);
        expect(ruby('ä', s => s.localeCompare('z', 'sv'))).toBeGreaterThan(0);
        expect(ruby('ä', s => s.localeCompare('a', 'de', { sensitivity: 'base' }))).toBe(0);
        expect(ruby('ä', s => s.localeCompare('a', 'sv', { sensitivity: 'base' }))).toBeGreaterThan(0);
    });

    test('String#match', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
        const paragraph = 'The quick brown fox jumps over the lazy dog. It barked.';
        expect(ruby(paragraph, s => s.jsMatch(/[A-Z]/g))).toStrictEqual(['T', 'I']);
        expect(ruby(paragraph, s => s.js_match(/[A-Z]/g))).toStrictEqual(['T', 'I']);
        const str = 'For more information, see Chapter 3.4.5.1';
        expect(ruby(str, s => {
            const m = s.jsMatch(/see (chapter \d+(\.\d)*)/i);
            return new RubyString(m.toJS()?.toString() ?? '');
        })).toBe('see Chapter 3.4.5.1,Chapter 3.4.5.1,.1');
        const str2 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        expect(ruby(str2, s => s.jsMatch(/[A-E]/gi))).toStrictEqual(['A', 'B', 'C', 'D', 'E', 'a', 'b', 'c', 'd', 'e']);
        // @ts-ignore
        expect(ruby(paragraph, s => s.jsMatch(/(?<animal>fox|cat) jumps over/).groups)).toEqual({animal: "fox"});
        const str3 = 'Hmm, this is interesting.';
        expect(ruby(str3, s => s.jsMatch({
            [Symbol.match](str) { return ["Yes, it's interesting."]}
        }))).toEqual(["Yes, it's interesting."]);
    });

    test('String#matchAll', () => {
        const regexp = /t(e)(st(\d?))/g;
        const str = 'test1test2';
        /*
         * Strange things happened here.
         * According to the MDN documentation, the return value of matchAll is an iterator of String,
         * Yet, in my test environment, it is an iterator of RegExpMatchArray. I'm really confused.
         * This make the following test failed.
         */
        // expect(ruby(str, s => [...s.matchAll(regexp)][0])).toEqual(['test1', 'e', 'st1', '1']);
        ruby(str, s => {
            const array = [...s.matchAll(regexp)];
            expect([...array[0].toJS()]).toEqual(['test1', 'e', 'st1', '1']);
            return new RubyNil();
        });
    });

    test('String#normalize', () => {
        const name1 = '\u0041\u006d\u00e9\u006c\u0069\u0065';
        const name2 = '\u0041\u006d\u0065\u0301\u006c\u0069\u0065';
        expect(ruby(name1, s => s.normalize('NFC'))).toBe(name2.normalize('NFC'));
        expect(ruby('\u00F1', s => s.normalize('NFC'))).toBe('ñ');
        expect(ruby('\u006E\u0303', s => s.normalize('NFC'))).toBe('ñ');
        expect(ruby('\u00F1', s => s.normalize('NFD'))).toBe('\u006E\u0303'.normalize('NFD'));
        expect(ruby('\uFB00', s => s.normalize('NFKD'))).toBe('ff');
        const str = '\u1E9B\u0323';
        expect(ruby(str, s => s.normalize('NFC'))).toBe('\u1E9B\u0323');
        expect(ruby(str, s => s.normalize())).toBe('\u1E9B\u0323');
        expect(ruby(str, s => s.normalize('NFD'))).toBe('\u017F\u0323\u0307');
        expect(ruby(str, s => s.normalize('NFKC'))).toBe('\u1E69');
        expect(ruby(str, s => s.normalize('NFKD'))).toBe('\u0073\u0323\u0307');
    });

    test('String#padEnd', () => {
        expect(ruby('Breaded Mushrooms', s => s.padEnd(25, '.'))).toBe('Breaded Mushrooms........');
        expect(ruby('200', s => s.padEnd(5))).toBe('200  ');
        expect(ruby('abc', s => s.padEnd(10))).toBe('abc       ');
        expect(ruby('abc', s => s.padEnd(10, 'foo'))).toBe('abcfoofoof');
        expect(ruby('abc', s => s.pad_end(10, 'foo'))).toBe('abcfoofoof');
        expect(ruby('abc', s => s.padEnd(6, '123456'))).toBe('abc123');
        expect(ruby('abc', s => s.padEnd(1))).toBe('abc');
    });

    test('String#padStart', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
        expect(ruby('5', s => s.padStart(2, '0'))).toBe('05');
        expect(ruby('5581', s => s.padStart(16, '*'))).toBe('************5581');
        expect(ruby('abc', s => s.padStart(10))).toBe('       abc');
        expect(ruby('abc', s => s.padStart(10))).toBe('       abc');
        expect(ruby('abc', s => s.padStart(10, 'foo'))).toBe('foofoofabc');
        expect(ruby('abc', s => s.padStart(8, '0'))).toBe('00000abc');
        expect(ruby('abc', s => s.padStart(1))).toBe('abc');
    });

    test('String#repeat', () => {
        expect(ruby('Happy! ', s => s.repeat(3))).toBe('Happy! Happy! Happy! ');
        expect(() => ruby('abc', s => s.repeat(-1))).toThrow(RangeError);
        expect(ruby('abc', s => s.repeat(0))).toBe('');
        expect(ruby('abc', s => s.repeat(1))).toBe('abc');
        expect(ruby('abc', s => s.repeat(2))).toBe('abcabc');
        expect(ruby('abc', s => s.repeat(3.5))).toBe('abcabcabc');
        expect(() => ruby('abc', s => s.repeat(1/0))).toThrow(RangeError);
    });

    test('String#replace renamed to jsReplace', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
        const p = 'The quick brown fox jumps over the lazy dog. If the dog reacted, was it really lazy?';
        expect(ruby(p, s => s.jsReplace('dog', 'monkey')))
            .toBe('The quick brown fox jumps over the lazy monkey. If the dog reacted, was it really lazy?');
        expect(ruby(p, s => s.js_replace('dog', 'monkey')))
            .toBe('The quick brown fox jumps over the lazy monkey. If the dog reacted, was it really lazy?');
        expect(ruby(p, s => s.jsReplace(/Dog/i, 'ferret')))
            .toBe('The quick brown fox jumps over the lazy ferret. If the dog reacted, was it really lazy?');
        expect(ruby('xxx', s => s.jsReplace('', '_'))).toBe('_xxx');
        expect(ruby('foo', s => s.jsReplace(/(f)/, '$2'))).toBe('$2oo');
        expect(ruby('foo', s => s.jsReplace('f', '$1'))).toBe('$1oo');
        expect(ruby('foo', s => s.jsReplace(/(f)|(g)/, '$2'))).toBe('oo');

        const replacer = (match:string, p1:string, p2:string, p3:string, offset:number, string:string) => [p1, p2, p3].join(' - ');
        expect(ruby('abc12345#$*%', s => s.jsReplace(/([^\d]*)(\d*)([^\w]*)/, replacer))).toBe('abc - 12345 - #$*%');

        const str = 'Twas the night before Xmas...';
        expect(ruby(str, s => s.jsReplace(/xmas/i, 'Christmas'))).toBe('Twas the night before Christmas...');

        expect(ruby('Apples are round, and apples are juicy.', s => s.jsReplace(/apples/gi, 'oranges')))
            .toBe('oranges are round, and oranges are juicy.');
        expect(ruby('Maria Cruz', s => s.jsReplace(/(\w+)\s(\w+)/, "$2, $1"))).toBe('Cruz, Maria');
        expect(ruby('abcd', s => s.jsReplace(/(bc)/, (match, p1, offset) => `${match} (${offset})`)))
            .toBe('abc (1)d');
    });

    test('String#replaceAll', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll
        const p = 'The quick brown fox jumps over the lazy dog. If the dog reacted, was it really lazy?';
        expect(ruby(p, s => s.replaceAll('dog', 'monkey')))
            .toBe('The quick brown fox jumps over the lazy monkey. If the monkey reacted, was it really lazy?');
        expect(ruby(p, s => s.replaceAll(/Dog/ig, 'ferret')))
            .toBe('The quick brown fox jumps over the lazy ferret. If the ferret reacted, was it really lazy?');
        const report = 'A hacker called ha.*er used special characters in their name to breach the system.';
        expect(ruby(report, s => s.replaceAll('ha.*er', '[REDACTED]')))
            .toBe('A hacker called [REDACTED] used special characters in their name to breach the system.');
        expect(ruby('xxx', s => s.replaceAll('', '_'))).toBe('_x_x_x_');
        expect(ruby('aabbcc', s => s.replaceAll('b', '.'))).toBe('aa..cc');
        expect(ruby('aabbcc', s => s.replace_all('b', '.'))).toBe('aa..cc');
        expect(ruby('aabbcc', s => s.replaceAll(/b/g, '.'))).toBe('aa..cc');
    });

    test('String#search', () => {
        const paragraph = 'The quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy?'
        expect(ruby(paragraph, s => s.search(/[^\w\s]/g))).toBe(43);
        expect(ruby('hey JudE', s => s.search(/[A-Z]/))).toBe(4);
        expect(ruby('hey JudE', s => s.search(/[.]/))).toBe(-1);
    });

    test('String#slice renamed to jsSlice', () => {
        const str = 'The quick brown fox jumps over the lazy dog.';
        expect(ruby(str, s => s.jsSlice(31))).toBe('the lazy dog.');
        expect(ruby(str, s => s.jsSlice(4, 19))).toBe('quick brown fox');
        expect(ruby(str, s => s.js_slice(4, 19))).toBe('quick brown fox');
        expect(ruby(str, s => s.jsSlice(-4))).toBe('dog.');
        expect(ruby(str, s => s.jsSlice(-9, -5))).toBe('lazy');
        const str1 = 'The morning is upon us.';
        expect(ruby(str1, s => s.jsSlice(1, 8))).toBe('he morn');
        expect(ruby(str1, s => s.jsSlice(4, -2))).toBe('morning is upon u');
        expect(ruby(str1, s => s.jsSlice(12))).toBe('is upon us.');
        expect(ruby(str1, s => s.jsSlice(30))).toBe('');
        expect(ruby(str1, s => s.jsSlice(-3))).toBe('us.');
        expect(ruby(str1, s => s.jsSlice(-3, -1))).toBe('us');
        expect(ruby(str1, s => s.jsSlice(0, -1))).toBe('The morning is upon us');
        expect(ruby(str1, s => s.jsSlice(4, -1))).toBe('morning is upon us');
        expect(ruby(str1, s => s.jsSlice(-11, 16))).toBe('is u');
        expect(ruby(str1, s => s.jsSlice(-5, -1))).toBe('n us');
    });

    test('String#split renamed to jsSplit', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
        const str = 'The quick brown fox jumps over the lazy dog.';
        ruby(str, s => {
            const words = s.jsSplit(' ');
            expect(words.at(3).toJS()).toBe('fox');
            const chars = s.jsSplit('');
            expect(chars.at(8).toJS()).toBe('k');
            expect(s.jsSplit().toJS()).toEqual([str]);
            return new RubyObject<Number>(0);
        });
        expect(ruby('😄😄', s => s.jsSplit(/(?:)/))).toStrictEqual(["\ud83d", "\ude04", "\ud83d", "\ude04"]);
        expect(ruby('😄😄', s => s.jsSplit(/(?:)/u))).toStrictEqual(["😄", "😄"]);
        expect(ruby('', s => s.jsSplit('a'))).toStrictEqual(['']);
        expect(ruby('', s => s.jsSplit(''))).toStrictEqual([]);
        expect(ruby('Hello World. How are you doing?', s => s.jsSplit(' ', 3))).toStrictEqual(["Hello", "World.", "How"]);
        expect(ruby('Hello World. How are you doing?', s => s.js_split(' ', 3))).toStrictEqual(["Hello", "World.", "How"]);
    });

    test('String#startsWith', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
        const str1 = 'Saturday night plans';
        expect(ruby(str1, s => s.startsWith('Sat'))).toBe(true);
        expect(ruby(str1, s => s.starts_with('Sat'))).toBe(true);
        expect(ruby(str1, s => s.startsWith('Sat', 3))).toBe(false);
        const str = 'To be, or not to be, that is the question.';
        expect(ruby(str, s => s.startsWith('To be'))).toBe(true);
        expect(ruby(str, s => s.startsWith('not to be'))).toBe(false);
        expect(ruby(str, s => s.startsWith('not to be', 10))).toBe(true);
    });

    test('String#substring', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring
        expect(ruby('Mozilla', s => s.substring(1, 3))).toBe('oz');
        expect(ruby('Mozilla', s => s.substring(2))).toBe('zilla');
        expect(ruby('Mozilla', s => s.substring(0, 1))).toBe('M');
        expect(ruby('Mozilla', s => s.substring(1, 0))).toBe('M');
        expect(ruby('Mozilla', s => s.substring(0, 6))).toBe('Mozill');
        expect(ruby('Mozilla', s => s.substring(4))).toBe('lla');
        expect(ruby('Mozilla', s => s.substring(4, 7))).toBe('lla');
        expect(ruby('Mozilla', s => s.substring(7, 4))).toBe('lla');
        expect(ruby('Mozilla', s => s.substring(0, 7))).toBe('Mozilla');
        expect(ruby('Mozilla', s => s.substring(0, 10))).toBe('Mozilla');
        expect(ruby('Mozilla', s => s.substring(-5, 2))).toBe('Mo');
        expect(ruby('Mozilla', s => s.substring(-5, -2))).toBe('');
    });

    test('String#toLocaleLowerCase', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase
        const dotted = 'İstanbul';
        expect(ruby(dotted, s => s.toLocaleLowerCase('en-US'))).toBe('i̇stanbul');
        expect(ruby(dotted, s => s.toLocaleLowerCase('tr'))).toBe('istanbul');
        expect(ruby('ALPHABET', s => s.toLocaleLowerCase())).toBe('alphabet');
        expect(ruby('ALPHABET', s => s.to_locale_lower_case())).toBe('alphabet');
        expect(ruby('\u0130', s => s.toLocaleLowerCase('tr'))).toBe('i');
        expect(ruby('\u0130', s => s.toLocaleLowerCase('en-US'))).not.toBe('i');
        const locales = ['tr', 'TR', 'tr-TR', 'tr-u-co-search', 'tr-x-turkish'];
        expect(ruby('\u0130', s => s.toLocaleLowerCase(locales))).toBe('i');
    });

    test('String#toLocaleUpperCase', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase
        const city = 'istanbul';
        expect(ruby(city, s => s.toLocaleUpperCase('en-US'))).toBe('ISTANBUL');
        expect(ruby(city, s => s.toLocaleUpperCase('TR'))).toBe('İSTANBUL');
        expect(ruby('alphabet', s => s.toLocaleUpperCase())).toBe('ALPHABET');
        expect(ruby('alphabet', s => s.to_locale_upper_case())).toBe('ALPHABET');
        expect(ruby('Gesäß', s => s.toLocaleUpperCase())).toBe('GESÄSS');
        expect(ruby('i\u0307', s => s.toLocaleUpperCase('lt-LT'))).toBe('I');
        const locales = ['lt', 'LT', 'lt-LT', 'lt-u-co-phonebk', 'lt-x-lietuva'];
        expect(ruby('i\u0307', s => s.toLocaleUpperCase(locales))).toBe('I');
    });

    test('String#toString', () => {
        expect(ruby('foo', s => s.toString())).toBe('foo');
        expect(ruby('foo', s => s.to_string())).toBe('foo');
        expect(ruby('foo', s => s.valueOf())).toBe('foo');
        expect(ruby('foo', s => s.value_of())).toBe('foo');
    });

    test('String#trim', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
        expect(ruby('   Hello world!   ', s => s.trim())).toBe('Hello world!');
        expect(ruby('   foo  ', s => s.trim())).toBe('foo');
    });

    test('String#trimEnd', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimEnd
        expect(ruby('   Hello world!   ', s => s.trimEnd())).toBe('   Hello world!');
        expect(ruby('   foo  ', s => s.trimEnd())).toBe('   foo');
        expect(ruby('   foo  ', s => s.trim_end())).toBe('   foo');
    });

    test('String#trimStart', () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimStart
        expect(ruby('   Hello world!   ', s => s.trimStart())).toBe('Hello world!   ');
        expect(ruby('   foo  ', s => s.trimStart())).toBe('foo  ');
        expect(ruby('   foo  ', s => s.trim_start())).toBe('foo  ');
    });
});
