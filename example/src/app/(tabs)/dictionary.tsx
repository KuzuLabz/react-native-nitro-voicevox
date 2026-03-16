import { Button } from "@/src/components/button";
import { bench } from "@/src/utils/bench";
import { UserDictWord, Voicevox, createUserDict } from "@kuzulabz/react-native-nitro-voicevox";
import { useLingui } from "@lingui/react/macro";
import { File, Paths } from "expo-file-system";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

const userdict_dir = 'UserDicts';
const userdict_filename = 'userDict.json';

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
        bench('addWord', () => userDict.addWord({surface: 'テスト', pronunciation: 'テスト', accentType: 0, wordType: 'ADJECTIVE'}));
        const userDictWords = await userDict.getWords();
        setWords(userDictWords);
    };

    const deleteWord = async () => {
        const lastWord = words.at(-1);
        if (lastWord?.id) {
            bench('removeWord', () => userDict.removeWord(lastWord.id));
            const userDictWords = await userDict.getWords();
            setWords(userDictWords);
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
        bench('updateWord', () => userDict.updateWord(words[0].id, {...words[0], surface: 'チーバ'}));
        const userDictWords = await userDict.getWords();
        setWords(userDictWords);
    }

    const saveDict = async () => {
        const file = new File(Paths.document, userdict_dir, userdict_filename);
        file.create({intermediates: true, overwrite: true});
        try {
            await bench('save', async () => await userDict.save(file.uri));
        } catch (error) {
            console.error(error);
        }
    };

    const loadDict = async () => {
        const file = new File(Paths.document, userdict_dir, userdict_filename);
        await bench('load', async () => await userDict.load(file.uri));
        const userDictWords = await userDict.getWords();
        setWords(userDictWords);
    };

    const setUserDict = () => {
        bench('setUserDict', () => Voicevox.setUserDict(userDict));
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
                <Button title={'Set UserDict'} onPress={setUserDict} />
                <View>
                    {words?.map((word, idx) => <WordView key={idx} item={word} />)}
                </View>
            </View>
        </ScrollView>
    );
};

export default DictionaryPage;