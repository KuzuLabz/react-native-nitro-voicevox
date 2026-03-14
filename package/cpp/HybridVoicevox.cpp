#include "HybridVoicevox.hpp"
#include "HybridVoiceModelFile.hpp"
#include "HybridUserDict.hpp"
#include "VoicevoxError.hpp"
#include "Utils.hpp"

namespace margelo::nitro::voicevox {



void HybridVoicevox::initializeOnnx() {
    if (onnxPtr.has_value()) {
        return;
    }
    
    const VoicevoxOnnxruntime* ort_raw = nullptr;
    VoicevoxResultCode code;
    
#if defined(VOICEVOX_LOAD_ONNXRUNTIME)
    auto onnxOptions = voicevox_make_default_load_onnxruntime_options();
    code = voicevox_onnxruntime_load_once(onnxOptions, &ort_raw);
#elif defined(VOICEVOX_LINK_ONNXRUNTIME)
    code = voicevox_onnxruntime_init_once(&ort_raw);
#else
#error "Unsupported platform for VOICEVOX ONNXRUNTIME"
#endif
    
    if (code != VOICEVOX_RESULT_OK) {
        VoicevoxError("Voicevox", "initializeOnnx", code);
    }
    
    onnxPtr = ort_raw;
};

void HybridVoicevox::initializeOpenJTalk(const std::string &uri) {
    auto ojtPath = Utils::clean_file_path(uri);
    
    if (ojtPtr.has_value()) {
        return;
    }
    
    OpenJtalkRc* ojt_raw = nullptr;
    
    VoicevoxResultCode code = voicevox_open_jtalk_rc_new(ojtPath.c_str(), &ojt_raw);
    
    if (code != VOICEVOX_RESULT_OK) {
        VoicevoxError("Voicevox", "initializeOpenJTalk", code);
    }
    
    ojtPtr = ojt_raw;
}

std::string HybridVoicevox::getVOICEVOX_VERSION() {
    return std::string(voicevox_get_version());
};

bool HybridVoicevox::getIsInitialized() {
    return synthPtr.has_value() && onnxPtr.has_value() && ojtPtr.has_value();
}

std::shared_ptr<Promise<void>> HybridVoicevox::initialize(const std::string &openJTalkUri) {
    return Promise<void>::async([=, this]() -> void {
        initializeOnnx();
        initializeOpenJTalk(openJTalkUri);
        
        VoicevoxSynthesizer* synth_raw = nullptr;
        
        auto initOptions = voicevox_make_default_initialize_options();
        
        VoicevoxResultCode code = voicevox_synthesizer_new(onnxPtr.value(), ojtPtr.value(), initOptions, &synth_raw);
        
        if (code != VOICEVOX_RESULT_OK) {
            VoicevoxError("Voicevox", "initialize", code);
        }
        
        synthPtr = synth_raw;
    });
};

void HybridVoicevox::deinitialize() {
    if (ojtPtr.has_value()) {
        voicevox_open_jtalk_rc_delete(ojtPtr.value());
        ojtPtr.reset();
    }
    if (synthPtr.has_value()) {
        voicevox_synthesizer_delete(synthPtr.value());
        synthPtr.reset();
    }
};

std::shared_ptr<Promise<std::string>> HybridVoicevox::getMetas() {
    return Promise<std::string>::async([=, this]() -> std::string {
        if (!synthPtr.has_value()) {
            throw std::runtime_error("Synthesizer is not initialized!");
        }
        
        char* meta = voicevox_synthesizer_create_metas_json(synthPtr.value());
        
        auto metaString = Utils::json_to_string(meta);
        
        voicevox_json_free(meta);
        
        return metaString;
    });
};

std::shared_ptr<Promise<void>> HybridVoicevox::loadVoiceModel(const std::shared_ptr<HybridVoiceModelFileNitroSpec> &voiceModel) {
    return Promise<void>::async([=, this]() -> void {
        if (!synthPtr.has_value()) {
            throw std::runtime_error("Synthesizer is not initialized!");
        }
        
        // Get the pointer of the voice model file
        VoicevoxVoiceModelFile* rawPtr = std::dynamic_pointer_cast<HybridVoiceModelFile>(voiceModel)->voiceModelFilePtr;
        
        VoicevoxResultCode code = voicevox_synthesizer_load_voice_model(synthPtr.value(), rawPtr);
        
        if (code != VOICEVOX_RESULT_OK) {
            VoicevoxError("Voicevox", "loadVoiceModel", code);
        }
    });
};

std::shared_ptr<Promise<void>> HybridVoicevox::unloadVoiceModel(const std::string &voiceModelId) {
    return Promise<void>::async([=, this]() -> void {
        if (!synthPtr.has_value()) {
            throw std::runtime_error("Synthesizer is not initialized!");
        }
        
        uint8_t uuid[16];
        Utils::string_to_uuid(voiceModelId, uuid);
        
        VoicevoxResultCode code = voicevox_synthesizer_unload_voice_model(synthPtr.value(), &uuid);
        
        if (code != VOICEVOX_RESULT_OK) {
            VoicevoxError("Voicevox", "unloadVoiceModel", code);
        }
    });
};

bool HybridVoicevox::getIsVoiceModelLoaded(const std::string &voiceModelId) {
    if (!synthPtr.has_value()) {
        throw std::runtime_error("Synthesizer is not initialized!");
    }
    
    uint8_t uuid[16];
    Utils::string_to_uuid(voiceModelId, uuid);
    
    bool isLoaded = voicevox_synthesizer_is_loaded_voice_model(synthPtr.value(), &uuid);
    
    return isLoaded;
};

std::string HybridVoicevox::createAudioQueryFromKana(const std::string &kana, double styleId) {
    if (!synthPtr.has_value()) {
        throw std::runtime_error("Synthesizer is not initialized!");
    }
    
    char *json{};
    VoicevoxResultCode code = voicevox_synthesizer_create_audio_query_from_kana(synthPtr.value(), kana.c_str(), Utils::getStyleId(styleId), &json);
    
    if (code != VOICEVOX_RESULT_OK) {
        VoicevoxError("Voicevox", "createAudioQueryFromKana", code);
    }
    
    auto jsonString = Utils::json_to_string(json);
    
    voicevox_json_free(json);
    
    return jsonString;
};

std::string HybridVoicevox::createAudioQuery(const std::string &text, double styleId) {
    if (!synthPtr.has_value()) {
        throw std::runtime_error("Synthesizer is not initialized!");
    }
    
    char *json{};
    VoicevoxResultCode code = voicevox_synthesizer_create_audio_query(synthPtr.value(), text.c_str(), Utils::getStyleId(styleId), &json);
    
    if (code != VOICEVOX_RESULT_OK) {
        VoicevoxError("Voicevox", "createAudioQuery", code);
    }
    
    auto jsonString = Utils::json_to_string(json);
    
    voicevox_json_free(json);
    
    return jsonString;
};

std::string HybridVoicevox::createAccentPhrasesFromKana(const std::string &kana, double styleId) {
    if (!synthPtr.has_value()) {
        throw std::runtime_error("Synthesizer is not initialized!");
    }
    
    char *json{};
    VoicevoxResultCode code = voicevox_synthesizer_create_accent_phrases_from_kana(synthPtr.value(), kana.c_str(), Utils::getStyleId(styleId), &json);
    
    if (code != VOICEVOX_RESULT_OK) {
        VoicevoxError("Voicevox", "createAccentPhrasesFromKana", code);
    }
    
    auto jsonString = Utils::json_to_string(json);
    
    voicevox_json_free(json);
    
    return jsonString;
};

std::string HybridVoicevox::createAccentPhrases(const std::string &text, double styleId) {
    if (!synthPtr.has_value()) {
        throw std::runtime_error("Synthesizer is not initialized!");
    }
    
    char *json{};
    VoicevoxResultCode code = voicevox_synthesizer_create_accent_phrases(synthPtr.value(), text.c_str(), Utils::getStyleId(styleId), &json);
    
    if (code != VOICEVOX_RESULT_OK) {
        VoicevoxError("Voicevox", "createAccentPhrases", code);
    }
    
    auto jsonString = Utils::json_to_string(json);
    
    voicevox_json_free(json);
    
    return jsonString;
};

std::string HybridVoicevox::replaceMoraData(const std::string &accentPhrases, double styleId) {
    if (!synthPtr.has_value()) {
        throw std::runtime_error("Synthesizer is not initialized!");
    }
    
    Utils::validate_accent_phrases_json(accentPhrases);
    
    char *json{};
    VoicevoxResultCode code = voicevox_synthesizer_replace_mora_data(synthPtr.value(), accentPhrases.c_str(), Utils::getStyleId(styleId), &json);
    
    if (code != VOICEVOX_RESULT_OK) {
        VoicevoxError("Voicevox", "replaceMoraData", code);
    }
    
    auto jsonString = Utils::json_to_string(json);
    
    voicevox_json_free(json);
    
    return jsonString;
};

std::string HybridVoicevox::replaceMoraPitch(const std::string &accentPhrases, double styleId) {
    if (!synthPtr.has_value()) {
        throw std::runtime_error("Synthesizer is not initialized!");
    }
    
    Utils::validate_accent_phrases_json(accentPhrases);
    
    char *json{};
    VoicevoxResultCode code = voicevox_synthesizer_replace_mora_pitch(synthPtr.value(), accentPhrases.c_str(), Utils::getStyleId(styleId), &json);
    
    if (code != VOICEVOX_RESULT_OK) {
        VoicevoxError("Voicevox", "replaceMoraPitch", code);
    }
    
    auto jsonString = Utils::json_to_string(json);
    
    voicevox_json_free(json);
    
    return jsonString;
};

std::string HybridVoicevox::replacePhonemeLength(const std::string &accentPhrases, double styleId) {
    if (!synthPtr.has_value()) {
        throw std::runtime_error("Synthesizer is not initialized!");
    }
    
    Utils::validate_accent_phrases_json(accentPhrases);
    
    char *json{};
    VoicevoxResultCode code = voicevox_synthesizer_replace_phoneme_length(synthPtr.value(), accentPhrases.c_str(), Utils::getStyleId(styleId), &json);
    
    if (code != VOICEVOX_RESULT_OK) {
        VoicevoxError("Voicevox", "replacePhonemeLength", code);
    }
    
    auto jsonString = Utils::json_to_string(json);
    
    voicevox_json_free(json);
    
    return jsonString;
};

std::shared_ptr<Promise<std::variant<std::shared_ptr<ArrayBuffer>, std::string>>> HybridVoicevox::synthesis(const std::string &audioQuery, double styleId, const AudioOptions &options) {
    return Promise<std::variant<std::shared_ptr<ArrayBuffer>, std::string>>::async([=, this]() -> std::variant<std::shared_ptr<ArrayBuffer>, std::string> {
        if (!synthPtr.has_value()) {
            throw std::runtime_error("Synthesizer is not initialized!");
        }
        
        Utils::validate_audio_query_json(audioQuery);
        
        VoicevoxSynthesisOptions synthOptions = voicevox_make_default_synthesis_options();
        
        if (options.enableInterrogativeUpspeak.has_value()) {
            synthOptions.enable_interrogative_upspeak = options.enableInterrogativeUpspeak.value();
        }
        
        size_t wavLength{};
        uint8_t *wav{};
        
        VoicevoxResultCode code =  voicevox_synthesizer_synthesis(synthPtr.value(), audioQuery.c_str(), Utils::getStyleId(styleId), synthOptions, &wavLength, &wav);
        
        if (code != VOICEVOX_RESULT_OK) {
            VoicevoxError("Voicevox", "synthesis", code);
        }
        
        if (options.format == AudioEncoding::ARRAYBUFFER) {
            auto buf = ArrayBuffer::copy(wav, wavLength);
            
            voicevox_wav_free(wav);
            return buf;
        } else {
            auto b64 = Utils::wav_to_base64(std::span<const uint8_t>{wav, wavLength});
            
            voicevox_wav_free(wav);
            return b64;
        }
    });
};

std::shared_ptr<Promise<std::variant<std::shared_ptr<ArrayBuffer>, std::string>>> HybridVoicevox::ttsFromKana(const std::string &kana, double styleId, const AudioOptions &options) {
    return Promise<std::variant<std::shared_ptr<ArrayBuffer>, std::string>>::async([=, this]() -> std::variant<std::shared_ptr<ArrayBuffer>, std::string> {
        if (!synthPtr.has_value()) {
            throw std::runtime_error("Synthesizer is not initialized!");
        }
        
        auto ttsOptions = Utils::get_tts_options(options);
        
        size_t wavLength{};
        uint8_t *wav{};
        
        VoicevoxResultCode code = voicevox_synthesizer_tts_from_kana(synthPtr.value(), kana.c_str(), Utils::getStyleId(styleId), ttsOptions, &wavLength, &wav);
        
        if (code != VOICEVOX_RESULT_OK) {
            VoicevoxError("Voicevox", "ttsFromKana", code);
        }
        
        if (options.format == AudioEncoding::ARRAYBUFFER) {
            auto buf = ArrayBuffer::copy(wav, wavLength);
            
            voicevox_wav_free(wav);
            return buf;
        } else {
            auto b64 = Utils::wav_to_base64(std::span<const uint8_t>{wav, wavLength});
            
            voicevox_wav_free(wav);
            return b64;
        }
    });
}

std::shared_ptr<Promise<std::variant<std::shared_ptr<ArrayBuffer>, std::string>>> HybridVoicevox::tts(const std::string &text, double styleId, const AudioOptions &options) {
    return Promise<std::variant<std::shared_ptr<ArrayBuffer>, std::string>>::async([=, this]() -> std::variant<std::shared_ptr<ArrayBuffer>, std::string> {
        if (!synthPtr.has_value()) {
            throw std::runtime_error("Synthesizer is not initialized!");
        }
        
        auto ttsOptions = Utils::get_tts_options(options);
        
        size_t wavLength{};
        uint8_t *wav{};
        
        VoicevoxResultCode code = voicevox_synthesizer_tts(synthPtr.value(), text.c_str(), Utils::getStyleId(styleId), ttsOptions, &wavLength, &wav);
        
        if (code != VOICEVOX_RESULT_OK) {
            VoicevoxError("Voicevox", "tts", code);
        }
        
        if (options.format == AudioEncoding::ARRAYBUFFER) {
            auto buf = ArrayBuffer::copy(wav, wavLength);
            
            voicevox_wav_free(wav);
            return buf;
        } else {
            auto b64 = Utils::wav_to_base64(std::span<const uint8_t>{wav, wavLength});
            
            voicevox_wav_free(wav);
            return b64;
        }
    });
}

bool HybridVoicevox::getIsGpuMode() {
    if (!synthPtr.has_value()) {
        throw std::runtime_error("Synthesizer is not initialized!");
    }
    
    auto isGpuMode = voicevox_synthesizer_is_gpu_mode(synthPtr.value());
    
    return isGpuMode;
};

// Sing
std::string HybridVoicevox::createSingFrameAudioQuery(const std::string &score, double styleId) {
    if (!synthPtr.has_value()) {
        throw std::runtime_error("Synthesizer is not initialized!");
    }
    
    Utils::validate_score(score);
    
    char *json{};
    VoicevoxResultCode code = voicevox_synthesizer_create_sing_frame_audio_query(synthPtr.value(), score.c_str(), Utils::getStyleId(styleId), &json);
    
    if (code != VOICEVOX_RESULT_OK) {
        VoicevoxError("Voicevox", "createSingFrameAudioQuery", code);
    }
    
    auto jsonString = Utils::json_to_string(json);
    
    voicevox_json_free(json);
    
    return jsonString;
};

std::string HybridVoicevox::createSingFrameF0(const std::string &score, const std::string &frameAudioQuery, double styleId) {
    if (!synthPtr.has_value()) {
        throw std::runtime_error("Synthesizer is not initialized!");
    }
    
    Utils::sing_ensure_compatible(score, frameAudioQuery);
    
    char *json{};
    VoicevoxResultCode code = voicevox_synthesizer_create_sing_frame_f0(synthPtr.value(), score.c_str(), frameAudioQuery.c_str(), Utils::getStyleId(styleId), &json);
    
    if (code != VOICEVOX_RESULT_OK) {
        VoicevoxError("Voicevox", "createSingFrameF0", code);
    }
    
    auto jsonString = json ? std::string(json) : "[]";
    
    voicevox_json_free(json);
    
    return jsonString;
};

std::string HybridVoicevox::createSingFrameVolume(const std::string &score, const std::string &frameAudioQuery, double styleId) {
    if (!synthPtr.has_value()) {
        throw std::runtime_error("Synthesizer is not initialized!");
    }
    
    Utils::sing_ensure_compatible(score, frameAudioQuery);
    
    char *json{};
    VoicevoxResultCode code = voicevox_synthesizer_create_sing_frame_volume(synthPtr.value(), score.c_str(), frameAudioQuery.c_str(), Utils::getStyleId(styleId), &json);
    
    if (code != VOICEVOX_RESULT_OK) {
        VoicevoxError("Voicevox", "createSingFrameVolume", code);
    }
    
    auto jsonString = json ? std::string(json) : "[]";
    
    voicevox_json_free(json);
    
    return jsonString;
};

std::shared_ptr<Promise<std::variant<std::shared_ptr<ArrayBuffer>, std::string>>> HybridVoicevox::frameSynthesis(const std::string &frameAudioQuery, double styleId, AudioEncoding format) {
    return Promise<std::variant<std::shared_ptr<ArrayBuffer>, std::string>>::async([=, this]() -> std::variant<std::shared_ptr<ArrayBuffer>, std::string> {
        if (!synthPtr.has_value()) {
            throw std::runtime_error("Synthesizer is not initialized!");
        }
        
        Utils::validate_frame_audio_query(frameAudioQuery);
        
        size_t wavLength{};
        uint8_t *wav{};
        
        VoicevoxResultCode code =  voicevox_synthesizer_frame_synthesis(synthPtr.value(), frameAudioQuery.c_str(), Utils::getStyleId(styleId), &wavLength, &wav);
        
        if (code != VOICEVOX_RESULT_OK) {
            VoicevoxError("Voicevox", "frameSynthesis", code);
        }
        
        if (format == AudioEncoding::ARRAYBUFFER) {
            auto buf = ArrayBuffer::copy(wav, wavLength);
            
            voicevox_wav_free(wav);
            return buf;
        } else {
            auto b64 = Utils::wav_to_base64(std::span<const uint8_t>{wav, wavLength});
            
            voicevox_wav_free(wav);
            return b64;
        }
    });
};

// OpenJTalk
void HybridVoicevox::setUserDict(const std::shared_ptr<HybridUserDictNitroSpec> &userDict) {
    if (!ojtPtr.has_value()) {
        throw std::runtime_error("OpenJTalk is not initialized!");
    }
    
    VoicevoxUserDict* rawPtr = std::dynamic_pointer_cast<HybridUserDict>(userDict)->userDictPtr;
    
    VoicevoxResultCode code = voicevox_open_jtalk_rc_use_user_dict(ojtPtr.value(), rawPtr);
    
    if (code != VOICEVOX_RESULT_OK) {
        VoicevoxError("Voicevox", "setUserDict", code);
    }
};

std::string HybridVoicevox::analyze(const std::string &text) {
    if (!ojtPtr.has_value()) {
        throw std::runtime_error("OpenJTalk is not initialized!");
    }
    
    char *json{};
    VoicevoxResultCode code = voicevox_open_jtalk_rc_analyze(ojtPtr.value(), text.c_str(), &json);
    
    if (code != VOICEVOX_RESULT_OK) {
        VoicevoxError("Voicevox", "analyze", code);
    }
    
    auto jsonString = Utils::json_to_string(json);
    
    voicevox_json_free(json);
    
    return jsonString;
};

// Onnxruntime
std::string HybridVoicevox::getSupportedDevices() {
    if (!onnxPtr.has_value()) {
        throw std::runtime_error("Onnxruntime is not initialized!");
    }
    
    char *json{};
    
    VoicevoxResultCode code = voicevox_onnxruntime_create_supported_devices_json(onnxPtr.value(), &json);
    
    if (code != VOICEVOX_RESULT_OK) {
        VoicevoxError("Voicevox", "getSupportedDevices", code);
    }
    
    auto jsonString = Utils::json_to_string(json);
    
    voicevox_json_free(json);
    
    return jsonString;
};
}
