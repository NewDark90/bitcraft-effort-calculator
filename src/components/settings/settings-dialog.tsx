
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import { 
    FormGroup, 
    FormControlLabel, 
    Switch, 
    Dialog, 
    IconButton, 
    DialogTitle,
    CircularProgress,
    DialogContent,
    Tooltip,
    Select,
    MenuItem
} from '@mui/material';
import { useSettings } from '@/hooks/use-settings';
import NumberInput from '@/components/common/number-input';
import InfoIcon from '@mui/icons-material/Info';
import { notificationStyles } from '@/database';
import { useNotificationSettings } from '@/hooks/use-notification-settings';

const labelWrapper = (title: React.ReactNode, tooltip?: React.ReactNode) => {
    return (
        <div className="flex flex-col items-center my-1">
            <h3 className="text-xl">
                {title}
            </h3>
            {tooltip && (
                <span className="text-xs flex flex-row flex-nowrap"> 
                    <InfoIcon color='info' />
                    {tooltip}
                </span>
            )}
        </div>
    );
}

export type SettingsDialogProps = {
    buttonClassName?: string
}

export default function SettingsDialog(
    { buttonClassName }: SettingsDialogProps
) {
    const [isOpen, setIsOpen] = useState(false);

    const openDialog = () => {
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
    };

    const { 
        isLoadingSettings,
        settings
    } = useSettings();

    const {
        setNotificationStyle
    } = useNotificationSettings();

    return (
        <>
            <IconButton 
                className={ buttonClassName }
                onClick={ openDialog }>
                <SettingsIcon fontSize='large'></SettingsIcon> 
            </IconButton>
            <Dialog
                maxWidth="xs"
                fullWidth={true}
                scroll='paper'
                open={ isOpen }
                onClose={ closeDialog }
            >
                <DialogTitle>
                    Settings
                </DialogTitle>
                <IconButton
                    color="inherit"
                    onClick={ closeDialog }
                    aria-label="close"
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                {
                    isLoadingSettings == null
                        ? <CircularProgress></CircularProgress>
                        : 
                            <FormGroup className='[&>*]:m-1'>

                                <FormControlLabel 
                                    labelPlacement='top'
                                    label={labelWrapper("Play Audio Alarm")}
                                    control={
                                        <Switch 
                                            checked={settings.playAlarmAudio.value === 1}  
                                            onChange={event => settings.playAlarmAudio.save(event.target.checked ? 1 : 0)}
                                        />
                                    }>
                                </FormControlLabel>
                                {/* 
                                This functionality won't work without a VAPID implementation that I'm not going to commit to (yet, maybe).

                                <FormControlLabel 
                                    labelPlacement='top'
                                    label={
                                        labelWrapper(
                                            "Notification Type", 
                                            `Notifications have inconsistent support between browsers. Changing this to a "on" setting will request notification permissions. ` +
                                                `Notification permission requests may be automatically blocked by your browser.`
                                        )
                                    }
                                    control={
                                        <Select
                                            value={settings.notificationStyle.value}
                                            onChange={(event) => {
                                                setNotificationStyle(event.target.value);
                                            }}
                                        >
                                            {
                                                notificationStyles.map(style => 
                                                    <MenuItem value={style.value}>
                                                        {style.name}
                                                    </MenuItem>
                                                )
                                            }
                                        </Select>
                                    }>
                                </FormControlLabel>
                                */}
                                <FormControlLabel 
                                    labelPlacement='top'
                                    label={
                                        labelWrapper(
                                            "Network Delay (milliseconds)",
                                            `Interval may not perfectly match the game speed due to network round trips. If the timing is off, try changing the "network delay" setting.`
                                        )
                                    }
                                    control={
                                        <NumberInput 
                                            value={settings.networkDelay.value}
                                            onValueChange={(val) => {
                                                if (val) {
                                                    settings.networkDelay.save(val);
                                                }
                                            }}
                                            >
                                        </NumberInput>
                                    }>
                                </FormControlLabel>
                                
                            </FormGroup>
                }
                </DialogContent>
            </Dialog>
        </>
    );
}