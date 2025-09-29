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
import ProgressBar from "@/components/progress-bar";
import WorkPlayer from "@/components/calculator/work-player";
import SettingsDialog from "@/components/settings/settings-dialog";

export default function Home() {

    const selectedSkill = useLiveQuery(async () => await skillService.getSelectedSkill());
    const selectedArmor = useLiveQuery(async () => await armorService.getSelectedArmor());

    return (
        <NoSSR>
            <div className="flex gap-4 items-stretch justify-evenly flex-col sm:flex-row [&>*]:grow [&>*]:basis-0">

                <SkillSelectButton skill={ selectedSkill }>

                </SkillSelectButton>

                <ArmorSelectButton armor={ selectedArmor } >
                    
                </ArmorSelectButton>

            </div>

            {
                (selectedArmor != null && selectedSkill != null) 
                &&
                <WorkPlayer armor={selectedArmor} skill={selectedSkill}>

                </WorkPlayer>
            }
        </NoSSR>
    );
}
