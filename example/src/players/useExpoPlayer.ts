import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { StorageAccessFramework } from 'expo-file-system/legacy';
import { File } from 'expo-file-system';
import { ToastAndroid } from "react-native";

export const useExpoPlayer = () => {
    const player = useAudioPlayer();
    const status = useAudioPlayerStatus(player);

    const onPlay = (source: string) => {
        console.log('Playing:', (source as string).substring(source.length - 60));
        player.pause();
        player.replace(source);
        player.seekTo(0);
        player.play();
    };

    const saveAudio = async (fileName: string, source: string | Uint8Array<ArrayBufferLike>, encoding: "utf8" | "base64") => {
        // Using the new expo-file-system API for SAF gives an error. using legacy for now.
        // https://github.com/expo/expo/issues/41717
        const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
            const fileUri = await StorageAccessFramework.createFileAsync(
                permissions.directoryUri,
                fileName,
                'audio/wav',
            );

            const file = new File(fileUri);
            file.write(source, { encoding });
            ToastAndroid.show('Audio saved!', ToastAndroid.SHORT);
        }
    };

    return {player, status, onPlay, saveAudio}
};
