import Image from "next/image";
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';

export type SkillIconProps = { name?: string, size?: number, className?: string };

export default function SkillIcon(
    { name, size = 16, className }: SkillIconProps
) {

    return (
        name && name != "" ?
            <Image
                aria-hidden
                src={`/skills/${name.toLocaleLowerCase()}.svg`}
                alt={`${name} icon`}
                width={ size }
                height={ size }
                className={ className }
            />
            : <PanoramaFishEyeIcon />
    );
}
