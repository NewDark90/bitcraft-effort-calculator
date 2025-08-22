import { createTheme } from "@mui/material";

export const muiTheme = createTheme({
    cssVariables: true,
    palette: {
        text: {
            primary: 'var(--foreground)',
            secondary: 'var(--color-gray-600)',
            disabled: 'var(--color-gray-300)',
        },

    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInput-underline:before': {
                        borderBottomColor: 'var(--color-gray-400)',
                    },
                    '& .MuiInput-underline:after': {
                        borderBottomColor: 'primary.main',
                    },
                },
            },
        },
    }
});