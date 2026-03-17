import type { AccentPhraseRaw, AudioQueryRaw, FrameAudioQueryRaw, ScoreRaw } from "./types/raw";
import type { FrameAudioQuery, Score } from "./types/sing";
import type { AccentPhrase, AudioQuery, CharacterMeta, Mora } from "./types/spec";
import { UserDictWordTypeEnum, type UserDictWord, type UserDictWordJson } from "./types/userdict";

export const convertUserDictWordsJson = (json: string): UserDictWord[] => {
    const words = JSON.parse(json) as Record<string, UserDictWordJson>;

    return Object.entries(words).map(([id, word]) => ({
        id,
        accentAssociativeRule: word.accent_associative_rule,
        accentType: word.accent_type,
        contextId: word.context_id,
        inflection: {
            form: word.inflection_form,
            type: word.inflection_type
        },
        moraCount: word.mora_count,
        pos: [word.part_of_speech, word.part_of_speech_detail_1, word.part_of_speech_detail_2, word.part_of_speech_detail_3],
        priority: word.priority,
        pronunciation: word.pronunciation,
        stem: word.stem,
        surface: word.surface,
        yomi: word.yomi,
        wordType: UserDictWordTypeEnum[word.part_of_speech]
    }))
};

export const convertCharacterMetasJson = (json: string): CharacterMeta[] => {
    const metas = JSON.parse(json) as CharacterMeta[];

    return metas;
};

const convertAccentPhraseRaw = (raw: AccentPhraseRaw) => {
    return {
        accent: raw.accent,
        isInterrogative: raw.is_interrogative,
        moras: raw.moras.map((m) => ({
            pitch: m.pitch,
            text: m.text,
            vowel: m.vowel,
            vowelLength: m.vowel_length,
            consonant: m.consonant,
            consonantLength: m.consonant_length
        }) as Mora),
        pauseMora: raw.pause_mora ? {
            pitch: raw.pause_mora.pitch,
            text: raw.pause_mora.text,
            vowel: raw.pause_mora.vowel,
            vowelLength: raw.pause_mora.vowel_length,
            consonant: raw.pause_mora.consonant,
            consonantLength: raw.pause_mora.consonant_length
        } : undefined
    };
};
const convertAccentPhrase = (accentPhrase: AccentPhrase): AccentPhraseRaw => {
    return {
        accent: accentPhrase.accent,
        is_interrogative: accentPhrase.isInterrogative,
        moras: accentPhrase.moras.map((m) => ({
            consonant_length: m.consonantLength,
            pitch: m.pitch,
            text: m.text,
            vowel: m.vowel,
            vowel_length: m.vowelLength,
            consonant: m.consonant
        })),
        pause_mora: accentPhrase.pauseMora ? {
            consonant_length: accentPhrase.pauseMora.consonantLength,
            pitch: accentPhrase.pauseMora.pitch,
            text: accentPhrase.pauseMora.text,
            vowel: accentPhrase.pauseMora.vowel,
            vowel_length: accentPhrase.pauseMora.vowelLength,
            consonant: accentPhrase.pauseMora.consonant
        } : undefined,
    };
};

// AccentPhrases
export const convertAccentPhrasesJson = (json: string): AccentPhrase[] => {
    const accentPhrasesRaw = JSON.parse(json) as AccentPhraseRaw[];

    return accentPhrasesRaw.map((ap) => convertAccentPhraseRaw(ap));
};
export const stringifyAccentPhrases = (accentPhrases: AccentPhrase[]): string => {
    const raw: AccentPhraseRaw[] = accentPhrases.map((ap) => convertAccentPhrase(ap));

    return JSON.stringify(raw);
};

// AudioQuery
export const convertAudioQueryJson = (json: string): AudioQuery => {
    const audioQuery = JSON.parse(json) as Omit<AudioQuery, 'accentPhrases'> & {accent_phrases: AccentPhraseRaw[]};

    return {
        accentPhrases: audioQuery.accent_phrases.map((ap) => convertAccentPhraseRaw(ap)),
        ...audioQuery
    }
};
export const stringifyAudioQuery = (audioQuery: AudioQuery): string => {
    const raw: AudioQueryRaw = {
        accent_phrases: audioQuery.accentPhrases.map((ap) => convertAccentPhrase(ap)),
        ...audioQuery
    };

    return JSON.stringify(raw);
};

// FrameAudioQuery
export const convertFrameAudioQueryJson = (json: string): FrameAudioQuery => {
    const frameAudioQuery = JSON.parse(json) as FrameAudioQueryRaw;

    return {
        ...frameAudioQuery,
        phonemes: frameAudioQuery.phonemes.map((p) => ({phoneme: p.phoneme, noteId: p.note_id, frameLength: p.frame_length})),
    }
};
export const stringifyFrameAudioQuery = (faq: FrameAudioQuery): string => {
    const raw: FrameAudioQueryRaw = {
        ...faq,
        phonemes: faq.phonemes.map((p) => ({
            frame_length: p.frameLength,
            note_id: p.noteId,
            phoneme: p.phoneme
        })),
    };

    return JSON.stringify(raw);
};

// Score
export const convertScoreJson = (json: string): Score => {
    const score = JSON.parse(json) as ScoreRaw;

    return {notes: score.notes.map((s) => ({...s, frameLength: s.frame_length}))};
};
export const stringifyScore = (score: Score) => {
    const raw: ScoreRaw = {notes: score.notes.map((note) => ({
        frame_length: note.frameLength,
        lyric: note.lyric,
        key: note.key,
        note_id: note.key,
    }))};

    return JSON.stringify(raw);
};