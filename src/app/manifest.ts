
import type { MetadataRoute } from 'next'

export const dynamic = 'force-static';

const iconPath = "/bitcraft-effort-calculator-icon.svg";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Bitcraft Effort Calculator',
        short_name: 'Effort Calculator',
        description: 'An app for simulating and estimating bitcraft crafting jobs. It can also function as an alarm clock.',
        start_url: '/',
        display: 'standalone',
        background_color: '#151515',
        theme_color: '#3C7FAA',
        icons: [

            {
                src: iconPath,
                sizes: "48x48 72x72 96x96 128x128 256x256 512x512",
                type: 'image/svg+xml',
            },
            {
                src: iconPath,
                sizes: 'any',
                type: 'image/svg+xml',
            },
        ],
    }
}