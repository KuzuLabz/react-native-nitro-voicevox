import { Button } from "@/src/components/button";
import { ParentView } from "@/src/components/container";
import { SAMPLE_TEXT } from "@/src/constants/text";
import { bench } from "@/src/utils/bench";
import { Voicevox } from "@kuzulabz/react-native-nitro-voicevox";

const MiscPage = () => {
    const onAnalyze = () => {
        console.log(bench('analyze', () => Voicevox.analyze(SAMPLE_TEXT)));
    };

    const onSupportedDevices = () => {
        console.log(bench('getSupportedDevices', () => Voicevox.getSupportedDevices()));
    };

    return(
        <ParentView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap:12, paddingHorizontal: 12, paddingVertical: 24}}>
            <Button title="Analyze" onPress={onAnalyze} />
            <Button title="Supported Devices" onPress={onSupportedDevices} />
        </ParentView>
    );
};

export default MiscPage;