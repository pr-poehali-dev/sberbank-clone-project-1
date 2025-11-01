import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

interface Transaction {
  id: number;
  type: string;
  amount: number;
  description: string;
  category: string;
  status: string;
  created_at: string;
}

const History = () => {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      loadTransactions(JSON.parse(userData).id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const loadTransactions = async (userId: number) => {
    try {
      const response = await fetch(
        `https://functions.poehali.dev/0484ff46-abe3-4a68-b712-72d069256179?user_id=${userId}`
      );
      const data = await response.json();
      
      if (response.ok && data.transactions) {
        setTransactions(data.transactions);
      }
    } catch (err) {
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return { icon: 'ArrowDownCircle', color: 'text-green-500' };
      case 'withdraw':
        return { icon: 'ArrowUpCircle', color: 'text-red-500' };
      case 'transfer_out':
      case 'external_transfer':
        return { icon: 'ArrowUpRight', color: 'text-orange-500' };
      case 'transfer_in':
        return { icon: 'ArrowDownLeft', color: 'text-green-500' };
      default:
        return { icon: 'Circle', color: 'text-white' };
    }
  };

  const getTransactionSign = (type: string) => {
    return type === 'deposit' || type === 'transfer_in' ? '+' : '-';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня, ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера, ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#21005D] text-white pb-6">
      <div className="p-4 flex items-center gap-4 sticky top-0 bg-[#21005D] z-10">
        <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center">
          <Icon name="ArrowLeft" size={24} className="text-white" />
        </button>
        <h1 className="text-xl font-medium">История операций</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-white/60">Загрузка...</div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <Icon name="Clock" size={48} className="text-white/30 mb-4" />
          <div className="text-white/60 text-lg mb-2">История пуста</div>
          <div className="text-white/40 text-sm">Здесь появятся ваши операции</div>
        </div>
      ) : (
        <div className="px-4 space-y-2">
          {transactions.map((transaction) => {
            const { icon, color } = getTransactionIcon(transaction.type);
            const sign = getTransactionSign(transaction.type);
            
            return (
              <div
                key={transaction.id}
                className="bg-white/5 hover:bg-white/8 rounded-2xl p-4 flex items-center gap-4 transition-colors"
              >
                <div className={`w-12 h-12 rounded-full bg-white/10 flex items-center justify-center`}>
                  <Icon name={icon as any} size={24} className={color} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium mb-0.5 truncate">
                    {transaction.description}
                  </div>
                  <div className="text-white/50 text-sm">
                    {formatDate(transaction.created_at)}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-semibold ${
                    sign === '+' ? 'text-green-500' : 'text-white'
                  }`}>
                    {sign} {transaction.amount.toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-white/40 text-xs capitalize">
                    {transaction.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;
