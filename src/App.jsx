import React, { useState } from 'react';
import Landing from './components/Landing';
import Developer from './components/dev/Developer';
import Designer from './components/design/Designer';
import GlobalHeader from './components/GlobalHeader'; // Import new header

function App() {
  // Defaulting to 'dev' for easier testing, change back to 'landing' when done
  const [mode, setMode] = useState('landing'); 

  return (
      // Using arbitrary values for specific background colors based on mode
      <div className={`min-h-screen w-full transition-colors duration-700 ease-in-out font-sans ${
        mode === 'dev' ? 'bg-[#F3F3F1]' : mode === 'design' ? 'bg-[#050505]' : 'bg-black'
      }`}>
      
      {/* GLOBAL HEADER (Logo + Switch Button) */}
      {mode !== 'landing' && (
        <GlobalHeader currentMode={mode} setMode={setMode} />
      )}

      {/* Views */}
      {mode === 'landing' && <Landing setMode={setMode} />}
      {mode === 'dev' && <Developer />}
      {mode === 'design' && <Designer />}
    </div>
  );
}

export default App;