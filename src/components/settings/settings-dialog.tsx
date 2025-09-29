
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
    DialogContent
} from '@mui/material';
import { useSettings } from '@/hooks/use-settings';


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
                            <FormGroup>
                                <FormControlLabel control={
                                    <Switch 
                                        checked={settings.playAlarmAudio.value === 1}  
                                        onChange={event => settings.playAlarmAudio.save(event.target.checked ? 1 : 0)}
                                    />
                                } label="Play Audio Alarm" />
                            </FormGroup>
                }
                </DialogContent>
            </Dialog>
        </>
    );
}