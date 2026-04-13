/**
 * MẬT MÃ HOÁN VỊ (Columnar Transposition Cipher)
 * Key: dãy số xác định thứ tự các cột
 * Mã hóa: viết plaintext theo hàng, đọc theo thứ tự cột
 * Giải mã: ngược lại
 */

function transpositionEncrypt(plaintext, key) {
    const text = plaintext.toUpperCase().replace(/[^A-Z]/g, '');
    const keyArr = key.toString().split('').map(Number);
    const numCols = keyArr.length;
    const numRows = Math.ceil(text.length / numCols);

    // Tạo bảng
    const table = [];
    let idx = 0;
    for (let r = 0; r < numRows; r++) {
        const row = [];
        for (let c = 0; c < numCols; c++) {
            if (idx < text.length) {
                row.push(text[idx]);
                idx++;
            } else {
                row.push('');
            }
        }
        table.push(row);
    }

    // Đọc theo thứ tự cột (key)
    let result = '';
    const columnOrder = [];
    
    for (let order = 1; order <= numCols; order++) {
        const colIdx = keyArr.indexOf(order);
        let colStr = '';
        for (let r = 0; r < numRows; r++) {
            if (table[r][colIdx]) {
                colStr += table[r][colIdx];
            }
        }
        columnOrder.push({
            order: order,
            colIndex: colIdx,
            chars: colStr
        });
        result += colStr;
    }

    return { result, table, keyArr, columnOrder, numRows, numCols };
}

function transpositionDecrypt(ciphertext, key) {
    const text = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
    const keyArr = key.toString().split('').map(Number);
    const numCols = keyArr.length;
    const numRows = Math.ceil(text.length / numCols);
    const totalCells = numRows * numCols;
    const emptyCount = totalCells - text.length;

    // Tính số ký tự mỗi cột
    const colLengths = new Array(numCols).fill(numRows);
    // Các cột có thứ tự lớn nhất bị thiếu ký tự
    const sortedCols = keyArr.map((val, idx) => ({ val, idx }))
        .sort((a, b) => a.val - b.val);
    
    // Các cột cuối cùng (theo vị trí gốc) bị thiếu
    for (let i = 0; i < emptyCount; i++) {
        const colOrigIdx = numCols - 1 - i;
        colLengths[colOrigIdx] = numRows - 1;
    }

    // Chia ciphertext vào từng cột theo thứ tự key
    const columns = new Array(numCols);
    let pos = 0;
    for (let order = 1; order <= numCols; order++) {
        const colIdx = keyArr.indexOf(order);
        const len = colLengths[colIdx];
        columns[colIdx] = text.substring(pos, pos + len).split('');
        pos += len;
    }

    // Đọc theo hàng
    let result = '';
    const table = [];
    for (let r = 0; r < numRows; r++) {
        const row = [];
        for (let c = 0; c < numCols; c++) {
            if (r < columns[c].length) {
                row.push(columns[c][r]);
                result += columns[c][r];
            } else {
                row.push('');
            }
        }
        table.push(row);
    }

    return { result, table, keyArr, numRows, numCols };
}
