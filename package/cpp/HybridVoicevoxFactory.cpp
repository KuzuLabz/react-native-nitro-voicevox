#include "HybridVoicevoxFactory.hpp"
#include "HybridVoiceModelFile.hpp"

namespace margelo::nitro::voicevox {

std::shared_ptr<Promise<std::shared_ptr<HybridVoiceModelFileNitroSpec>>> HybridVoicevoxFactory::openVoiceModelFile(const std::string& uri) {
    return Promise<std::shared_ptr<HybridVoiceModelFileNitroSpec>>::async([uri]() -> std::shared_ptr<HybridVoiceModelFileNitroSpec> {
        try {
            return std::make_shared<HybridVoiceModelFile>(uri);
        } catch (const std::exception& e) {
            throw std::runtime_error("Failed to open voice model file: " + std::string(e.what()));
        }
    });
};

}
