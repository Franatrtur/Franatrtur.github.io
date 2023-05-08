let PRIMES = [2]; //small PRIMES (less than 2^8) - constant
//array initialization
outer: for (let n = 3; n < 256; n += 2) {
    for (let factor = 1; factor < PRIMES.length; factor++)
        if (n % PRIMES[factor] === 0)
            continue outer;
    PRIMES.push(n);
}
const Primes = PRIMES.slice();
function random_prime() {
    // only select from the bigger half of primes
    return PRIMES[PRIMES.length / 2 + Math.floor(Math.random() * (PRIMES.length / 2))];
}
//code design from: https://www.geeksforgeeks.org/multiplicative-inverse-under-modulo-m/#tablist3-tab7
function modular_inversion(num, modulus) {
    let mod0 = modulus;
    let y = 0, x = 1;
    let quot, temp;
    while (num > 1) {
        quot = Math.floor(num / modulus);
        temp = modulus;
        //as euclids algorigm
        modulus = num % modulus;
        num = temp;
        temp = y;
        y = x - quot * y;
        x = temp;
    }
    return x < 0 ? x + mod0 : x;
}
function modular_power(base, exponent, modulus) {
    let result = 1;
    while (exponent) {
        if ((exponent & 1) == 1)
            result = (result * base) % modulus;
        exponent >>= 1; //next bit
        base = (Math.pow(base, 2)) % modulus;
    }
    return result;
}
class RSAKey {
    constructor(exponent, mod) {
        this.exponent = exponent;
        this.mod = mod;
    }
    process(message) {
        return modular_power(message, this.exponent, this.mod);
    }
}
class RSAKeyPair {
    constructor(publicKey, privateKey) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }
    static generate(prime1 = 0, prime2 = 0, exponent = 7) {
        let e = exponent;
        if (prime1 % e == 1 || prime2 % e == 1) //assert modular invertibility under phi(n)
            throw new Error("Exponent must be coprime with totient of n");
        while (!prime1 || prime1 % e == 1)
            prime1 = random_prime();
        while (!prime2 || prime2 % e == 1 || prime2 == prime1) // prevent factorization to n = p*p
            prime2 = random_prime();
        let p = prime1, q = prime2;
        let n = p * q;
        let totient = (p - 1) * (q - 1);
        let d = modular_inversion(e, totient);
        return new this(new RSAKey(e, n), new RSAKey(d, n));
    }
}


$("#pslider").change(() => process())
$("#qslider").change(() => process())
$("#minput").change(() => process())

$("#pslider").attr("min", 0).attr("max", Primes.length - 1).val(10).change()
$("#qslider").attr("min", 0).attr("max", Primes.length - 1).val(5).change()

function process(){
	let e = 7
	let p = Primes[$("#pslider").val()]
	let q = Primes[$("#qslider").val()]
	$(".pval").text(p)
	$(".qval").text(q)
	$(".eval").text(e)
	let n = p*q
	$(".nval").text(n)
	let phi = (p-1)*(q-1)
	$(".phival").text(phi)
	let d = modular_inversion(7, phi)
	$(".dval").text(d)
    let m = $("#minput").val()
    $("#minput").attr("min", 0)
    $("#minput").attr("max", n-1)
    let kp = RSAKeyPair.generate(p,q,e)
    $(".mval").text(m)
    let c = kp.publicKey.process(m)
    $(".cval").text(c)
    let m2 = kp.privateKey.process(c)
    $(".m2val").text(m)
}
    $("#minput").val(5).change()
