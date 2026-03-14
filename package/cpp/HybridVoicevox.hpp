#pragma once


#include <NitroModules/Promise.hpp>
#include "HybridVoicevoxNitroSpec.hpp"
#include "VoicevoxBridge.hpp"

namespace margelo::nitro::voicevox {

class HybridVoicevox: public HybridVoicevoxNitroSpec {
    
private:
    // pointers
    std::optional<const VoicevoxOnnxruntime*> onnxPtr;
    std::optional<OpenJtalkRc*> ojtPtr;
    std::optional<VoicevoxSynthesizer*> synthPtr;
    
private:
    // methods
    void initializeOnnx();
    void initializeOpenJTalk(const std::string& uri);
    
public:
    HybridVoicevox(): HybridObject(TAG) { }
    
    ~HybridVoicevox() {
        if (ojtPtr.has_value()) {
            voicevox_open_jtalk_rc_delete(ojtPtr.value());
        }
        if (synthPtr.has_value()) {
            voicevox_synthesizer_delete(synthPtr.value());
        }
    };
    
public:
    // properties
    std::string getVOICEVOX_VERSION() override;
    
public:
    // methods
    bool getIsInitialized() override;
    
    std::shared_ptr<Promise<void>> initialize(const std::string& openJTalkUri) override;

    void deinitialize() override;
    
    std::shared_ptr<Promise<std::string>> getMetas() override;
    
    std::shared_ptr<Promise<void>> loadVoiceModel(const std::shared_ptr<HybridVoiceModelFileNitroSpec>& voiceModel) override;
    
    std::shared_ptr<Promise<void>> unloadVoiceModel(const std::string& voiceModelId) override;
    
    bool getIsVoiceModelLoaded(const std::string& voiceModelId) override;
    
    std::string createAudioQueryFromKana(const std::string& kana, double styleId) override;
    
    std::string createAudioQuery(const std::string& text, double styleId) override;
    
    std::string createAccentPhrasesFromKana(const std::string& kana, double styleId) override;
    
    std::string createAccentPhrases(const std::string& text, double styleId) override;
    
    std::string replaceMoraData(const std::string& accentPhrases, double styleId) override;
    
    std::string replaceMoraPitch(const std::string& accentPhrases, double styleId) override;
    
    std::string replacePhonemeLength(const std::string& accentPhrases, double styleId) override;
    
    std::shared_ptr<Promise<std::variant<std::shared_ptr<ArrayBuffer>, std::string>>> synthesis(const std::string& audioQuery, double styleId, const AudioOptions& options) override;
    
    std::shared_ptr<Promise<std::variant<std::shared_ptr<ArrayBuffer>, std::string>>> ttsFromKana(const std::string& kana, double styleId, const AudioOptions& options) override;
    
    std::shared_ptr<Promise<std::variant<std::shared_ptr<ArrayBuffer>, std::string>>> tts(const std::string& text, double styleId, const AudioOptions& options) override;
    
    bool getIsGpuMode() override;
    
    // Sing
    std::string createSingFrameAudioQuery(const std::string& score, double styleId) override;
    std::string createSingFrameF0(const std::string& score, const std::string& frameAudioQuery, double styleId) override;
    std::string createSingFrameVolume(const std::string& score, const std::string& frameAudioQuery, double styleId) override;
    std::shared_ptr<Promise<std::variant<std::shared_ptr<ArrayBuffer>, std::string>>> frameSynthesis(const std::string& frameAudioQuery, double styleId, AudioEncoding format) override;
    
    // OpenJTalk
    std::string analyze(const std::string& text) override;
    void setUserDict(const std::shared_ptr<HybridUserDictNitroSpec>& userDict) override;
    
    // Onnxruntime
    std::string getSupportedDevices() override;
};

}
