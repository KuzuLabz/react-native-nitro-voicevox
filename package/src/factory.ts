import { NitroModules } from "react-native-nitro-modules";
import type { VoicevoxFactory } from "./specs/voicevoxFactory.nitro";

const VoicevoxFactory = NitroModules.createHybridObject<VoicevoxFactory>('VoicevoxFactory');

export const openVoiceModelFile = (uri: string) => VoicevoxFactory.openVoiceModelFile(uri);