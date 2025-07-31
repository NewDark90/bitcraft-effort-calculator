import * as React from 'react';
import { NumberField } from '@base-ui-components/react/number-field';
import { clsx } from 'clsx';
import styles from './index.module.css';

export type NumberInputProps = {
    defaultValue?: number;
    readOnly?: boolean;
    onInput?: (current: number | null) => void;
}

export default function NumberInput(
    { defaultValue, onInput, readOnly }: NumberInputProps
) {
    const id = React.useId();
    return (
        <NumberField.Root id={ id } 
            defaultValue={ defaultValue } 
            className={ styles.Field } 
            onValueChange={(ev) => onInput?.(ev)} 
            readOnly={readOnly ?? false}
        >
            <NumberField.Group className={ styles.Group }>
                <NumberField.Decrement className={ clsx(styles.Decrement, readOnly && "invisible") }>
                    <MinusIcon />
                </NumberField.Decrement>
                <NumberField.Input
                    className={ styles.Input } />
                <NumberField.Increment className={ clsx(styles.Increment, readOnly && "invisible") }>
                    <PlusIcon />
                </NumberField.Increment>
            </NumberField.Group>
        </NumberField.Root>
    );
}

function PlusIcon(props: React.ComponentProps<'svg'>) {
    return (
        <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentcolor"
            strokeWidth="1.6"
            xmlns="http://www.w3.org/2000/svg"
            { ...props }
        >
            <path d="M0 5H5M10 5H5M5 5V0M5 5V10" />
        </svg>
    );
}

function MinusIcon(props: React.ComponentProps<'svg'>) {
    return (
        <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentcolor"
            strokeWidth="1.6"
            xmlns="http://www.w3.org/2000/svg"
            { ...props }
        >
            <path d="M0 5H10" />
        </svg>
    );
}
