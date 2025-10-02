export function slugify(str: string) {
    return str?.toLocaleLowerCase()?.replace(/\s/g, "_");
}