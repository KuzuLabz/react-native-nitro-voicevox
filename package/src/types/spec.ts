
export interface Mora {
    text: string
    vowel: string
    vowelLength: number
    pitch: number
    consonant?: string
    consonantLength?: number
}

export interface AccentPhrase {
    moras: Mora[]
    accent: number
    pauseMora?: Mora
    isInterrogative: boolean
}

/**
 * @param type 'talk' | 'singing_teacher' | 'frame_decode' | 'sing' | 'streaming_talk'
 */
export interface StyleMeta {
    id: number
    name: string
    type: string
    order?: number
}

export interface CharacterMeta {
    name: string
    styles: StyleMeta[]
    speakerUuid: string
    version: string
    order?: number
}

export interface AudioQuery {
    accentPhrases: AccentPhrase[]
    speedScale: number
    pitchScale: number
    intonationScale: number
    volumeScale: number
    prePhonemeLength: number
    postPhonemeLength: number
    outputSamplingRate: number
    outputStereo: boolean
    readonly kana?: string
}

export type UserDictWordType =
  | 'PROPER_NOUN'
  | 'COMMON_NOUN'
  | 'VERB'
  | 'ADJECTIVE'
  | 'SUFFIX'
export interface UserDictWordInput {
    surface: string
    pronunciation: string
    accentType: number
    wordType?: UserDictWordType
    priority?: number
};

export type AudioEncoding = 'base64' | 'arraybuffer';

export interface AudioOptions {
    enableInterrogativeUpspeak?: boolean;
    format?: AudioEncoding;
}

export interface SupportedDevices {
    cpu: boolean;
    cuda: boolean;
    dml: boolean;
}