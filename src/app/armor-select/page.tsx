'use client'

import Image from "next/image";
import Link from "next/link";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useLiveQuery } from "dexie-react-hooks";
import { armorService } from "@/services/armor-service";
import Armor from "@/app/armor-select/armor";

export default function ArmorSelect() {

    const armors = useLiveQuery(async () => await armorService.getArmors());

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <nav>
                    <Link
                        className="m-2 flex justify-baseline font-bold"
                        href={`../`}
                    >
                        <ChevronLeftIcon className="mx-1"></ChevronLeftIcon>
                        Calculator
                    </Link>
                </nav>
                <div className="flex gap-4 flex-wrap items-center flex-col sm:flex-row">
                    {
                        armors?.map((armor) =>
                            <Armor armor={armor}
                                key={armor.id}
                            >

                            </Armor>
                        )
                    }
                </div>
            </main>
        </div>
    );
}
