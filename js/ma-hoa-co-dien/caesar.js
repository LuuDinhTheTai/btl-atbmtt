/**
 * MẬT MÃ CAESAR
 * Mã hóa: C = (M + K) mod 26
 * Giải mã: M = (C - K + 26) mod 26
 */

function caesarEncrypt(plaintext, key) {
    const k = ((key % 26) + 26) % 26;
    let result = '';
    const steps = [];

    for (let i = 0; i < plaintext.length; i++) {
        const ch = plaintext[i].toUpperCase();
        if (ch >= 'A' && ch <= 'Z') {
            const p = ch.charCodeAt(0) - 65;
            const c = (p + k) % 26;
            const encrypted = String.fromCharCode(c + 65);
            steps.push({
                char: ch,
                value: p,
                shifted: c,
                result: encrypted,
                formula: `(${p} + ${k}) mod 26 = ${c}`
            });
            result += encrypted;
        } else {
            result += ch;
        }
    }

    return { result, steps, key: k };
}

function caesarDecrypt(ciphertext, key) {
    const k = ((key % 26) + 26) % 26;
    let result = '';
    const steps = [];

    for (let i = 0; i < ciphertext.length; i++) {
        const ch = ciphertext[i].toUpperCase();
        if (ch >= 'A' && ch <= 'Z') {
            const c = ch.charCodeAt(0) - 65;
            const p = (c - k + 26) % 26;
            const decrypted = String.fromCharCode(p + 65);
            steps.push({
                char: ch,
                value: c,
                shifted: p,
                result: decrypted,
                formula: `(${c} - ${k} + 26) mod 26 = ${p}`
            });
            result += decrypted;
        } else {
            result += ch;
        }
    }

    return { result, steps, key: k };
}
