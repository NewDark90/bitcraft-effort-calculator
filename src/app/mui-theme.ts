import { createTheme, useMediaQuery } from "@mui/material";

export const buildMuiTheme = () => {
    const theme = useMediaQuery('(prefers-color-scheme: dark)') ? "dark" : "light";

    return createTheme({
        cssVariables: true,
        palette: {
            mode: theme,
            text: {
                primary: 'var(--foreground)',
                secondary: 'var(--color-gray-600)',
                disabled: 'var(--color-gray-300)',
                
            },
            background: {
                default: 'var(--background)',
                paper: 'var(--background)',
            },
            
        },
        components: {
        }
    });
};

