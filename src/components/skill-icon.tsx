import Image from "next/image";

export type SkillIconProps = { name: string, size?: number };

export default function SkillIcon(
    { name, size = 16 }: SkillIconProps
) {
    return (
        <Image
            aria-hidden
            src={`/skills/${name.toLocaleLowerCase()}.svg`}
            alt={`${name} icon`}
            width={ size }
            height={ size }
        />
    );
}
