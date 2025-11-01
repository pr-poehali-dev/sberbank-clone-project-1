import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const Deposit = () => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  const quickAmounts = [100, 500, 1000, 5000, 10000];

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Введите корректную сумму');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/0484ff46-abe3-4a68-b712-72d069256179', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          type: 'deposit',
          amount: parseFloat(amount),
          description: 'Пополнение счета',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const updatedUser = { ...user, balance: data.new_balance };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        navigate('/');
      } else {
        setError(data.error || 'Ошибка пополнения');
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
        <h1 className="text-xl font-medium">Пополнить счёт</h1>
      </div>

      <div className="px-6 py-8">
        <div className="mb-6">
          <div className="text-white/70 text-sm mb-2">Текущий баланс</div>
          <div className="text-3xl font-semibold">
            {user.balance.toLocaleString('ru-RU')} ₽
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-white/70 mb-3">Сумма пополнения</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white text-2xl placeholder:text-white/40 focus:outline-none focus:border-[#21A038]"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 text-2xl">₽</span>
          </div>
        </div>

        <div className="mb-8">
          <div className="text-sm text-white/70 mb-3">Быстрая сумма</div>
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt.toString())}
                className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl py-3 text-white font-medium transition-colors"
              >
                {amt.toLocaleString('ru-RU')} ₽
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleDeposit}
          disabled={loading || !amount}
          className="w-full bg-[#21A038] hover:bg-[#1A8030] disabled:bg-white/10 disabled:text-white/50 text-white font-medium py-4 rounded-xl transition-colors"
        >
          {loading ? 'Пополнение...' : 'Пополнить счёт'}
        </button>

        <div className="mt-6 bg-white/5 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-[#21A038] mt-0.5" />
            <div className="text-sm text-white/70">
              Деньги поступят на ваш счёт мгновенно. Комиссия не взимается.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
