'use client'

import Skill from "@/app/skill-select/Skill";
import { professions } from "@/config/professions";
import { skills } from "@/config/skills";
import { NoSSR } from "next-dynamic-no-ssr";
import Image from "next/image";

export default function SkillSelect() {

    const titleCss = "my-6 text-2xl text-center font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white";

    return (
        <NoSSR>
            <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-5xl">

                    <section>
                        <h2 className={titleCss}>
                            Professions
                        </h2>
                        <div className="grid grid-cols-4 gap-4">
                        {
                            professions.map(profession => (
                                <Skill 
                                    key={profession} 
                                    name={profession}
                                    className="" >

                                </Skill>
                            ))
                        }
                        </div>
                    </section>

                    <section>
                        <h2 className={titleCss}>
                            Skills
                        </h2>
                        <div className="grid grid-cols-4 gap-4">
                        {
                            skills.map(skill => (
                                <Skill 
                                    key={skill} 
                                    name={skill} 
                                    className=""   
                                ></Skill>
                            ))
                        }
                        </div>
                    </section>
                    
                </main>
            </div>
        </NoSSR>
    );
}
