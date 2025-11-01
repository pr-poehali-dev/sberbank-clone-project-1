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
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-[420px] bg-gradient-to-b from-[#2A1A5E] to-background" />
        
        <div className="relative px-4 pt-3">
          <div className="flex items-center justify-between mb-6">
            <Avatar className="w-12 h-12 border-2 border-white/10">
              <AvatarFallback className="bg-gray-700 text-white text-xs">👤</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 mx-4">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2.5">
                <Icon name="Search" size={18} className="text-white/60" />
                <span className="text-white/60 text-sm">Поиск</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="w-10 h-10 flex items-center justify-center">
                <Icon name="Bookmark" size={22} className="text-white" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center relative">
                <Icon name="Bell" size={22} className="text-white" />
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-white/70 text-xs mb-1 tracking-wide">В кошельке</div>
            <div className="flex items-center gap-2">
              <span className="text-white text-3xl font-medium">7,58 ₽</span>
              <Icon name="ChevronRight" size={24} className="text-white/60" />
            </div>
          </div>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-3xl p-5 mb-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-3">
                <button className="w-full aspect-square bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/15 transition-colors">
                  <Icon name="QrCode" size={32} className="text-white" />
                </button>
                <button className="w-full aspect-square bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/15 transition-colors">
                  <Icon name="Shield" size={32} className="text-white" />
                </button>
              </div>

              <div className="col-span-2 bg-white/10 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-start gap-2 mb-auto">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                    <Icon name="CreditCard" size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white/50 text-xs mb-0.5">3194</div>
                  </div>
                </div>
                <div>
                  <div className="text-white text-2xl font-medium mb-0.5">7,58 ₽</div>
                  <div className="text-white/50 text-xs">Счёт •• 2996</div>
                </div>
              </div>

              <div className="col-span-1 bg-white/10 rounded-2xl p-4 flex flex-col items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white text-xl font-bold mb-auto">
                  С
                </div>
                <div className="text-center">
                  <div className="text-white text-xl font-medium">0</div>
                  <div className="text-white/50 text-xs mt-0.5">СберСпасибо</div>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-semibold">Переводы на Сбер</h2>
              <button className="text-primary text-sm">
                Все (6)
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
              {contacts.map((contact, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 min-w-[80px]">
                  {contact.isNew ? (
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                      <Icon name="ArrowRight" size={28} className="text-white" />
                    </div>
                  ) : (
                    <div className="relative">
                      <Avatar className="w-16 h-16 bg-gray-600 border-2 border-transparent">
                        <AvatarFallback className="bg-gray-600 text-white text-lg font-medium">
                          {contact.initials}
                        </AvatarFallback>
                      </Avatar>
                      {contact.notifications > 0 && (
                        <Badge className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center p-0 border-2 border-background">
                          {contact.notifications}
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-white text-xs leading-tight mb-0.5">
                      {contact.isNew ? 'Новый' : contact.name}
                    </div>
                    <div className="text-white/60 text-xs">
                      {contact.isNew ? 'перевод' : contact.surname}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-card rounded-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Расходы в ноябре</h2>
              <button className="text-primary text-sm">Все</button>
            </div>

            <div className="flex gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-pink-500 flex items-center justify-center text-2xl">
                📄
              </div>
              <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-2xl">
                🏠
              </div>
              <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-2xl">
                👥
              </div>
            </div>

            <div>
              <div className="text-base font-medium mb-1">Расходы по категориям</div>
              <div className="text-sm text-muted-foreground">Появятся, когда вы что-нибудь купите</div>
            </div>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#0A0614] border-t border-white/5 px-4 py-2">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('main')}
            className="flex flex-col items-center gap-1 px-4 py-2 min-w-[70px]"
          >
            <Icon 
              name="Home" 
              size={24} 
              className={activeTab === 'main' ? 'text-primary' : 'text-white/60'} 
            />
            <span className={`text-xs ${activeTab === 'main' ? 'text-primary' : 'text-white/60'}`}>
              Главный
            </span>
          </button>

          <button
            onClick={() => setActiveTab('savings')}
            className="flex flex-col items-center gap-1 px-4 py-2 min-w-[70px]"
          >
            <Icon 
              name="BarChart3" 
              size={24} 
              className={activeTab === 'savings' ? 'text-primary' : 'text-white/60'} 
            />
            <span className={`text-xs ${activeTab === 'savings' ? 'text-primary' : 'text-white/60'}`}>
              Накопления
            </span>
          </button>

          <button
            onClick={() => setActiveTab('assistant')}
            className="flex flex-col items-center gap-1 px-4 py-2 min-w-[70px]"
          >
            <div className="relative">
              <Icon 
                name="Sparkles" 
                size={24} 
                className={activeTab === 'assistant' ? 'text-primary' : 'text-white/60'} 
              />
            </div>
            <span className={`text-xs ${activeTab === 'assistant' ? 'text-primary' : 'text-white/60'}`}>
              Ассистент
            </span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className="flex flex-col items-center gap-1 px-4 py-2 min-w-[70px]"
          >
            <Icon 
              name="ArrowRightLeft" 
              size={24} 
              className={activeTab === 'payments' ? 'text-primary' : 'text-white/60'} 
            />
            <span className={`text-xs ${activeTab === 'payments' ? 'text-primary' : 'text-white/60'}`}>
              Платежи
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className="flex flex-col items-center gap-1 px-4 py-2 min-w-[70px]"
          >
            <Icon 
              name="Clock" 
              size={24} 
              className={activeTab === 'history' ? 'text-primary' : 'text-white/60'} 
            />
            <span className={`text-xs ${activeTab === 'history' ? 'text-primary' : 'text-white/60'}`}>
              История
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Index;
