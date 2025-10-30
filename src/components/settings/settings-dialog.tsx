
import { ChangeEventHandler, useId, useRef, useState } from 'react';
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
    Stack,
    Slider,
    Button,
    FormControl,
    Select,
    InputLabel,
    MenuItem
} from '@mui/material';
import { useSettings } from '@/hooks/use-settings';
import NumberInput from '@/components/common/number-input';
import InfoIcon from '@mui/icons-material/Info';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { defaultAlarms } from '@/config/sounds';
import { useSounds } from '@/hooks/use-sounds';

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
    const id = useId();
    const [isOpen, setIsOpen] = useState(false);

    const openDialog = () => {
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
    };

    const [isLoadingUpload, setIsLoadingUpload] = useState(false);
    const alarmInputRef = useRef<HTMLInputElement>(null);

    const { 
        isLoadingSettings,
        settings
    } = useSettings();

    const { 
        tryPlayAudio,
        setAlarmVolume
    } = useSounds();

    const onFileUploadChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const selectedFiles = event.target.files;

        if (!selectedFiles || selectedFiles.length == 0) {
            return;
        }
        setIsLoadingUpload(true);
        
        const file = selectedFiles[0];

        const reader = new FileReader();
        reader.addEventListener("load", async () => {
            Promise.all([
                settings.alarmFile.save(reader.result as string),
                settings.alarmName.save(file.name)
            ])
                .finally(() => {
                    setIsLoadingUpload(false);
                });
        });
        reader.addEventListener("error", () => {
            setIsLoadingUpload(false);
        })
        reader.readAsDataURL(file);
    }

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
                                <FormControlLabel
                                    labelPlacement='top'
                                    label={labelWrapper("Alarm Volume")}
                                    control={
                                        <Stack spacing={2} direction="row" sx={{ alignItems: 'center', mb: 1, width: "100%", maxWidth: "300px" }}>
                                            <VolumeDownIcon />
                                            <Slider 
                                                aria-label="Volume" 
                                                value={settings.alarmVolume.value} 
                                                step={0.01}
                                                min={0.01}
                                                max={1}
                                                onChange={async (_event, newValue) => { 
                                                    await setAlarmVolume(newValue)
                                                    tryPlayAudio("work-complete");
                                                }} />
                                            <VolumeUpIcon />
                                        </Stack>
                                    }>
                                </FormControlLabel>

                                <div>
                                    {labelWrapper("Alarm Sound")}
                                    <div className='flex flex-row flex-wrap items-center justify-evenly [&>*]:m-1'>
                                        <span className='w-full text-center'>
                                            {settings.alarmName.value}
                                        </span>

                                        <FormControl 
                                            sx={{ minWidth: 140 }}
                                        >
                                            <InputLabel id={`preset-alarms-${id}`}>
                                                Alarm
                                            </InputLabel>
                                            <Select
                                                labelId={`preset-alarms-${id}`}
                                                label={"Alarm Options"}
                                                value={settings.alarmName.value}
                                                autoWidth={true}
                                                displayEmpty
                                                onChange={(event) => {
                                                    const alarm = defaultAlarms.find(a => a.name === event.target.value);
                                                    if (alarm) {
                                                        settings.alarmFile.save(alarm.filePath);
                                                        settings.alarmName.save(alarm.name);
                                                    }
                                                }}
                                            >
                                                <MenuItem value="">
                                                    &nbsp;
                                                </MenuItem>
                                                {
                                                    defaultAlarms.map(alarm => (
                                                        <MenuItem
                                                            value={alarm.name}
                                                            key={alarm.name}
                                                        >
                                                            {alarm.name}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                        
                                        <input
                                            accept="audio/*, .mp3, .wav, .aac, .m4a, .webm"
                                            style={{ display: 'none' }}
                                            id="raised-button-file"
                                            type="file"
                                            ref={alarmInputRef}
                                            onChange={onFileUploadChange}
                                        />
                                        
                                        <Button variant="outlined" 
                                            disabled={isLoadingUpload}
                                            onClick={() => {
                                                alarmInputRef.current?.click();
                                            }}
                                            startIcon={ 
                                                isLoadingUpload 
                                                    ? <CircularProgress />
                                                    : <FileUploadIcon></FileUploadIcon>
                                            }>
                                            Custom Alarm
                                        </Button>
                                    </div>
                                </div>
                                
                                
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
                                            "Craft Delay (milliseconds)",
                                            `The calculator craft interval may go faster than the game. This setting forces a delay to the craft interval to help match the actual game crafting speed.`
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