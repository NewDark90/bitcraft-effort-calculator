import * as React from 'react';
import { NumberField } from '@base-ui-components/react/number-field';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { clsx } from 'clsx';
import './index.theme.scss';
import styles from './index.module.scss';

export type NumberInputProps = {
    value?: number;
    readOnly?: boolean;
    readOnlyField?: boolean;
    readOnlyStep?: boolean;
    label?: string | React.ReactElement;
    displayStepValue?: boolean;
    className?: string;
} & NumberField.Root.Props

export default function NumberInput(
    { 
        value, 
        readOnly, 
        readOnlyField,
        readOnlyStep,
        className, 
        label, 
        displayStepValue, 
        onInput, 
        ...props 
    }: NumberInputProps
) {
    const id = React.useId();
    return (
        <NumberField.Root 
            { ...props }
            id={ id } 
            value={ value } 
            className={ `${styles.Field} ${className ?? ""}` } 
            
            readOnly={readOnly ?? false}
        >
            {
                label && <label htmlFor={id} className={styles.Label}>
                    {label}
                </label>
            }
            <NumberField.Group className={ styles.Group }>
                {
                    props.step !== 0 &&
                        <NumberField.Decrement className={ clsx(styles.Decrement, (readOnly || readOnlyStep) && "!hidden") }>
                            <RemoveIcon fontSize='small' /> {displayStepValue && props.step?.toString()}
                        </NumberField.Decrement>
                }
                
                <NumberField.Input
                    readOnly={readOnly || readOnlyField}
                    className={ styles.Input } />

                {
                    props.step !== 0 &&
                        <NumberField.Increment className={ clsx(styles.Increment, (readOnly || readOnlyStep) && "!hidden") }>
                            <AddIcon fontSize='small' /> {displayStepValue && props.step?.toString()}
                        </NumberField.Increment>
                }
            </NumberField.Group>
        </NumberField.Root>
    );
}
