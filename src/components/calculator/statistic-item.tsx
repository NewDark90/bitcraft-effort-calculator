
import humanizeDuration from 'humanize-duration';
import { styled, Theme, Tooltip, tooltipClasses, TooltipProps, useTheme } from "@mui/material";
import React from 'react';

export type StatisticItemProps<TValue extends React.ReactNode = React.ReactNode> = {
    left: TValue;
    right: TValue;
    
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
    transform
}: StatisticItemProps<TValue>) {

    const theme = useTheme();

    return (
        <NoMaxWidthTooltip title={ tooltipContent }>
            <div className="flex flex-row flex-nowrap font-bold">
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
 
 
