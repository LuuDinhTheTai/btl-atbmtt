/**
 * MẬT MÃ VIGENERE – AUTOKEY
 * Key stream = Key ban đầu + plaintext (dùng chính bản rõ để mở rộng khóa)
 * Mã hóa: C_i = (M_i + K_i) mod 26
 * Giải mã: M_i = (C_i - K_i + 26) mod 26, sau đó dùng M_i làm key tiếp theo
 */

function vigenereAutokeyEncrypt(plaintext, key) {
    const text = plaintext.toUpperCase().replace(/[^A-Z]/g, '');
    const k = key.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (k.length === 0) return { result: '', steps: [], fullKey: '' };

    let result = '';
    const steps = [];
    // Key stream: bắt đầu bằng key, sau đó nối thêm plaintext
    let keyStream = k;

    for (let i = 0; i < text.length; i++) {
        // Mở rộng key stream bằng plaintext nếu cần
        if (i >= keyStream.length) {
            keyStream += text[i - k.length]; 
        }
        // Thực ra cách đúng: keyStream = key + plaintext
        // keyStream[i] = key[i] nếu i < key.length, ngược lại = plaintext[i - key.length]
    }

    // Reset và tính lại đúng
    keyStream = '';
    for (let i = 0; i < text.length; i++) {
        let kChar;
        if (i < k.length) {
            kChar = k[i];
        } else {
            kChar = text[i - k.length];
        }
        keyStream += kChar;

        const pChar = text[i];
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

    return { result, steps, fullKey: keyStream };
}

function vigenereAutokeyDecrypt(ciphertext, key) {
    const text = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
    const k = key.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (k.length === 0) return { result: '', steps: [], fullKey: '' };

    let result = '';
    const steps = [];
    let keyStream = '';

    for (let i = 0; i < text.length; i++) {
        let kChar;
        if (i < k.length) {
            kChar = k[i];
        } else {
            // Dùng plaintext đã giải mã trước đó
            kChar = result[i - k.length];
        }
        keyStream += kChar;

        const cChar = text[i];
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

    return { result, steps, fullKey: keyStream };
}
