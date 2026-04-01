/**
 * PostCSS plugin: Tailwind v4 → Chrome 103 color compatibility
 */

function extractOpacity(sel) {
    const int = sel.match(
        /(?:^|[.])(?:[a-z-]+\\?:)*(bg|text|border|ring|shadow|fill|stroke)-[a-z-]+\\?\/([\d]+)/,
    );
    if (int) return { found: true, value: parseInt(int[2]) / 100 };

    const bracket = sel.match(
        /(?:^|[.])(?:[a-z-]+\\?:)*(bg|text|border|ring|shadow|fill|stroke)-[a-z-]+\\?\/\\\[([\d]+(?:\\?\.[\d]+)?)\\\]/,
    );
    if (bracket)
        return {
            found: true,
            value: parseFloat(bracket[2].replace(/\\/g, "")),
        };

    return { found: false, value: 1 };
}

function rewriteDecl(decl, opacity, seen) {
    if (seen.has(decl) || decl.value.includes("rgba(")) return;
    seen.add(decl);

    const v = decl.value;

    // color-mix(in srgb, rgb(var(--x) / <alpha-value>) NN%, transparent)
    let m = v.match(
        /color-mix\(in\s+(?:srgb|display-p3),\s*rgb\(var\((--[^)]+)\)\s*\/\s*<alpha-value>\)\s*(\d+(?:\.\d+)?)%,\s*transparent\)/,
    );
    if (m) {
        decl.value = `rgb(var(${m[1]}) / ${parseFloat(m[2]) / 100})`;
        return;
    }

    // rgb(var(--x) / var(--x-opacity, <alpha-value>))  →  preserve the var, swap fallback
    m = v.match(
        /rgb\(var\((--[^)]+)\)\s*\/\s*var\((--[^,]+),\s*<alpha-value>\)\)/,
    );
    if (m) {
        decl.value = `rgb(var(${m[1]}) / var(${m[2]}, ${opacity}))`;
        return;
    }

    // rgb(var(--x) / <alpha-value>)
    m = v.match(/rgb\(var\((--[^)]+)\)\s*\/\s*<alpha-value>\)/);
    if (m) {
        decl.value = `rgb(var(${m[1]}) / ${opacity})`;
        return;
    }
}

