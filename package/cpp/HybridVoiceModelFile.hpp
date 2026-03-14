#pragma once

#include <NitroModules/Promise.hpp>
#include "HybridVoiceModelFileNitroSpec.hpp"
#include "VoicevoxBridge.hpp"

namespace margelo::nitro::voicevox {
    
    class HybridVoiceModelFile final: public HybridVoiceModelFileNitroSpec {
    public:
        explicit HybridVoiceModelFile(const std::string &uri);
        ~HybridVoiceModelFile() {
            voicevox_voice_model_file_delete(voiceModelFilePtr);
        };
    public:
        // properties
        VoicevoxVoiceModelFile* voiceModelFilePtr;
        std::string getId() override;
        std::string getJson() override;
    };
}
