
/**
 * <Buffer > Binary data type
 * @typedef {TypedArray} Buffer
 * @global
 * @example
 * <Buffer 5b ed 67 f9 9c b3 31 9e 0c 6f 6a 03 54 8b e3 c8 c5 2a 83 64 46 4f 88 6f> 24
 */

/**
 * Client password or passphrase.
 * @typedef {String} Password
 * @global
 * @example
 * "password0192837465DlK"
 */

/**
 * Hex-string
 * @typedef {String} HexString
 * @global
 * @example
 * "0x5bed67f99cb3319e0c6f6a03548be3c8c52a8364464f886f";
 */

/**
 * Hex-string or Buffer hash.
 * @typedef {(String|Buffer)} Hash
 * @global
 * @example
 * "0x5bed67f99cb3319e0c6f6a03548be3c8c52a8364464f886f" || <Buffer 5b ed 67 f9 9c b3 31 9e 0c 6f 6a 03 54 8b e3 c8 c5 2a 83 64 46 4f 88 6f> 24;
 */