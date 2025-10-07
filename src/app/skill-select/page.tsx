'use client'

import Skill from "@/app/skill-select/skill";
import { skillService } from "@/services/skill-service";
import { NoSSR } from 'next-dynamic-no-ssr';
import { useLiveQuery } from "dexie-react-hooks";
import CalculatorNavLink from "@/components/calculator-nav-link";


export default function SkillSelect() {

    const skills = useLiveQuery(async () => await skillService.getSkills());

    const titleCss = "my-6 text-2xl text-center font-bold leading-none tracking-tight text-gray-950 md:text-3xl lg:text-4xl";

    return (
        <NoSSR>
            <nav className="my-8">
                <CalculatorNavLink></CalculatorNavLink>
            </nav>
            <section className="w-full">
                <h2 className={titleCss}>
                    Professions
                </h2>
                <div className="grid grid-cols-4 gap-4">
                {
                    skills
                        ?.filter(skill => skill.type == 'profession')
                        .map(profession => (
                            <Skill 
                                key={profession.id} 
                                skill={profession}
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
                    skills
                        ?.filter(skill => skill.type == 'skill')
                        .map(skill => (
                            <Skill 
                                key={skill.id} 
                                skill={skill} 
                                className="">    
                            </Skill>
                        ))
                }
                </div>
            </section>
        </NoSSR>
    );
}
