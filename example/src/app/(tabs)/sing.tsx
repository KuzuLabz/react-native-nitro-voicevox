import { useModelsStore } from "@/src/store/useModelsStore";
import { useLingui } from "@lingui/react/macro";
import { Score, Voicevox } from '@kuzulabz/react-native-nitro-voicevox';
import { useState } from "react";
import audioApi from "@/src/players/audioApi";
import { Button, Column, Spacer } from "@expo/ui";
import { ThemedHost } from "@/src/components/host";

const SingPage = () => {
    const { t } = useLingui();
    const { singerId, singingTeacherId, isSingModelLoading, modelIds, getRandomStyleId, loadSingModel } = useModelsStore();
    const [isLoading, setIsLoading] = useState(false);

    const score: Score = {
        notes: [
            { key: null, frameLength: 15, lyric: "" },
            { key: 60, frameLength: 45, lyric: "ド" },
            { key: 62, frameLength: 45, lyric: "レ" },
            { key: 64, frameLength: 45, lyric: "ミ" },
            { key: null, frameLength: 15, lyric: "" },
        ]
    };

    const onSing = async () => {
        if (singingTeacherId && singerId) {
            try {
                setIsLoading(true);
                const randomStyleId = getRandomStyleId('sing');
                console.log('Sing StyleId:', randomStyleId);
                const frameAudioQuery = Voicevox.createSingFrameAudioQuery(score, singingTeacherId);
                const result = await Voicevox.frameSynthesis(frameAudioQuery, randomStyleId, 'arraybuffer');
                await audioApi.reset();
                await audioApi.loadBuffer(result);
                await audioApi.play();
            } catch (e) {
                console.error(e);
            }
            setIsLoading(false);
        }
        
    };


    return(
        <ThemedHost style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Column spacing={12} alignment="center">
                <Spacer flexible />
                    <Button label={t`Load Sing Model`} onPress={loadSingModel} disabled={modelIds.includes('81fed1e8-aa94-4863-ae66-4adacb784879') || isSingModelLoading} />
                    <Button label={t`Sing`} onPress={onSing} disabled={isLoading || !modelIds.includes('81fed1e8-aa94-4863-ae66-4adacb784879')} />
                <Spacer flexible />
            </Column>
        </ThemedHost>
    );
};

export default SingPage;