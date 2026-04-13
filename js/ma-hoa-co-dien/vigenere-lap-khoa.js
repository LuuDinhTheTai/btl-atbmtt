/**
 * MẬT MÃ VIGENERE – LẶP KHÓA
 * Khóa được lặp lại cho đủ chiều dài bản rõ
 * Mã hóa: C_i = (M_i + K_i) mod 26
 * Giải mã: M_i = (C_i - K_i + 26) mod 26
 */

function vigenereRepeatEncrypt(plaintext, key) {
    const text = plaintext.toUpperCase().replace(/[^A-Z]/g, '');
    const k = key.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (k.length === 0) return { result: '', steps: [], fullKey: '' };

    let result = '';
    const steps = [];
    let fullKey = '';

    for (let i = 0; i < text.length; i++) {
        const pChar = text[i];
        const kChar = k[i % k.length];
        fullKey += kChar;

        const p = pChar.charCodeAt(0) - 65;
        const kv = kChar.charCodeAt(0) - 65;
        const c = (p + kv) % 26;
        const encrypted = String.fromCharCode(c + 65);

        steps.push({
            index: i,
            plainChar: pChar,
            keyChar: kChar,
            pValue: p,
            kValue: kv,
            cValue: c,
            result: encrypted,
            formula: `(${p} + ${kv}) mod 26 = ${c}`
        });

        result += encrypted;
    }

    return { result, steps, fullKey };
}

function vigenereRepeatDecrypt(ciphertext, key) {
    const text = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
    const k = key.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (k.length === 0) return { result: '', steps: [], fullKey: '' };

    let result = '';
    const steps = [];
    let fullKey = '';

    for (let i = 0; i < text.length; i++) {
        const cChar = text[i];
        const kChar = k[i % k.length];
        fullKey += kChar;

        const c = cChar.charCodeAt(0) - 65;
        const kv = kChar.charCodeAt(0) - 65;
        const p = (c - kv + 26) % 26;
        const decrypted = String.fromCharCode(p + 65);

        steps.push({
            index: i,
            cipherChar: cChar,
            keyChar: kChar,
            cValue: c,
            kValue: kv,
            pValue: p,
            result: decrypted,
            formula: `(${c} - ${kv} + 26) mod 26 = ${p}`
        });

        result += decrypted;
    }

    return { result, steps, fullKey };
}
