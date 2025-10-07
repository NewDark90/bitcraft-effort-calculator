'use client'

import ArmorSelectButton from "@/components/calculator/armor-select-button";
import SkillSelectButton from "@/components/calculator/skill-select-button";
import { armorService } from "@/services/armor-service";
import { skillService } from "@/services/skill-service";
import { useLiveQuery } from "dexie-react-hooks";
import { NoSSR } from 'next-dynamic-no-ssr';
import WorkPlayer from "@/components/calculator/work-player";
import { calculatorDatabase, FoodEntity } from "@/database";
import FoodSelectButton from "@/components/calculator/food-select-button";
import { useState } from "react";
import { CraftingTypeSlug } from "@/config/crafting-types";

export default function Home() {

    const selectedSkill = useLiveQuery(async () => await skillService.getSelectedSkill());
    const selectedArmor = useLiveQuery(async () => await armorService.getSelectedArmor());
    const selectedFood = useLiveQuery(async () => await calculatorDatabase.foods.where("selected" satisfies keyof FoodEntity).equals(1).first());
    const [selectedType, setSelectedType] = useState<CraftingTypeSlug>();

    return (
        <NoSSR>
            <div className="flex gap-4 items-stretch justify-evenly flex-col sm:flex-row [&>*]:grow [&>*]:basis-0">

                <SkillSelectButton skill={ selectedSkill }>

                </SkillSelectButton>

                <ArmorSelectButton armor={ selectedArmor } craftType={ selectedType }>
                    
                </ArmorSelectButton>

                <FoodSelectButton food={ selectedFood } craftType={ selectedType }>

                </FoodSelectButton>
            </div>

            {
                (selectedArmor != null && selectedSkill != null) 
                &&
                <WorkPlayer 
                    armor={selectedArmor} 
                    skill={selectedSkill} 
                    food={selectedFood}
                    onCraftingTypeChange={(type) => {
                        setSelectedType(type);
                    }}>

                </WorkPlayer>
            }
        </NoSSR>
    );
}
