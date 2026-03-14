import type { VoiceModelFileNitro as VoiceModelFileNitroSpec } from "./specs/voiceModelFile.nitro";
import type { CharacterMeta } from "./types/spec";
import { openVoiceModelFile as openVoiceModelFileNative } from "./factory";
import { convertCharacterMetasJson } from "./json";

export class VoiceModelFile {
    private _native: VoiceModelFileNitroSpec;

    /** The UUID of the file */
    public id: string;

    /**
     * An array of all {@linkcode CharacterMeta} in this file.
     */
    public metas: CharacterMeta[];

    constructor(voiceModelFileSpec: VoiceModelFileNitroSpec) {
        this._native = voiceModelFileSpec;
        this.id = voiceModelFileSpec.id;
        
        this.metas = convertCharacterMetasJson(voiceModelFileSpec.json);
    };

    /**
     * For internal use!
     * 
     * @returns the nitro hybrid object
     */
    getNativeInstance() {
        return this._native;
    }
};

/**
 * Opens a voice model file.
 * 
 * @param uri The local URI of the VVM file.
 * 
 * @returns A Promise that fulfills with a {@linkcode VoiceModelFile} object.
 * 
 * @example
 * ```ts
 * const uri = "file://...";
 * const voiceModel = await openVoiceModelFile(uri);
 * ```
 */
export const openVoiceModelFile = async (uri: string) => {
    const voiceModel = await openVoiceModelFileNative(uri);
    return new VoiceModelFile(voiceModel);
};