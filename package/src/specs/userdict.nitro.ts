import type { HybridObject } from "react-native-nitro-modules";
import type { UserDictWordInput } from "../types/spec";

export interface UserDictNitro extends HybridObject<{ android: 'c++', ios: 'c++' }> {
    addWord(word: UserDictWordInput): string;
    updateWord(wordUuid: string, word: UserDictWordInput): void;
    removeWord(wordUuid: string): void;
    getWords(): Promise<string>;
    load(dictUrl: string): Promise<void>;
    save(destUrl: string): Promise<void>;
    importDict(other: UserDictNitro): Promise<void>;
}