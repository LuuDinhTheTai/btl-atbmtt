/**
 * MẬT MÃ MA TRẬN KHÓA PLAYFAIR
 * - Tạo ma trận 5x5 từ key (I/J gộp chung)
 * - Chia plaintext thành cặp 2 ký tự (thêm X nếu trùng hoặc lẻ)
 * - Mã hóa theo 3 quy tắc: cùng hàng, cùng cột, hình chữ nhật
 */

function createPlayfairMatrix(key) {
    const k = key.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    const used = new Set();
    const matrix = [];
    let chars = '';

    // Thêm key
    for (const ch of k) {
        if (!used.has(ch)) {
            used.add(ch);
            chars += ch;
        }
    }

    // Thêm các chữ cái còn lại
    for (let i = 0; i < 26; i++) {
        const ch = String.fromCharCode(65 + i);
        if (ch === 'J') continue; // bỏ J
        if (!used.has(ch)) {
            used.add(ch);
            chars += ch;
        }
    }

    // Tạo ma trận 5x5
    for (let i = 0; i < 5; i++) {
        matrix.push(chars.substring(i * 5, i * 5 + 5).split(''));
    }

    return matrix;
}

function findPosition(matrix, ch) {
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            if (matrix[r][c] === ch) return { row: r, col: c };
        }
    }
    return null;
}

function preparePlaintext(text) {
    let prepared = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    const pairs = [];
    let i = 0;

    while (i < prepared.length) {
        const first = prepared[i];
        let second;

        if (i + 1 >= prepared.length) {
            second = 'X';
            i += 1;
        } else if (prepared[i] === prepared[i + 1]) {
            second = 'X';
            i += 1;
        } else {
            second = prepared[i + 1];
            i += 2;
        }

        pairs.push([first, second]);
    }

    return pairs;
}

function playfairEncrypt(plaintext, key) {
    const matrix = createPlayfairMatrix(key);
    const pairs = preparePlaintext(plaintext);
    let result = '';
    const steps = [];

    for (const [a, b] of pairs) {
        const posA = findPosition(matrix, a);
        const posB = findPosition(matrix, b);
        let encA, encB, rule;

        if (posA.row === posB.row) {
            // Cùng hàng: dịch phải
            encA = matrix[posA.row][(posA.col + 1) % 5];
            encB = matrix[posB.row][(posB.col + 1) % 5];
            rule = 'Cùng hàng → dịch phải';
        } else if (posA.col === posB.col) {
            // Cùng cột: dịch xuống
            encA = matrix[(posA.row + 1) % 5][posA.col];
            encB = matrix[(posB.row + 1) % 5][posB.col];
            rule = 'Cùng cột → dịch xuống';
        } else {
            // Hình chữ nhật: đổi cột
            encA = matrix[posA.row][posB.col];
            encB = matrix[posB.row][posA.col];
            rule = 'Hình chữ nhật → đổi cột';
        }

        steps.push({
            pair: `${a}${b}`,
            posA: `(${posA.row},${posA.col})`,
            posB: `(${posB.row},${posB.col})`,
            rule: rule,
            result: `${encA}${encB}`
        });

        result += encA + encB;
    }

    return { result, steps, matrix, pairs };
}

function playfairDecrypt(ciphertext, key) {
    const matrix = createPlayfairMatrix(key);
    const text = ciphertext.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    const pairs = [];
    
    for (let i = 0; i < text.length; i += 2) {
        if (i + 1 < text.length) {
            pairs.push([text[i], text[i + 1]]);
        }
    }

    let result = '';
    const steps = [];

    for (const [a, b] of pairs) {
        const posA = findPosition(matrix, a);
        const posB = findPosition(matrix, b);
        let decA, decB, rule;

        if (posA.row === posB.row) {
            // Cùng hàng: dịch trái
            decA = matrix[posA.row][(posA.col - 1 + 5) % 5];
            decB = matrix[posB.row][(posB.col - 1 + 5) % 5];
            rule = 'Cùng hàng → dịch trái';
        } else if (posA.col === posB.col) {
            // Cùng cột: dịch lên
            decA = matrix[(posA.row - 1 + 5) % 5][posA.col];
            decB = matrix[(posB.row - 1 + 5) % 5][posB.col];
            rule = 'Cùng cột → dịch lên';
        } else {
            // Hình chữ nhật: đổi cột
            decA = matrix[posA.row][posB.col];
            decB = matrix[posB.row][posA.col];
            rule = 'Hình chữ nhật → đổi cột';
        }

        steps.push({
            pair: `${a}${b}`,
            posA: `(${posA.row},${posA.col})`,
            posB: `(${posB.row},${posB.col})`,
            rule: rule,
            result: `${decA}${decB}`
        });

        result += decA + decB;
    }

    return { result, steps, matrix, pairs };
}
