import Image from "next/image";
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import ButtonLink from "@/components/common/button-link";
import SkillIcon from "@/components/skill-icon";
import { ArmorEntity, SkillEntity } from "@/database/entities";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { CraftingType } from "@/config/crafting-types";

export type WorkStatisticsProps = { 
    
    skill: SkillEntity;
    armor: ArmorEntity;

    craftingType: CraftingType;
    fullEffort: number;
    currentEffort: number;
    currentStamina: number;
};

export default function WorkStatistics({ 
    skill, 
    armor,
    craftingType,
    fullEffort,
    currentEffort,
    currentStamina
}: WorkStatisticsProps) {

    

    return (
        <div>

        </div>
    );
}
 
 
