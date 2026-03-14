//
//  UserDictUtils.hpp
//  Pods
//
//  Created by Justin Lukasik on 2/13/26.
//

#pragma once

#include "VoicevoxBridge.hpp"

struct VvUserDictWord {
    std::string surface;
    std::string pronunciation;
    int accent_type;
    std::optional<VoicevoxUserDictWordType> word_type;
    std::optional<int> priority;
};


using VvUserDictWords = std::unordered_map<std::string, VvUserDictWord>;

namespace UserDictUtils {

inline VoicevoxUserDictWordType nitro_word_type_to_vv(const margelo::nitro::voicevox::UserDictWordType &nitroWordType) {
    switch (nitroWordType) {
        case margelo::nitro::voicevox::UserDictWordType::COMMON_NOUN:
            return VoicevoxUserDictWordType::VOICEVOX_USER_DICT_WORD_TYPE_PROPER_NOUN;
        case margelo::nitro::voicevox::UserDictWordType::PROPER_NOUN:
            return VoicevoxUserDictWordType::VOICEVOX_USER_DICT_WORD_TYPE_PROPER_NOUN;
        case margelo::nitro::voicevox::UserDictWordType::ADJECTIVE:
            return VoicevoxUserDictWordType::VOICEVOX_USER_DICT_WORD_TYPE_ADJECTIVE;
        case margelo::nitro::voicevox::UserDictWordType::VERB:
            return VoicevoxUserDictWordType::VOICEVOX_USER_DICT_WORD_TYPE_VERB;
        case margelo::nitro::voicevox::UserDictWordType::SUFFIX:
            return VoicevoxUserDictWordType::VOICEVOX_USER_DICT_WORD_TYPE_SUFFIX;
        default:
            return VoicevoxUserDictWordType::VOICEVOX_USER_DICT_WORD_TYPE_PROPER_NOUN;
    }
};

inline VoicevoxUserDictWord nitro_word_to_vv(const margelo::nitro::voicevox::UserDictWordInput &nitroWord) {
    VoicevoxUserDictWord word = voicevox_user_dict_word_make(nitroWord.surface.c_str(), nitroWord.surface.c_str(), static_cast<int>(std::round(nitroWord.accentType)));
    
    if (nitroWord.priority.has_value()) {
        double val = nitroWord.priority.value();
        word.priority = static_cast<uint32_t>(std::round(val));
    }
    
    if (nitroWord.wordType.has_value()) {
        margelo::nitro::voicevox::UserDictWordType val = nitroWord.wordType.value();
        
        word.word_type = nitro_word_type_to_vv(val);
    }
    
    return word;
};

}
