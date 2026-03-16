import { Button } from "@/src/components/button";
import { useModelsStore } from "@/src/store/useModelsStore";
import { useLingui } from "@lingui/react/macro";
import { View } from "react-native";
import { Score, Voicevox } from '@kuzulabz/react-native-nitro-voicevox';
import { useState } from "react";
import audioApi from "@/src/players/audioApi";
import { bench } from "@/src/utils/bench";

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
                const frameAudioQuery = bench('createSingFrameAudioQuery', () => Voicevox.createSingFrameAudioQuery(score, singingTeacherId));
                const result = await bench('frameSynthesis', async () => await Voicevox.frameSynthesis(frameAudioQuery, randomStyleId, 'arraybuffer'));
                await audioApi.reset();
                await audioApi.loadBuffer(result);
                await audioApi.play();
            } catch (e) {
                console.error(e);
            }
            setIsLoading(false);
        }
        
    };

    return(<View style={{flex:1, justifyContent: 'center', alignItems: 'center', gap: 12}}>
        <Button title={t`Load Sing Model`} onPress={loadSingModel} disabled={modelIds.includes('81fed1e8-aa94-4863-ae66-4adacb784879')} isLoading={isSingModelLoading} />
        <Button title={t`Sing`} onPress={onSing} icon="play" disabled={isLoading || !modelIds.includes('81fed1e8-aa94-4863-ae66-4adacb784879')} />
    </View>);
};

export default SingPage;