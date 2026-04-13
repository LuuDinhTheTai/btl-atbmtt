/**
 * TÌM NGHỊCH ĐẢO x = a^(-1) mod n
 * Phương pháp 1: Theo định nghĩa (brute force) — duyệt x từ 1 đến n-1
 * Phương pháp 2: Thuật toán Euclid mở rộng (Extended Euclidean Algorithm)
 */

/* ─────────────────────────────────────────
   GCD cơ bản (dùng cho kiểm tra)
   ───────────────────────────────────────── */
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

/* ─────────────────────────────────────────
   PHƯƠNG PHÁP 1: Theo định nghĩa
   Duyệt x = 1..n-1, tìm x sao cho (a * x) mod n = 1
   ───────────────────────────────────────── */
function modInverseByDefinition(a, n) {
    a = parseInt(a);
    n = parseInt(n);

    if (n <= 1) return { result: null, error: 'n phải lớn hơn 1' };

    // Chuẩn hóa a về [0, n)
    a = ((a % n) + n) % n;

    if (gcd(a, n) !== 1) {
        return {
            result: null,
            error: `gcd(${a}, ${n}) = ${gcd(a, n)} ≠ 1 → Nghịch đảo không tồn tại`,
            steps: [],
            gcdValue: gcd(a, n)
        };
    }

    const steps = [];
    let result = null;

    for (let x = 1; x < n; x++) {
        const product = (a * x) % n;
        const found = product === 1;
        steps.push({
            x: x,
            product: a * x,
            mod: product,
            found: found
        });
        if (found) {
            result = x;
            break;
        }
    }

    return {
        result,
        a,
        n,
        steps,
        method: 'definition'
    };
}

/* ─────────────────────────────────────────
   PHƯƠNG PHÁP 2: Thuật toán Euclid mở rộng
   Tìm x, y sao cho: a*x + n*y = gcd(a, n)
   Nếu gcd = 1 thì x mod n là nghịch đảo
   ───────────────────────────────────────── */
function extendedGCD(a, b) {
    const steps = [];

    // Bảng: r, q, x, y
    let r0 = a, r1 = b;
    let x0 = 1, x1 = 0;
    let y0 = 0, y1 = 1;

    steps.push({
        step: 0,
        r: r0,
        q: '-',
        x: x0,
        y: y0
    });
    steps.push({
        step: 1,
        r: r1,
        q: '-',
        x: x1,
        y: y1
    });

    let stepNum = 2;

    while (r1 !== 0) {
        const q = Math.floor(r0 / r1);
        const rNew = r0 - q * r1;
        const xNew = x0 - q * x1;
        const yNew = y0 - q * y1;

        steps.push({
            step: stepNum,
            r: rNew,
            q: q,
            x: xNew,
            y: yNew,
            formula: `r = ${r0} - ${q}×${r1} = ${rNew}, x = ${x0} - ${q}×${x1} = ${xNew}, y = ${y0} - ${q}×${y1} = ${yNew}`
        });

        r0 = r1;
        r1 = rNew;
        x0 = x1;
        x1 = xNew;
        y0 = y1;
        y1 = yNew;
        stepNum++;
    }

    return {
        gcd: r0,
        x: x0,
        y: y0,
        steps
    };
}

function modInverseByEuclid(a, n) {
    a = parseInt(a);
    n = parseInt(n);

    if (n <= 1) return { result: null, error: 'n phải lớn hơn 1' };

    const originalA = a;
    a = ((a % n) + n) % n;

    const euclidResult = extendedGCD(a, n);

    if (euclidResult.gcd !== 1) {
        return {
            result: null,
            error: `gcd(${a}, ${n}) = ${euclidResult.gcd} ≠ 1 → Nghịch đảo không tồn tại`,
            steps: euclidResult.steps,
            gcdValue: euclidResult.gcd
        };
    }

    // x có thể âm, cần mod n
    const rawX = euclidResult.x;
    const result = ((rawX % n) + n) % n;

    return {
        result,
        a: originalA,
        aNormalized: a,
        n,
        rawX,
        gcdResult: euclidResult,
        steps: euclidResult.steps,
        method: 'euclid',
        verification: `${a} × ${result} = ${a * result} ≡ ${(a * result) % n} (mod ${n})`
    };
}
