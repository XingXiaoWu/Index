// @ts-nocheck
// uno.config.ts
import {
    defineConfig,
    presetAttributify,
    presetIcons,
    presetTypography,
    presetUno,
    presetWebFonts,
    presetWind,
    transformerDirectives,
    transformerVariantGroup
} from 'unocss'

export default defineConfig({
    rules: [
        [/^m-(\d+)$/, ([, d]) => ({ margin: `${d / 4}px` })],
        [/^p-(\d+)$/, match => ({ padding: `${match[1] / 4}px` })],
    ],
    shortcuts: [
        // ...
    ],
    theme: {
        colors: {
            // ...
        }
    },
    presets: [
        presetWind(),
        presetUno(),
        presetAttributify(),
        presetIcons(),
        presetTypography(),
        presetWebFonts({
            fonts: {
                // ...
            },
        }),
    ],
    transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
    ],
})