//
//  VoicevoxError.hpp
//  Pods
//
//  Created by Justin Lukasik on 2/13/26.
//
#pragma once

#include "VoicevoxBridge.hpp"

namespace margelo::nitro::voicevox {
    class VoicevoxError: public std::runtime_error {
    public:
        explicit VoicevoxError(const std::string &className, const std::string &funcName, const VoicevoxResultCode &code): std::runtime_error(className + " -> " + funcName + "(): " + std::string(voicevox_error_result_to_message(code))) {}
    };
}
