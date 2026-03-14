import { create } from 'zustand';
import { CharacterMeta, openVoiceModelFile, StyleMeta, Voicevox } from '@kuzulabz/react-native-nitro-voicevox';
import { downloadModel, getLocalModel } from '../utils/model';

type ModelsState = {
    styleId: number | null;
    singingTeacherId: number | null;
    singerId: number | null;
    modelIds: string[];
    metas: CharacterMeta[];
    isModelLoading: boolean;
    isSingModelLoading: boolean;
};

type ModelsActions = {
    loadModel: () => Promise<void>;
    loadSingModel: () => Promise<void>;
    unloadModel: (id: string) => Promise<void>;
    setStyleId: (id: number) => void;
    getRandomStyleId: (type: 'talk' | 'sing') => number;
};

export const useModelsStore = create<ModelsState & ModelsActions>((set, get) => ({
    styleId: null,
    singerId: null,
    singingTeacherId: null,
    modelIds: [],
    metas: [],
    isModelLoading: false,
    isSingModelLoading: false,
    getRandomStyleId(type) {
        const charStyles = get().metas.flatMap((m) => m.styles);
        if (type === 'sing') {
            const styles = charStyles.filter((s) => s.type === 'sing' || s.type === 'frame_decode');
            return styles[Math.floor(Math.random() * styles.length)].id;
        } else {
            const styles = charStyles.filter((s) => s.type === type);
            return charStyles[Math.floor(Math.random() * styles.length)].id;
        }
    },
    /** Only loads one model for this example. */
    async loadModel() {
        try {
            set({isModelLoading: true});
            const url = await getLocalModel();
            if (!url) {
                console.warn('Failed to load VVM asset');
                return;
            }
            const voiceModel = await openVoiceModelFile(url);
            await Voicevox.loadVoiceModel(voiceModel);
            const metas = await Voicevox.getMetas();
            set((state) => ({ ...state, styleId: metas[0].styles[0].id, modelIds: [...state.modelIds, voiceModel.id], metas, isModelLoading: false }));
        } catch (e) {
            console.error(e);
            return;
        }
    },
    async loadSingModel() {
        set({isSingModelLoading: true});
        const uri = await downloadModel('s0', 'https://github.com/VOICEVOX/voicevox_vvm/releases/download/0.16.3/s0.vvm');
        if (!uri) {
            console.warn('Failed to download sing model!');
            return;
        }
        const voiceModel = await openVoiceModelFile(uri);
        if (!Voicevox.getIsVoiceModelLoaded(voiceModel.id)) {
            await Voicevox.loadVoiceModel(voiceModel);
        } else {
            console.log('Model already loaded!');
        }
        const metas = await Voicevox.getMetas();
        set((state) => ({ ...state, singerId: 3000, singingTeacherId: 6000, modelIds: [...new Set([...state.modelIds, voiceModel.id])], metas, isSingModelLoading: false }));
    },
    async unloadModel(id) {
        await Voicevox.unloadVoiceModel(id);
        const metas = await Voicevox.getMetas();
        set((state) => ({...state, metas, modelIds: state.modelIds.filter((mId) => mId !== id)}));
    },
    setStyleId(id) {
        set({styleId: id});
    },
}));