import React, { useState } from 'react';
import { EyeOff, Play, RotateCcw, Crown, AlertTriangle, Fingerprint, Smile, Sparkles, Key, Users, UserMinus, Search, Tag, Coffee, Shirt, Flame, ChevronDown, X, Grid } from 'lucide-react';

// --- CATEGORIES & WORD LISTS ---
const CATEGORIES = {
  clothes: {
    id: 'clothes',
    label: 'هدوم',
    icon: <Shirt size={28} />,
    color: 'bg-blue-600',
    words: [
      'تي شيرت', 'جاكيت', 'بنطلون', 'شورت', 'فستان', 
      'شراب', 'بوكسر', 'كوتشي', 'شبشب', 'طاقية', 
      'بيجامة', 'قميص', 'بدلة', 'كرافته', 'مايوه'
    ]
  },
  food: {
    id: 'food',
    label: 'أكل',
    icon: <Coffee size={28} />,
    color: 'bg-green-600',
    words: [
      'اندومي', 'مصاصه', 'قصب', 'فشار', 'بطيخ', 
      'كوارع', 'شاورما', 'حواوشي', 'محشي', 'مكرونة بشاميل', 
      'بيتزا', 'سوشي', 'فسيخ', 'رنجة', 'كشري', 'ملوخية'
    ]
  },
  adult: {
    id: 'adult',
    label: '+18',
    icon: <Flame size={28} />,
    color: 'bg-red-600',
    words: [
      'مخدرات', 'سيجارة فرط', 'كادلز', 'ميكب', 'صبي رقاصه', 
      'اختبار حمل', 'بكيني', 'قاعده', 'شيشة', 'فياجرا', 'لانجري'
    ]
  }
};

type CategoryKey = keyof typeof CATEGORIES | 'all';
type GameState = 'SETUP' | 'PLAY_LOOP' | 'FINISHED';

interface Player {
  id: number;
  role: 'imposter' | 'civilian';
  word: string;
}

