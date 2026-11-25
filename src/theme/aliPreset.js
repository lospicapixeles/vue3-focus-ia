import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

const AliPreset = definePreset(Aura, {
    primitive: {
        borderRadius: {
            none: '0',
            xs: '4px',
            sm: '6px',
            md: '8px',
            lg: '10px',
            xl: '12px'
        }
    },
    semantic: {
        primary: {
            50: '#eef7f1',
            100: '#d8eee0',
            200: '#b4dcc4',
            300: '#82c29c',
            400: '#4f9f72',
            500: '#1f6b45',
            600: '#165435',
            700: '#13432c',
            800: '#113626',
            900: '#0e2c1f',
            950: '#071912'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '#f4f6f5',
                    100: '#e8ecea',
                    200: '#e1e6e3',
                    300: '#c5cdc8',
                    400: '#9aa59f',
                    500: '#5a635e',
                    600: '#3f4743',
                    700: '#2a312e',
                    800: '#1c2420',
                    900: '#0f1412',
                    950: '#080b0a'
                }
            }
        }
    }
})

export default AliPreset
