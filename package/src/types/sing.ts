export interface FramePhoneme {
    phoneme: string;
    frameLength: number;
    noteId: number | null; // CHECK
};

export interface FrameAudioQuery {
    /**
     * Fundamental frequency per frame.
     */
    f0: number[];
    /**
     * Volume per frame.
     */
    volume: number[];
    /**
     * List of phonemes.
     */
    phonemes: FramePhoneme[];
    /**
     * Overall volume.
     */
    volumeScale: number;
    /**
     * Output sampling rate of the speech data.
     */
    outputSamplingRate: number;
    /**
     * Whether or not to output audio data in stereo.
     */
    outputStereo: boolean;
};

/**
 * Musical Note
 */
export interface Note {
    /**
     * Frame length of the note.
     * 
     * The number of seconds is multiplied by 93.75 and the fraction is adjusted to make it an integer.
     * 
     * [Song Documentation](https://github.com/VOICEVOX/voicevox_core/blob/main/docs/guide/user/song.md)
     */
    frameLength: number;
    /**
     * hiragana/katakana that represent one mora. 
     *  
     * **For Rests**: use an empty string.
     * @example "ド" | "ファ" | ""
     */
    lyric: string;
    /**
     * Scale with MIDI note number (C4 = 60).
     * 
     * **For Rests**: use null or undefined
     * @example 60 | null | undefined
     */
    key?: number | null;
    readonly noteId?: number | null;
};

/**
 * Sheet music information.
 */
export type Score = {notes: Note[]};