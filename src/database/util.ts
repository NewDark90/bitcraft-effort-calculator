

export type IDBValidProp = string | number | Date | ArrayBuffer | null | IDBValidProp[];

export function slugify(str: string) {
    return str?.toLocaleLowerCase()?.replace(/\s/g, "_");
}