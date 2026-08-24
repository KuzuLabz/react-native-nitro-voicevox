import { useModelsStore } from "@/src/store/useModelsStore";
import { AudioQuery, Voicevox } from "@kuzulabz/react-native-nitro-voicevox";
import { useState } from "react";
import { useLingui } from "@lingui/react/macro";
import audioApi from "@/src/players/audioApi";
import { SAMPLE_TEXT } from "@/src/constants/text";
import { Button, Column, Row, ScrollView, Slider, SliderProps, Spacer, Text, useNativeState } from "@expo/ui";
import { Image } from '@expo/ui/swift-ui';
import { Icon, IconButton } from '@expo/ui/jetpack-compose';
import { Platform } from "react-native";
import { ThemedHost } from "@/src/components/host";
import { TextInput } from "@/src/components/textInput";
import { fillMaxWidth } from "@expo/ui/jetpack-compose/modifiers";

const NativeSlider = ({ label, onReset, ...props }:{ label: string; onReset: () => void } & SliderProps) => {
    return(
        <Column>
            <Row alignment="center">
                <Text>{`${label}: ${props.value.toFixed(2)}`}</Text>
                <Spacer flexible />
                {
                    Platform.select({
                        ios: <Image systemName="arrow.clockwise" size={18} onPress={onReset} />,
                        android: <IconButton onClick={onReset}><Icon source={require('../../../assets/icons/restart_alt.xml')} size={18} /></IconButton>
                    })
                }
            </Row>
            <Slider {...props} />
        </Column>
    );
};

const AdvancedTab = () => {
    const { t } = useLingui();
    const { styleId } = useModelsStore();
    const [source, setSource] = useState<ArrayBuffer | null>(null);
    const [audioQuery, setAudioQuery] = useState<AudioQuery | null>(null);
    const text = useNativeState(SAMPLE_TEXT);

    const createAudioQuery = async () => {
        if (text && styleId) {
            const aq = Voicevox.createAudioQuery(text.value, styleId);
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
        <ThemedHost style={{ flex: 1,  alignItems: 'center' }}>
            <ScrollView>
                <Column 
                    alignment="center" 
                    spacing={12} 
                    modifiers={Platform.OS === 'android' ? [fillMaxWidth()] : undefined} 
                    style={{paddingHorizontal: 12, paddingTop: Platform.OS === 'ios' ? 12 : 42}}
                >
                    <TextInput label={t`Input`} value={text} multiline style={{ padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#000000' }} />
                    <Button label={t`Create AudioQuery`} onPress={createAudioQuery} />
                    <Spacer />
                    {audioQuery && 
                        <Column spacing={12}>
                            <NativeSlider 
                                label={t`Speed`} 
                                value={audioQuery.speedScale} 
                                min={0.5} max={2.0}
                                step={0.05}
                                onValueChange={(val) => updateAudioQuery({ speedScale: Number(val.toFixed(2)) })}
                                onReset={() => updateAudioQuery({ speedScale: 1.0})}
                            />
                            <NativeSlider 
                                label={t`Pitch`} 
                                value={audioQuery.pitchScale} 
                                min={-0.15} max={0.15}
                                step={0.01}
                                onValueChange={(val) => updateAudioQuery({ pitchScale: Number(val.toFixed(2)) })} 
                                onReset={() => updateAudioQuery({ pitchScale: 0})}
                            />
                            <NativeSlider 
                                label={t`Intonation`}
                                value={audioQuery.intonationScale}
                                min={0} max={2.0}
                                step={0.05}
                                onValueChange={(val) => updateAudioQuery({ intonationScale: Number(val.toFixed(2)) })} 
                                onReset={() => updateAudioQuery({ intonationScale: 1})}
                            />
                            <NativeSlider 
                                label={t`Volume`}
                                value={audioQuery.volumeScale} 
                                min={0} max={2.0}
                                step={0.05}
                                onValueChange={(val) => updateAudioQuery({ volumeScale: Number(val.toFixed(2)) })}  
                                onReset={() => updateAudioQuery({ volumeScale: 1})}
                            />
                            <NativeSlider 
                                label={t`Starting Silence`}
                                value={audioQuery.prePhonemeLength} 
                                min={0} max={1.5}
                                step={0.05}
                                onValueChange={(val) => updateAudioQuery({ prePhonemeLength: Number(val.toFixed(2)) })} 
                                onReset={() => updateAudioQuery({ prePhonemeLength: 0.10})} 
                            />
                            <NativeSlider 
                                label={t`Ending Silence`}
                                value={audioQuery.postPhonemeLength} 
                                min={0} max={1.5}
                                step={0.05}
                                onValueChange={(val) => updateAudioQuery({ postPhonemeLength: Number(val.toFixed(2)) })}  
                                onReset={() => updateAudioQuery({ postPhonemeLength: 0.10})}
                            />
                        </Column>
                    }
                    {audioQuery && 
                        <Column alignment="center" >
                            <Button label={t`Synthesize`} onPress={onSynth} />
                            <Row spacing={12}>
                                <Button label={t`Save`} onPress={onSaveWav} disabled={!source} />
                                <Button label={t`Play`} onPress={playAudio} disabled={!source} />
                            </Row>
                        </Column>
                    }
                </Column>
            </ScrollView>
        </ThemedHost>
    );
};

export default AdvancedTab