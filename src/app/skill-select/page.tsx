'use client'

import Skill from "@/app/skill-select/skill";
import { professions } from "@/config/professions";
import { skills } from "@/config/skills";
import { SkillService } from "@/services/skill-service";
import { NoSSR } from 'next-dynamic-no-ssr';
import { useState } from "react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Link from "next/link";


const skillService = new SkillService();

export default function SkillSelect() {

    const [selectedSkill, setSelectedSkill] = useState(() => skillService.getSelectedSkill());
    
    const updateSelectedSkill = (skill: string | null) => {
        if (skill) {
            setSelectedSkill(skill);
            skillService.setSelectedSkill(skill);
        }
    }

    const titleCss = "my-6 text-2xl text-center font-bold leading-none tracking-tight text-gray-950 md:text-3xl lg:text-4xl";

    return (
        <NoSSR>
            <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-6xl">
                    <nav>
                        <Link
                            className="m-2 flex justify-baseline font-bold"
                            href={`../`}
                        >
                            <ChevronLeftIcon className="mx-1 "></ChevronLeftIcon>
                            Calculator
                        </Link>
                    </nav>
                    <section className="w-full">
                        <h2 className={titleCss}>
                            Professions
                        </h2>
                        <div className="grid grid-cols-4 gap-4">
                        {
                            professions.map(profession => (
                                <Skill 
                                    key={profession} 
                                    name={profession}
                                    selectedSkill={selectedSkill}
                                    onSelectedSkillChange={updateSelectedSkill}
                                    className="">

                                </Skill>
                            ))
                        }
                        </div>
                    </section>

                    <section className="w-full">
                        <h2 className={titleCss}>
                            Skills
                        </h2>
                        <div className="grid grid-cols-4 gap-4">
                        {
                            skills.map(skill => (
                                <Skill 
                                    key={skill} 
                                    name={skill} 
                                    selectedSkill={selectedSkill}
                                    onSelectedSkillChange={updateSelectedSkill}
                                    className="">    
                                </Skill>
                            ))
                        }
                        </div>
                    </section>
                    
                </main>
            </div>
        </NoSSR>
    );
}
