'use client'

import { armorService } from "@/services/armor-service";
import Armor from "@/app/armor-select/armor";
import { useEffect, useState } from "react";
import { ArmorEntity } from "@/database/tables";
import { Button } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { NoSSR } from "next-dynamic-no-ssr";
import CalculatorNavLink from "@/components/calculator-nav-link";

export default function ArmorSelect() {

    const [armors, setArmors] = useState<ArmorEntity[]>([]);
    useEffect(() => {
        armorService.getArmors().then((initialArmors) => {
            setArmors(initialArmors);
        })
    }, []);
    

    return (
        <NoSSR>
            <nav className="my-8">
                <CalculatorNavLink></CalculatorNavLink>
            </nav>
            <div className="my-4 text-center">
                <p>
                    The percentages for your armor should be in the 
                    <span className="font-bold">&quot;Character&quot;</span> &rarr; <span className="font-bold">&quot;View Detailed Statistics&quot;</span> &rarr; <span className="font-bold">&quot;All Professions&quot;</span>.
                </p>
                <p>Do <span className="font-bold italic">not</span> use the numbers while a food buff is active.</p>
            </div>
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
