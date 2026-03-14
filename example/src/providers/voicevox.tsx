import { ReactNode, useEffect } from "react";
import { Voicevox } from '@kuzulabz/react-native-nitro-voicevox';
import { setupOpenJTalk } from "../utils/dict";
import { SplashScreen } from 'expo-router';
import { useModelsStore } from "../store/useModelsStore";

const loadVoicevox = async () => {
    const isInit = Voicevox.getIsInitialized();
    if (!isInit) {
        const {isReady, dictUri} = await setupOpenJTalk();
        if (isReady) {
            await Voicevox.initialize(dictUri);
            await useModelsStore.getState().loadModel();
            SplashScreen.hideAsync();
        }
    }
};

export const VoicevoxProvider = ({children}: {children: ReactNode | ReactNode[]}) => {
    useEffect(() => {
        loadVoicevox();
    },[]);
    return children;
};