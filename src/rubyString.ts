import RubyObject from './rubyObject.js';
import RubyNumber from "./rubyNumber.js";
import RubyArray from "./rubyArray.js";
import RubyUndefined from "./rubyUndefined.js";
import RubyBoolean from "./rubyBoolean.js";
import RubyNil from "./rubyNil.js";
import RubyRegExpMatchArray from "./rubyRegExpMatchArray.js";
import RubyEnumerable from "./rubyEnumerable.js";
import CharacterSelectors from "./util/characterSelectors.js";

class RubyString extends RubyObject<string> {
    /**
     * Returns a string containing the characters in self;
     * the first character is upcased; the remaining characters are downcased
     */
    capitalize():RubyString {
        if (this.js.length == 0) return this;
        let firstCharCap = this.js.charAt(0).toUpperCase();
        if (firstCharCap.length > 1) {
            firstCharCap = firstCharCap.charAt(0) + firstCharCap.slice(1).toLowerCase();
        }
        this.js = firstCharCap + this.js.slice(1).toLowerCase();
        return this;
    }

    /**
     * Compares self.downcase and other_string.downcase; returns:
     *
     * -1 if other_string.downcase is larger.
     * 0 if the two are equal.
     * 1 if other_string.downcase is smaller.
     * @param other The other string to compare with.
     */
    casecmp(other: string): RubyNumber {
        const thisLowerCase = this.js.toLowerCase();
        const otherLowerCase = other.toLowerCase();
        if (thisLowerCase === otherLowerCase) return new RubyNumber(0);
        return thisLowerCase < otherLowerCase ? new RubyNumber(-1) : new RubyNumber(1);
    }

    center(size:number|string, padString = ' '):RubyString {
        if (typeof(size) === 'string') {
            size = parseInt(size);
        }
        size = Math.floor(size);
        if (isNaN(size)){
            throw new TypeError(`Cannot convert ${size} to number.`);
        }
        if (size <= this.js.length) {
            this.js = this.js.slice();
            return this;
        }
        const padSize = size - this.js.length;
        const leftPadSize = Math.floor(padSize / 2);
        this.js = this.js.padStart(leftPadSize + this.js.length, padString).padEnd(size, padString);
        return this;
    }

    chars(func: (elm: RubyString) => void):RubyString;
    chars(): RubyArray<string>
    chars(func?: ((elm: RubyString) => symbol | void)):RubyArray<string>|RubyString {
        const rubyArray = new RubyArray<string>([...this.js]);
        if (!func) {
            return rubyArray;
        }
        rubyArray.each(func);
        return this;
    }

    /**
     * Returns a new string copied from self, with trailing characters possibly removed:
     * When line_sep is "\n", removes the last one or two characters if they are "\r", "\n", or "\r\n" (but not "\n\r"):
     */
    chomp(line_sep :string = '\n'):RubyString {
        let result;
        if (line_sep === '\n') {
            // default ('\n') chomp \r\n and \n and \r
            result = this.js.replace(/(\r?\n|\r)$/, '');
        } else if (line_sep === '') {
            // When line_sep is '', removes multiple trailing occurrences of "\n" or "\r\n" (but not "\r" or "\n\r")
            result = this.js.replace(/(\r?\n)+$/, '');
        } else {
            if (this.js.endsWith(line_sep)) {
                result = this.js.slice(0, -line_sep.length);
            } else {
                result = this.js.repeat(1);
            }
        }
        return new RubyString(result);
    }

    /**
     * Returns a new string copied from self, with trailing characters possibly removed.
     * Removes "\r\n" if those are the last two characters.
     */
    chop():RubyString {
        if (this.js.length === 0) return new RubyString(this.js);
        if (this.js.endsWith('\r\n')) {
            return new RubyString(this.js.slice(0, -2));
        }
        return new RubyString(this.js.slice(0, -1));
    }

    /**
     * Returns a string containing the first character of self
     */
    chr() {
        return this.js.length === 0 ? new RubyString('') : new RubyString(this.js[0]);
    }

