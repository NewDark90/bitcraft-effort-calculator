

import clsx from 'clsx';
import styles from './progress-bar.module.scss';
import { minmax } from '@/util/minmax';

export type ProgressBarProps = { 
    current: number;
    max: number;
    className?: string;
    barColor?: string;
};

export default function ProgressBar(
    {  current, max, className, barColor = 'var(--energy)' }: ProgressBarProps
) {

    const progressNumber = minmax((current / max) * 100, 0, 100)
    const progressPercentage = progressNumber.toFixed(2) + "%";

    return (
        <div className={ clsx(styles['progress-bar-border'], className) }>
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
 
 
