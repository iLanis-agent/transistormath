import json, random
from fractions import Fraction

def hu(num, den):  # half-up of num/den, non-negative ints
    return Fraction((2*num + den) - ((2*num + den) % (2*den)), 2*den)

def dec(v, places=2):
    if v < 0: return "-" + dec(-v, places)
    base = 10**places
    n = v.numerator // v.denominator
    s = str(n // base); f = str(n % base).zfill(places).rstrip("0")
    return s + "." + f if f else s

def vfmt(v100): return f"{dec(Fraction(v100))} V"
def ma(v100): return f"{dec(Fraction(v100))} mA"

def base(v, b, c):
    d = v - 70
    assert d > 0
    rb = hu(1000*d*b, c); ib = hu(c, b)
    return (f"With a {vfmt(v)} drive, a 0.7 V junction drop and a beta of {b}, "
            f"switching {ma(c)} calls for a {rb} Ω base resistor ({ma(ib)} of base current).")
def current(v, r, b):
    d = v - 70
    assert d > 0
    ib = hu(1000*d, r); ic = b*ib
    return (f"A {vfmt(v)} drive through a {r} Ω resistor pushes {ma(ib)} into the base. "
            f"A beta of {b} scales that to {ma(ic)} of collector current.")
def emitter(e, i):
    re = hu(1000*e, i)
    return f"{vfmt(e)} across the emitter resistor at {ma(i)} works out to {re} Ω."

def s100(n):  # exact hundredths to string
    w, f = divmod(n, 100)
    return f"{w}.{f:02d}".rstrip("0").rstrip(".")

random.seed(728)
cases = [
  dict(fn="base", args=["5","100","500"], expect=base(500,100,50000)),
  dict(fn="current", args=["5","860","100"], expect=current(500,860,100)),
  dict(fn="emitter", args=["0.9","20"], expect=emitter(90,2000)),
]
for _ in range(30):
    v = random.randint(71,10000); b = random.randint(1,1000); c = random.randint(1,10000000)
    cases.append(dict(fn="base", args=[s100(v),str(b),s100(c)], expect=base(v,b,c)))
    r = random.randint(1,10000000)
    cases.append(dict(fn="current", args=[s100(v),str(r),str(b)], expect=current(v,r,b)))
    e = random.randint(1,10000); i = random.randint(1,10000000)
    cases.append(dict(fn="emitter", args=[s100(e),s100(i)], expect=emitter(e,i)))
errcases = [
  ("base", ["0.7","100","500"]), ("base", ["0.5","100","500"]), ("current", ["0.69","1000","10"]),
  ("base", ["0","100","500"]), ("base", ["5","0","500"]), ("base", ["5","1001","500"]),
  ("base", ["5","100","0"]), ("current", ["5","0","100"]), ("emitter", ["0","20"]),
  ("emitter", ["0.9","100000.001"]), ("base", ["1.5","100.5","500"]),
]
json.dump({"cases": cases, "errors": errcases}, open("expected.json","w"), ensure_ascii=False, indent=1)
open("expected.json","a").write("\n")
print("expected.json written:", len(cases), "cases")