module.exports = function variableOpacityPlugin() {
    return {
        postcssPlugin: "variable-opacity",
        Once(root) {
            const seen = new Set();

            // Strip @supports (color-mix) feature queries
            root.walkAtRules("supports", (rule) => {
                if (rule.params.includes("color-mix")) rule.remove();
            });

            // Static value conversions (oklch, color-mix with literals)
            root.walkDecls((decl) => {
                // oklch(L% C H) → rgb(r, g, b)
                const oklch = decl.value.match(
                    /^oklch\(([0-9.]+)%\s+([0-9.]+)\s+([0-9.]+)\)$/,
                );
                if (oklch) {
                    const rgb = oklchToRgb(
                        parseFloat(oklch[1]),
                        parseFloat(oklch[2]),
                        parseFloat(oklch[3]),
                    );
                    decl.value = `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
                    seen.add(decl);
                    return;
                }

                // color-mix(in srgb, #hex NN%, transparent) → rgba(r, g, b, a)
                const mix = decl.value.match(
                    /color-mix\(in\s+(?:srgb|display-p3|oklch),\s*(#[0-9a-fA-F]{3,8}|rgb\([^)]+\))\s+(\d+(?:\.\d+)?)%,\s*transparent\)/,
                );
                if (mix) {
                    const alpha = parseFloat(mix[2]) / 100;
                    if (mix[1].startsWith("#")) {
                        const { r, g, b } = hexToRgb(mix[1]);
                        decl.value = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                    } else {
                        decl.value = `rgba(${mix[1].match(/rgb\(([^)]+)\)/)[1]}, ${alpha})`;
                    }
                    seen.add(decl);
                }
            });

            // Opacity-aware rules: split grouped selectors by their opacity value,
            // then rewrite <alpha-value> with the correct number.
            root.walkRules((rule) => {
                const parts = rule.selector.split(",").map((s) => s.trim());

                // Group by opacity
                const byOpacity = new Map(); // "0.1" → [sel, ...]
                const plain = [];

                for (const sel of parts) {
                    const { found, value } = extractOpacity(sel);
                    if (found) {
                        const k = String(value);
                        if (!byOpacity.has(k)) byOpacity.set(k, []);
                        byOpacity.get(k).push(sel);
                    } else {
                        plain.push(sel);
                    }
                }

                if (byOpacity.size === 0) return;

                // Single selector or all share one opacity → rewrite in place
                if (plain.length === 0 && byOpacity.size === 1) {
                    const opacity = parseFloat(byOpacity.keys().next().value);
                    rule.walkDecls((d) => rewriteDecl(d, opacity, seen));
                    return;
                }

                // Mixed opacities → keep plain selectors on the original rule,
                // clone a new rule per distinct opacity value
                if (plain.length > 0) {
                    rule.selector = plain.join(", ");
                } else {
                    const [firstKey, firstSels] = byOpacity
                        .entries()
                        .next().value;
                    rule.selector = firstSels.join(", ");
                    rule.walkDecls((d) =>
                        rewriteDecl(d, parseFloat(firstKey), seen),
                    );
                    byOpacity.delete(firstKey);
                }

                for (const [k, sels] of byOpacity) {
                    const clone = rule.cloneAfter({
                        selector: sels.join(", "),
                    });
                    clone.walkDecls((d) => rewriteDecl(d, parseFloat(k), seen));
                }
            });

            // Catch-all: any <alpha-value> that slipped through gets replaced with 1
            root.walkDecls((decl) => {
                if (seen.has(decl) || !decl.value.includes("<alpha-value>"))
                    return;

                // Nested var fallback: var(--x-opacity, <alpha-value>) → var(--x-opacity, 1)
                decl.value = decl.value.replace(
                    /rgb\(var\((--[^)]+)\)\s*\/\s*var\((--[^,]+),\s*<alpha-value>\)\)/g,
                    (_, c, o) => `rgb(var(${c}) / var(${o}, 1))`,
                );

                // Simple: rgb(var(--x) / <alpha-value>) → rgb(var(--x) / 1)
                decl.value = decl.value.replace(
                    /rgb\(var\((--[^)]+)\)\s*\/\s*<alpha-value>\)/g,
                    (_, v) => `rgb(var(${v}) / 1)`,
                );

                // Leftover color-mix
                decl.value = decl.value.replace(
                    /color-mix\(in\s+(?:srgb|display-p3|oklch),\s*rgb\(var\((--[^)]+)\)\s*\/\s*(?:<alpha-value>|1)\)\s*(\d+(?:\.\d+)?)%,\s*transparent\)/g,
                    (_, v, p) => `rgb(var(${v}) / ${parseFloat(p) / 100})`,
                );

                // oklch(from rgb(...) l c h / a)
                decl.value = decl.value.replace(
                    /oklch\(from\s+rgb\(var\((--[^)]+)\)\s*\/\s*(?:<alpha-value>|1)\)\s+l\s+c\s+h\s*\/\s*([0-9.]+)\)/g,
                    (_, v, a) => `rgb(var(${v}) / ${a})`,
                );
            });
        },
    };
};

module.exports.postcss = true;

// --- Color conversion helpers ---

function oklchToRgb(l, c, h) {
    const a_ = c * Math.cos((h * Math.PI) / 180);
    const b_ = c * Math.sin((h * Math.PI) / 180);
    const L = l / 100;

    const l_ = L + 0.3963377774 * a_ + 0.2158037573 * b_;
    const m_ = L - 0.1055613458 * a_ - 0.0638541728 * b_;
    const s_ = L - 0.0894841775 * a_ - 1.291485548 * b_;

    const r =
        l_ ** 3 * 4.0767416621 -
        m_ ** 3 * 3.3077115913 +
        s_ ** 3 * 0.2309699292;
    const g =
        l_ ** 3 * -1.2684380046 +
        m_ ** 3 * 2.6097574011 -
        s_ ** 3 * 0.3413193965;
    const b =
        l_ ** 3 * -0.0041960863 -
        m_ ** 3 * 0.7034186147 +
        s_ ** 3 * 1.707614701;

    const clamp = (v) => Math.max(0, Math.min(255, gamma(v) * 255));
    return { r: clamp(r), g: clamp(g), b: clamp(b) };
}

function gamma(c) {
    const abs = Math.abs(c);
    return abs > 0.0031308
        ? (Math.sign(c) || 1) * (1.055 * abs ** (1 / 2.4) - 0.055)
        : 12.92 * c;
}

function hexToRgb(hex) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3)
        hex = hex
            .split("")
            .map((c) => c + c)
            .join("");
    const n = parseInt(hex, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
