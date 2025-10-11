import { useTheme } from "@mui/material";
import { WorkProgressStats } from "@/components/calculator/work-player.hooks";
import StatisticItem from '@/components/calculator/statistic-item';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import SkillIcon from "@/components/skill-icon";

export type StaminaStatisticsProps = Pick<WorkProgressStats, 'staminaStats'>;

const tooltipWrapper = (desc: React.ReactNode) => {
    return (
        <div className="text-base text-center">
            <span>For Stamina Bar</span>
            <br />
            <span>{desc}</span>
        </div>
    );
}

export default function StaminaStatistics({ 
    staminaStats: {
        effort,
        workTime,
        staminaRegen
    }
}: StaminaStatisticsProps) {

    const theme = useTheme();

    return (
        <div className="flex flex-row flex-wrap justify-evenly items-baseline">
            <StatisticItem<string>
                prefix={<AccessTimeIcon className='mx-1'></AccessTimeIcon>}
                tooltipContent={
                    tooltipWrapper("Remaining Work Time / Full Work Time")
                }
                left={(workTime.remainingMs / 1000 / 60).toFixed(2)}
                right={(workTime.fullMs / 1000 / 60).toFixed(2)}
                suffix={<span className='mx-1'>Minutes</span>}
            ></StatisticItem>

            <StatisticItem<number>
                prefix={
                    <SkillIcon 
                        className="invert-0 dark:invert -scale-x-100 mx-1"
                        name={ "Power" } 
                        size={ 24 } 
                        folder="/other"

                    ></SkillIcon>
                }
                tooltipContent={
                    tooltipWrapper("Remaining Effort / Full Work Effort")
                }
                left={effort.remaining}
                right={effort.full}
            ></StatisticItem>

            <StatisticItem<string>
                prefix={       
                    <>
                    <ElectricBoltIcon htmlColor="var(--energy, yellow)"></ElectricBoltIcon>
                    <AutorenewIcon></AutorenewIcon>
                    </>
                }
                tooltipContent={
                    tooltipWrapper("Regeneration Time Needed / Full Regeneration Time")
                }
                left={Math.ceil((staminaRegen.timeToFullMs) / 1000).toFixed(0)}
                right={Math.ceil(staminaRegen.fullMs / 1000).toFixed(0)}
                suffix={<span className='mx-1'>Seconds</span>}
            ></StatisticItem>
        </div>
    );
    
}
 
 
