

import clsx from 'clsx';
import styles from './progress-bar.module.scss';

export type ProgressBarProps = { 
    current: number;
    max: number;
    barColor: string;
};

export default function ProgressBar(
    {  current, max, barColor = 'var(--energy)' }: ProgressBarProps
) {

    const progressPercentage = ((current / max) * 100).toFixed(2) + "%";

    return (
        <div className={ clsx(styles['progress-bar-border']) }>
            <div className={ clsx(styles['progress-bar-background']) }>
                <div className={ clsx(styles['progress-bar']) }
                    style={{
                        clipPath: `polygon(0% 0%, ${progressPercentage} 0%, ${progressPercentage} 100%, 0% 100%)`,
                        backgroundColor: barColor
                    }}
                    >
                    
                </div>
                <span className={ clsx(styles['progress-bar-label']) }>
                    {Math.floor(current)} / {Math.floor(max)}
                </span>
            </div>
        </div>
    );
}
 
 
