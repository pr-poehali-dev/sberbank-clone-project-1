import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeTab, setActiveTab] = useState('main');

  const contacts = [
    { name: 'Новый перевод', initials: '', icon: 'ArrowRight', isNew: true },
    { name: 'Ирина', surname: 'Артуровн...', initials: 'ИК', notifications: 0 },
    { name: 'Валерий', surname: 'Рустамов...', initials: 'ВС', notifications: 1 },
    { name: 'Милана', surname: 'Аслановн...', initials: 'МЦ', notifications: 2 },
    { name: 'Мадина', surname: 'Владими..', initials: 'МЦ', notifications: 2 },
  ];

  return (
    <div className="min-h-screen text-foreground pb-20" style={{ background: 'linear-gradient(180deg, #352058 0%, #2A1A4E 30%, #1C0F35 100%)' }}>
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-8">
          <Avatar className="w-11 h-11">
            <AvatarFallback className="bg-gray-600 text-white text-sm">👤</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 mx-3">
            <div className="flex items-center gap-2 bg-white/8 rounded-full px-4 py-2.5">
              <Icon name="Search" size={17} className="text-white/50" />
              <span className="text-white/50 text-[15px] font-light">Поиск</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="w-10 h-10 flex items-center justify-center">
              <Icon name="Bookmark" size={23} className="text-white" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center">
              <Icon name="Bell" size={23} className="text-white" />
            </button>
          </div>
        </div>

        <div className="mb-7">
          <div className="text-white/60 text-xs mb-1.5 font-light tracking-wide">В кошельке</div>
          <div className="flex items-center gap-1.5">
            <span className="text-white text-[32px] font-normal tracking-tight">7,58 ₽</span>
            <Icon name="ChevronRight" size={22} className="text-white/50 mt-1" />
            <div className="ml-auto flex gap-2">
              <button className="w-10 h-10 flex items-center justify-center">
                <Icon name="EyeOff" size={22} className="text-white/70" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center">
                <Icon name="MoreHorizontal" size={22} className="text-white/70" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.06] backdrop-blur-xl rounded-[24px] p-4 mb-6">
          <div className="grid grid-cols-3 gap-3.5">
            <div className="flex flex-col gap-3">
              <button className="w-full aspect-square bg-white/[0.08] rounded-[18px] flex items-center justify-center active:bg-white/[0.12] transition-colors">
                <Icon name="QrCode" size={36} className="text-white" />
              </button>
              <button className="w-full aspect-square bg-white/[0.08] rounded-[18px] flex items-center justify-center active:bg-white/[0.12] transition-colors">
                <Icon name="ShieldCheck" size={34} className="text-white" />
              </button>
            </div>

            <div className="col-span-2 bg-white/[0.08] rounded-[18px] p-4 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-auto">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)' }}>
                  <Icon name="CreditCard" size={22} className="text-white" />
                </div>
                <div className="text-white/40 text-xs font-light tracking-wide mt-1">3194</div>
              </div>
              <div className="mt-6">
                <div className="text-white text-[22px] font-normal mb-0.5 tracking-tight">7,58 ₽</div>
                <div className="text-white/40 text-xs font-light">Счёт •• 2996</div>
              </div>
            </div>

            <div className="col-span-1 bg-white/[0.08] rounded-[18px] p-3.5 flex flex-col items-center justify-between">
              <div className="w-[46px] h-[46px] rounded-full flex items-center justify-center text-white text-lg font-semibold mb-auto" style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' }}>
                С
              </div>
              <div className="text-center mt-4">
                <div className="text-white text-lg font-normal mb-0.5">0</div>
                <div className="text-white/40 text-[11px] font-light leading-tight">СберСпасибо</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-normal">Переводы на Сбер</h2>
            <button className="text-primary text-sm font-normal">
              Все (6)
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {contacts.map((contact, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2.5 min-w-[72px]">
                {contact.isNew ? (
                  <div className="w-[62px] h-[62px] rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Icon name="ArrowRight" size={26} className="text-white" />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-[62px] h-[62px] rounded-full bg-gray-500 flex items-center justify-center">
                      <span className="text-white text-base font-medium">{contact.initials}</span>
                    </div>
                    {contact.notifications > 0 && (
                      <div className="absolute -top-0.5 -right-0.5 w-[22px] h-[22px] rounded-full bg-orange-500 text-white text-[11px] font-medium flex items-center justify-center border-[2.5px] border-[#2A1A4E]">
                        {contact.notifications}
                      </div>
                    )}
                  </div>
                )}
                <div className="text-center">
                  <div className="text-white text-[13px] leading-tight mb-0.5 font-light">
                    {contact.isNew ? 'Новый' : contact.name}
                  </div>
                  <div className="text-white/50 text-[12px] font-light">
                    {contact.isNew ? 'перевод' : contact.surname}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0F0A1A] rounded-[24px] p-5 mt-7">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white text-xl font-normal">Расходы в ноябре</h2>
            <button className="text-primary text-sm font-normal">Все</button>
          </div>

          <div className="flex gap-3 mb-5">
            <div className="w-14 h-14 rounded-full bg-pink-500 flex items-center justify-center text-2xl shadow-md">
              📄
            </div>
            <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-2xl shadow-md">
              🏠
            </div>
            <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-2xl shadow-md">
              👥
            </div>
          </div>

          <div>
            <div className="text-white text-[15px] font-normal mb-1">Расходы по категориям</div>
            <div className="text-white/40 text-sm font-light">Появятся, когда вы что-нибудь купите</div>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#08030F] border-t border-white/[0.06] px-2 py-1.5 safe-area-inset-bottom">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('main')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 min-w-[68px]"
          >
            <Icon 
              name="Home" 
              size={24} 
              className={activeTab === 'main' ? 'text-primary' : 'text-white/50'} 
            />
            <span className={`text-[11px] font-light ${activeTab === 'main' ? 'text-primary' : 'text-white/50'}`}>
              Главный
            </span>
          </button>

          <button
            onClick={() => setActiveTab('savings')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 min-w-[68px]"
          >
            <Icon 
              name="BarChart3" 
              size={24} 
              className={activeTab === 'savings' ? 'text-primary' : 'text-white/50'} 
            />
            <span className={`text-[11px] font-light ${activeTab === 'savings' ? 'text-primary' : 'text-white/50'}`}>
              Накопления
            </span>
          </button>

          <button
            onClick={() => setActiveTab('assistant')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 min-w-[68px]"
          >
            <Icon 
              name="Sparkles" 
              size={24} 
              className={activeTab === 'assistant' ? 'text-primary' : 'text-white/50'} 
            />
            <span className={`text-[11px] font-light ${activeTab === 'assistant' ? 'text-primary' : 'text-white/50'}`}>
              Ассистент
            </span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 min-w-[68px]"
          >
            <Icon 
              name="ArrowRightLeft" 
              size={24} 
              className={activeTab === 'payments' ? 'text-primary' : 'text-white/50'} 
            />
            <span className={`text-[11px] font-light ${activeTab === 'payments' ? 'text-primary' : 'text-white/50'}`}>
              Платежи
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 min-w-[68px]"
          >
            <Icon 
              name="Clock" 
              size={24} 
              className={activeTab === 'history' ? 'text-primary' : 'text-white/50'} 
            />
            <span className={`text-[11px] font-light ${activeTab === 'history' ? 'text-primary' : 'text-white/50'}`}>
              История
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Index;
