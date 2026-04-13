/**
 * MÃ HÓA CHỮ ĐƠN (Simple Substitution Cipher)
 * Key: bảng thay thế 26 ký tự (hoán vị của bảng chữ cái)
 * Mã hóa: C = Key[index(M)]
 * Giải mã: M = reverseKey[index(C)]
 */

function substitutionEncrypt(plaintext, key) {
    const text = plaintext.toUpperCase().replace(/[^A-Z]/g, '');
    const k = key.toUpperCase().replace(/[^A-Z]/g, '');

    if (k.length !== 26) {
        return { result: '', steps: [], error: 'Khóa phải có đúng 26 ký tự (hoán vị bảng chữ cái)' };
    }

    let result = '';
    const steps = [];

    for (let i = 0; i < text.length; i++) {
        const pChar = text[i];
        const idx = pChar.charCodeAt(0) - 65;
        const encrypted = k[idx];

        steps.push({
            index: i,
            plainChar: pChar,
            position: idx,
            result: encrypted,
            formula: `${pChar}(${idx}) → ${encrypted}`
        });

        result += encrypted;
    }

    return { result, steps, key: k };
}

function substitutionDecrypt(ciphertext, key) {
    const text = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
    const k = key.toUpperCase().replace(/[^A-Z]/g, '');

    if (k.length !== 26) {
        return { result: '', steps: [], error: 'Khóa phải có đúng 26 ký tự (hoán vị bảng chữ cái)' };
    }

    // Tạo reverse key
    const reverseKey = new Array(26);
    for (let i = 0; i < 26; i++) {
        const idx = k[i].charCodeAt(0) - 65;
        reverseKey[idx] = String.fromCharCode(i + 65);
    }

    let result = '';
    const steps = [];

    for (let i = 0; i < text.length; i++) {
        const cChar = text[i];
        const idx = cChar.charCodeAt(0) - 65;
        const decrypted = reverseKey[idx];

        steps.push({
            index: i,
            cipherChar: cChar,
            position: idx,
            result: decrypted,
            formula: `${cChar}(${idx}) → ${decrypted}`
        });

        result += decrypted;
    }

    return { result, steps, key: k };
}
