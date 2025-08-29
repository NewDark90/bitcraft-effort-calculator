import { Button } from "@mui/material";
import { useState } from "react";
import { useInterval } from "usehooks-ts";

export type WorkPlayerProps = {   
    effort: number;
    skillInterval: number;
    onEffortChange: (effort: number) => void; 
};

export default function WorkPlayer(
    { effort, skillInterval, onEffortChange }: WorkPlayerProps
) {

    const [isPlaying, setIsPlaying] = useState(false);

    useInterval(
        () => {

        },
        isPlaying ? skillInterval : null
    )

    const togglePlaying = () => {
        clearInterval(playingInterval);
        setInterval(() => {

        })
        setIsPlaying(!isPlaying);
    }

    return (
        <div className="">
            <Button 
                onClick={togglePlaying}
            >

            </Button>
        </div>
    );
}
 
 
