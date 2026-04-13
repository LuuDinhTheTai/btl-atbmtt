/**
 * THUẬT TOÁN RSA - BÀI TOÁN 1
 * 
 * Input: p, q (hai số nguyên tố), e (khóa công khai)
 * Output:
 *   a) PU = {e, n}  (khóa công khai)
 *   b) PR = {d, n}  (khóa bí mật)
 *   c) Mã hóa: C = M^e mod n
 *   d) Giải mã: M' = C^d mod n
 * 
 * Bài toán 1: An (người A) mã hóa, Ba (người B) giải mã
 */

/* ─────────────────────────────────────────
   Các hàm toán học phụ trợ (BigInt)
   ───────────────────────────────────────── */

/**
 * GCD dùng BigInt
 */
function rsaGCD(a, b) {
    a = a < 0n ? -a : a;
    b = b < 0n ? -b : b;
    while (b !== 0n) {
        [a, b] = [b, a % b];
    }
    return a;
}

/**
 * Extended Euclidean Algorithm dùng BigInt
 * Trả về { gcd, x, y } sao cho a*x + b*y = gcd
 */
function rsaExtGCD(a, b) {
    const steps = [];
    let r0 = a, r1 = b;
    let x0 = 1n, x1 = 0n;
    let y0 = 0n, y1 = 1n;

    steps.push({ r: r0, q: '-', x: x0, y: y0 });
    steps.push({ r: r1, q: '-', x: x1, y: y1 });

    while (r1 !== 0n) {
        const q = r0 / r1;
        const rNew = r0 - q * r1;
        const xNew = x0 - q * x1;
        const yNew = y0 - q * y1;

        steps.push({
            r: rNew, q, x: xNew, y: yNew,
            formula: `r=${r0}-${q}×${r1}=${rNew}, x=${x0}-${q}×${x1}=${xNew}`
        });

        r0 = r1; r1 = rNew;
        x0 = x1; x1 = xNew;
        y0 = y1; y1 = yNew;
    }

    return { gcd: r0, x: x0, y: y0, steps };
}

/**
 * Modular inverse: a^(-1) mod n dùng BigInt
 */
function rsaModInverse(a, n) {
    const result = rsaExtGCD(a, n);
    if (result.gcd !== 1n) return { inverse: null, steps: result.steps };
    return {
        inverse: ((result.x % n) + n) % n,
        rawX: result.x,
        steps: result.steps
    };
}

/**
 * Modular exponentiation: base^exp mod mod (square-and-multiply)
 * BigInt version
 */
function rsaModPow(base, exp, mod) {
    if (mod === 1n) return 0n;
    let result = 1n;
    base = ((base % mod) + mod) % mod;
    const steps = [];

    // Chuyển exp sang dạng nhị phân
    const bits = exp.toString(2);

    for (let i = 0; i < bits.length; i++) {
        result = (result * result) % mod;
        const afterSquare = result;

        if (bits[i] === '1') {
            result = (result * base) % mod;
        }

        steps.push({
            bit: bits[i],
            position: i,
            afterSquare: afterSquare,
            afterMultiply: result
        });
    }

    // Tính lại đúng với square-and-multiply
    result = 1n;
    base = ((base % mod) + mod) % mod;
    const stepsCorrect = [];
    const binaryStr = exp.toString(2);

    for (let i = 0; i < binaryStr.length; i++) {
        result = (result * result) % mod;
        let step = { bit: binaryStr[i], afterSquare: result };

        if (binaryStr[i] === '1') {
            result = (result * base) % mod;
        }
        step.result = result;
        stepsCorrect.push(step);
    }

    return { result, steps: stepsCorrect, binary: binaryStr };
}

/**
 * Kiểm tra số nguyên tố (đơn giản, chỉ dùng cho số nhỏ-vừa)
 */
function rsaIsPrime(n) {
    if (n < 2n) return false;
    if (n < 4n) return true;
    if (n % 2n === 0n || n % 3n === 0n) return false;
    for (let i = 5n; i * i <= n; i += 6n) {
        if (n % i === 0n || n % (i + 2n) === 0n) return false;
    }
    return true;
}

/* ─────────────────────────────────────────
   RSA CHÍNH
   ───────────────────────────────────────── */

