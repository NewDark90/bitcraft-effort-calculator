'use client'

import NumberInput from "@/components/common/number-input";
import SkillArmorButton from "@/components/skill-armor-button";
import SkillIcon from "@/components/skill-icon";
import SkillSelectButton from "@/components/skill-select-button";
import { NoSSR } from 'next-dynamic-no-ssr';
import Image from "next/image";

export default function Home() {

    return (
        <NoSSR>
            <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

                    <h1 className="text-center w-full">
                        Bitcraft Online Effort Calculator
                    </h1>

                    <div className="flex gap-4 items-center justify-evenly flex-col sm:flex-row [&>*]:grow [&>*]:basis-0">

                        <SkillSelectButton power={ 12 } skill="Hunting"></SkillSelectButton>

                        <SkillArmorButton energy={ 400 } interval={ 1.24 }></SkillArmorButton>

                    </div>

                    <NumberInput
                        value={ 55 }
                        onInput={ (cur) => console.log(cur) }
                        readOnly={ true }
                    >

                    </NumberInput>

                    <SkillIcon
                        name="Hunting"
                        size={ 32 }
                    >

                    </SkillIcon>
                </main>
                <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                    <a
                        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                        href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >

                        Learn
                    </a>
                    <a
                        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                        href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            aria-hidden
                            src="/window.svg"
                            alt="Window icon"
                            width={ 16 }
                            height={ 16 }
                        />
                        Examples
                    </a>
                    <a
                        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                        href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            aria-hidden
                            src="/globe.svg"
                            alt="Globe icon"
                            width={ 16 }
                            height={ 16 }
                        />
                        Go to nextjs.org →
                    </a>
                </footer>
            </div>
        </NoSSR>
    );
}
