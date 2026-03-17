#include "HybridVoiceModelFile.hpp"
#include "Utils.hpp"
#include "VoicevoxError.hpp"

namespace margelo::nitro::voicevox {

HybridVoiceModelFile::HybridVoiceModelFile(const std::string &uri) : HybridObject(TAG) {
    auto filePath = Utils::clean_file_path(uri);
    
    VoicevoxResultCode code = voicevox_voice_model_file_open(filePath.c_str(), &voiceModelFilePtr);
    
    if (code != VOICEVOX_RESULT_OK) {
        VoicevoxError("VoiceModelFile", "voicevox_voice_model_file_open", code);
    }
};

std::string HybridVoiceModelFile::getId() {
    uint8_t uuid[16];
    voicevox_voice_model_file_id(HybridVoiceModelFile::voiceModelFilePtr, &uuid);
    return Utils::uuid_to_string(uuid);
}

std::string HybridVoiceModelFile::getJson() {
    char *json = voicevox_voice_model_file_create_metas_json(voiceModelFilePtr);
    
    return Utils::json_to_string(json);
}

}
