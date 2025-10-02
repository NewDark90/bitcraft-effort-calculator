'use client'

import Image from "next/image";
import Link from "next/link";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { armorService } from "@/services/armor-service";
import Armor from "@/app/armor-select/armor";
import { useEffect, useState } from "react";
import { ArmorEntity } from "@/database/entities";
import { Button } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { NoSSR } from "next-dynamic-no-ssr";

export default function ArmorSelect() {

    const [armors, setArmors] = useState<ArmorEntity[]>([]);
    useEffect(() => {
        armorService.getArmors().then((initialArmors) => {
            setArmors(initialArmors);
        })
    }, []);

    return (
        <NoSSR>
            <nav>
                <Link
                    className="m-2 flex justify-baseline font-bold"
                    href={`../`}
                >
                    <ChevronLeftIcon className="mx-1"></ChevronLeftIcon>
                    Calculator
                </Link>
            </nav>
            <div className="flex gap-4 flex-wrap flex-col sm:flex-row">
                {
                    armors?.map((armor, index) =>
                        <Armor armor={armor}
                            key={armor.id}
                            onArmorChange={(newArmor) => {
                                armors[index] = newArmor;
                                setArmors([...armors]);
                                armorService.setArmor(newArmor, armor.id);
                            }}
                            onArmorSelect={(selectedArmor) => {
                                armors.forEach(nonSelectedArmor => nonSelectedArmor.selected = 0);
                                selectedArmor.selected = 1;
                                armors[index] = selectedArmor;
                                setArmors([...armors]);
                                armorService.setSelectedArmor(selectedArmor);
                            }}
                            onArmorDelete={(deletedArmor) => {
                                setArmors(armors.filter(armor => armor.id != deletedArmor.id));
                                armorService.deleteArmor(deletedArmor.id);
                            }}
                        >
                        </Armor>
                    )
                }
                <div>
                    <Button 
                        className="m-2"
                        startIcon={<AddCircleIcon></AddCircleIcon>} 
                        onClick={async () => {
                            const newArmor = await armorService.createNewArmor();
                            setArmors([...armors, newArmor]);
                        }}>
                        New Armor Set
                    </Button>
                </div>
            </div>
        </NoSSR>
    );
}
