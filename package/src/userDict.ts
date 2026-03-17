import { NitroModules } from "react-native-nitro-modules";
// import type { VoicevoxFactoryCpp as VoicevoxFactoryCppSpec  } from './specs/voicevoxFactoryCpp.nitro';
import type { UserDictNitro as UserDictNitroSpec } from './specs/userdict.nitro';
import { convertUserDictWordsJson } from "./json";
import type { UserDictWord } from "./types/userdict";
import type { UserDictWordInput } from "./types/spec";

export class UserDict {
    private _native: UserDictNitroSpec;

    constructor() {
        this._native = NitroModules.createHybridObject<UserDictNitroSpec>('UserDictNitro');
    };

    /**
     * Adds a word to the user dictionary.
     * 
     * @param word The {@linkcode UserDictWordInput} to add.
     * 
     * @returns A Promise that fulfills with the word's UUID string.
     * 
     * @example
     * ```ts
     * const wordId = await userDict.addWord({...});
     * ```
     */
    addWord(word: UserDictWordInput): string {
        return this._native.addWord(word);
    };

    /**
     * Updates a word in the user dictionary.
     * 
     * @param id The word id.
     * @param word The modified word.
     */
    updateWord(id: string, word: UserDictWordInput): void {
        return this._native.updateWord(id, word);
    };

    /**
     * Removes the word from the user dictionary.
     * 
     * @param id The word id.
     */
    removeWord(id: string): void {
        return this._native.removeWord(id);
    };

    /**
     * Get all the words from this user dictionary.
     * 
     * @returns A Promise that fulfills with an array of {@linkcode UserDictWord}
     */
    async getWords(): Promise<UserDictWord[]> {
        const json = await this._native.getWords();
        return convertUserDictWordsJson(json);
    };

    /**
     * Loads a user dictionary from a file.
     * 
     * @param uri The file URI of a saved user dictionary.
     * 
     * @example
     * ```ts
     * const uri = "file://...";
     * await userDict.load(uri);
     * ```
     */
    async load(uri: string): Promise<void> {
        return this._native.load(uri);
    };

    /**
     * Saves the current user dictionary to file.
     * 
     * @param uri The file URI destination to save to.
     * 
     * @example
     * ```ts
     * const uri = "file://...";
     * await userDict.save(uri);
     * ```
     */
    async save(uri: string): Promise<void> {
        return this._native.save(uri);
    };

    /**
     * Imports the user dictionary from a UserDict object.
     * 
     * @param other A {@linkcode UserDict} object.
     */
    async importDict(other: UserDict): Promise<void> {
        return this._native.importDict(other._native);
    };

    /**
     * For internal use!
     * 
     * @returns the nitro hybrid object
     */
    getNativeInstance(): UserDictNitroSpec {
        return this._native;
    };
}

/**
 * Create a custom dictionary.
 * 
 * @returns A UserDict object.
 */
export const createUserDict = (): UserDict => {
    return new UserDict();
};

typeof UserDict;