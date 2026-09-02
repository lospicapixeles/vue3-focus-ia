import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

const AliPreset = definePreset(Aura, {
    primitive: {
        borderRadius: {
            none: '0',
            xs: '4px',
            sm: '6px',
            md: '10px',
            lg: '12px',
            xl: '14px'
        }
    },
    semantic: {
        primary: {
            50: '#eef6f0',
            100: '#d7eadc',
            200: '#b3d4be',
            300: '#82b693',
            400: '#55986d',
            500: '#2F7A4B',
            600: '#24563b',
            700: '#1d4430',
            800: '#183728',
            900: '#142e22',
            950: '#0a1a13'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#FFFCF6',
                    50: '#F3F0E8',
                    100: '#E8E4D8',
                    200: '#D6D0C2',
                    300: '#C0B9A8',
                    400: '#A7A297',
                    500: '#8A8578',
                    600: '#6B665C',
                    700: '#4A463E',
                    800: '#2C2A24',
                    900: '#171714',
                    950: '#0E0E0C'
                }
            }
        }
    }
})

export default AliPreset
