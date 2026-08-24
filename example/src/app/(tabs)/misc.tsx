import { ThemedHost } from "@/src/components/host";
import { SAMPLE_TEXT } from "@/src/constants/text";
import { Button, Column, Spacer } from "@expo/ui";
import { Voicevox } from "@kuzulabz/react-native-nitro-voicevox";
import { useLingui } from "@lingui/react/macro";

const MiscPage = () => {
    const { t } = useLingui();

    const onAnalyze = () => {
        console.log(JSON.stringify(Voicevox.analyze(SAMPLE_TEXT), undefined, 2));
    };

    const onSupportedDevices = () => {
        console.log(Voicevox.getSupportedDevices());
    };

    return(
        <ThemedHost style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Column alignment="center">
                <Spacer flexible />
                <Button label={t`Analyze`} onPress={onAnalyze} />
                <Button label={t`Supported Devices`} onPress={onSupportedDevices} />
                <Spacer flexible />
            </Column>
        </ThemedHost>
    );
};

export default MiscPage;