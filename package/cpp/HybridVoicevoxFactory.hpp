#pragma once

#include <NitroModules/Promise.hpp>
#include "HybridVoicevoxFactorySpec.hpp"
#include "HybridUserDictNitroSpec.hpp"

namespace margelo::nitro::voicevox {
    
    class HybridVoicevoxFactory: public HybridVoicevoxFactorySpec {
    public:
        HybridVoicevoxFactory(): HybridObject(TAG) { }
    
    public:
        // methods
        std::shared_ptr<Promise<std::shared_ptr<HybridVoiceModelFileNitroSpec>>> openVoiceModelFile(const std::string& uri) override;
    };
}
