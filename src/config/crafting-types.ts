export type CraftingTypeSlug = "gather" | "craft" | "build";
export type CraftingType = {
    slug: CraftingTypeSlug;
    name: string;
}

export const craftingTypes = [
    {
        slug: "gather",
        name: "Gather"
    }, {
        slug: "craft",
        name: "Craft"
    }, {
        slug: "build",
        name: "Build"
    }
] as const;