    /**
     * Removes the contents of self
     */
    clear():RubyString {
        this.js = '';
        return this;
    }

    /**
     * Returns an array of the codepoints in self; each codepoint is the integer value for a character
     */
    codepoints():RubyArray<number> {
        let result:Array<number> = [];
        for (let i = 0; i < this.js.length; i++) {
            // JS String#codePointAt return undefined only i is out of range.
            const codepoint = this.js.codePointAt(i);
            if (codepoint !== undefined) result.push(codepoint);
        }
        return new RubyArray<number>(result);
    }

    /**
     * Concatenates each object in objects to self and returns self:
     * For each given object object that is an Integer, the value is considered a codepoint and converted to a
     * character before concatenation:
     * @param strings
     */
    concat(...strings: Array<string|number>):RubyString {
        strings = strings.map(element => {
            if (typeof(element) === 'number') {
                element = String.fromCharCode(element);
            }
            return element;
        })
        this.js += strings.join('');
        return this;
    }

    /**
     * Returns the total number of characters in self that are specified by the given selectors
     * @see characterSelectors
     */
    count(...selectors: Array<string>):RubyNumber {
        if (selectors === undefined || selectors.length === 0) {
            throw new Error('wrong number of arguments (given 0, expected 1+)');
        }
        const filters = selectors.map(selector => new CharacterSelectors(selector));
        const result = [...this.js].filter(char => filters.every(filter => filter.match(char))).length;
        return new RubyNumber(result);
    }

    /**
     * Returns a copy of self with characters specified by selectors removed
     */
    delete(...selectors: Array<string>):RubyString {
        if (selectors === undefined || selectors.length === 0) {
            throw new Error('wrong number of arguments (given 0, expected 1+)');
        }
        const filters = selectors.map(selector => new CharacterSelectors(selector));
        const result = [...this.js].filter(char => !filters.every(filter => filter.match(char))).join('');
        return new RubyString(result);
    }

    /**
     * Returns a copy of self with leading substring prefix removed
     */
    deletePrefix(prefix:string): RubyString {
        if (!this.js.startsWith(prefix)) return new RubyString(this.js);
        return new RubyString(this.js.slice(prefix.length));
    }
    delete_prefix = this.deletePrefix;

    /**
     * Returns a copy of self with trailing substring suffix removed
     */
    deleteSuffix(suffix:string): RubyString {
        if (suffix.length === 0 || !this.js.endsWith(suffix)) return new RubyString(this.js);
        return new RubyString(this.js.slice(0, -suffix.length));
    }
    delete_suffix = this.deleteSuffix;

    downcase():RubyString {
        const result = this.js.toLowerCase();
        return new RubyString(result);
    }

    /*
     * Returns true if the length of self is zero, false otherwise
     */
    empty():RubyBoolean {
        const result = this.js.length === 0;
        return new RubyBoolean(result);
    }
    isEmpty = this.empty;

    /**
     * Returns whether self ends with any of the given strings.
     * Returns true if any given string matches the end, false otherwise:
     */
    endWith(...strings: Array<string>): RubyBoolean {
        const result = strings.some(str => this.js.endsWith(str));
        return new RubyBoolean(result);
    }
    end_with = this.endWith;
    isEndWith = this.endWith;

    include(otherString:string):RubyBoolean {
        const result = this.js.includes(otherString);
        return new RubyBoolean(result);
    }
    isInclude = this.include;

    lstrip():RubyString {
        const result = this.js.trimStart();
        return new RubyString(result);
    }

    rstrip():RubyString {
        const result = this.js.trimEnd();
        return new RubyString(result);
    }

