import { Button } from "@/src/components/button";
import { UserDictWord, createUserDict } from "@kuzulabz/react-native-nitro-voicevox";
import { useLingui } from "@lingui/react/macro";
import { Directory, File, Paths } from "expo-file-system";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

const WordView = ({item}: { item: UserDictWord }) => {
    return(
        <View>
            <Text>{item.surface} - {item.id}</Text>
        </View>
    );
};

const DictionaryPage = () => {
    const { t } = useLingui();
    const userDict = createUserDict();
    const [words, setWords] = useState<UserDictWord[]>([]);

    const addWord = async () => {
        
        console.log('Adding Word');
        const ps = performance.now();
        userDict.addWord({surface: 'テスト', pronunciation: 'テスト', accentType: 0, wordType: 'ADJECTIVE'});
        const pe = performance.now();
        // await Voicevox.setUserDict(userDict);
        
        const userDictWords = await userDict.getWords();
        console.log('words:', userDictWords);
        setWords(userDictWords);
        console.log('Time:', `${pe - ps}ms`);
    };

    const deleteWord = async () => {
        const lastWord = words.at(-1);
        if (lastWord?.id) {
            const ps = performance.now();
            userDict.removeWord(lastWord.id);
            const pe = performance.now();
            setWords((state) => state.filter((w) => w.id !== lastWord.id));
            console.log('Time:', `${pe - ps}ms`);
        }
    };

    const testImport = async () => {
        const userDict2 = createUserDict();
        try {
            userDict2.addWord({surface: 'チービ', pronunciation: 'チービ', accentType: 0});
            await userDict.importDict(userDict2);
            const userDictWords = await userDict.getWords();
            setWords(userDictWords);
        } catch (e) {
            console.error(e);
        }
    };

    const updateWord = async() => {
        const ps = performance.now();
        userDict.updateWord(words[0].id, {...words[0], pronunciation: 'チーバ'});
        const pe = performance.now();
        const userDictWords = await userDict.getWords();
        setWords(userDictWords);
        console.log('Time:', `${pe - ps}ms`);
    }

    const saveDict = async () => {
        const dir = new Directory(Paths.document, 'UserDicts');
        dir.create({idempotent: true});
        const dest = new File(dir, 'dict2.json');
        try {
            await userDict.save(dest.uri);
            const text = await dest.text();
            console.log(text);
        } catch (error) {
            console.error(error);
        }
    };

    const loadDict = async () => {
        const file = new File(Paths.document, 'UserDicts', 'dict2.json');
        console.log('File Content:', file.textSync());
        await userDict.load(file.uri);
        const userDictWords = await userDict.getWords();
        console.log('Loaded Words:', userDictWords);
        setWords(userDictWords);
    };

    const testCpp = async () => {
        try {
            // const userDictCpp = createUserDict();
            userDict.addWord({surface: 'チービビ', pronunciation: 'チービビ', accentType: 0, wordType: 'VERB'});
            const wordsCpp = await userDict.getWords();
            console.log(wordsCpp);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        console.log('Getting Words');
        userDict.getWords().then((w) => setWords(w));
    },[]);

    return(
        <ScrollView contentContainerStyle={{paddingVertical: 56, paddingHorizontal: 12}}>
            <Text style={{fontSize: 24}}>{t`Words`}</Text>
            <View style={{gap: 8}}>
                <Button title={t`Add Word`} onPress={addWord} />
                <Button title="Update Word" onPress={updateWord} />
                <Button title={t`Delete Word`} onPress={deleteWord} disabled={words.length < 1} />
                <Button title={t`Save`} onPress={saveDict} />
                <Button title={t`Load`} onPress={loadDict} />
                <View>
                    {words?.map((word, idx) => <WordView key={idx} item={word} />)}
                </View>
            </View>
        </ScrollView>
    );
};

export default DictionaryPage;