/**
 * Tạo khóa RSA
 * @param {BigInt} p - Số nguyên tố thứ nhất
 * @param {BigInt} q - Số nguyên tố thứ hai
 * @param {BigInt} e - Khóa công khai e
 * @returns Khóa PU, PR và các bước chi tiết
 */
function rsaGenerateKeys(p, q, e) {
    const errors = [];
    const steps = [];

    // Bước 1: Kiểm tra p, q nguyên tố
    if (!rsaIsPrime(p)) errors.push(`p = ${p} không phải số nguyên tố`);
    if (!rsaIsPrime(q)) errors.push(`q = ${q} không phải số nguyên tố`);
    if (errors.length > 0) return { error: errors.join('; ') };

    // Bước 2: Tính n = p * q
    const n = p * q;
    steps.push({ label: 'Tính n', formula: `n = p × q = ${p} × ${q} = ${n}` });

    // Bước 3: Tính φ(n) = (p-1)(q-1)
    const phi = (p - 1n) * (q - 1n);
    steps.push({ label: 'Tính φ(n)', formula: `φ(n) = (p−1)(q−1) = (${p}-1)(${q}-1) = ${p - 1n} × ${q - 1n} = ${phi}` });

    // Bước 4: Kiểm tra gcd(e, φ(n)) = 1
    const g = rsaGCD(e, phi);
    steps.push({ label: 'Kiểm tra e', formula: `gcd(e, φ(n)) = gcd(${e}, ${phi}) = ${g}` });

    if (g !== 1n) {
        return { error: `gcd(${e}, ${phi}) = ${g} ≠ 1. Chọn e khác sao cho gcd(e, φ(n)) = 1` };
    }

    // Bước 5: Tính d = e^(-1) mod φ(n)
    const invResult = rsaModInverse(e, phi);
    if (invResult.inverse === null) {
        return { error: `Không tìm được nghịch đảo của e = ${e} mod φ(n) = ${phi}` };
    }
    const d = invResult.inverse;
    steps.push({ label: 'Tính d', formula: `d = e⁻¹ mod φ(n) = ${e}⁻¹ mod ${phi} = ${d}` });

    // Kiểm chứng: e * d mod φ(n) = 1
    const verify = (e * d) % phi;
    steps.push({ label: 'Kiểm chứng', formula: `e × d mod φ(n) = ${e} × ${d} mod ${phi} = ${verify}` });

    return {
        p, q, e, n, phi, d,
        publicKey: { e, n },
        privateKey: { d, n },
        steps,
        euclidSteps: invResult.steps
    };
}

/**
 * Mã hóa RSA: C = M^e mod n
 */
function rsaEncrypt(M, e, n) {
    const modPowResult = rsaModPow(M, e, n);
    return {
        C: modPowResult.result,
        M, e, n,
        formula: `C = M^e mod n = ${M}^${e} mod ${n} = ${modPowResult.result}`,
        modPowSteps: modPowResult.steps,
        binary: modPowResult.binary
    };
}

/**
 * Giải mã RSA: M' = C^d mod n
 */
function rsaDecrypt(C, d, n) {
    const modPowResult = rsaModPow(C, d, n);
    return {
        M: modPowResult.result,
        C, d, n,
        formula: `M' = C^d mod n = ${C}^${d} mod ${n} = ${modPowResult.result}`,
        modPowSteps: modPowResult.steps,
        binary: modPowResult.binary
    };
}

/**
 * Chạy toàn bộ bài toán RSA 1
 * An mã hóa → Ba giải mã
 */
function rsaProblem1(p, q, e, M) {
    // Bước 1: Tạo khóa
    const keys = rsaGenerateKeys(p, q, e);
    if (keys.error) return keys;

    // Bước 2: An mã hóa M
    const encrypted = rsaEncrypt(M, keys.publicKey.e, keys.publicKey.n);

    // Bước 3: Ba giải mã C
    const decrypted = rsaDecrypt(encrypted.C, keys.privateKey.d, keys.privateKey.n);

    return {
        keys,
        encrypted,
        decrypted,
        verified: decrypted.M === M,
        summary: {
            PU: `{e, n} = {${keys.e}, ${keys.n}}`,
            PR: `{d, n} = {${keys.d}, ${keys.n}}`,
            C: `${encrypted.C}`,
            MPrime: `${decrypted.M}`
        }
    };
}
