'use client'

import { NoSSR } from 'next-dynamic-no-ssr';
import { useLiveQuery } from "dexie-react-hooks";
import { calculatorDatabase, deselectAllEntities, FoodEntity, foodOverrideId, FoodType, foodTypes, selectEntity } from "@/database";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Switch, Tooltip } from "@mui/material";
import { ChangeEvent, useCallback, useId, useMemo, useState } from "react";
import { TierNumber } from "@/config/tier";
import TierSelector from "@/components/tier-selector";
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import clsx from "clsx";
import CalculatorNavLink from "@/components/calculator-nav-link";
import { useEffectChange } from '@/hooks/use-effect-change';
import NumberInput from '@/components/common/number-input';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useFormatters } from '@/hooks/use-formatters';

export default function FoodSelect() {

    const id = useId();
    const { staminaRegenFormatter } = useFormatters();

    const foods = useLiveQuery(async () => await calculatorDatabase.foods.toArray());
    const selectedFood = foods?.find(f => f.selected);

    const [selectedType, setSelectedType] = useState<FoodType|"">("");
    const [selectedTier, setSelectedTier] = useState<TierNumber|"">("");

    const isOverride = selectedFood?.id === foodOverrideId;
    const validTiers = foods?.filter(f => f.type === selectedType && f.id !== foodOverrideId).map(f => f.tier);
    
    useEffectChange(() => {
        setSelectedType(selectedFood?.type ?? "");
        setSelectedTier(selectedFood?.tier ?? "");
    }, [foods != null]);

    const selectPresetFood = async (type: FoodType | "", tier: TierNumber | "") => {
        const toSelectFood = foods?.find(f => f.type === type && f.tier === tier);
        if (toSelectFood) {
            await selectEntity(calculatorDatabase.foods, toSelectFood);
        }
    }

    const patchFood = async (food: FoodEntity | undefined, changes: Partial<FoodEntity>) => {
        if (!food) return;

        await calculatorDatabase.foods.put({
            ...food,
            ...changes
        });
    }
    
    const onModeChange = async (event: ChangeEvent<HTMLInputElement>, overrideToggle: boolean) => {
        if (overrideToggle) {
            await deselectAllEntities(calculatorDatabase.foods, foods);
            const overrideFood = foods?.find(f => f.id === foodOverrideId) as FoodEntity;
            await patchFood(overrideFood, {selected: 1});
        } else {
            const previousFoodPreset = foods?.find(f => f.type === selectedType && f.tier === selectedTier);
            const foodPreset = previousFoodPreset?.id !== foodOverrideId 
                ? previousFoodPreset 
                : foods?.[0];
            if (foodPreset) {
                await selectEntity(calculatorDatabase.foods, foodPreset);
            }
        }
    }

    const onTypeChange = async (event: SelectChangeEvent<FoodType | "">) => {
        const type = event.target.value as FoodType | "";
        setSelectedType(type);
        if (type == null) {
            await deselectAllEntities(calculatorDatabase.foods, foods);
            return;
        }

        await selectPresetFood(type, selectedTier);
    }

    const onTierChange = async (tier: TierNumber) => {
        setSelectedTier(tier === 0 ? "" : tier);
        if (tier == null) {
            await deselectAllEntities(calculatorDatabase.foods, foods);
            return;
        }
        await selectPresetFood(selectedType, tier);
    }

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
                
                <div className={clsx("m-4 text-center flex flex-row items-baseline justify-evenly [&>*]:m-1")}>
                    <Tooltip 
                        placement="top"  
                        title={
                            <div className="text-base text-center">
                                <span>Only regenerates while <span className="font-bold italic">not</span> crafting.</span>
                            </div>
                        }
                    >
                        <div>
                            <span className="w-full block">
                                Passive Stamina Regen
                            </span>
                            <span className="font-bold">
                                <PauseIcon></PauseIcon>
                                <ElectricBoltIcon htmlColor="var(--energy, yellow)"></ElectricBoltIcon>
                                &nbsp;
                                {staminaRegenFormatter.format(selectedFood?.staminaRegen ?? 0)}
                            </span>
                        </div>
                    </Tooltip>
                    <Tooltip 
                        placement="top"  
                        title={
                            <div className="text-base text-center">
                                <span>Always active, even while crafting.</span>
                            </div>
                        }
                    >
                        <div>
                            <span className="w-full block">
                                Active Stamina Regen
                            </span>
                            <span className="font-bold">
                                <PlayArrowIcon></PlayArrowIcon>
                                <ElectricBoltIcon htmlColor="var(--energy, yellow)"></ElectricBoltIcon>
                                &nbsp;
                                {staminaRegenFormatter.format(selectedFood?.activeStaminaRegen ?? 0)}
                            </span>
                        </div>
                    </Tooltip>
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

                <div className="flex flex-row justify-center items-center">
                    <div>
                        Presets
                    </div>
                    <Switch
                        checked={isOverride}
                        onChange={onModeChange}
                    >
                    </Switch>
                    <div>
                        Manual
                    </div>
                </div>

                {/* Preset Foods */}
                <div className={clsx("flex flex-col justify-center items-center", isOverride ? "hidden" : "")} >
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
                            onChange={onTypeChange}
                        >
                            {
                                foodTypes
                                    .filter(type => type != 'Custom Food')
                                    .map(type => (
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
                        subsetTiers={validTiers}
                        onTierChange={onTierChange}
                        >
                    </TierSelector>
                    
                </div>

                {/* Manual Settings */}
                <div className={clsx("flex flex-col justify-center items-center", isOverride ? "" : "hidden")} >
                   <NumberInput 
                        className="my-2"
                        value={selectedFood?.staminaRegen ?? 0} 
                        label={
                            <span className="mx-1">Passive Stamina Regen</span>
                        }
                        step={1}
                        min={0.01}
                        format={{
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2
                        }}
                        onValueChange={async (passiveStaminaRegen) => {
                            if (passiveStaminaRegen == null) 
                                return;
                            await patchFood(selectedFood, {staminaRegen: passiveStaminaRegen})
                        }}
                    >
                    </NumberInput>

                    <NumberInput 
                        className="my-2"
                        value={selectedFood?.activeStaminaRegen ?? 0} 
                        label={
                            <span className="mx-1">Active Stamina Regen</span>
                        }
                        step={0.1}
                        min={0.01}
                        format={{
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2
                        }}
                        onValueChange={async (activeStaminaRegen) => {
                            if (activeStaminaRegen == null) 
                                return;
                            await patchFood(selectedFood, {activeStaminaRegen: activeStaminaRegen})
                        }}
                    >
                    </NumberInput>

                    <NumberInput 
                        className="my-2"
                        value={(selectedFood?.gatherBonus ?? 0) * 100} 
                        label={
                            <span className="mx-1">Gather Bonus %</span>
                        }
                        step={1}
                        min={0.01}
                        format={{
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2
                        }}
                        onValueChange={async (gatherBonus) => {
                            if (gatherBonus == null) 
                                return;
                            await patchFood(selectedFood, {gatherBonus: (gatherBonus / 100)})
                        }}
                    >
                    </NumberInput>

                    <NumberInput 
                        className="my-2"
                        value={(selectedFood?.craftBonus ?? 0) * 100} 
                        label={
                            <span className="mx-1">Craft Bonus %</span>
                        }
                        step={1}
                        min={0.01}
                        format={{
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2
                        }}
                        onValueChange={async (craftBonus) => {
                            if (craftBonus == null) 
                                return;
                            await patchFood(selectedFood, {craftBonus: (craftBonus / 100)})
                        }}
                    >
                    </NumberInput>

                </div>
            </section>
        </NoSSR>
    );
}
