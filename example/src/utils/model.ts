import { Directory, File, Paths } from "expo-file-system";
import { Asset } from "expo-asset";

const getModelDir = () => {
    return new Directory(Paths.document, 'models');
};

export const getLocalModel = async () => {
    const modelDir = getModelDir();
    const file = new File(modelDir, '0.vvm');

    if (file.exists) {
        return file.uri;
    } else {
        console.log('Getting 0.vvm');
        modelDir.create({idempotent: true});
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const assets = await Asset.loadAsync(require(`../../assets/models/0.vvm`));
        if (assets[0].localUri) {
            const assetFile = new File(assets[0].localUri);
            assetFile.move(file);
        }
    }

    return file.uri;
};

export const downloadModel = async (fileName: string, url: string) => {
    const dir = getModelDir();
    const dest = new File(dir, fileName + 'vvm');

    if (!dest.exists) {
        try {
            await File.downloadFileAsync(url, dest);
        } catch (e) {
            console.warn(e);
            return null;
        }
    }

    return dest.uri;
};