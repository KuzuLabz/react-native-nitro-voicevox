import { useModelsStore } from "@/src/store/useModelsStore";
import { AudioQuery, Voicevox } from "@kuzulabz/react-native-nitro-voicevox";
import { ComponentProps, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { Slider } from '@react-native-assets/slider';
import { Button } from "@/src/components/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLingui } from "@lingui/react/macro";
import { Theme } from "@/src/constants/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import audioApi from "@/src/players/audioApi";
import { VvTextInput } from "@/src/components/textInput";

const AudioQuerySlider = ({title, ...props}: ComponentProps<typeof Slider> & {title: string; onReset: () => void}) => {
    return(
        <View style={{gap: 8}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
                <View style={{gap: 4}}>
                    <Text style={{fontSize: 18}}>{title}</Text>
                    <Text>{props.value?.toFixed(2)}</Text>
                </View>
                <MaterialCommunityIcons name="reload" onPress={props.onReset} size={18} />
            </View>
            <Slider {...props} trackHeight={6} thumbTintColor={Theme.primary} maximumTrackTintColor={Theme.secondary} minimumTrackTintColor={Theme.primary} />
        </View>
    );
};

const AdvancedTab = () => {
    const { t } = useLingui();
    const { styleId, metas, } = useModelsStore();
    const [source, setSource] = useState<ArrayBuffer | null>(null);
    const [audioQuery, setAudioQuery] = useState<AudioQuery | null>(null);
    const [text, setText] = useState('こんにちは世界！');

    const createAudioQuery = async () => {
        console.log('Styles:', metas[0]?.styles);
        console.log('Create AudioQuery:', text, styleId);
        if (text && styleId) {
            const aq = Voicevox.createAudioQuery(text, styleId);
            setAudioQuery(aq);
            console.log('AudioQuery:', aq);
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
            console.log('Complete!');
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
            <SafeAreaView style={{height: '100%', gap: 8, padding: 12, paddingTop: 28, paddingBottom: 92, justifyContent: 'space-between'}}>
                <View style={{gap: 12}}>
                    <VvTextInput value={text} onChangeText={setText} multiline />
                    <Button title={`${audioQuery ? 'Recreate' : 'Create'} AudioQuery`} onPress={createAudioQuery} icon="code-braces" />
                    <Button title={'Log'} onPress={async () => styleId && console.log(Voicevox.createAccentPhrases(text, styleId))} />
                    {
                        audioQuery && <View>
                            <AudioQuerySlider 
                                title={t`Speed`} 
                                value={audioQuery.speedScale} 
                                maximumValue={2.0} minimumValue={0.5}
                                step={0.01} 
                                onValueChange={(val) => updateAudioQuery({ speedScale: Number(val.toFixed(2)) })} 
                                onReset={() => updateAudioQuery({ speedScale: 1.0})}
                            />
                            <AudioQuerySlider 
                                title={t`Pitch`} 
                                value={audioQuery.pitchScale} 
                                maximumValue={0.15} minimumValue={-0.15} 
                                step={0.01} 
                                onValueChange={(val) => updateAudioQuery({ pitchScale: Number(val.toFixed(2)) })}  
                                onReset={() => updateAudioQuery({ pitchScale: 0})}
                            />
                            <AudioQuerySlider 
                                title={t`Intonation`} 
                                value={audioQuery.intonationScale} 
                                maximumValue={2.0} minimumValue={0} 
                                step={0.01} 
                                onValueChange={(val) => updateAudioQuery({ intonationScale: Number(val.toFixed(2)) })}  
                                onReset={() => updateAudioQuery({ intonationScale: 1})}
                            />
                            <AudioQuerySlider 
                                title={t`Volume`} 
                                value={audioQuery.volumeScale} 
                                maximumValue={2.0} minimumValue={0} 
                                step={0.01} 
                                onValueChange={(val) => updateAudioQuery({ volumeScale: Number(val.toFixed(2)) })}  
                                onReset={() => updateAudioQuery({ volumeScale: 1})}
                            />
                            <AudioQuerySlider 
                                title={t`Starting Silence`} 
                                value={audioQuery.prePhonemeLength} 
                                maximumValue={1.5} minimumValue={0} 
                                step={0.01} 
                                onValueChange={(val) => updateAudioQuery({ prePhonemeLength: Number(val.toFixed(2)) })} 
                                onReset={() => updateAudioQuery({ prePhonemeLength: 0.10})} 
                            />
                            <AudioQuerySlider 
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
                
            </SafeAreaView>
    );
};

export default AdvancedTab