const App = () => {
  const [gameState, setGameState] = useState<GameState>('SETUP');
  
  // Inputs
  const [playerCount, setPlayerCount] = useState<number | string>(5);
  const [imposterCount, setImposterCount] = useState<number | string>(1);
  const [customWord, setCustomWord] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  
  // UI States
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  // Game Logic
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // --- ACTIONS ---
  const startGame = () => {
    const pCount = typeof playerCount === 'string' ? parseInt(playerCount) : playerCount;
    const iCount = typeof imposterCount === 'string' ? parseInt(imposterCount) : imposterCount;

    if (!pCount || pCount < 3) {
      alert("لازم على الأقل 3 لعيبة!");
      setPlayerCount(3);
      return;
    }
    if (!iCount || iCount < 1) {
      alert("لازم يكون فيه امبوستر واحد على الأقل!");
      setImposterCount(1);
      return;
    }
    if (iCount > pCount) {
      alert(`مينفعش عدد الامبوستر (${iCount}) يبقى أكبر من عدد اللعيبة (${pCount})!`);
      return;
    }

    let secretWord = '';

    if (customWord.trim()) {
      secretWord = customWord.trim();
    } else {
      let sourceList: string[] = [];
      if (selectedCategory === 'all') {
        sourceList = [
          ...CATEGORIES.clothes.words,
          ...CATEGORIES.food.words,
          ...CATEGORIES.adult.words
        ];
      } else {
        sourceList = CATEGORIES[selectedCategory].words;
      }
      secretWord = sourceList[Math.floor(Math.random() * sourceList.length)];
    }

    const roles: ('imposter' | 'civilian')[] = Array(pCount).fill('civilian');
    for (let i = 0; i < iCount; i++) roles[i] = 'imposter';

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

  const getSelectedCategoryInfo = () => {
    if (selectedCategory === 'all') {
      return { label: 'كوكتيل', icon: <Grid size={24} />, color: 'bg-yellow-500' };
    }
    return {
      label: CATEGORIES[selectedCategory].label,
      icon: CATEGORIES[selectedCategory].icon,
      color: CATEGORIES[selectedCategory].color
    };
  };

  const activeCat = getSelectedCategoryInfo();

  return (
    // ROOT WRAPPER: Flexbox centering for the entire viewport
    <div className="fixed inset-0 w-full h-full bg-gray-900 text-white font-sans flex items-center justify-center overflow-hidden" dir="rtl">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vmin] h-[50vmin] bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vmin] h-[50vmin] bg-blue-600/20 rounded-full blur-[100px]" />
      </div>

      {/* CSS Styles */}
      <style>{`
        .scene { perspective: 1000px; }
        .card-object { width: 100%; height: 100%; position: relative; transition: transform 0.6s; transform-style: preserve-3d; }
        .card-object.is-flipped { transform: rotateY(180deg); }
        .card-face { position: absolute; inset: 0; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; border-radius: 1.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
        .card-front-bg { background-color: #2563eb; }
        .card-back-imposter { background-color: #dc2626; }
        .card-back-civilian { background-color: #059669; }
        .card-face-back { transform: rotateY(180deg); }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>

      {/* --- MODAL (FIXED CENTER) --- */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-gray-900 rounded-3xl border border-gray-700 shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-white flex items-center gap-2 mx-auto pr-8">
                 اختار القسم <Tag className="text-yellow-400" size={24} />
              </h2>
              <button 
                onClick={() => setShowCategoryModal(false)}
                className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { setSelectedCategory('all'); setShowCategoryModal(false); }}
                className={`w-full aspect-square p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 ${
                  selectedCategory === 'all' 
                    ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' 
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                <Grid size={40} />
                <span className="font-bold text-xl">كوكتيل</span>
              </button>
              {(Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>).map((key) => (
                <button
                  key={key}
                  onClick={() => { setSelectedCategory(key); setShowCategoryModal(false); }}
                  className={`w-full aspect-square p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 ${
                    selectedCategory === key 
                      ? 'bg-gray-800 border-white text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
                  }`}
                  style={{ borderColor: selectedCategory === key ? CATEGORIES[key].color.replace('bg-', '') : '' }}
                >
                  <div className={`${selectedCategory === key ? 'text-white' : 'text-gray-400'}`}>
                    {CATEGORIES[key].icon}
                  </div>
                  <span className="font-bold text-xl">{CATEGORIES[key].label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT WRAPPER (CENTERED) --- */}
      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center justify-center">

        {/* --- 1. SETUP SCREEN --- */}
        {gameState === 'SETUP' && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="mb-4">
               <Crown size={60} className="text-yellow-400 drop-shadow-lg" />
            </div>
            <h1 className="text-6xl font-black text-white mb-8 drop-shadow-md text-center">IMPOSTER</h1>

            <div className="w-full bg-gray-800/90 backdrop-blur-md p-6 rounded-3xl border border-gray-700 shadow-2xl">
              {/* Row 1 */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 text-center">
                  <label className="flex items-center justify-center gap-2 text-sm font-bold text-gray-300 mb-2">
                    <Users className="text-blue-400" size={18} />
                    اللعيبة
                  </label>
                  <input 
                    type="number" min="3" max="50"
                    value={playerCount}
                    onChange={(e) => setPlayerCount(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-xl p-3 text-center text-2xl font-black text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex-1 text-center">
                  <label className="flex items-center justify-center gap-2 text-sm font-bold text-gray-300 mb-2">
                    <UserMinus className="text-red-400" size={18} />
                    امبوستر
                  </label>
                  <input 
                    type="number" min="1" max="50"
                    value={imposterCount}
                    onChange={(e) => setImposterCount(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-xl p-3 text-center text-2xl font-black text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="mb-6 text-center">
                <label className="flex items-center justify-center gap-2 text-sm font-bold text-gray-300 mb-2">
                  <Tag className="text-yellow-400" size={18} />
                  القسم
                </label>
                <button 
                  onClick={() => setShowCategoryModal(true)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all active:scale-95 ${
                    selectedCategory === 'all' 
                      ? 'bg-gray-900 border-gray-600 text-white' 
                      : `bg-gray-900 border-gray-500 text-white`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${activeCat.color} text-white shadow-lg`}>
                      {activeCat.icon}
                    </div>
                    <span className="text-xl font-bold">{activeCat.label}</span>
                  </div>
                  <ChevronDown className="text-gray-400" />
                </button>
              </div>

              {/* Row 3 */}
              <div className="mb-8 text-center">
                 <label className="flex items-center justify-center gap-2 text-sm font-bold text-gray-300 mb-2">
                  <Key className="text-purple-400" size={18} />
                  كلمة سر (اختياري)
                </label>
                <input 
                  type="text" placeholder="اكتبها لو عايز تلغي القسم" 
                  value={customWord}
                  onChange={(e) => setCustomWord(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 rounded-xl p-3 text-center text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <button onClick={startGame} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-black py-4 rounded-2xl text-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
                <Play fill="black" size={24} /> يلا نبدأ
              </button>
            </div>
          </div>
        )}

        {/* --- 2. PLAYING SCREEN --- */}
        {gameState === 'PLAY_LOOP' && (
          <div className="w-full flex flex-col items-center scene animate-in fade-in duration-500">
            <div className="mb-6 text-center">
              <h2 className="text-gray-400 text-sm font-bold uppercase mb-1 tracking-widest">اللاعب رقم</h2>
              <div className="text-6xl font-black text-white">{currentPlayerIndex + 1}</div>
            </div>

            {/* CARD: Fixed height/width to prevent squishing */}
            <div 
              className="w-full aspect-[3/4] max-h-[500px] cursor-pointer"
              onClick={() => setIsFlipped(true)}
            >
              <div className={`card-object ${isFlipped ? 'is-flipped' : ''}`}>
                
                {/* FRONT */}
                <div className="card-face card-front-bg border-4 border-white/10 p-6 text-center">
                   <div className="bg-white/20 p-6 rounded-full mb-6 backdrop-blur-sm animate-pulse">
                     <Fingerprint size={64} className="text-white" />
                   </div>
                   <h2 className="text-4xl font-black text-white mb-4">خد الموبايل</h2>
                   <p className="text-blue-100 text-lg leading-relaxed px-4 mb-8">
                     اتأكد ان محدش تاني <br/> باصص في الشاشة 👀
                   </p>
                   <div className="mt-auto bg-black/20 px-6 py-3 rounded-full text-sm font-bold border border-white/20 flex items-center gap-2 animate-bounce">
                     <Sparkles size={16} className="text-yellow-400"/>
                     <span>اضغط عشان تقلب الكارت</span>
                   </div>
                </div>

                {/* BACK */}
                <div className={`card-face card-face-back border-4 border-white/10 p-6 text-center ${
                  players[currentPlayerIndex].role === 'imposter' ? 'card-back-imposter' : 'card-back-civilian'
                }`}>
                   {players[currentPlayerIndex].role === 'imposter' ? (
                     <>
                       <AlertTriangle size={80} className="text-white mb-6 animate-pulse" />
                       <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">IMPOSTER</h2>
                       <div className="bg-black/20 p-5 rounded-2xl w-full border border-white/10 mb-6">
                         <p className="text-2xl font-bold text-white leading-snug">انت الامبوستر <br/> ربنا يستر 🤫</p>
                       </div>
                     </>
                   ) : (
                     <>
                       <Smile size={80} className="text-white mb-6" />
                       <p className="text-green-100 font-bold tracking-widest text-sm uppercase mb-3 bg-white/10 px-4 py-1 rounded-full">الكلمة السرية</p>
                       <h2 className="text-5xl font-black text-white mb-8 leading-tight drop-shadow-md break-words w-full px-2">
                         {players[currentPlayerIndex].word}
                       </h2>
                       <div className="bg-black/20 p-4 rounded-xl w-full mb-6">
                         <p className="text-white font-bold text-base">حاول تفقس الامبوستر!</p>
                       </div>
                     </>
                   )}
                   <button onClick={handleNextPlayer} className="mt-auto w-full bg-white text-black font-black py-4 rounded-xl text-xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
                     <EyeOff size={24} />
                     <span>{currentPlayerIndex + 1 === players.length ? "يلا نبدأ" : "خبي وباصي"}</span>
                   </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 3. GAME OVER SCREEN --- */}
        {gameState === 'FINISHED' && (
          <div className="w-full flex flex-col items-center animate-in zoom-in duration-300 text-center">
             <div className="mb-8 animate-bounce">
                <Search size={100} className="text-blue-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.5)]" />
             </div>

             <h1 className="text-5xl md:text-7xl font-black mb-6 text-white drop-shadow-lg">
               ابدأوا اللعب!
             </h1>
             
             <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl mb-12 w-full">
              <span className="text-yellow-400 font-black text-3xl mt-4 block">
  يلا ابدأوا اللعب! 🗣️🔥
</span>
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
    </div>
  );
};

export default App;