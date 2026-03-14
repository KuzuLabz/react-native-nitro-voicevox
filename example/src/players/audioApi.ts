// Copied from the react-native-audio-api example
// https://github.com/software-mansion/react-native-audio-api/blob/main/apps/common-app/src/examples/AudioFile/AudioFile.tsx

import type {
  AudioBuffer,
  AudioBufferSourceNode,
  DecodeDataInput,
} from 'react-native-audio-api';
import {
  AudioContext,
  PlaybackNotificationManager,
  GainNode,
} from 'react-native-audio-api';
import { StorageAccessFramework } from 'expo-file-system/legacy';
import { Directory, File } from 'expo-file-system';
import { Platform, ToastAndroid, Alert } from 'react-native';

class AudioApiPlayer {
  private readonly audioContext: AudioContext;
  private sourceNode: AudioBufferSourceNode | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private volumeNode: GainNode | null = null;

  private isPlaying: boolean = false;

  private currentElapsedTime: number = 0;
  private playbackRate: number = 1;
  private volume: number = 1;
  private onPositionChanged: ((offset: number) => void) | null = null;

  constructor() {
    this.audioContext = new AudioContext();
  }

  play = async () => {
    if (this.isPlaying) {
      console.warn('Audio is already playing');
      return;
    }

    if (!this.audioBuffer) {
      console.warn('Audio buffer is not loaded');
      return;
    }

    this.isPlaying = true;
    PlaybackNotificationManager.show({
      state: 'playing',
    });

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    this.sourceNode = this.audioContext.createBufferSource({pitchCorrection: true});
    this.sourceNode.buffer = this.audioBuffer;
    this.sourceNode.playbackRate.value = this.playbackRate;
    this.volumeNode = this.audioContext.createGain();
    this.volumeNode.gain.value = this.volume;

    this.sourceNode.connect(this.volumeNode).connect(this.audioContext.destination);
    this.sourceNode.onPositionChangedInterval = 1000;
    this.sourceNode.onPositionChanged = (event) => {
      PlaybackNotificationManager.show({
        elapsedTime: this.currentElapsedTime,
      });
      this.currentElapsedTime = event.value;
      if (this.onPositionChanged) {
        this.onPositionChanged(
          this.currentElapsedTime / this.audioBuffer!.duration
        );
      }
    };

    this.sourceNode.start(
      this.audioContext.currentTime,
      this.currentElapsedTime
    );
  };

  pause = async () => {
    if (!this.isPlaying) {
      console.warn('Audio is not playing');
      return;
    }

    this.sourceNode?.stop(this.audioContext.currentTime);

    await this.audioContext.suspend();
    PlaybackNotificationManager.show({
      state: 'paused',
      elapsedTime: this.currentElapsedTime,
    });

    this.isPlaying = false;
  };

  seekBy = (seconds: number) => {
    this.sourceNode?.stop(this.audioContext.currentTime);
    this.currentElapsedTime += seconds;
    if (this.currentElapsedTime < 0) {
      this.currentElapsedTime = 0;
    } else if (this.currentElapsedTime > this.getDuration()) {
      this.currentElapsedTime = this.getDuration();
    }
    PlaybackNotificationManager.show({
      elapsedTime: this.currentElapsedTime,
    });

    if (this.isPlaying) {
      this.isPlaying = false;
      this.play();
    }
  };

  loadBuffer = async (asset: DecodeDataInput) => {
    const buffer = await this.audioContext.decodeAudioData(asset);

    if (buffer) {
      this.audioBuffer = buffer;
      this.playbackRate = 1;
    }
  };

  reset = async () => {
    if (this.sourceNode) {
      this.sourceNode.onEnded = null;
      this.sourceNode.onPositionChanged = null;
      this.sourceNode.stop(this.audioContext.currentTime);
    }
    this.audioBuffer = null;
    this.sourceNode = null;
    this.currentElapsedTime = 0;
    this.playbackRate = 1;
    this.isPlaying = false;

    await this.audioContext.suspend();
  };

  setOnPositionChanged = (
    callback: null | ((offset: number) => void) = null
  ) => {
    this.onPositionChanged = callback;
  };

  getDuration = (): number => {
    return this.audioBuffer?.duration ?? 0;
  };

  getElapsedTime = (): number => {
    return this.currentElapsedTime;
  };

  setVolume = (volume: number) => {
    this.volume = volume;
    if (this.volumeNode) {
      this.volumeNode.gain.value = volume;
    }
  };

  // encoder node not yet available as of 0.11.5  
  saveAudio = async (fileName: string, buffer: ArrayBuffer) => {
    if (this.sourceNode?.buffer) {
        if (Platform.OS === 'android') {
            const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (permissions.granted) {
                const fileUri = await StorageAccessFramework.createFileAsync(
                    permissions.directoryUri,
                    fileName,
                    'audio/wav',
                );

                const file = new File(fileUri);
                file.write(new Uint8Array(buffer));
                ToastAndroid.show('Audio saved!', ToastAndroid.SHORT);
            }
        } else {
            const dir = await Directory.pickDirectoryAsync();
            const file = dir.createFile(fileName, 'audio/wav');
            file.write(new Uint8Array(buffer));
            Alert.alert('Audio saved!', undefined, undefined);
        }
        
    }
  };
}

export default new AudioApiPlayer();