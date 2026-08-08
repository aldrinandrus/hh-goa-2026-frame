export type FormatMode = "frame" | "card";

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BuilderProfile {
  name: string;
  role: string;
  twitter: string;
  builderTitle: string;
  builderId: string;
}

export interface StoredCard {
  id: string;
  name: string;
  role: string;
  twitter?: string;
  builderTitle: string;
  format: FormatMode;
  /** Public URL or data URL of the generated PNG */
  imageDataUrl: string;
  photoDataUrl?: string;
  createdAt: string;
}

export interface UploadState {
  file: File | null;
  previewUrl: string | null;
  naturalWidth: number;
  naturalHeight: number;
}
