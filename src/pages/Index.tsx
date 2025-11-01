import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeTab, setActiveTab] = useState('main');
  const [hideBalance, setHideBalance] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const stories = [
    { id: 1, label: 'Новый\nперевод', icon: 'Plus', isNew: true },
    { id: 2, label: 'Ирина К.', initials: 'ИК', color: '#6B7280' },
    { id: 3, label: 'Валерий С.', initials: 'ВС', color: '#8B5CF6' },
    { id: 4, label: 'Милана Ц.', initials: 'МЦ', color: '#EC4899' },
    { id: 5, label: 'Мадина Ц.', initials: 'МЦ', color: '#F59E0B' },
  ];

  return (
    <div className="min-h-screen bg-[#21005D] text-white pb-20">
      <div className="px-4 pt-3 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-xl">👤</span>
          </div>

          <div className="flex-1 mx-3">
            <div className="bg-white/10 rounded-full px-4 py-2 flex items-center gap-2">
              <Icon name="Search" size={18} className="text-white/60" />
              <input 
                type="text" 
                placeholder="Поиск" 
                className="bg-transparent border-none outline-none text-white/80 placeholder:text-white/60 text-sm flex-1"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button className="w-10 h-10 flex items-center justify-center">
              <Icon name="Bookmark" size={22} className="text-white" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center">
              <Icon name="Bell" size={22} className="text-white" />
            </button>
          </div>
        </div>

        <div className="mb-5">
          <div className="text-white/70 text-xs mb-1">В кошельке</div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-medium">
              {hideBalance ? '••••• ₽' : `${user?.balance?.toLocaleString('ru-RU') || 0} ₽`}
            </span>
            <Icon name="ChevronRight" size={20} className="text-white/60" />
            <button 
              onClick={() => setHideBalance(!hideBalance)}
              className="ml-auto"
            >
              <Icon name={hideBalance ? "Eye" : "EyeOff"} size={20} className="text-white/60" />
            </button>
            <button
              onClick={() => navigate('/deposit')}
              className="bg-[#21A038] hover:bg-[#1A8030] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Пополнить
            </button>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-4 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-3">
              <button className="w-full aspect-square bg-white/10 rounded-2xl flex items-center justify-center">
                <Icon name="QrCode" size={32} className="text-white" />
              </button>
              <button className="w-full aspect-square bg-white/10 rounded-2xl flex items-center justify-center">
                <Icon name="Shield" size={32} className="text-white" />
              </button>
            </div>

            <div className="col-span-2 bg-gradient-to-br from-[#21A038] to-[#1A8030] rounded-2xl p-4 flex flex-col justify-between shadow-xl">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon name="CreditCard" size={20} className="text-white" />
                </div>
                <div className="text-white/80 text-xs">{user?.card_number || '3194'}</div>
              </div>
              <div>
                <div className="text-white text-2xl font-semibold mb-1">{user?.balance?.toLocaleString('ru-RU') || 0} ₽</div>
                <div className="text-white/80 text-xs">Счёт •• {user?.account_number || '2996'}</div>
              </div>
            </div>

            <div className="col-span-1 bg-white/10 rounded-2xl p-4 flex flex-col items-center justify-between">
              <div className="w-12 h-12 bg-gradient-to-br from-[#21A038] to-[#1A8030] rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                С
              </div>
              <div className="text-center">
                <div className="text-white text-lg font-semibold">{user?.sber_spasibo || 0}</div>
                <div className="text-white/60 text-[10px]">СберСпасибо</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Переводы на Сбер</h2>
            <button className="text-[#21A038] text-sm font-medium">
              Все (6)
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {stories.map((story) => (
              <div 
                key={story.id} 
                className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer"
                onClick={() => story.isNew && navigate('/transfer')}
              >
                {story.isNew ? (
                  <div className="w-16 h-16 rounded-full bg-[#21A038] flex items-center justify-center shadow-lg hover:bg-[#1A8030] transition-colors">
                    <Icon name="Plus" size={28} className="text-white" />
                  </div>
                ) : (
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-medium shadow-lg"
                    style={{ backgroundColor: story.color }}
                  >
                    {story.initials}
                  </div>
                )}
                <div className="text-center text-xs text-white/90 leading-tight whitespace-pre-line">
                  {story.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#1A0047] px-4 py-6 rounded-t-3xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Расходы в ноябре</h2>
          <button className="text-[#21A038] text-sm font-medium">Все</button>
        </div>

        <div className="flex gap-3 mb-4">
          <div className="w-14 h-14 rounded-full bg-[#E91E63] flex items-center justify-center text-2xl shadow-lg">
            📄
          </div>
          <div className="w-14 h-14 rounded-full bg-[#FF9800] flex items-center justify-center text-2xl shadow-lg">
            🏠
          </div>
          <div className="w-14 h-14 rounded-full bg-[#4CAF50] flex items-center justify-center text-2xl shadow-lg">
            👥
          </div>
        </div>

        <div>
          <div className="text-white font-medium mb-1">Расходы по категориям</div>
          <div className="text-white/60 text-sm">Появятся, когда вы что-нибудь купите</div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#1A0047] border-t border-white/10 safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          <button
            onClick={() => setActiveTab('main')}
            className="flex flex-col items-center gap-1 px-3 py-1 min-w-[60px]"
          >
            <Icon 
              name="Home" 
              size={24} 
              className={activeTab === 'main' ? 'text-[#21A038]' : 'text-white/50'} 
            />
            <span className={`text-[10px] ${activeTab === 'main' ? 'text-[#21A038]' : 'text-white/50'}`}>
              Главный
            </span>
          </button>

          <button
            onClick={() => setActiveTab('savings')}
            className="flex flex-col items-center gap-1 px-3 py-1 min-w-[60px]"
          >
            <Icon 
              name="PiggyBank" 
              size={24} 
              className={activeTab === 'savings' ? 'text-[#21A038]' : 'text-white/50'} 
            />
            <span className={`text-[10px] ${activeTab === 'savings' ? 'text-[#21A038]' : 'text-white/50'}`}>
              Накопления
            </span>
          </button>

          <button
            onClick={() => setActiveTab('assistant')}
            className="flex flex-col items-center gap-1 px-3 py-1 min-w-[60px]"
          >
            <Icon 
              name="Sparkles" 
              size={24} 
              className={activeTab === 'assistant' ? 'text-[#21A038]' : 'text-white/50'} 
            />
            <span className={`text-[10px] ${activeTab === 'assistant' ? 'text-[#21A038]' : 'text-white/50'}`}>
              Ассистент
            </span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className="flex flex-col items-center gap-1 px-3 py-1 min-w-[60px]"
          >
            <Icon 
              name="ArrowRightLeft" 
              size={24} 
              className={activeTab === 'payments' ? 'text-[#21A038]' : 'text-white/50'} 
            />
            <span className={`text-[10px] ${activeTab === 'payments' ? 'text-[#21A038]' : 'text-white/50'}`}>
              Платежи
            </span>
          </button>

          <button
            onClick={() => navigate('/history')}
            className="flex flex-col items-center gap-1 px-3 py-1 min-w-[60px]"
          >
            <Icon 
              name="Clock" 
              size={24} 
              className={activeTab === 'history' ? 'text-[#21A038]' : 'text-white/50'} 
            />
            <span className={`text-[10px] ${activeTab === 'history' ? 'text-[#21A038]' : 'text-white/50'}`}>
              История
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Index;