'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PiAuthProvider } from '@/components/PiAuthProvider';
import { usePiAuth } from '@/hooks/usePiAuth';
import { getRestaurantById } from '@/services/restaurantService';
import { getRestaurantScore, getRewardPoolBalance } from '@/services/restaurantScoreService';
import { createPiPayment } from '@/services/paymentService';
import { Restaurant } from '@/services/restaurantService';
import { Wallet, TrendingUp, Coins } from 'lucide-react';

export default function RestaurantDashboardPage() {
  return (
    <PiAuthProvider autoAuth={true}>
      <RestaurantDashboardContent />
    </PiAuthProvider>
  );
}

function RestaurantDashboardContent() {
  const params = useParams();
  const restaurantId = params.id as string;
  const { user } = usePiAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [poolBalance, setPoolBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (restaurantId) {
      loadRestaurantData();
    }
  }, [restaurantId]);

  const loadRestaurantData = async () => {
    try {
      setIsLoading(true);
      const [data, score, pool] = await Promise.all([
        getRestaurantById(restaurantId),
        getRestaurantScore(restaurantId),
        getRewardPoolBalance(),
      ]);
      setRestaurant(data);
      setTotalScore(score);
      setPoolBalance(pool);
    } catch (error) {
      console.error('Failed to load restaurant data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!user || !restaurant || !paymentAmount) return;

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      setIsProcessing(true);
      await createPiPayment(user.uid, restaurantId, amount);
      alert('Payment initiated! Please complete the payment in the Pi app.');
      setPaymentAmount('');
      // 重新加载数据
      await loadRestaurantData();
    } catch (error: any) {
      console.error('Payment failed:', error);
      alert(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-white text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-white text-center">Restaurant not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">{restaurant.name}</h1>
        <p className="text-white/60 mb-8">{restaurant.address}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 餐厅总积分 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-purple-300" />
              <h2 className="text-xl font-semibold text-white">Total Score</h2>
            </div>
            <div className="text-4xl font-bold text-purple-300 mb-2">
              {totalScore}
            </div>
            <p className="text-white/60 text-sm">
              Points from all players
            </p>
          </div>

          {/* 奖励金池余额 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <Coins className="w-6 h-6 text-yellow-300" />
              <h2 className="text-xl font-semibold text-white">Reward Pool</h2>
            </div>
            <div className="text-4xl font-bold text-yellow-300 mb-2">
              {poolBalance.toFixed(2)} π
            </div>
            <p className="text-white/60 text-sm">
              Community reward pool balance
            </p>
          </div>
        </div>

        {/* 餐厅钱包余额 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-6 h-6 text-green-300" />
            <h2 className="text-xl font-semibold text-white">Restaurant Balance</h2>
          </div>
          <div className="text-4xl font-bold text-green-300 mb-2">
            {(restaurant.balance || 0).toFixed(2)} π
          </div>
          <p className="text-white/60 text-sm">
            Earnings from payments (95% of each payment)
          </p>
        </div>

        {/* 支付功能 */}
        {user && (
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">Make Payment</h2>
            <p className="text-white/60 text-sm mb-4">
              Pay for your meal. 95% goes to the restaurant, 5% to the reward pool.
            </p>
            <div className="flex gap-4">
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount (π)"
                min="0"
                step="0.01"
                className="flex-1 px-4 py-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                onClick={handlePayment}
                disabled={isProcessing || !paymentAmount}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Pay with Pi'}
              </button>
            </div>
            {user && (
              <p className="text-white/60 text-xs mt-2">
                Note: Payment gives +2 points (once per 24 hours)
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
