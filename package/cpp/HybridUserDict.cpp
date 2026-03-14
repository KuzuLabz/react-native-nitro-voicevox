#include "HybridUserDict.hpp"
#include "Utils.hpp"
#include "UserDictUtils.hpp"
#include "VoicevoxError.hpp"

namespace margelo::nitro::voicevox {

HybridUserDict::HybridUserDict() : HybridObject(TAG) {
    userDictPtr = voicevox_user_dict_new();
};

std::shared_ptr<Promise<void>> HybridUserDict::load(const std::string &dictUrl) {
    return Promise<void>::async([=, this]() -> void {
        auto filePath = Utils::clean_file_path(dictUrl);
        
        VoicevoxResultCode code = voicevox_user_dict_load(userDictPtr, filePath.c_str());
        
        if (code != VOICEVOX_RESULT_OK) {
            VoicevoxError("UserDict", "load", code);
        }
    });
};

std::shared_ptr<Promise<void>> HybridUserDict::save(const std::string &destUrl) {
    return Promise<void>::async([=, this]() -> void {
        VoicevoxResultCode code = voicevox_user_dict_save(userDictPtr, destUrl.c_str());
        
        if (code != VOICEVOX_RESULT_OK) {
            VoicevoxError("UserDict", "save", code);
        }
    });
};

std::string HybridUserDict::addWord(const UserDictWordInput &word) {
    uint8_t uuid[16];
    VoicevoxUserDictWord userWord = UserDictUtils::nitro_word_to_vv(word);
    VoicevoxResultCode code = voicevox_user_dict_add_word(userDictPtr, &userWord, &uuid);
    
    if (code != VOICEVOX_RESULT_OK) {
        VoicevoxError("UserDict", "addWord", code);
    }
    
    return Utils::uuid_to_string(uuid);
};

void HybridUserDict::updateWord(const std::string &wordUuid, const UserDictWordInput &word) {
    uint8_t uuid[16];
    VoicevoxUserDictWord userWord = UserDictUtils::nitro_word_to_vv(word);
    
    VoicevoxResultCode code = voicevox_user_dict_update_word(userDictPtr, &uuid, &userWord);
    
    if (code != VOICEVOX_RESULT_OK) {
        VoicevoxError("UserDict", "updateWord", code);
    }
}

void HybridUserDict::removeWord(const std::string &wordUuid) {
    uint8_t uuid[16];
    Utils::string_to_uuid(wordUuid, uuid);
    
    VoicevoxResultCode code = voicevox_user_dict_remove_word(userDictPtr, &uuid);
    
    if (code != VOICEVOX_RESULT_OK) {
        VoicevoxError("UserDict", "removeWord", code);
    }
}

std::shared_ptr<Promise<void>> HybridUserDict::importDict(const std::shared_ptr<HybridUserDictNitroSpec> &other) {
    return Promise<void>::async([=, this]() -> void {
        VoicevoxUserDict* rawPtr = std::dynamic_pointer_cast<HybridUserDict>(other)->userDictPtr;
        VoicevoxResultCode code = voicevox_user_dict_import(userDictPtr, rawPtr);
        
        if (code != VOICEVOX_RESULT_OK) {
            VoicevoxError("UserDict", "importDict", code);
        }
    });
}

std::shared_ptr<Promise<std::string>> HybridUserDict::getWords() {
    return Promise<std::string>::async([=, this]() -> std::string {
        char *json{};
        VoicevoxResultCode code = voicevox_user_dict_to_json(userDictPtr, &json);
        
        if (code != VOICEVOX_RESULT_OK) {
            VoicevoxError("UserDict", "importDict", code);
        }
        
        std::string jsonString = Utils::json_to_string(json);
        
        voicevox_json_free(json);
        
        return jsonString;
    });
}

}
