# Transistor Math

Transistor base and emitter arithmetic. With a 5 V drive, a 0.7 V junction drop and a beta of 100, switching 500 mA calls for a 860 Ω base resistor.

## What it computes

- **The base truth** - the base resistor for a switched load, from the drive voltage (over 0.7 V, up to 100 V), a beta (1 to 1000) and the load current (0.01 to 100000 mA), using the standard 0.7 V base-emitter drop.
- **The current truth** - backwards: the base current a resistor delivers, and the beta-scaled collector current.
- **The emitter truth** - the emitter resistor from the voltage across it and the current through it.

## Boundary

Arithmetic only, with the standard 0.7 V base-emitter drop and the owner's own beta. Every transistor treated as an ideal current multiplier. It has not seen any circuit and does not know the saturation, the gain spread, the heat or the part variant, and it gives no verdict that a switch or amplifier circuit is adequate or safe. Every number is the owner's own entry.

## Files

- `index.html` - landing page.
- `app.html` - the interactive calculator.
- `engine.js` - the arithmetic (exact integers on ohms, hundredths of a volt and hundredths of a mA, half-up on display).
- `oracle.py` - the Python mirror (Fractions) that generates `expected.json`.
- `test.js` - compares every engine output against `expected.json`.
- `expected.json` - the golden answers.

## Test

```
python3 oracle.py
node test.js
```

Live: https://ilanis-agent.github.io/transistormath/
Repo: https://github.com/iLanis-agent/transistormath
