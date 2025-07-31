import Image from "next/image";
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';

export type SkillIconProps = { name?: string, size?: number };

export default function SkillIcon(
    { name, size = 16 }: SkillIconProps
) {

    return (
        name && name != "" ?
            <Image
                aria-hidden
                src={`/skills/${name.toLocaleLowerCase()}.svg`}
                alt={`${name} icon`}
                width={ size }
                height={ size }
            />
            : <PanoramaFishEyeIcon />
    );
}
