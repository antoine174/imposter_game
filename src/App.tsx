import React, { useState } from 'react';
import { EyeOff, Play, RotateCcw, Crown, AlertTriangle, Fingerprint, Smile, Sparkles, User, Key, Search } from 'lucide-react';

// --- ARABIC WORD LIST ---
const WORD_LIST = [
  'صبي رقاصه', 'اندومي', 'مصاصه', 'قصب', 'مخدرات', 
  'اختبار حمل', 'نوم', 'مصيف', 'توك توك', 'شبشب', 'كوارع', 'سيجارة فرط', 'ميكروباص',
  'فشار', 'بطيخ', 'مرجيحة', 'حلاق', 'جيم', 'شاحن'
];

type GameState = 'SETUP' | 'PLAY_LOOP' | 'FINISHED';

interface Player {
  id: number;
  role: 'imposter' | 'civilian';
  word: string;
}

const App = () => {
  const [gameState, setGameState] = useState<GameState>('SETUP');
  const [playerCount, setPlayerCount] = useState<number | string>(5);
  const [customWord, setCustomWord] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // --- ACTIONS ---
  const startGame = () => {
    const count = typeof playerCount === 'string' ? parseInt(playerCount) : playerCount;
    if (!count || count < 3) {
      alert("لازم على الأقل 3 لعيبة!");
      setPlayerCount(3);
      return;
    }

    const secretWord = customWord.trim() || WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    const roles: ('imposter' | 'civilian')[] = Array(count).fill('civilian');
    roles[0] = 'imposter'; 

    // Shuffle
    for (let i = roles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [roles[i], roles[j]] = [roles[j], roles[i]];
    }

    setPlayers(roles.map((role, index) => ({
      id: index + 1,
      role: role,
      word: role === 'imposter' ? 'IMPOSTER' : secretWord
    })));

    setCurrentPlayerIndex(0);
    setIsFlipped(false);
    setGameState('PLAY_LOOP');
  };

  const handleNextPlayer = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsFlipped(false);
    
    // Wait for flip animation
    setTimeout(() => {
      if (currentPlayerIndex + 1 < players.length) {
        setCurrentPlayerIndex(prev => prev + 1);
      } else {
        setGameState('FINISHED');
      }
    }, 600);
  };

  const resetGame = () => {
    setGameState('SETUP');
    setCustomWord('');
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="min-h-[100dvh] bg-gray-900 text-white font-sans overflow-hidden select-none flex flex-col relative" dir="rtl">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gray-900">
        <div className="absolute top-[-10%] left-[-10%] w-[40vh] h-[40vh] bg-purple-600/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vh] h-[40vh] bg-blue-600/20 rounded-full blur-[80px]" />
      </div>

      {/* --- CSS --- */}
      <style>{`
        .scene { perspective: 1000px; }
        .card-object { 
          width: 100%; 
          height: 100%; 
          position: relative; 
          transition: transform 0.6s; 
          transform-style: preserve-3d; 
        }
        .card-object.is-flipped { transform: rotateY(180deg); }
        
        .card-face { 
          position: absolute; 
          inset: 0;
          width: 100%; 
          height: 100%; 
          -webkit-backface-visibility: hidden; 
          backface-visibility: hidden; 
          border-radius: 1.5rem; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        
        /* Solid colors to prevent ghosting */
        .card-front-bg { background-color: #2563eb; } /* Blue */
        .card-back-imposter { background-color: #dc2626; } /* Red */
        .card-back-civilian { background-color: #059669; } /* Green */
        
        .card-face-back { transform: rotateY(180deg); }
        
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; margin: 0; 
        }
      `}</style>

      {/* --- 1. SETUP SCREEN --- */}
      {gameState === 'SETUP' && (
        <div className="flex-grow flex flex-col items-center justify-center p-4 z-10 w-full max-w-lg mx-auto">
          <div className="mb-4">
             <Crown size={60} className="text-yellow-400 drop-shadow-lg" />
          </div>
          <h1 className="text-5xl font-black text-white mb-2 drop-shadow-md">IMPOSTER</h1>
          <p className="text-gray-400 text-lg mb-8 font-medium">مين فينا الكداب؟ 😉</p>

          <div className="w-full bg-gray-800/90 backdrop-blur-md p-6 rounded-3xl border border-gray-700 shadow-2xl">
            <div className="mb-6">
              <label className="flex items-center gap-2 text-lg font-bold text-gray-300 mb-2">
                <User className="text-yellow-400" size={20} />
                عدد اللعيبه
              </label>
              <input 
                type="number" min="3" max="50"
                value={playerCount}
                onChange={(e) => setPlayerCount(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-xl p-4 text-center text-3xl font-black text-white focus:outline-none focus:border-yellow-500 transition-all placeholder-gray-600"
                placeholder="5"
              />
            </div>
            <div className="mb-8">
               <label className="flex items-center gap-2 text-lg font-bold text-gray-300 mb-2">
                <Key className="text-purple-400" size={20} />
                كلمة سر (اختياري)
              </label>
              <input 
                type="text" placeholder="سيبها فاضية لعشوائي" 
                value={customWord}
                onChange={(e) => setCustomWord(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-xl p-4 text-center text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>
            <button onClick={startGame} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-2xl text-xl shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-transform">
              <Play fill="black" size={24} /> يلا نبدأ
            </button>
          </div>
        </div>
      )}

      {/* --- 2. PLAYING SCREEN (CARD FLIP) --- */}
      {gameState === 'PLAY_LOOP' && (
        <div className="flex-grow flex flex-col items-center justify-center p-4 scene z-10 w-full">
          <div className="mb-4 text-center shrink-0">
            <h2 className="text-gray-400 text-xs font-bold uppercase mb-1 tracking-widest">اللاعب رقم</h2>
            <div className="text-5xl font-black text-white">{currentPlayerIndex + 1}</div>
          </div>

          <div 
            className="w-[85vw] max-w-sm aspect-[3/4] max-h-[60vh] cursor-pointer"
            onClick={() => setIsFlipped(true)}
          >
            <div className={`card-object ${isFlipped ? 'is-flipped' : ''}`}>
              
              {/* FRONT FACE (SOLID BLUE) */}
              <div className="card-face card-front-bg border-4 border-white/10">
                 <div className="bg-white/20 p-5 rounded-full mb-4 backdrop-blur-sm animate-pulse">
                   <Fingerprint size={56} className="text-white" />
                 </div>
                 <h2 className="text-3xl font-black text-white mb-2 text-center">خد الموبايل</h2>
                 <p className="text-blue-100 text-center text-base leading-relaxed px-2">
                   اتأكد ان محدش تاني <br/> باصص في الشاشة 👀
                 </p>
                 <div className="mt-auto mb-4 bg-black/20 px-5 py-3 rounded-full text-xs font-bold border border-white/20 flex items-center gap-2 animate-bounce">
                   <Sparkles size={16} className="text-yellow-400"/>
                   <span>اضغط عشان تقلب الكارت</span>
                 </div>
              </div>

              {/* BACK FACE (SOLID RED/GREEN) */}
              <div className={`card-face card-face-back border-4 border-white/10 ${
                players[currentPlayerIndex].role === 'imposter' ? 'card-back-imposter' : 'card-back-civilian'
              }`}>
                 {players[currentPlayerIndex].role === 'imposter' ? (
                   <>
                     <AlertTriangle size={70} className="text-white mb-4 animate-pulse" />
                     <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">IMPOSTER</h2>
                     <div className="bg-black/20 p-4 rounded-2xl w-full text-center border border-white/10">
                       <p className="text-xl font-bold text-white leading-snug">انت الامبوستر <br/> ربنا يستر 🤫</p>
                     </div>
                   </>
                 ) : (
                   <>
                     <Smile size={70} className="text-white mb-4" />
                     <p className="text-green-100 font-bold tracking-widest text-xs uppercase mb-2 bg-white/10 px-3 py-1 rounded-full">الكلمة السرية</p>
                     <h2 className="text-4xl md:text-5xl font-black text-white mb-6 text-center leading-tight drop-shadow-md break-words w-full px-2">
                       {players[currentPlayerIndex].word}
                     </h2>
                     <div className="bg-black/20 p-3 rounded-xl w-full text-center">
                       <p className="text-white font-bold text-sm">حاول تفقس الامبوستر!</p>
                     </div>
                   </>
                 )}
                 <button onClick={handleNextPlayer} className="mt-auto mb-4 w-full bg-white text-black font-black py-4 rounded-xl text-lg shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
                   <EyeOff size={24} />
                   <span>{currentPlayerIndex + 1 === players.length ? "يلا نبدأ" : "خبي وباصي"}</span>
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- 3. GAME OVER SCREEN (FIXED OVERLAY) --- */}
      {gameState === 'FINISHED' && (
        <div className="fixed inset-0 z-[9999] bg-gray-900 flex flex-col items-center justify-center p-6 text-center w-full h-full">
           <div className="mb-6 animate-bounce">
              <Search size={80} className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
           </div>

           <h1 className="text-5xl md:text-7xl font-black mb-4 text-white drop-shadow-lg">
             ابدأوا اللعب!
           </h1>
           
           <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700 shadow-2xl mb-12 w-full max-w-sm">
             <p className="text-xl leading-relaxed text-gray-200 font-medium">
               الكل شاف كلمته.. <br/>
               ماعدا واحد بس مش عارف حاجة.<br/>
               <span className="text-yellow-400 font-black text-3xl mt-4 block">طلعوه برة! 🫵</span>
             </p>
           </div>
           
           <button 
             onClick={resetGame}
             className="w-full max-w-xs bg-white text-gray-900 font-black py-5 rounded-2xl text-2xl shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3 active:scale-95 transition-transform hover:scale-105"
           >
             <RotateCcw size={28} /> العب تاني
           </button>
        </div>
      )}
    </div>
  );
};

export default App;