    /**
     * Returns whether self starts with any of the given string_or_regexp.
     * Matches patterns against the beginning of self
     * @return true if any pattern matches the beginning, false otherwise
     */
    startWith(...stringOrRegExps: Array<string|RegExp>): RubyBoolean {
        const result = stringOrRegExps.some(stringOrRegExp => {
            if (typeof(stringOrRegExp) === 'string') {
                return this.js.startsWith(stringOrRegExp);
            } else { // RegExp, add ^ to the beginning
                const startRegExp = new RegExp(`^${stringOrRegExp.source}`, stringOrRegExp.flags);
                return startRegExp.test(this.js);
            }
        });
        return new RubyBoolean(result);
    }
    start_with = this.startWith;
    isStartWith = this.startWith;

    strip():RubyString {
        const result = this.js.trim();
        return new RubyString(result);
    }

    squeeze(...selectors : Array<string>):RubyString {
        if (selectors === undefined) {
            selectors = [];
        }
        const filters = selectors.map(selector => new CharacterSelectors(selector));
        const result = [...this.js].filter((char, index, array) => {
            if (index === 0) return true;
            return char !== array[index - 1] || !filters.every(filter => filter.match(char));
        }).join('');
        return new RubyString(result);
    }

    /**
     * Returns a copy of self with each character specified by string selector translated to the corresponding
     * character in string replacements. The correspondence is positional:
     *
     * Each occurrence of the first character specified by selector is translated to the first character
     * in replacements.
     *
     * Each occurrence of the second character specified by selector is translated to the second character
     * in replacements.
     *
     * And so on.
     */
    tr(selector:string, replacement:string):RubyString {
        const selectorCs = new CharacterSelectors(selector);
        const replacementCs = new CharacterSelectors(replacement);
        const replacementChars = [...new CharacterSelectors(replacement)];
        if (selectorCs.negation) {
            const lastCharOfReplacement = replacementChars[replacementChars.length - 1];
            const result = [...this.js].map(c => selectorCs.match(c) ? lastCharOfReplacement : c).join('');
            return new RubyString(result);
        }

        const selectorChars = [...new CharacterSelectors(selector)]
        const zipArray: Array<[string, string]> = selectorChars.map((char, index) => {
            if (index < replacementChars.length) {
                return [char, replacementChars[index]];
            } else {
                return [char, replacementChars[replacementChars.length - 1]];
            }
        });
        const trMap:Map<string, string> = new Map(zipArray);
        const result = [...this.js].map(c => trMap.get(c) || c).join('');
        return new RubyString(result);
    }

    /**
     * Like String#tr, but also squeezes the modified portions of the translated string; returns a new string
     * (translated and squeezed).
     */
    trS(selector:string, replacement:string):RubyString {
        const selectorCs = new CharacterSelectors(selector);
        const replacementCs = new CharacterSelectors(replacement);
        const replacementChars = [...new CharacterSelectors(replacement)];
        let lastCharOfReplacement = '';
        let trMap:Map<string, string> = new Map();
        if (selectorCs.negation) {
            lastCharOfReplacement = replacementChars[replacementChars.length - 1];
        } else {
            const selectorChars = [...new CharacterSelectors(selector)]
            const zipArray: Array<[string, string]> = selectorChars.map((char, index) => {
                if (index < replacementChars.length) {
                    return [char, replacementChars[index]];
                } else {
                    return [char, replacementChars[replacementChars.length - 1]];
                }
            });
            trMap = new Map(zipArray);
        }

        let inMatch = false;
        let lastReplacement = '';
        const resultArray: Array<string> = [];
        for (const char of this.js) {
            if (selectorCs.match(char)) {
                const replaceChar = selectorCs.negation ? lastCharOfReplacement : trMap.get(char) || char;
                if (inMatch) {
                    if (replaceChar !== lastReplacement) {
                        resultArray.push(replaceChar);
                        lastReplacement = replaceChar;
                    }
                } else { // first char of potention replace group
                    resultArray.push(replaceChar);
                    lastReplacement = replaceChar;
                    inMatch = true;
                }
            } else {
                resultArray.push(char);
                inMatch = false;
            }
        }
        return new RubyString(resultArray.join(''));
    }
    tr_s = this.trS;

    toS():RubyString {
        return new RubyString(this.js);
    }
    to_s = this.toS;
    toStr = this.toS;
    to_str = this.toS;

