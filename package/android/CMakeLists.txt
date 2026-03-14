project(NitroVoicevox)
cmake_minimum_required(VERSION 3.9.0)

set (PACKAGE_NAME NitroVoicevox)
set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 20)

# Add Voicevox Binaries
add_library(voicevox_core SHARED IMPORTED)
add_library(voicevox_onnxruntime SHARED IMPORTED)
set_target_properties(voicevox_core PROPERTIES
    IMPORTED_LOCATION ${CMAKE_CURRENT_SOURCE_DIR}/src/main/libs/${ANDROID_ABI}/libvoicevox_core.so
)
set_target_properties(voicevox_onnxruntime PROPERTIES
    IMPORTED_LOCATION ${CMAKE_CURRENT_SOURCE_DIR}/src/main/libs/${ANDROID_ABI}/libvoicevox_onnxruntime.so
)

# Define C++ library and add all sources
add_library(${PACKAGE_NAME} SHARED
        src/main/cpp/cpp-adapter.cpp
        ../cpp/HybridUserDict.cpp
        ../cpp/HybridVoiceModelFile.cpp
        ../cpp/HybridVoicevox.cpp
        ../cpp/HybridVoicevoxFactory.cpp
)

# Add Nitrogen specs :)
include(${CMAKE_SOURCE_DIR}/../nitrogen/generated/android/NitroVoicevox+autolinking.cmake)

# Set up local includes
include_directories(
        "src/main/cpp"
        "../cpp"
)

find_library(LOG_LIB log)

# Link all libraries together
target_link_libraries(
        ${PACKAGE_NAME}
        ${LOG_LIB}
        voicevox_core
        voicevox_onnxruntime
        android                                   # <-- Android core
)
