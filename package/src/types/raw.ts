import type { Note } from "./sing";
import type { AccentPhrase, AudioQuery, Mora } from "./spec";

// var text: String
// var consonant: String?
// var consonant_length: Double?
// var vowel: String
// var vowel_length: Double
// var pitch: Double
export type MoraRaw = Omit<Mora, 'consonantLength' | 'vowelLength'> & {consonant_length: number | undefined; vowel_length: number;};

// var moras: [VVMora]
// var accent: Double
// var pause_mora: VVMora?
// var is_interrogative: Bool
export type AccentPhraseRaw = Omit<AccentPhrase, 'moras' | 'pauseMora' | 'isInterrogative'> & {moras: MoraRaw[]; pause_mora?: MoraRaw; is_interrogative: boolean};

export type AudioQueryRaw = Omit<AudioQuery, 'accentPhrases'> & {accent_phrases: AccentPhraseRaw[]};

export interface FramePhonemeRaw {
    phoneme: string;
    frame_length: number;
    note_id: number | null;
};

export interface FrameAudioQueryRaw {
    f0: number[];
    volume: number[];
    phonemes: FramePhonemeRaw[];
    volumeScale: number;
    outputSamplingRate: number;
    outputStereo: boolean;
};

export type NoteRaw = Omit<Note, 'frameLength' | 'noteId'> & {frame_length: number, note_id?: number | null};
export type ScoreRaw = {notes: NoteRaw[]};