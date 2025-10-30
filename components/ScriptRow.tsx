
import React, { useState, useRef, useEffect } from 'react';
import { ScriptLine } from '../types';
import { VOICE_OPTIONS } from '../constants';
import { generateSpeech } from '../services/geminiService';
import { createWavBlobFromPcm } from '../utils/audioUtils';
import { PlayIcon, PauseIcon, DownloadIcon, GenerateIcon, DeleteIcon, LoadingIcon } from './icons';

interface ScriptRowProps {
  index: number;
  line: ScriptLine;
  onUpdate: (updatedLine: ScriptLine) => void;
  onDelete: () => void;
}

export const ScriptRow: React.FC<ScriptRowProps> = ({ index, line, onUpdate, onDelete }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Clean up blob URL when component unmounts or audio data changes
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleInputChange = (field: keyof ScriptLine, value: string) => {
    onUpdate({ ...line, [field]: value, audioData: null }); // Reset audio if script changes
    setAudioUrl(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!line.script) {
        setError('Kịch bản không được để trống.');
        return;
    }
    setIsGenerating(true);
    setError(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);

    try {
        const pcmData = await generateSpeech(line.script, line.voice);
        onUpdate({ ...line, audioData: pcmData });
        const wavBlob = createWavBlobFromPcm(pcmData);
        setAudioUrl(URL.createObjectURL(wavBlob));
    } catch (e) {
        console.error(e);
        setError((e as Error).message || 'Lỗi không xác định.');
    } finally {
        setIsGenerating(false);
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play();
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `${line.character || 'audio'}_${index + 1}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <tr className="bg-studio-dark border-b border-studio-border hover:bg-studio-panel/50 transition-colors">
      <td className="px-4 py-3 text-center text-studio-text-secondary">{index + 1}</td>
      <td className="px-4 py-3">
        <input
          type="text"
          value={line.character}
          onChange={(e) => handleInputChange('character', e.target.value)}
          className="w-full bg-transparent border-0 focus:ring-0 p-0"
          placeholder="Tên nhân vật"
        />
      </td>
      <td className="px-4 py-3">
        <textarea
          value={line.script}
          onChange={(e) => handleInputChange('script', e.target.value)}
          rows={2}
          className="w-full bg-transparent border-0 focus:ring-0 p-0 resize-none"
          placeholder="Nội dung kịch bản..."
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </td>
      <td className="px-4 py-3">
        <input
          type="text"
          value={line.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          className="w-full bg-transparent border-0 focus:ring-0 p-0"
          placeholder="Ghi chú..."
        />
      </td>
      <td className="px-4 py-3">
        <select
          value={line.voice}
          onChange={(e) => handleInputChange('voice', e.target.value)}
          className="w-full bg-studio-dark border border-studio-border rounded-md py-1 px-2 focus:ring-2 focus:ring-studio-accent focus:border-studio-accent"
        >
          {VOICE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-studio-dark">
              {opt.label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center space-x-2">
            {isGenerating ? (
                 <button className="p-2 text-studio-text-secondary" disabled><LoadingIcon /></button>
            ) : (
                <button onClick={handleGenerate} title="Tạo âm thanh" className="p-2 text-studio-text-secondary hover:text-studio-accent transition-colors"><GenerateIcon /></button>
            )}
            
            <button onClick={togglePlayPause} disabled={!audioUrl} title={isPlaying ? "Dừng" : "Phát"} className="p-2 text-studio-text-secondary hover:text-studio-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            <button onClick={handleDownload} disabled={!audioUrl} title="Tải xuống" className="p-2 text-studio-text-secondary hover:text-studio-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <DownloadIcon />
            </button>
            <button onClick={onDelete} title="Xoá dòng" className="p-2 text-red-500/60 hover:text-red-500 transition-colors">
                <DeleteIcon />
            </button>
        </div>
        {audioUrl && (
            <audio
                ref={audioRef}
                src={audioUrl}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                hidden
            />
        )}
      </td>
    </tr>
  );
};
