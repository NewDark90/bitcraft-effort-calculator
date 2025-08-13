export type SkillEntityType = 'skill' | 'profession';

export interface SkillEntity {
    id: string;
    name: string;
    selected: 0 | 1;
    power: number;
    type: SkillEntityType;
}

export interface ArmorEntity {
    id: number;
    name: string;
    selected: 0 | 1;
    energy: number;
    interval: number;
    regenPerSecond: number;
}