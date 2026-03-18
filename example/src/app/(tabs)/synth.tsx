import { useModelsStore } from "@/src/store/useModelsStore";
import { AudioQuery, Voicevox } from "@kuzulabz/react-native-nitro-voicevox";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/src/components/button";
import { useLingui } from "@lingui/react/macro";
import audioApi from "@/src/players/audioApi";
import { VvTextInput } from "@/src/components/textInput";
import { ParentView } from "@/src/components/container";
import { SAMPLE_TEXT } from "@/src/constants/text";
import { ThemedSlider } from "@/src/components/slider";

const AdvancedTab = () => {
    const { t } = useLingui();
    const { styleId } = useModelsStore();
    const [source, setSource] = useState<ArrayBuffer | null>(null);
    const [audioQuery, setAudioQuery] = useState<AudioQuery | null>(null);
    const [text, setText] = useState(SAMPLE_TEXT);

    const createAudioQuery = async () => {
        if (text && styleId) {
            const aq = Voicevox.createAudioQuery(text, styleId);
            setAudioQuery(aq);
        }
    };

    const updateAudioQuery = (config: Partial<AudioQuery>) => {
        setAudioQuery((prev) => {
            if (prev) {
                return {...prev, ...config}
            } else {
                return prev
            }
        });
    };

    const onSynth = async () => {
        if (!styleId) {
            console.log('Select a styleId!');
            return;
        }
        if (audioQuery) {
            setSource(null);
            const result = await Voicevox.synthesis(audioQuery, styleId, {format: 'arraybuffer', enableInterrogativeUpspeak: true});
            if (result instanceof ArrayBuffer) {
                setSource(result)
            }
        }
    };

    const playAudio = async () => {
        if (source) {
            await audioApi.reset();
            await audioApi.loadBuffer(source);
            await audioApi.play();
        }
    };

    const onSaveWav = async () => {
        // saveAudio
        if (source && styleId && text) {
            const fileName = `${styleId}-${text}.wav`;
            await audioApi.saveAudio(fileName, source);
        }
    };

    return(
            <ParentView style={{height: '100%', gap: 8, padding: 12, paddingTop: 28, paddingBottom: 92, justifyContent: 'space-between'}}>
                <View style={{gap: 12}}>
                    <VvTextInput value={text} onChangeText={setText} multiline />
                    <Button title={`${audioQuery ? 'Recreate' : 'Create'} AudioQuery`} onPress={createAudioQuery} icon="code-braces" />
                    {
                        audioQuery && <View>
                            <ThemedSlider
                                title={t`Speed`} 
                                value={audioQuery.speedScale} 
                                maximumValue={2.0} minimumValue={0.5}
                                step={0.01} 
                                onValueChange={(val) => updateAudioQuery({ speedScale: Number(val.toFixed(2)) })} 
                                onReset={() => updateAudioQuery({ speedScale: 1.0})}
                            />
                            <ThemedSlider 
                                title={t`Pitch`} 
                                value={audioQuery.pitchScale} 
                                maximumValue={0.15} minimumValue={-0.15} 
                                step={0.01} 
                                onValueChange={(val) => updateAudioQuery({ pitchScale: Number(val.toFixed(2)) })}  
                                onReset={() => updateAudioQuery({ pitchScale: 0})}
                            />
                            <ThemedSlider 
                                title={t`Intonation`} 
                                value={audioQuery.intonationScale} 
                                maximumValue={2.0} minimumValue={0} 
                                step={0.01} 
                                onValueChange={(val) => updateAudioQuery({ intonationScale: Number(val.toFixed(2)) })}  
                                onReset={() => updateAudioQuery({ intonationScale: 1})}
                            />
                            <ThemedSlider 
                                title={t`Volume`} 
                                value={audioQuery.volumeScale} 
                                maximumValue={2.0} minimumValue={0} 
                                step={0.01} 
                                onValueChange={(val) => updateAudioQuery({ volumeScale: Number(val.toFixed(2)) })}  
                                onReset={() => updateAudioQuery({ volumeScale: 1})}
                            />
                            <ThemedSlider 
                                title={t`Starting Silence`} 
                                value={audioQuery.prePhonemeLength} 
                                maximumValue={1.5} minimumValue={0} 
                                step={0.01} 
                                onValueChange={(val) => updateAudioQuery({ prePhonemeLength: Number(val.toFixed(2)) })} 
                                onReset={() => updateAudioQuery({ prePhonemeLength: 0.10})} 
                            />
                            <ThemedSlider 
                                title={t`Ending Silence`} 
                                value={audioQuery.postPhonemeLength} 
                                maximumValue={1.5} 
                                minimumValue={0} 
                                step={0.01} 
                                onValueChange={(val) => updateAudioQuery({ postPhonemeLength: Number(val.toFixed(2)) })}  
                                onReset={() => updateAudioQuery({ postPhonemeLength: 0.10})}
                            />
                        </View>
                    }
                </View>
                <View style={{gap: 12}}>
                    <Button title={t`Synthesize`} onPress={() => onSynth()} icon="waveform" disabled={!audioQuery} />
                    <View style={{flexDirection: 'row', gap: 12, justifyContent: 'center',}}>
                        <Button title={t`Play`} onPress={playAudio} disabled={!source} icon="play" />
                        <Button title={t`Save`} onPress={onSaveWav} disabled={!source} icon="download" />
                    </View>
                </View>
            </ParentView>
    );
};

export default AdvancedTab