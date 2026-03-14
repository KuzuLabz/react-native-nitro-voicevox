import { Directory, Paths } from 'expo-file-system';
import { Asset } from 'expo-asset';
import { unzip } from 'react-native-zip-archive';

export const setupOpenJTalk = async (): Promise<{isReady: boolean; dictUri: string}> => {
    const docDir = new Directory(Paths.document);
    const dictDir = new Directory(docDir, 'OpenJTalk');

    console.log(dictDir);
    
    if (dictDir.exists && dictDir.list().length > 0) {
        return {isReady: true, dictUri: dictDir.uri};
    } else {
        dictDir.create();
        try {
            const assets = await Asset.loadAsync(require('../../assets/OpenJTalk.zip'));
            await unzip(assets[0].localUri!, docDir.uri);
            return {isReady: true, dictUri: dictDir.uri};
        } catch (error) {
            console.warn("Failed to unzip OpenJTalk dictionary:", error);
            return {isReady: false, dictUri: ''};
        }
    }
};