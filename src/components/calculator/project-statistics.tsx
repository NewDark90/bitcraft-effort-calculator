
import { WorkProgressStats } from "@/components/calculator/work-player.hooks";
import StatisticItem from '@/components/calculator/statistic-item';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import HexagonIcon from '@mui/icons-material/Hexagon';

export type ProjectStatisticsProps = Pick<WorkProgressStats, "projectStats">;

const tooltipWrapper = (desc: React.ReactNode) => {
    return (
        <div className="text-base text-center">
            <span>For Whole Project</span>
            <br />
            <span>{desc}</span>
        </div>
    );
}

export default function ProjectStatistics({ 
    projectStats: {
        workTime,
        staminaBar,
        staminaRegen
    }
}: ProjectStatisticsProps) {

    return (
        <div className="flex flex-row flex-wrap justify-evenly items-center [&>*]:my-1">
            <StatisticItem<string>
                prefix={<AccessTimeIcon className='mx-1'></AccessTimeIcon>}
                tooltipContent={
                    tooltipWrapper("Remaining Work Time / Full Work Time")
                }
                left={(workTime.remainingMs / 1000 / 60).toFixed(2)}
                right={(workTime.fullMs / 1000 / 60).toFixed(2)}
                suffix={<span className='mx-1'>Minutes</span>}
            ></StatisticItem>

            <StatisticItem<string>
                prefix={       
                    <div className="relative mx-1 w-[36px]">
                        <HexagonIcon className="absolute top-[50%] left-[50%] translate-[-50%] scale-x-150 scale-y-75"></HexagonIcon>
                        <HexagonIcon className="absolute top-[50%] left-[50%] translate-[-50%] scale-x-125 scale-y-50" htmlColor="var(--energy, yellow)"></HexagonIcon>
                    </div>
                }
                tooltipContent={
                    tooltipWrapper("Remaining Stamina Bars to Complete / All Stamina Bars")
                }
                left={staminaBar.remaining.toFixed(2)}
                right={staminaBar.total.toFixed(2)}
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
                left={Math.ceil((staminaRegen.remainingMs) / 1000).toFixed(0)}
                right={Math.ceil(staminaRegen.fullMs / 1000).toFixed(0)}
                suffix={<span className='mx-1'>Seconds</span>}
            ></StatisticItem>
        </div>
    );
    
}
 
 
