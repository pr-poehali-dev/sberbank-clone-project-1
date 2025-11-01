import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

type TransferType = 'sber' | 'external';

const Transfer = () => {
  const [user, setUser] = useState<any>(null);
  const [transferType, setTransferType] = useState<TransferType>('sber');
  const [phone, setPhone] = useState('');
  const [card, setCard] = useState('');
  const [bankName, setBankName] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleTransfer = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Введите корректную сумму');
      return;
    }

    if (transferType === 'sber' && !phone) {
      setError('Введите номер телефона получателя');
      return;
    }

    if (transferType === 'external' && !card) {
      setError('Введите номер карты получателя');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const body: any = {
        from_user_id: user.id,
        type: transferType === 'sber' ? 'sber_transfer' : 'external_transfer',
        amount: parseFloat(amount),
      };

      if (transferType === 'sber') {
        body.to_phone = phone;
      } else {
        body.to_card = card;
        body.bank_name = bankName || 'Внешний банк';
      }

      const response = await fetch('https://functions.poehali.dev/0d54b109-fc41-4033-9e80-8da3422fa454', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const updatedUser = { ...user, balance: data.new_balance };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setSuccess(data.message);
        setAmount('');
        setPhone('');
        setCard('');
        setBankName('');
        
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(data.error || 'Ошибка перевода');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#21005D] text-white">
      <div className="p-4 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center">
          <Icon name="ArrowLeft" size={24} className="text-white" />
        </button>
        <h1 className="text-xl font-medium">Перевод</h1>
      </div>

      <div className="px-6 py-6">
        <div className="mb-6">
          <div className="text-white/70 text-sm mb-2">Доступно</div>
          <div className="text-2xl font-semibold">
            {user.balance.toLocaleString('ru-RU')} ₽
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTransferType('sber')}
            className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
              transferType === 'sber'
                ? 'bg-[#21A038] text-white'
                : 'bg-white/10 text-white/70'
            }`}
          >
            На Сбер
          </button>
          <button
            onClick={() => setTransferType('external')}
            className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
              transferType === 'external'
                ? 'bg-[#21A038] text-white'
                : 'bg-white/10 text-white/70'
            }`}
          >
            В другой банк
          </button>
        </div>

        {transferType === 'sber' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Номер телефона получателя</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (999) 123-45-67"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#21A038]"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Сумма</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-xl placeholder:text-white/40 focus:outline-none focus:border-[#21A038]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 text-xl">₽</span>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={18} className="text-[#21A038] mt-0.5" />
                <div className="text-sm text-white/70">
                  Перевод между пользователями СберБанка без комиссии
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Номер карты получателя</label>
              <input
                type="text"
                value={card}
                onChange={(e) => setCard(e.target.value)}
                placeholder="5536 9138 1234 5678"
                maxLength={19}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#21A038]"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Название банка (необязательно)</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Тинькофф, Альфа-Банк..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#21A038]"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Сумма</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-xl placeholder:text-white/40 focus:outline-none focus:border-[#21A038]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 text-xl">₽</span>
              </div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Icon name="AlertCircle" size={18} className="text-orange-500 mt-0.5" />
                <div className="text-sm text-white/90">
                  Комиссия за перевод в другой банк: <span className="font-semibold">1%</span>
                  {amount && (
                    <div className="mt-1 text-white/70">
                      К списанию: {(parseFloat(amount) * 1.01).toLocaleString('ru-RU')} ₽
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl px-4 py-3 text-sm mt-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-xl px-4 py-3 text-sm mt-4">
            {success}
          </div>
        )}

        <button
          onClick={handleTransfer}
          disabled={loading || !amount}
          className="w-full bg-[#21A038] hover:bg-[#1A8030] disabled:bg-white/10 disabled:text-white/50 text-white font-medium py-4 rounded-xl transition-colors mt-6"
        >
          {loading ? 'Перевод...' : 'Перевести'}
        </button>
      </div>
    </div>
  );
};

export default Transfer;
