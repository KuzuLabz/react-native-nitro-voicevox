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
    deinitialize() {
        VoicevoxNitro.deinitialize();
    },
    /**
     * Check if synthesizer is initialized.
     */
    getIsInitialized() {
        return VoicevoxNitro.getIsInitialized();
    },
    /**
     * Load the voice model.
     * @param voiceModel A {@linkcode VoiceModelFile} object.
     */
    async loadVoiceModel(voiceModel: VoiceModelFile) {
        await VoicevoxNitro.loadVoiceModel(voiceModel.getNativeInstance());
    },
    /**
     * Check if voice model is loaded.
     * @param voiceModelId The uuid string of the voice model.
     * 
     * @returns A Promise that fulfills with a boolean.
     */
    getIsVoiceModelLoaded(id: string) {
        return VoicevoxNitro.getIsVoiceModelLoaded(id);
    },
    /**
     * Unload the voice model.
     * @param voiceModelId The uuid string of the voice model.
     */
    async unloadVoiceModel(id: string) {
        await VoicevoxNitro.unloadVoiceModel(id);
    },
    /**
     * Get the loaded character metas.
     * 
     * @returns A Promise that fulfills with an array of {@linkcode CharacterMeta}
     */
    async getMetas() {
        const json = await VoicevoxNitro.getMetas();
        return convertCharacterMetasJson(json);
    },
    /**
     * Create an AudioQuery object.
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
        const json = VoicevoxNitro.createAudioQuery(text, styleId);
        return convertAudioQueryJson(json);
    },
    /**
     * Create an AudioQuery object using AquesTalk notation. 
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
        const json = VoicevoxNitro.createAccentPhrases(text, styleId);
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
        const json = VoicevoxNitro.replaceMoraData(stringifyAccentPhrases(accentPhrases), styleId);
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
        const json = VoicevoxNitro.replaceMoraPitch(stringifyAccentPhrases(accentPhrases), styleId);
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
        const json = VoicevoxNitro.replacePhonemeLength(stringifyAccentPhrases(accentPhrases), styleId);
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
        const result = await VoicevoxNitro.synthesis(stringifyAudioQuery(audioQuery), styleId, options);
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
        const result = await VoicevoxNitro.tts(text, styleId, options);
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
        const result = VoicevoxNitro.createSingFrameAudioQuery(stringifyScore(score), styleId);
        const converted = convertFrameAudioQueryJson(result);
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
        const result = VoicevoxNitro.createSingFrameF0(stringifyScore(score), stringifyFrameAudioQuery(frameAudioQuery), styleId);
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
        const result = VoicevoxNitro.createSingFrameVolume(stringifyScore(score), stringifyFrameAudioQuery(frameAudioQuery), styleId);
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
        const result = await VoicevoxNitro.frameSynthesis(stringifyFrameAudioQuery(frameAudioQuery), styleId, format);
        return format === 'base64' ? mime + result : result;
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
     * Voicevox.setUserDict(userDict);
     * ```
     */
    setUserDict(userDict: UserDict) {
        VoicevoxNitro.setUserDict(userDict.getNativeInstance());
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
        const json = VoicevoxNitro.analyze(text);
        return convertAccentPhrasesJson(json);
    },

    // Onnxruntime
    /**
     * Get the onnxruntime supported devices.  
     * *cpu | cuda | dml*
     * 
     * @returns An object of {@linkcode SupportedDevices}
     */
    getSupportedDevices() {
        const json = VoicevoxNitro.getSupportedDevices();
        return JSON.parse(json) as SupportedDevices;
    },
};