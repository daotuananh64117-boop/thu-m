
import React, { useState } from 'react';
import { ScriptLine } from './types';
import { ScriptRow } from './components/ScriptRow';
import { AddIcon } from './components/icons';

const App: React.FC = () => {
  const [scriptLines, setScriptLines] = useState<ScriptLine[]>([
    {
      id: 1,
      character: 'Người dẫn chuyện',
      script: 'Xin chào, đây là một bản thử nghiệm giọng nói được tạo bởi trí tuệ nhân tạo.',
      notes: 'Giọng nói ấm áp, thân thiện, tốc độ vừa phải.',
      voice: 'Kore',
      audioData: null,
    },
  ]);

  const updateLine = (index: number, updatedLine: ScriptLine) => {
    const newLines = [...scriptLines];
    newLines[index] = updatedLine;
    setScriptLines(newLines);
  };

  const addLine = () => {
    const newLine: ScriptLine = {
      id: Date.now(),
      character: '',
      script: '',
      notes: '',
      voice: 'Kore',
      audioData: null,
    };
    setScriptLines([...scriptLines, newLine]);
  };

  const deleteLine = (index: number) => {
    const newLines = scriptLines.filter((_, i) => i !== index);
    setScriptLines(newLines);
  };
  

  return (
    <div className="min-h-screen bg-studio-bg text-studio-text-primary font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            Studio Thu Âm AI
          </h1>
          <p className="mt-2 text-lg text-studio-text-secondary">
            Tạo bản thu âm chuyên nghiệp từ kịch bản của bạn.
          </p>
        </header>

        <main className="bg-studio-dark rounded-xl shadow-2xl shadow-black/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-studio-panel/50 text-xs text-studio-text-secondary uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-4 py-3 w-12 text-center">STT</th>
                  <th scope="col" className="px-4 py-3 w-1/6">Nhân vật</th>
                  <th scope="col" className="px-4 py-3 w-2/5">Kịch bản lồng tiếng</th>
                  <th scope="col" className="px-4 py-3 w-1/6">Ghi chú giọng & cảm xúc</th>
                  <th scope="col" className="px-4 py-3 w-1/6">Giọng đọc</th>
                  <th scope="col" className="px-4 py-3 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {scriptLines.map((line, index) => (
                  <ScriptRow
                    key={line.id}
                    index={index}
                    line={line}
                    onUpdate={(updatedLine) => updateLine(index, updatedLine)}
                    onDelete={() => deleteLine(index)}
                  />
                ))}
              </tbody>
            </table>
          </div>
           <div className="p-4 bg-studio-panel/30">
            <button
              onClick={addLine}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-studio-border rounded-lg text-studio-text-secondary hover:bg-studio-panel hover:text-studio-text-primary transition-colors"
            >
              <AddIcon />
              Thêm dòng mới
            </button>
          </div>
        </main>
        
        <footer className="text-center mt-8 text-sm text-studio-text-secondary">
            <p>&copy; {new Date().getFullYear()} Studio Thu Âm AI. Được cung cấp bởi Gemini API.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
