//
//  Utils.hpp
//  Pods
//
//  Created by Justin Lukasik on 2/13/26.
//

#pragma once

#include <span>
#include <NitroModules/ArrayBuffer.hpp>
#include "AudioOptions.hpp"
#include "VoicevoxError.hpp"
#include "VoicevoxBridge.hpp"
#include <filesystem>

namespace fs = std::filesystem;

namespace Utils {

inline void validate_file_path(std::string uri) {
    fs::path filePath(uri);
    if (!fs::exists(filePath) || !fs::is_directory(filePath)) {
        std::runtime_error("File/Directory path does not exist: " + uri);
        // throw or set promise rejection
    }
};

inline std::string clean_file_path(std::string uri) {
    validate_file_path(uri);
    
    const std::string prefix = "file://";
    
    if (uri.substr(0, prefix.size()) == prefix) {
        return std::string(uri.substr(prefix.size()));
    }
    
    return std::string(uri);
};

inline std::string uuid_to_string(const uint8_t uuid[16]) {
    char buf[37];  // 36 chars + null terminator
        std::snprintf(buf, sizeof(buf),
            "%02x%02x%02x%02x-%02x%02x-%02x%02x-%02x%02x-%02x%02x%02x%02x%02x%02x",
            uuid[0], uuid[1], uuid[2], uuid[3],
            uuid[4], uuid[5],
            uuid[6], uuid[7],
            uuid[8], uuid[9],
            uuid[10], uuid[11], uuid[12], uuid[13], uuid[14], uuid[15]);
    return std::string(buf);
}

inline void string_to_uuid(const std::string& uuidString, uint8_t out_uuid[16]) {
    if (std::sscanf(uuidString.c_str(),
        "%2hhx%2hhx%2hhx%2hhx-%2hhx%2hhx-%2hhx%2hhx-%2hhx%2hhx-%2hhx%2hhx%2hhx%2hhx%2hhx%2hhx",
        &out_uuid[0], &out_uuid[1], &out_uuid[2], &out_uuid[3],
        &out_uuid[4], &out_uuid[5],
        &out_uuid[6], &out_uuid[7],
        &out_uuid[8], &out_uuid[9],
        &out_uuid[10],&out_uuid[11],&out_uuid[12],&out_uuid[13],&out_uuid[14],&out_uuid[15]) != 16)
    {
        throw std::runtime_error("UUID string has invalid format");
    }
}

inline std::string json_to_string(const char* json) {
    if (!json || !*json) return "{}";
    
    return std::string(json);
}

inline VoicevoxStyleId getStyleId(double id) {
    return static_cast<VoicevoxStyleId>(id);
};

inline std::string wav_to_base64(std::span<const uint8_t> input) {
    static constexpr char table[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    std::string out;
    out.reserve(((input.size() + 2) / 3) * 4 + 4);  // slight overalloc

    size_t i = 0;
    while (i < input.size()) {
        uint32_t a = i < input.size() ? input[i++] : 0;
        uint32_t b = i < input.size() ? input[i++] : 0;
        uint32_t c = i < input.size() ? input[i++] : 0;

        uint32_t triple = (a << 16) | (b << 8) | c;

        out += table[(triple >> 18) & 0x3F];
        out += table[(triple >> 12) & 0x3F];
        out += (i > input.size() + 1) ? '=' : table[(triple >> 6)  & 0x3F];
        out += (i > input.size())     ? '=' : table[(triple >> 0)  & 0x3F];
    }
    return out;
};

inline VoicevoxTtsOptions get_tts_options(const margelo::nitro::voicevox::AudioOptions &options) {
    auto ttsOptions = voicevox_make_default_tts_options();
    
    if (options.enableInterrogativeUpspeak.has_value()) {
        ttsOptions.enable_interrogative_upspeak = options.enableInterrogativeUpspeak.value();
    }
    
    return ttsOptions;
};

inline void validate_audio_query_json(const std::string &audioQuery) {
    VoicevoxResultCode code = voicevox_audio_query_validate(audioQuery.c_str());
    
    if (code != VOICEVOX_RESULT_OK) {
        margelo::nitro::voicevox::VoicevoxError("Voicevox", "validate_audio_query_json", code);
    }
};

inline void validate_accent_phrases_json(const std::string &accentPhrases) {
    VoicevoxResultCode code = voicevox_accent_phrase_validate(accentPhrases.c_str());
    
    if (code != VOICEVOX_RESULT_OK) {
        margelo::nitro::voicevox::VoicevoxError("Voicevox", "validate_accent_phrases_json", code);
    }
};

inline void validate_frame_audio_query(const std::string &frameAudioQuery) {
    VoicevoxResultCode code = voicevox_frame_audio_query_validate(frameAudioQuery.c_str());
    
    if (code != VOICEVOX_RESULT_OK) {
        margelo::nitro::voicevox::VoicevoxError("Voicevox", "validate_frame_audio_query", code);
    }
};

inline void validate_score(const std::string &score) {
    VoicevoxResultCode code = voicevox_score_validate(score.c_str());
    
    if (code != VOICEVOX_RESULT_OK) {
        margelo::nitro::voicevox::VoicevoxError("Voicevox", "validate_score", code);
    }
};

inline void sing_ensure_compatible(const std::string &score_json, const std::string &frame_audio_query_json) {
    VoicevoxResultCode code = voicevox_ensure_compatible(score_json.c_str(), frame_audio_query_json.c_str());
    
    if (code != VOICEVOX_RESULT_OK) {
        margelo::nitro::voicevox::VoicevoxError("Voicevox", "sing_ensure_compatible", code);
    }
};

}
