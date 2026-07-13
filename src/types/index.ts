export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  negativePrompt?: string;
  seed: number;
  aspectRatio: string;
  guidanceScale: number;
  steps: number;
  size: number;
  model: 'pollinations' | 'huggingface';
  date: string;
  favorite: boolean;
}

export interface EditorState {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
}

export interface GenerationSettings {
  aspectRatio: string;
  size: number;
  guidanceScale: number;
  steps: number;
  seed: number;
  model: 'pollinations' | 'huggingface';
}

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export type Language = 'en' | 'ar';

export interface I18nText {
  en: string;
  ar: string;
}
