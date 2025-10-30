
export interface ScriptLine {
  id: number;
  character: string;
  script: string;
  notes: string;
  voice: string;
  audioData: string | null; // Will store base64 pcm audio data
}

export interface VoiceOption {
  value: string;
  label: string;
}
