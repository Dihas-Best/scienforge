/**
 * A small shunting-yard expression parser. Compiles a string like
 * "sin(x)/x + 2^x" into a function of x. No eval, no dependencies.
 */

type Token = { t: "num" | "var" | "op" | "fn" | "lp" | "rp"; v: string };

const FUNCS: Record<string, (x: number) => number> = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  asin: Math.asin, acos: Math.acos, atan: Math.atan,
  sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
  ln: Math.log, log: Math.log10, log2: Math.log2,
  sqrt: Math.sqrt, cbrt: Math.cbrt, abs: Math.abs,
  exp: Math.exp, floor: Math.floor, ceil: Math.ceil, round: Math.round,
  sign: Math.sign,
};

const CONSTS: Record<string, number> = { pi: Math.PI, e: Math.E, tau: 2 * Math.PI };

const PREC: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2, "%": 2, "^": 3 };
const RIGHT = new Set(["^"]);

function tokenize(src: string): Token[] {
  const s = src.replace(/\s+/g, "").toLowerCase();
  const out: Token[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      if (s[j] === "e" && /[0-9+-]/.test(s[j + 1] ?? "")) {
        j++;
        if (/[+-]/.test(s[j])) j++;
        while (j < s.length && /[0-9]/.test(s[j])) j++;
      }
      out.push({ t: "num", v: s.slice(i, j) });
      i = j;
      continue;
    }
    if (/[a-z]/.test(c)) {
      let j = i;
      while (j < s.length && /[a-z0-9]/.test(s[j])) j++;
      const word = s.slice(i, j);
      if (word in FUNCS) out.push({ t: "fn", v: word });
      else out.push({ t: "var", v: word });
      i = j;
      continue;
    }
    if (c === "(") { out.push({ t: "lp", v: c }); i++; continue; }
    if (c === ")") { out.push({ t: "rp", v: c }); i++; continue; }
    if (c in PREC) { out.push({ t: "op", v: c }); i++; continue; }
    throw new Error(`Unexpected character "${c}"`);
  }

  // Insert implicit multiplication: 2x, 3(x+1), (x)(x), 2sin(x)
  const withMul: Token[] = [];
  for (let k = 0; k < out.length; k++) {
    const prev = out[k - 1];
    const cur = out[k];
    if (
      prev &&
      (prev.t === "num" || prev.t === "var" || prev.t === "rp") &&
      (cur.t === "num" || cur.t === "var" || cur.t === "fn" || cur.t === "lp")
    ) {
      withMul.push({ t: "op", v: "*" });
    }
    withMul.push(cur);
  }
  return withMul;
}

function toRPN(tokens: Token[]): Token[] {
  const out: Token[] = [];
  const stack: Token[] = [];
  let prev: Token | undefined;

  for (const tok of tokens) {
    if (tok.t === "num" || tok.t === "var") { out.push(tok); }
    else if (tok.t === "fn") { stack.push(tok); }
    else if (tok.t === "op") {
      // unary minus / plus
      const unary = !prev || prev.t === "op" || prev.t === "lp";
      if (unary && (tok.v === "-" || tok.v === "+")) {
        out.push({ t: "num", v: "0" });
      }
      while (stack.length) {
        const top = stack[stack.length - 1];
        if (top.t === "fn" ||
          (top.t === "op" &&
            (PREC[top.v] > PREC[tok.v] ||
              (PREC[top.v] === PREC[tok.v] && !RIGHT.has(tok.v))))) {
          out.push(stack.pop()!);
        } else break;
      }
      stack.push(tok);
    }
    else if (tok.t === "lp") { stack.push(tok); }
    else {
      while (stack.length && stack[stack.length - 1].t !== "lp") out.push(stack.pop()!);
      if (!stack.length) throw new Error("Unbalanced brackets");
      stack.pop();
      if (stack.length && stack[stack.length - 1].t === "fn") out.push(stack.pop()!);
    }
    prev = tok;
  }
  while (stack.length) {
    const top = stack.pop()!;
    if (top.t === "lp") throw new Error("Unbalanced brackets");
    out.push(top);
  }
  return out;
}

export type CompiledExpr = (x: number) => number;

export function compile(src: string): CompiledExpr {
  const rpn = toRPN(tokenize(src));
  return (x: number) => {
    const st: number[] = [];
    for (const tok of rpn) {
      if (tok.t === "num") st.push(Number(tok.v));
      else if (tok.t === "var") {
        if (tok.v === "x") st.push(x);
        else if (tok.v in CONSTS) st.push(CONSTS[tok.v]);
        else throw new Error(`Unknown name "${tok.v}"`);
      }
      else if (tok.t === "fn") {
        const a = st.pop();
        if (a === undefined) throw new Error("Missing argument");
        st.push(FUNCS[tok.v](a));
      }
      else {
        const b = st.pop(), a = st.pop();
        if (a === undefined || b === undefined) throw new Error("Malformed expression");
        switch (tok.v) {
          case "+": st.push(a + b); break;
          case "-": st.push(a - b); break;
          case "*": st.push(a * b); break;
          case "/": st.push(a / b); break;
          case "%": st.push(a % b); break;
          case "^": st.push(a ** b); break;
        }
      }
    }
    if (st.length !== 1) throw new Error("Malformed expression");
    return st[0];
  };
}

export const FUNCTION_NAMES = Object.keys(FUNCS);
