'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Link, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { useMuiTheme } from "@/hooks/use-mui-theme";
import SettingsDialog from "@/components/settings/settings-dialog";
import GitHubIcon from '@mui/icons-material/GitHub';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const theme = useMuiTheme();

    return (
        <html lang="en">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/bitcraft-effort-calculator-icon.svg" type="image/svg+xml"></link>
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>
            <body
                className={ `${ geistSans.variable } ${ geistMono.variable } antialiased` }
            >
                <AppRouterCacheProvider options={ { enableCssLayer: true } }>
                    <ThemeProvider theme={ theme }>
                        <div className="flex flex-col flex-nowrap items-center justify-items-between justify-between min-h-screen p-2 sm:p-8 md:p-20 font-[family-name:var(--font-geist-sans)] [&>*]:max-w-6xl [&>*]:w-full">
                            <header className="relative">
                                <h1 className="text-center text-3xl px-[64px]">
                                    Bitcraft Online Effort Calculator
                                </h1>
                                <SettingsDialog buttonClassName={"absolute top-[0] right-[0]"}>
            
                                </SettingsDialog>
                            </header>
                            <main>
                                { children }
                            </main>
                            <footer className="flex gap-[24px] flex-wrap items-center justify-between">
                                <div>
                                    Not affiliated with Clockwork Laboratories, Inc.
                                </div>
                                <div>
                                    <Link target="_blank" href="https://github.com/NewDark90/bitcraft-effort-calculator">
                                        <GitHubIcon></GitHubIcon>
                                    </Link>
                                </div>
                            </footer>
                        </div>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
