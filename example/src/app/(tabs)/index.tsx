import { Text, View } from "react-native";
import { Voicevox } from '@kuzulabz/react-native-nitro-voicevox';
import { useModelsStore } from "@/src/store/useModelsStore";
import { Button } from "@/src/components/button";
import { useState } from "react";
import { useLingui } from "@lingui/react/macro";
import { useExpoPlayer } from "@/src/players/useExpoPlayer";
import { VvTextInput } from "@/src/components/textInput";

export default function Index() {
    const { t } = useLingui();
    const { modelIds, metas, getRandomStyleId } = useModelsStore();
    const [text, setText] = useState<string>("こんにちは世界！");
    const [loading, setLoading] = useState(false);

    const { status, onPlay } = useExpoPlayer();

    const speak = async () => {
        setLoading(true);
        const wavUri = await Voicevox.tts(text, getRandomStyleId('talk'));
        onPlay(wavUri as string);
        setLoading(false);
    };

    const checkDir = async () => {
        console.log(metas[0]);
    };

  return (
    <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: 'center',
                padding: 12,
                gap: 12,
            }}
        >
            <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 26}}>TTS</Text>
                <Text>voicevox_core v{Voicevox.VOICEVOX_VERSION}</Text>
            </View>
            <VvTextInput value={text} onChangeText={setText} multiline />
            <Button title={t`Speak`} disabled={modelIds.length === 0 || status.playing || loading} onPress={speak} isLoading={loading} icon="play" />
            <Button title="LOG" onPress={checkDir} />
        </View>
  );
}
