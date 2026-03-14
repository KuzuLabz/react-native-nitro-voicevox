import { Directory, File } from "expo-file-system";

export const saveAudio = async (source: string, fileName: string) => {
    const saveDir = await Directory.pickDirectoryAsync();
    const saveFile = new File(saveDir.uri, `${fileName}.wav`);
    saveFile.create();
    saveFile.write(source, {encoding: 'base64'});
};