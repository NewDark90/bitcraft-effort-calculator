'use client'

import { NoSSR } from 'next-dynamic-no-ssr';
import { useLiveQuery } from "dexie-react-hooks";
import { calculatorDatabase, deselectAllEntities, FoodEntity, FoodType, foodTypes, selectEntity } from "@/database";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useId, useState } from "react";
import { TierNumber, tiers } from "@/config/tier";
import TierSelector from "@/components/tier-selector";
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import clsx from "clsx";
import CalculatorNavLink from "@/components/calculator-nav-link";

export default function FoodSelect() {

    const id = useId();

    const foods = useLiveQuery(async () => await calculatorDatabase.foods.toArray());
    const selectedFood = foods?.find(f => f.selected);

    const [selectedType, setSelectedType] = useState<FoodType|"">("");
    const [selectedTier, setSelectedTier] = useState<TierNumber|"">("");

    useEffect(() => {
        setSelectedType(selectedFood?.type ?? "");
        setSelectedTier(selectedFood?.tier ?? "");
    }, [foods != null]);

    const titleCss = "my-6 text-2xl text-center font-bold leading-none tracking-tight text-gray-950 md:text-3xl lg:text-4xl";

    return (
        <NoSSR>
            <nav className="my-8 w-full max-w-2xl mx-auto">
                <CalculatorNavLink></CalculatorNavLink>
            </nav>
            <section className="w-full max-w-2xl mx-auto">
                <h2 className={titleCss}>
                    Food
                </h2>
                
                <div className={clsx( "m-4 text-center flex flex-row items-baseline justify-evenly", selectedFood ? "" : "invisible")}>
                    <div>
                        <span className="w-full block">
                            <ElectricBoltIcon htmlColor="var(--energy, yellow)"></ElectricBoltIcon>
                            <AutorenewIcon></AutorenewIcon>
                            Stamina Regen
                        </span>
                        <span className="font-bold">
                            {(selectedFood?.staminaRegen ?? 0).toFixed(0)}
                        </span>
                    </div>
                    <div>
                        <span className="w-full block">
                            Gather Bonus
                        </span>
                        <span className="font-bold">
                            {((selectedFood?.gatherBonus ?? 0) * 100).toFixed(2)}%
                        </span>
                    </div>
                    <div>
                        <span className="w-full block">
                            Craft Bonus
                        </span>
                        <span className="font-bold">
                            {((selectedFood?.craftBonus ?? 0) * 100).toFixed(2)}%
                        </span>
                    </div>
                </div>

                <div className="flex flex-col justify-center align-center">
                    <FormControl 
                        sx={{ minWidth: 220 }}
                        className="m-4"
                        >
                        <InputLabel id={`crafting-type-label-${id}`}>
                            Type
                        </InputLabel>
                        <Select
                            labelId={`crafting-type-label-${id}`}
                            label={"Type"}
                            value={selectedType}
                            onChange={async (event) => {
                                const type = event.target.value as FoodType | "";
                                setSelectedType(type);
                                if (type == null) {
                                    await deselectAllEntities(calculatorDatabase.foods, foods);
                                    return;
                                }
                                const toSelectFood = foods?.find(f => f.type === type && f.tier === selectedTier);
                                if (toSelectFood) {
                                    await selectEntity(calculatorDatabase.foods, toSelectFood);
                                }
                            }}
                        >
                            {
                                foodTypes.map(type => (
                                    <MenuItem
                                        value={type}
                                        key={type}
                                    >
                                        { type }
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <TierSelector 
                        className="m-4"
                        tier={selectedTier === "" ? 0 : selectedTier}
                        onTierChange={async (tier) => {
                            setSelectedTier(tier === 0 ? "" : tier);
                            if (tier == null) {
                                await deselectAllEntities(calculatorDatabase.foods, foods);
                                return;
                            }
                            const toSelectFood = foods?.find(f => f.type === selectedType && f.tier === tier);
                            if (toSelectFood) {
                                await selectEntity(calculatorDatabase.foods, toSelectFood);
                            }
                        }}
                        >

                    </TierSelector>
                    
                </div>
            </section>
        </NoSSR>
    );
}
