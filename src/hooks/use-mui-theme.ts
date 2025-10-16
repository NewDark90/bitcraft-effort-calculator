import { createTheme, useMediaQuery } from "@mui/material";

/*
const cssVar = (varName: string): string => {
    // This only works in browser environment
    if (typeof window === 'undefined') 
        return '#000000';
    
    const cssValue = getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim();
    return cssValue;
};
*/

export const useMuiTheme = () => {
    const theme = useMediaQuery('(prefers-color-scheme: dark)') ? "dark" : "light";

    return createTheme({
        cssVariables: true,

        palette: {
            mode: theme,
            /*
            text: {
                primary: cssVar('--foreground'),
                secondary: cssVar('--color-gray-600'),
                disabled: cssVar('--color-gray-300'),
            },
            background: {
                default: cssVar('--background'),
                paper: cssVar('--background'),
            },
            */
        },
        components: {
        }
    });
};

