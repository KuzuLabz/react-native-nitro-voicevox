import { ThemedHost } from "@/src/components/host";
import { Button, Column, ScrollView, Text } from "@expo/ui";
import { UserDictWord, Voicevox, createUserDict } from "@kuzulabz/react-native-nitro-voicevox";
import { useLingui } from "@lingui/react/macro";
import { File, Paths } from "expo-file-system";
import { useEffect, useState } from "react";

const userdict_dir = 'UserDicts';
const userdict_filename = 'userDict.json';

const WordView = ({item}: { item: UserDictWord }) => {
    return(
        <Column>
            <Text>{`${item.surface} - ${item.id}`}</Text>
        </Column>
    );
};

const DictionaryPage = () => {
    const { t } = useLingui();
    const userDict = createUserDict();
    const [words, setWords] = useState<UserDictWord[]>([]);

    const addWord = async () => {
        console.log('Adding Word');
        userDict.addWord({surface: 'テスト', pronunciation: 'テスト', accentType: 0, wordType: 'ADJECTIVE'});
        const userDictWords = await userDict.getWords();
        setWords(userDictWords);
    };

    const deleteWord = async () => {
        const lastWord = words.at(-1);
        if (lastWord?.id) {
            userDict.removeWord(lastWord.id);
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
        userDict.updateWord(words[0].id, {...words[0], surface: 'チーバ'});
        const userDictWords = await userDict.getWords();
        setWords(userDictWords);
    }

    const saveDict = async () => {
        const file = new File(Paths.document, userdict_dir, userdict_filename);
        file.create({intermediates: true, overwrite: true});
        try {
            await userDict.save(file.uri);
        } catch (error) {
            console.error(error);
        }
    };

    const loadDict = async () => {
        const file = new File(Paths.document, userdict_dir, userdict_filename);
        await userDict.load(file.uri);
        const userDictWords = await userDict.getWords();
        setWords(userDictWords);
    };

    const setUserDict = () => {
        Voicevox.setUserDict(userDict);
    };

    useEffect(() => {
        console.log('Getting Words');
        userDict.getWords().then((w) => setWords(w));
    },[userDict]);


    return(
        <ThemedHost style={{flex: 1}}>
            <ScrollView style={{paddingHorizontal: 12, paddingVertical: 56, }}>
                <Column>
                    <Text textStyle={{fontSize: 24}}>{t`Words`}</Text>
                    <Column spacing={8} style={{paddingBottom: 12}}>
                        <Button label={t`Add Word`} onPress={addWord} />
                        <Button label={t`Update Word`} onPress={updateWord} />
                        <Button label={t`Delete Word`} onPress={deleteWord} />
                        <Button label={t`Save`} onPress={saveDict} />
                        <Button label={t`Load`} onPress={loadDict} />
                        <Button label={t`Set UserDict`} onPress={setUserDict} />
                    </Column>
                    <Column spacing={12}>
                        {words?.map((word, idx) => <WordView key={idx} item={word} />)}
                    </Column>
                </Column>
            </ScrollView>
        </ThemedHost>
    );
};

export default DictionaryPage;