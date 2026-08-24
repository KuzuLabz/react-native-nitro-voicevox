# react-native-nitro-voicevox

An unoffical VOICEVOX React Native package built with [Nitro](https://nitro.margelo.com/)!

## Requirements
- Android minSdkVersion: 26 
- iOS deploymentTarget: 16.4

## Installation
```bash
bun add @kuzulabz/react-native-nitro-voicevox react-native-nitro-modules
```

## Usage
Checkout the [documentation site](https://kuzulabz.com/docs/react-native/voicevox) for the full API.

```ts
import { Voicevox, openVoiceModelFile, AudioOptions } from '@kuzulabz/react-native-nitro-voicevox';

// 1. Initialize
await Voicevox.initialize('file:///path/to/openJTalk/directory');

// 2. Load voice models
const voiceModel = await openVoiceModelFile('file:///path/to/model.vvm');
await Voicevox.loadVoiceModel(voiceModel);

// 2.5. Get a styleId
const metas = await Voicevox.getMetas();
const styleId = metas[0].styles[0].id;

// 3. TTS!
const wavb64 = await Voicevox.tts('こんにちは世界！', styleId);

// TTS but with control!
let audioQuery = Voicevox.createAudioQuery('こんにちは世界！', styleId);
audioQuery.speedScale += 0.1;

const audioConfig: AudioOptions = { format: 'arraybuffer', enableInterrogativeUpspeak: false };
const wavArrayBuffer = await Voicevox.synthesis(audioQuery, styleId, audioConfig);
```

## Credits
The [voicevox-core](https://github.com/VOICEVOX/voicevox_core)!

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Binaries are not included. You need to download the [voicevox_core](https://github.com/VOICEVOX/voicevox_core/releases/latest) and [voicevox_onnxruntime](https://github.com/VOICEVOX/onnxruntime-builder/releases/latest) dynamic libraries (so) and xcframeworks.