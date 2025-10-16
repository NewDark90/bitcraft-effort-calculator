import { EntityTable } from "dexie";


export type IDBValidProp = string | number | Date | ArrayBuffer | null | IDBValidProp[];

export type CraftBonusEntity = {
    gatherBonus?: number;
    craftBonus?: number;
    buildBonus?: number;
}

export function slugify(str: string) {
    return str?.toLocaleLowerCase()?.replace(/\s/g, "_");
}

export async function deselectAllEntities<TEntity extends {selected: 0|1}, TProp extends keyof TEntity>(table: EntityTable<TEntity, TProp>, rows?: TEntity[]) {

    const allSelected = rows ?? await table.where({selected: 1}).toArray();
    for (const selected of allSelected) {
        selected.selected = 0;
    }
    
    await table.bulkPut(allSelected);
}

export async function selectEntity<TEntity extends {selected: 0|1}, TProp extends keyof TEntity>(table: EntityTable<TEntity, TProp>, entity: TEntity) {
    const allSelected =  await table.where({selected: 1}).toArray();
    for (const selected of allSelected) {
        selected.selected = 0;
    }

    entity.selected = 1;
    await table.bulkPut([...allSelected, entity]);
}