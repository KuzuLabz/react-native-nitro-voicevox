import { NitroModules } from "react-native-nitro-modules";
import type { AccentPhrase, AudioEncoding, AudioOptions, AudioQuery, SupportedDevices } from "./types/spec";
import type { VoicevoxNitro as VoicevoxNitroSpec } from "./specs/voicevox.nitro";
import type { UserDict } from "./userDict";
import { convertAccentPhrasesJson, convertAudioQueryJson, convertCharacterMetasJson, convertFrameAudioQueryJson, stringifyAccentPhrases, stringifyAudioQuery, stringifyFrameAudioQuery, stringifyScore } from "./json";
import type { VoiceModelFile } from "./voiceModelFile";
import type { FrameAudioQuery, Score } from "./types/sing";

const VoicevoxNitro = NitroModules.createHybridObject<VoicevoxNitroSpec>('VoicevoxNitro');

const defaultAudioOptions: AudioOptions = {format: 'base64'};
const mime = "data:audio/wav;base64,"

export const Voicevox = {
    VOICEVOX_VERSION: VoicevoxNitro.VOICEVOX_VERSION,
    /**
     * Initialize the synthesizer.  
     * 
     * **Must run this once before using other methods!**
     * @param openJTalkUri The OpenJTalk directory uri (must contain the dict files as children)
     */
    async initialize(openJTalkUri: string) {
        await VoicevoxNitro.initialize(openJTalkUri);
    },
    /**
     * Free the resources used.
     */
    async deinitialize() {
        VoicevoxNitro.deinitialize();
    },
    /**
     * Checks if synthesizer is initialized.
     */
    getIsInitialized() {
        return VoicevoxNitro.getIsInitialized();
    },
    /**
     * Load the voice model.
     * @param voiceModel A {@linkcode VoiceModelFile} object.
     */
    async loadVoiceModel(voiceModel: VoiceModelFile) {
        const p1 = performance.now();
        await VoicevoxNitro.loadVoiceModel(voiceModel.getNativeInstance());
        const p2 = performance.now();
        console.log('loadVoiceModel:', `${p2 - p1}ms`);
    },
    /**
     * Checks if voice model is loaded.
     * @param voiceModelId The uuid string of the voice model.
     * 
     * @returns A Promise that fulfills with a boolean.
     */
    getIsVoiceModelLoaded(id: string) {
        return VoicevoxNitro.getIsVoiceModelLoaded(id);
    },
    /**
     * Unloads the voice model.
     * @param voiceModelId The uuid string of the voice model.
     */
    async unloadVoiceModel(id: string) {
        const p1 = performance.now();
        await VoicevoxNitro.unloadVoiceModel(id);
        const p2 = performance.now();
        console.log('unloadVoiceModel:', `${p2 - p1}ms`);
    },
    /**
     * Get the loaded character metas.
     * 
     * @returns A Promise that fulfills with an array of {@linkcode CharacterMeta}
     */
    async getMetas() {
        const p1 = performance.now();
        const json = await VoicevoxNitro.getMetas();
        const p2 = performance.now();
        console.log('getMetas:', `${p2 - p1}ms`);
        return convertCharacterMetasJson(json);
    },
    /**
     * Creates an AudioQuery object.
     * 
     * Info: {@link [Synthesis Flow](https://github.com/VOICEVOX/voicevox_core/blob/main/docs/guide/user/tts-process.md)}
     * 
     * @param text Japanese text.
     * @param styleId The style id of the speaker.
     * 
     * @returns A Promise that fulfills with an {@linkcode AudioQuery} object. 
     * 
     * @example
     * ```ts
     * let audioQuery = await Voicevox.createAudioQuery("こんにちは", 2);
     * audioQuery.speedScale += 0.1;
     * ```
     */
    createAudioQuery(text: string, styleId: number): AudioQuery {
        const p1 = performance.now();
        const json = VoicevoxNitro.createAudioQuery(text, styleId);
        const p2 = performance.now();
        console.log('createAudioQuery:', `${p2 - p1}ms`);
        return convertAudioQueryJson(json);
    },
    /**
     * Creates an AudioQuery object using AquesTalk notation. 
     * 
     * Info: {@link [Synthesis Flow](https://github.com/VOICEVOX/voicevox_core/blob/main/docs/guide/user/tts-process.md)}
     * 
     * @param kana Kana text.
     * @param styleId The style id of the speaker.
     * 
     * @returns A Promise that fulfills with an {@linkcode AudioQuery} object. 
     * 
     * @example
     * ```ts
     * let audioQueryKana = await Voicevox.createAudioQueryFromKana("コンニチワ", 2);
     * audioQueryKana.speedScale += 0.1;
     * ```
     */
    createAudioQueryFromKana(kana: string, styleId: number): AudioQuery {
        const json = VoicevoxNitro.createAudioQueryFromKana(kana, styleId);
        return convertAudioQueryJson(json);
    },
    /**
     * Creates accent phrases.
     * @param text Japanese text.
     * @param styleId The style id of the speaker.
     * 
     * @returns A Promise that fulfills with an array of {@linkcode AccentPhrase} objects. 
     */
    createAccentPhrases(text: string, styleId: number): AccentPhrase[] {
        const p1 = performance.now();
        const json = VoicevoxNitro.createAccentPhrases(text, styleId);
        const p2 = performance.now();
        console.log('createAccentPhrases:', `${p2 - p1}ms`);
        return convertAccentPhrasesJson(json);
    },
    /**
     * Creates accent phrases using AquesTalk notation.
     * 
     * @param kana Kana text.
     * @param styleId The style id of the speaker.
     * 
     * @returns A Promise that fulfills with an array of {@linkcode AccentPhrase} objects. 
     */
    createAccentPhrasesFromKana(kana: string, styleId: number): AccentPhrase[] {
        const json = VoicevoxNitro.createAccentPhrasesFromKana(kana, styleId);
        return convertAccentPhrasesJson(json);
    },
    /**
     * Replaces the pitch and phoneme length of the AccentPhrase array with a specific voice.
     * 
     * @param accentPhrases An array of AccentPhrase.
     * @param styleId The style id of the speaker.
     * 
     * @returns A Promise that fulfills with an array of {@linkcode AccentPhrase} objects. 
     */
    replaceMoraData(accentPhrases: AccentPhrase[], styleId: number): AccentPhrase[] {
        const p1 = performance.now();
        const json = VoicevoxNitro.replaceMoraData(stringifyAccentPhrases(accentPhrases), styleId);
        const p2 = performance.now();
        console.log('replaceMoraData:', `${p2 - p1}ms`);
        return convertAccentPhrasesJson(json);
    },
    /**
     * Replaces the pitch of an AccentPhrase array with a specific voice.
     * 
     * @param accentPhrases An array of AccentPhrase.
     * @param styleId The style id of the speaker.
     * 
     * @returns A Promise that fulfills with an array of {@linkcode AccentPhrase} objects. 
     */
    replaceMoraPitch(accentPhrases: AccentPhrase[], styleId: number): AccentPhrase[] {
        const p1 = performance.now();
        const json = VoicevoxNitro.replaceMoraPitch(stringifyAccentPhrases(accentPhrases), styleId);
        const p2 = performance.now();
        console.log('replaceMoraPitch:', `${p2 - p1}ms`);
        return convertAccentPhrasesJson(json);
    },
    /**
     * Replaces the phoneme length of the AccentPhrase array with a specific voice.
     * 
     * @param accentPhrases An array of AccentPhrase.
     * @param styleId The style id of the speaker.
     * 
     * @returns A Promise that fulfills with an array of {@linkcode AccentPhrase} objects. 
     */
    replacePhonemeLength(accentPhrases: AccentPhrase[], styleId: number): AccentPhrase[] {
        const p1 = performance.now();
        const json = VoicevoxNitro.replacePhonemeLength(stringifyAccentPhrases(accentPhrases), styleId);
        const p2 = performance.now();
        console.log('replacePhonemeLength:', `${p2 - p1}ms`);
        return convertAccentPhrasesJson(json);
    },
    /**
     * Synthesize speech from AudioQuery.
     * 
     * @param audioQuery An AudioQuery object.
     * @param styleId The style id of the speaker.
     * @param options {@linkcode AudioOptions} [**base64 format by default**]
     * 
     * @returns A Promise that fulfills with a wav file as either a base64 uri or an ArrayBuffer.
     * 
     * *A base64 URI is returned by default.*
     * 
     * @example
     * ```ts
     * const audioQuery = await Voicevox.createAudioQuery("こんにちは", 2);
     * const wavArrayBuffer = await Voicevox.synthesis(audioQuery, 2, { format: 'arraybuffer' });
     * ```
     */
    async synthesis(audioQuery: AudioQuery, styleId: number, options: AudioOptions = defaultAudioOptions) {
        const p1 = performance.now();
        const result = await VoicevoxNitro.synthesis(stringifyAudioQuery(audioQuery), styleId, options);
        const p2 = performance.now();
        console.log('synthesis:', `${p2 - p1}ms`);
        return options.format === 'base64' ? mime + result : result;
    },
    /**
     * Synthesize speech from japanese text.
     * 
     * Info: {@link [Synthesis Flow](https://github.com/VOICEVOX/voicevox_core/blob/main/docs/guide/user/tts-process.md)}
     * 
     * @param text Japanese text.
     * @param styleId The style id of the speaker.
     * @param options {@linkcode AudioOptions} [**base64 format by default**]
     * 
     * @returns A Promise that fulfills with a wav file as either a base64 uri or an ArrayBuffer.
     * 
     * @example
     * ```ts
     * const base64 = await Voicevox.tts("こんにちは", 2);
     * // base64 = "data:audio/wav;base64,..."
     * ```
     */
    async tts(text: string, styleId: number, options: AudioOptions = defaultAudioOptions) {
        const p1 = performance.now();
        const result = await VoicevoxNitro.tts(text, styleId, options);
        const p2 = performance.now();
        console.log('tts:', `${p2 - p1}ms`);
        return options.format === 'base64' ? mime + result : result;
    },
    /**
     * Synthesize speech from kana text using AquesTalk notation.
     * 
     * Info: {@link [Synthesis Flow](https://github.com/VOICEVOX/voicevox_core/blob/main/docs/guide/user/tts-process.md)}
     * 
     * @param kana Kana text.
     * @param styleId The style id of the speaker.
     * @param options {@linkcode AudioOptions} [**base64 format by default**]
     * 
     * @returns A Promise that fulfills with a wav file as either a base64 uri or an ArrayBuffer.
     * 
     * @example
     * ```ts
     * const base64 = await Voicevox.ttsFromKana("コンニチワ", 2);
     * // base64 = "data:audio/wav;base64,..."
     * ```
     */
    async ttsFromKana(kana: string, styleId: number, options: AudioOptions = defaultAudioOptions) {
        const result = await VoicevoxNitro.ttsFromKana(kana, styleId, options);
        return options.format === 'base64' ? mime + result : result;
    },

    // Sing

    /**
     * Create a singing audio frame query
     * @param score The sheet music / {@linkcode Score}
     * @param styleId The singing teacher style id of the speaker.
     * 
     * @returns A Promise that fulfills with a {@linkcode FrameAudioQuery} object. 
     * 
     * @example
     * ```ts
     * const teacher = 6000;
     * let frameAudioQuery = await Voicevox.createSingFrameAudioQuery(score, teacher);
     * ```
     */
    createSingFrameAudioQuery(score: Score, styleId: number): FrameAudioQuery {
        const p1 = performance.now();
        const result = VoicevoxNitro.createSingFrameAudioQuery(stringifyScore(score), styleId);
        const p2 = performance.now();
        console.log('createSingFrameAudioQuery:', `${p2 - p1}ms`);
        // console.log('Frame Raw:', result);
        const converted = convertFrameAudioQueryJson(result);
        // console.log('Frame Converted:', converted);
        return converted;
    },
    /**
     * Generate frame-by-frame fundamental frequency from the singing frame audio query.
     * @param score The sheet music / {@linkcode Score}
     * @param frameAudioQuery Singing audio frame query.
     * @param styleId The singing teacher style id of the speaker.
     * @returns Fundamental frequency per frame.
     */
    createSingFrameF0(score: Score, frameAudioQuery: FrameAudioQuery, styleId: number): number[] {
        const p1 = performance.now();
        const result = VoicevoxNitro.createSingFrameF0(stringifyScore(score), stringifyFrameAudioQuery(frameAudioQuery), styleId);
        const p2 = performance.now();
        console.log('createSingFrameF0:', `${p2 - p1}ms`);
        return JSON.parse(result);
    },
    /**
     * Generate frame-by-frame volume from the singing frame audio query.
     * @param score The sheet music / {@linkcode Score}
     * @param frameAudioQuery Singing audio frame query.
     * @param styleId The singing teacher style id of the speaker.
     * @returns Volume per frame.
     */
    createSingFrameVolume(score: Score, frameAudioQuery: FrameAudioQuery, styleId: number): number[] {
        const p1 = performance.now();
        const result = VoicevoxNitro.createSingFrameVolume(stringifyScore(score), stringifyFrameAudioQuery(frameAudioQuery), styleId);
        const p2 = performance.now();
        console.log('Volume:', result);
        console.log('createSingFrameVolume:', `${p2 - p1}ms`);
        return JSON.parse(result);
    },
    /**
     * Perform singing voice synthesis.
     * 
     * [Song Documentation](https://github.com/VOICEVOX/voicevox_core/blob/main/docs/guide/user/song.md)
     * @param frameAudioQuery Singing audio frame query.
     * @param styleId The singer style id of the speaker.
     * @param format The audio format ${@linkcode AudioEncoding} ("base64" | "arraybuffer").
     * @returns A Promise that fulfills with a wav file as either a base64 uri or an ArrayBuffer.
     * 
     * @example
     * ```ts
     * const teacher = 6000;
     * const singer = 3000;
     * const frameAudioQuery = await Voicevox.createSingFrameAudioQuery(score, teacher);
     * const wavArrayBuffer = await Voicevox.frameSynthesis(frameAudioQuery, singer, 'arraybuffer');
     * ```
     */
    async frameSynthesis(frameAudioQuery: FrameAudioQuery, styleId: number, format: AudioEncoding = 'base64'): Promise<string | ArrayBuffer> {
        const p1 = performance.now();
        const result = await VoicevoxNitro.frameSynthesis(stringifyFrameAudioQuery(frameAudioQuery), styleId, format);
        const p2 = performance.now();
        console.log('frameSynthesis:', `${p2 - p1}ms`);
        return format === 'base64' ? mime + result : result;
    },

    // OpenJTalk
    /**
     * Parse Japanese text using OpenJTalk.
     * 
     * @param text Japanese text.
     * 
     * @returns A Promise that fulfills with an array of {@linkcode AccentPhrase} objects. 
     */
    analyze(text: string): AccentPhrase[] {
        const p1 = performance.now();
        const json = VoicevoxNitro.analyze(text);
        const p2 = performance.now();
        console.log(`analyze (${p2 - p1}ms): ${json}`);
        return convertAccentPhrasesJson(json);
    },
    /**
     * Configure the user dictionary used by OpenJtalk.
     * 
     * *Call this method again after any changes to the UserDict.*
     * 
     * @param userDict A UserDict object.
     * 
     * @example
     * ```ts
     * const userDict = createUserDict();
     * await Voicevox.setUserDict(userDict);
     * ```
     */
    setUserDict(userDict: UserDict) {
        const p1 = performance.now();
        VoicevoxNitro.setUserDict(userDict.getNativeInstance());
        const p2 = performance.now();
        console.log('setUserDict:', `${p2 - p1}ms`);
    },

    // Onnxruntime
    /**
     * Get the onnxruntime supported devices.  
     * *cpu | cuda | dml*
     */
    getSupportedDevices() {
        const json = VoicevoxNitro.getSupportedDevices();
        return JSON.parse(json) as SupportedDevices;
        // VoicevoxNitro.getSupportedDevices();
    },
};