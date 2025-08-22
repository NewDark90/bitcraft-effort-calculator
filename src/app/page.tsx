'use client'

import NumberInput from "@/components/common/number-input";
import ArmorSelectButton from "@/components/calculator/armor-select-button";
import SkillIcon from "@/components/skill-icon";
import SkillSelectButton from "@/components/calculator/skill-select-button";
import { armorService } from "@/services/armor-service";
import { skillService } from "@/services/skill-service";
import { useLiveQuery } from "dexie-react-hooks";
import { NoSSR } from 'next-dynamic-no-ssr';
import Image from "next/image";
import { useState } from "react";
import CraftParameters from "@/components/calculator/craft-parameters";
import { craftParameterService } from "@/services/craft-parameter-service";

export default function Home() {

    const selectedSkill = useLiveQuery(async () => await skillService.getSelectedSkill());
    const selectedArmor = useLiveQuery(async () => await armorService.getSelectedArmor());

    const [fullEffort, setFullEffort] = useState(craftParameterService.getEffort());
    const [craftingType, setCraftingType] = useState(craftParameterService.getCraftingType());


    return (
        <NoSSR>
            <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

                    <h1 className="text-center w-full">
                        Bitcraft Online Effort Calculator
                    </h1>

                    <div className="flex gap-4 items-stretch justify-evenly flex-col sm:flex-row [&>*]:grow [&>*]:basis-0">

                        <SkillSelectButton skill={ selectedSkill }>

                        </SkillSelectButton>

                        <ArmorSelectButton armor={ selectedArmor } >
                            
                        </ArmorSelectButton>

                    </div>

                    <CraftParameters 
                        effort={fullEffort}
                        craftType={craftingType}
                        onCraftTypeChange={(type) => { setCraftingType(type) }}
                        onEffortChange={(effort) => { setFullEffort(effort) }}
                    >
                    </CraftParameters>

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
