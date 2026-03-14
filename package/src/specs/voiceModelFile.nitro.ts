import type { HybridObject } from "react-native-nitro-modules";

export interface VoiceModelFileNitro extends HybridObject<{ android: 'c++', ios: 'c++' }> {
    readonly id: string;
    
    readonly json: string;
};