import SkillIcon from "@/components/skill-icon";
import Image from "next/image";
import { TextField } from "@mui/material";

export type SkillPowerProps = { name: string, readOnly?: boolean };

export default function SkillPower(
    { name, readOnly = false }: SkillPowerProps
) {
    return (
        <div>
            <SkillIcon name={name} size={32} />
            <TextField 
                id="outlined-basic" 
                label={name} 
                variant="outlined"
                slotProps={{
                    input: {
                      readOnly: readOnly,
                    },
                }} />
        </div>
    );
}