    upcase():RubyString {
        const result = this.js.toUpperCase();
        return new RubyString(result);
    }

    // delegate properties and methods to string
    get length() {
        const result = this.js.length;
        return new RubyNumber(result);
    }

    at(index:number):RubyString|RubyObject<undefined> {
        const result = this.js.at(index);
        if (result === undefined) {
            return new RubyUndefined;
        } else {
            return new RubyString(result);
        }
    }

    charAt(index = 0):RubyString {
        const result = this.js.charAt(index);
        return new RubyString(result);
    }
    char_at = this.charAt;

    charCodeAt(index = 0):RubyNumber {
        const result = this.js.charCodeAt(index);
        return new RubyNumber(result);
    }
    char_code_at = this.charCodeAt;

    codePointAt(pos:number):RubyNumber|RubyUndefined {
        const result = this.js.codePointAt(pos);
        if (result === undefined) {
            return new RubyUndefined;
        } else {
            return new RubyNumber(result);
        }
    }
    code_point_at = this.codePointAt;

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
     */
    endsWith(searchString:string, position?:number):RubyBoolean {
        const result = this.js.endsWith(searchString, position);
        return new RubyBoolean(result);
    }
    ends_with = this.endsWith;

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/concat
     */
    jsConcat(...strings: Array<any>):RubyString {
        const result = this.js.concat(...strings);
        return new RubyString(result);
    }
    js_concat = this.jsConcat;

    /**
     * This method lets you determine whether or not a string includes another string.
     * @param searchString A string to be searched for within str. Cannot be a regex. All values that are not regexes
     *  are coerced to strings, so omitting it or passing undefined causes includes() to search for the string
     *  "undefined", which is rarely what you want.
     * @param position The position within the string at which to begin searching for searchString. (Defaults to 0.)
     */
    includes(searchString:string, position = 0):RubyBoolean {
        const result = this.js.includes(searchString, position);
        return new RubyBoolean(result);
    }

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf
     */
    indexOf(searchString:string, position = 0):RubyNumber {
        const result = this.js.indexOf(searchString, position);
        return new RubyNumber(result);
    }
    index_of = this.indexOf;

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf
     */
    lastIndexOf(searchString:string, position?:number):RubyNumber {
        const result = this.js.lastIndexOf(searchString, position);
        return new RubyNumber(result);
    }
    last_index_of = this.lastIndexOf;

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
     */
    localeCompare(compareString:string, locales?: string, options?: Intl.CollatorOptions):RubyNumber {
        const result = this.js.localeCompare(compareString, locales, options);
        return new RubyNumber(result);
    }
    locale_compare = this.localeCompare;

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
     */
    jsMatch(matcher: {[Symbol.match](string: string): RegExpMatchArray | null; }): RubyRegExpMatchArray | RubyNil {
        const result = this.js.match(matcher);
        return result === null ? new RubyNil() : new RubyRegExpMatchArray(result);
    }
    js_match = this.jsMatch;

    /**
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll
     */
    matchAll(regexp: RegExp): RubyEnumerable<RegExpMatchArray> {
        const result = this.js.matchAll(regexp);
        return new RubyEnumerable(result);
    }
    match_all = this.matchAll;

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
     */
    normalize(form?: 'NFC' | 'NFD' | 'NFKC' | 'NFKD'):RubyString {
        const result = this.js.normalize(form);
        return new RubyString(result);
    }

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd
     */
    padEnd(targetLength: number, padString?: string): RubyString {
        const result = this.js.padEnd(targetLength, padString);
        return new RubyString(result);
    }
    pad_end = this.padEnd;

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
     */
    padStart(targetLength: number, padString?: string): RubyString {
        const result = this.js.padStart(targetLength, padString);
        return new RubyString(result);
    }
    pad_start = this.padStart;

    /**
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
     */
    repeat(count:number): RubyString {
        const result = this.js.repeat(count);
        return new RubyString(result);
    }

