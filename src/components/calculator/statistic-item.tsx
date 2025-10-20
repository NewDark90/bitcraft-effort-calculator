import { styled, Tooltip, tooltipClasses, TooltipProps, useTheme } from "@mui/material";
import clsx from "clsx";
import React from 'react';

export type StatisticItemProps<TValue extends React.ReactNode = React.ReactNode> = {
    left: TValue;
    right: TValue;
    
    className?: string;

    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    tooltipContent?: React.ReactNode;
    transform?: (val: TValue) => React.ReactNode;
};


const NoMaxWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: "100%",
  },
});


export default function StatisticItem<TValue extends React.ReactNode>({ 
    prefix,
    suffix,
    tooltipContent,
    left,
    right,
    transform,
    className
}: StatisticItemProps<TValue>) {

    const theme = useTheme();

    return (
        <NoMaxWidthTooltip title={ tooltipContent }>
            <div className={clsx("flex flex-row flex-nowrap font-bold justify-center items-center", className)}>
                {prefix}
                <div className="text-right" style={{color: theme.palette.secondary.main }}> 
                    {transform?.(left) ?? left} 
                </div>
                <div className="grow-0 shrink">
                    /
                </div>
                <div className="text-left"> 
                    {transform?.(right) ?? right} 
                </div>
                {suffix}
            </div>
        </NoMaxWidthTooltip>
    );
    
}
 
 
