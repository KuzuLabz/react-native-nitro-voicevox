export interface UserDictWordJson {
    surface: string;
    priority: number;
    context_id: number;
    part_of_speech: keyof typeof UserDictWordTypeEnum;
    part_of_speech_detail_1: string;
    part_of_speech_detail_2: string;
    part_of_speech_detail_3: string;
    inflection_type: string;
    inflection_form: string;
    stem: string;
    yomi: string;
    pronunciation: string;
    accent_type: number;
    mora_count: number;
    accent_associative_rule: string;
};

export enum UserDictWordTypeEnum {
    '固有名詞' = 'PROPER_NOUN',
    '一般名詞' = 'COMMON_NOUN',
    '動詞' = 'VERB',
    '形容詞' = 'ADJECTIVE',
    '語尾' = 'SUFFIX'
};

export type UserDictWordType = 'PROPER_NOUN' | 'COMMON_NOUN' | 'VERB' | 'ADJECTIVE' | 'SUFFIX';

export interface UserDictWordInflection {
    type: string;
    form: string;
};

export interface UserDictWord {
    readonly id: string;
    readonly surface: string;
    readonly pronunciation: string;
    readonly accentType: number;
    readonly accentAssociativeRule: string;
    readonly wordType: UserDictWordType;
    readonly priority: number;
    readonly inflection: UserDictWordInflection;
    readonly stem: string;
    readonly yomi: string;
    readonly moraCount: number;
    readonly pos: string[];
    readonly contextId: number;
};