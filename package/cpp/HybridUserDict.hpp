#pragma once

#include <NitroModules/Promise.hpp>
#include "HybridUserDictNitroSpec.hpp"
#include "UserDictWordInput.hpp"
#include "VoicevoxBridge.hpp"

namespace margelo::nitro::voicevox {

class HybridUserDict final: public HybridUserDictNitroSpec {
    public:
        explicit HybridUserDict();
        ~HybridUserDict() { voicevox_user_dict_delete(userDictPtr); };
    public:
        // properties
        VoicevoxUserDict* userDictPtr;
    public:
        // methods
        std::shared_ptr<Promise<void>> load(const std::string& dictUrl) override;
    
        std::shared_ptr<Promise<void>> save(const std::string& destUrl) override;
    
        std::string addWord(const UserDictWordInput& word) override;
    
        void updateWord(const std::string& wordUuid, const UserDictWordInput& word) override;
    
        void removeWord(const std::string& wordUuid) override;
    
        std::shared_ptr<Promise<void>> importDict(const std::shared_ptr<HybridUserDictNitroSpec>& other) override;
    
        std::shared_ptr<Promise<std::string>> getWords() override;
};
}
