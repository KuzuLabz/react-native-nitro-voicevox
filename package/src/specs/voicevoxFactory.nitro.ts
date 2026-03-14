import type { HybridObject } from "react-native-nitro-modules";
import type { VoiceModelFileNitro } from "./voiceModelFile.nitro";

export interface VoicevoxFactory extends HybridObject<{ android: 'c++', ios: 'c++' }> {
    openVoiceModelFile(uri: string): Promise<VoiceModelFileNitro>;
}