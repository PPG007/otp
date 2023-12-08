import jsSHA from 'jssha';
const totp = (options) => {
    const now = Date.now() / 1000;
    return generatePassword({
        algorithm: options.algorithm,
        digits: options.digits,
        secret: options.secret,
    }, Math.floor(now / (options.period || 30)));
};
const hotp = (options) => {
    return generatePassword({
        secret: options.secret,
        algorithm: options.algorithm,
        digits: options.digits
    }, options.counter || 0);
};
const generatePassword = (options, counter) => {
    const hexSecret = base32ToHex(options.secret);
    const algorithm = options.algorithm || 'SHA-1';
    const digits = options.digits || 6;
    const sha = new jsSHA(algorithm, 'HEX');
    sha.setHMACKey(hexSecret, 'HEX');
    sha.update(leftPad(numberToHex(counter), 16, '0'));
    const hmac = sha.getHMAC('HEX');
    const offset = hexToNumber(hmac.substring(hmac.length - 1));
    let otp = (hexToNumber(hmac.substr(offset * 2, 8)) & hexToNumber('7fffffff')) + '';
    return otp.substr(Math.max(otp.length - digits, 0), digits);
};
const hexToNumber = (hex) => {
    return parseInt(hex, 16);
};
const numberToHex = (n) => {
    return (n < 15.5 ? '0' : '') + Math.round(n).toString(16);
};
const base32ToHex = (base32) => {
    const base32Charts = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    let hex = '';
    base32 = base32.replace(/=+$/, '');
    for (let i = 0; i < base32.length; i++) {
        const val = base32Charts.indexOf(base32.charAt(i).toUpperCase());
        if (val === -1) {
            throw new Error('Invalid base32 string');
        }
        bits += leftPad(val.toString(2), 5, '0');
    }
    for (let i = 0; i + 8 <= bits.length; i += 8) {
        const chunk = bits.substring(i, i + 8);
        hex = hex + leftPad(parseInt(chunk, 2).toString(16), 2, '0');
    }
    return hex;
};
const leftPad = (str, len, pad) => {
    if (len + 1 >= str.length) {
        str = Array(len + 1 - str.length).join(pad) + str;
    }
    return str;
};
const signURL = (option) => {
    const query = new URLSearchParams();
    query.set('secret', option.secret);
    query.set('digits', `${option.digits || 6}`);
    if (option.issuer) {
        query.set('issuer', option.issuer);
    }
    if (option.type === 'totp') {
        query.set('period', `${option.period || 30}`);
    }
    else {
        query.set('counter', `${option.counter || 0}`);
    }
    const algorithm = option.algorithm || 'SHA-1';
    query.set('algorithm', algorithm.replace('-', '').toLowerCase());
    const url = new URL(`otpauth://${option.type}/${encodeURIComponent(option.label || 'user')}`);
    url.search = query.toString();
    return url.toString();
};
export { totp, hotp, signURL };
