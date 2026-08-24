import { Voicevox } from '@kuzulabz/react-native-nitro-voicevox';
import { useModelsStore } from "@/src/store/useModelsStore";
import { useState } from "react";
import { useLingui } from "@lingui/react/macro";
import { useExpoPlayer } from "@/src/players/useExpoPlayer";
import { SAMPLE_TEXT } from "@/src/constants/text";
import { Column, TextInput, Text, Button, useNativeState } from '@expo/ui';
import { ThemedHost } from '@/src/components/host';

export default function Index() {
    const { t } = useLingui();
    const { modelIds, getRandomStyleId } = useModelsStore();
    const text = useNativeState(SAMPLE_TEXT);
    const [loading, setLoading] = useState(false);

    const { status, onPlay } = useExpoPlayer();

    const speak = async () => {
        setLoading(true);
        const wavUri = await Voicevox.tts(text.value, getRandomStyleId('talk'));
        onPlay(wavUri as string);
        setLoading(false);
    };

    return (
        <ThemedHost style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Column alignment='center' spacing={6} >
                <Text>TTS</Text>
                <Text>{'voicevox_core v' + Voicevox.VOICEVOX_VERSION}</Text>
                <Column spacing={12} alignment='center' style={{paddingHorizontal: 12}}>
                    <TextInput value={text} multiline style={{ width: '100%', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#000000' }} />
                    <Button label={t`Speak`} disabled={modelIds.length === 0 || status.playing || loading} onPress={speak}  />
                </Column>
            </Column>
        </ThemedHost>
    );
}
