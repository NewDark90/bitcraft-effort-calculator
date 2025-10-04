import { BitcraftCalculatorDatabase } from "@/database/db";

export interface ArmorEntity {
    id: number;
    name: string;
    selected: 0 | 1;
    stamina: number;
    gatherBonus: number;
    craftBonus: number;
    buildBonus: number;
}

export const armorColumns = (
    [
        'id',
        'name',
        'selected',
        'stamina',
        'gatherBonus',
        'craftBonus',
        'buildBonus'
    ] satisfies Array<keyof ArmorEntity>
);
armorColumns[0] = `++${armorColumns[0]}` as any; //autoincrement definition


export const initializeArmor = async (db: BitcraftCalculatorDatabase) => {

    const allCurrentArmors = await db.armors.toArray();

    if (allCurrentArmors.length) {
        return;
    }

    const armors: Omit<ArmorEntity, "id">[] = [
        {
            name: "Cloth",
            selected: 1,
            stamina: 100,
            buildBonus: 0,
            craftBonus: 0,
            gatherBonus: 0
        }, {
            name: "Leather",
            selected: 0,
            stamina: 100,
            buildBonus: 0,
            craftBonus: 0,
            gatherBonus: 0
        }
    ];

    await db.armors.bulkAdd(armors)
}