    /**
     * Since Ruby String#replace has different behavior than JavaScript String#replace,
     * JavaScript String#replace is delegated by String#jsReplace.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
     */
    jsReplace(pattern: string | RegExp, replaceValue: string | ((substring: string, ...args: any[]) => string)): RubyString {
        // TypeScript bug?
        const result = typeof(replaceValue) === 'string' ?
            this.js.replace(pattern, replaceValue) : this.js.replace(pattern, replaceValue);
        return new RubyString(result);
    }
    js_replace = this.jsReplace;

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll
     */
    replaceAll(searchValue: string | RegExp, replaceValue: string | ((substring: string, ...args: any[]) => string)): RubyString {
        // TypeScript bug?
        const result = typeof(replaceValue) === 'string' ?
            this.js.replaceAll(searchValue, replaceValue) : this.js.replaceAll(searchValue, replaceValue);
        return new RubyString(result);
    }
    replace_all = this.replaceAll;

    /**
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search
     */
    search(regexp: string | RegExp): RubyNumber {
        const result = this.js.search(regexp);
        return new RubyNumber(result);
    }

    /**
     * Since Ruby String#slice has different behavior than JavaScript String#slice,
     * JavaScript String#slice is delegated by String#jsSlice.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice
     */
    jsSlice(indexStart: number, indexEnd?: number): RubyString {
        const result = this.js.slice(indexStart, indexEnd);
        return new RubyString(result);
    }
    js_slice = this.jsSlice;

    /**
     * Since Ruby String#split has different behavior than JavaScript String#split,
     * JavaScript String#split is delegated by String#jsSplit.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
     */
    jsSplit(separator?: string | RegExp, limit?: number): RubyArray<string> {
        // Actually, String#split can be called without arguments.
        // @ts-ignore
        const result = this.js.split(separator, limit);
        return new RubyArray(result);
    }
    js_split = this.jsSplit;

    /**
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
     */
    startsWith(searchString:string, position?:number):RubyBoolean {
        const result = this.js.startsWith(searchString, position);
        return new RubyBoolean(result);
    }
    starts_with = this.startsWith;

    /**
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring
     */
    substring(indexStart: number, indexEnd?: number): RubyString {
        const result = this.js.substring(indexStart, indexEnd);
        return new RubyString(result);
    }

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase
     */
    toLocaleLowerCase(locales?: string | string[]): RubyString {
        const result = this.js.toLocaleLowerCase(locales)
        return new RubyString(result);
    }
    to_locale_lower_case = this.toLocaleLowerCase;

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase
     */
    toLocaleUpperCase(locales?: string | string[]): RubyString {
        const result = this.js.toLocaleUpperCase(locales);
        return new RubyString(result);
    }
    to_locale_upper_case = this.toLocaleUpperCase;

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase
     */
    toLowerCase = this.downcase;
    to_lower_case = this.downcase;

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toString
     */
    toString = this.toS;
    to_string = this.toS;

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase
     */
    toUpperCase = this.upcase;
    to_upper_case = this.upcase;

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
     */
    trim = this.strip;

    /**
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimEnd
     */
    trimEnd = this.rstrip;
    trim_end = this.rstrip;

    /**
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimStart
     */
    trimStart = this.lstrip;
    trim_start = this.lstrip;

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/valueOf
     */
    valueOf = this.toS;
    value_of = this.toS;

    // static delegation methods

    /**
     * static method returns a string created from the specified sequence of UTF-16 code units.
     */
    static fromCharCode(...charCodes: Array<number>):RubyString {
        const result = String.fromCharCode(...charCodes);
        return new RubyString(result);
    }
    static from_char_code = this.fromCharCode;

    /**
     * static method returns a string created by using the specified sequence of code points.
     */
    static fromCodePoint(...codePoints: Array<number>):RubyString {
        const result = String.fromCodePoint(...codePoints);
        return new RubyString(result);
    }
    static from_code_point = this.fromCodePoint;
}

export default RubyString;
