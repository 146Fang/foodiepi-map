'use client';

import { useState, useEffect } from 'react';
import { PiAuthProvider } from '@/components/PiAuthProvider';
import { Medal } from '@/components/Medal';
import { Trophy, Coins } from 'lucide-react';
import {
  getTopRestaurantsByScore,
  getTopRestaurantsByPoolContribution,
  LeaderboardEntry,
} from '@/services/leaderboardService';

export default function LeaderboardPage() {
  return (
    <PiAuthProvider autoAuth={false}>
      <LeaderboardContent />
    </PiAuthProvider>
  );
}

function LeaderboardContent() {
  const [scoreLeaderboard, setScoreLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [poolLeaderboard, setPoolLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'score' | 'pool'>('score');

  useEffect(() => {
    loadLeaderboards();
  }, []);

  const loadLeaderboards = async () => {
    try {
      setIsLoading(true);
      const [scoreData, poolData] = await Promise.all([
        getTopRestaurantsByScore(),
        getTopRestaurantsByPoolContribution(),
      ]);
      setScoreLeaderboard(scoreData);
      setPoolLeaderboard(poolData);
    } catch (error) {
      console.error('Failed to load leaderboards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderLeaderboard = (entries: LeaderboardEntry[]) => {
    if (entries.length === 0) {
      return (
        <div className="text-center text-white/60 py-12">
          No data available
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.restaurant.id}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 flex items-center gap-4 hover:bg-white/15 transition-colors"
          >
            {/* 排名和勋章 */}
            <div className="flex items-center justify-center w-16">
              {entry.rank <= 3 ? (
                <Medal rank={entry.rank} size={40} />
              ) : (
                <span className="text-2xl font-bold text-white/60">
                  #{entry.rank}
                </span>
              )}
            </div>

            {/* 餐厅信息 */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">
                {entry.restaurant.name}
              </h3>
              <p className="text-sm text-white/60">{entry.restaurant.address}</p>
            </div>

            {/* 数值 */}
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {activeTab === 'score' ? (
                  <span>{entry.value}</span>
                ) : (
                  <span>{entry.value.toFixed(2)} π</span>
                )}
              </div>
              <p className="text-xs text-white/60">
                {activeTab === 'score' ? 'Total Score' : 'Pool Contribution'}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-white text-center">Loading leaderboards...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Leaderboards</h1>

        {/* 标签页切换 */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('score')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'score'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/15'
            }`}
          >
            <Trophy className="w-5 h-5" />
            Top by Score
          </button>
          <button
            onClick={() => setActiveTab('pool')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'pool'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/15'
            }`}
          >
            <Coins className="w-5 h-5" />
            Top by Pool Contribution
          </button>
        </div>

        {/* 排行榜内容 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">
            {activeTab === 'score' ? 'Top 10 Restaurants by Total Score' : 'Top 10 Restaurants by Pool Contribution'}
          </h2>
          {activeTab === 'score' ? renderLeaderboard(scoreLeaderboard) : renderLeaderboard(poolLeaderboard)}
        </div>

        {/* 说明 */}
        <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
          <p className="text-white/60 text-sm">
            <strong className="text-white">Top by Score:</strong> Rankings based on total points earned from all player actions.
          </p>
          <p className="text-white/60 text-sm mt-2">
            <strong className="text-white">Top by Pool Contribution:</strong> Rankings based on total contribution to the reward pool from payments (5% of each payment).
          </p>
        </div>
      </div>
    </div>
  );
}
