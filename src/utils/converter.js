/**
 * Converts a value from one unit to another.
 *
 * @param {number} value - The value to convert.
 * @param {object} fromUnit - The unit object to convert from.
 * @param {object} toUnit - The unit object to convert to.
 * @param {number} [decimals] - Optional number of decimals to round to.
 * @returns {number|string} - The converted value, optionally rounded.
 * @throws {Error} - If unit families do not match.
 */
export function convert(value, fromUnit, toUnit, decimals = null) {
    if (!fromUnit || !toUnit) {
        return 0; // Return 0 or handle error if units are missing
    }

    // 1. Family check
    if (fromUnit.family !== toUnit.family) {
        throw new Error(`Unit families don't match: ${fromUnit.family} vs ${toUnit.family}`);
    }

    // Handle non-numeric input gracefully
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
        return 0;
    }

    // 2. Convert to SI (Base unit)
    // Formula: Base = (Value + Offset) * Factor
    // Note: For most units offset is 0.
    // Temperature example:
    // C to K: (C + 273.15) * 1 = K
    // K to C: (K / 1) - 273.15 = C
    // Wait, the standard offset logic is usually: Value * Factor + Offset.
    // Let's re-verify specific implementation for Temperature.
    // Celsius to Base (Kelvin): C + 273.15
    // Fahrenheit to Base (Kelvin): (F + 459.67) * 5/9
    //
    // My JSON has:
    // C: toSI=1, offset=273.15
    // F: toSI=5/9, offset=459.67
    //
    // If I use: (Value + Offset) * Factor -> Base
    // C: (C + 0) * 1 + 273.15 ?? No.
    //
    // Let's use a robust approach:
    // Normalize to Base:
    // if family is temperature:
    //   if from == 'c' -> base = val + 273.15
    //   if from == 'f' -> base = (val + 459.67) * 5/9
    //   if from == 'k' -> base = val
    //
    // But to be generic with JSON data:
    // We can stick to linear transformation y = mx + c if possible.
    // K = C + 273.15
    // K = (F - 32) * 5/9 + 273.15 = (F + 459.67) * 5/9
    //
    // So: Base = (Value + InputOffset) * Factor
    // Let's check my JSON for F: offset=459.67, factor=0.555 (5/9).
    // (F + 459.67) * 5/9 = Kelvin. This is correct.
    // Rankine? Not in list.
    //
    // So Formula for Base:
    // baseValue = (numericValue + (fromUnit.offset || 0)) * fromUnit.toSI;

    const baseValue = (numericValue + (fromUnit.offset || 0)) * fromUnit.toSI;

    // 3. Convert from SI to target
    // Target = (Base / Factor) - Offset
    const result = (baseValue / toUnit.toSI) - (toUnit.offset || 0);

    // 4. Rounding if requested
    if (decimals !== null) {
        // Use a small epsilon for float precision issues if needed, or simple toFixed
        // Using a refined rounding to avoid 0.999999
        const factor = Math.pow(10, decimals);
        return Math.round(result * factor) / factor;
    }

    return result;
}
