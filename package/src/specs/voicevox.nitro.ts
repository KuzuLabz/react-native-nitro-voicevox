import { type HybridObject } from 'react-native-nitro-modules'
import type {  AudioEncoding, AudioOptions } from '../types/spec';
import type { VoiceModelFileNitro } from './voiceModelFile.nitro';
import type { UserDictNitro } from './userdict.nitro';

export interface VoicevoxNitro extends HybridObject<{ android: 'c++', ios: 'c++' }> {
    readonly VOICEVOX_VERSION: string;

    getIsInitialized(): boolean;
    initialize(openJTalkUri: string): Promise<void>;
    deinitialize(): void;
    
    getMetas(): Promise<string>;
    loadVoiceModel(voiceModel: VoiceModelFileNitro): Promise<void>;
    unloadVoiceModel(voiceModelId: string): Promise<void>;
    getIsVoiceModelLoaded(voiceModelId: string): boolean;
    createAudioQueryFromKana(kana: string, styleId: number): string;
    createAudioQuery(text: string, styleId: number): string;
    createAccentPhrasesFromKana(kana: string, styleId: number): string;
    createAccentPhrases(text: string, styleId: number): string;
    replaceMoraData(accentPhrases: string, styleId: number): string;
    replaceMoraPitch(accentPhrases: string, styleId: number): string;
    replacePhonemeLength(accentPhrases: string, styleId: number): string;
    synthesis(audioQuery: string, styleId: number, options: AudioOptions): Promise<string | ArrayBuffer>;
    ttsFromKana(kana: string, styleId: number, options: AudioOptions): Promise<string | ArrayBuffer>;
    tts(text: string, styleId: number, options: AudioOptions): Promise<string | ArrayBuffer>;

    getIsGpuMode(): boolean;

    // OpenJTalk
    analyze(text: string): string;
    setUserDict(userDict: UserDictNitro): void;

    // Onnxruntime
    getSupportedDevices(): string;

    // Sing
    createSingFrameAudioQuery(score: string, styleId: number): string; //FrameAudioQuery
    createSingFrameF0(score: string, frameAudioQuery: string, styleId: number): string; //f0
    createSingFrameVolume(score: string, frameAudioQuery: string, styleId: number): string; //volume
    frameSynthesis(frameAudioQuery: string, styleId: number, format: AudioEncoding): Promise<string | ArrayBuffer>;
}