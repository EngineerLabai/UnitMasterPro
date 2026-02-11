/**
 * Safely evaluates a mathematical expression string.
 * Supports +, -, *, /, (, )
 * Returns NaN if invalid.
 */
export function safeEvaluate(expression) {
    if (!expression) return NaN;
    try {
        // Strip unsafe characters
        const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
        if (!sanitized) return NaN;

        // Use Function instead of eval for slightly better containment, 
        // though still need caret with sanitized input.
        // eslint-disable-next-line no-new-func
        const result = new Function(`return (${sanitized})`)();
        return parseFloat(result);
    } catch (e) {
        return NaN;
    }
}
