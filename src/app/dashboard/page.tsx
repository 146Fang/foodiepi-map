'use client';

import { useState, useEffect } from 'react';
import { PiAuthProvider } from '@/components/PiAuthProvider';
import { usePiAuth } from '@/hooks/usePiAuth';
import { Camera, Copy, Check } from 'lucide-react';
import { getUser, uploadUserAvatar } from '@/services/userService';
import { getUserScore } from '@/services/scoreService';
import { calculateUserTotalReward } from '@/services/rewardService';
import { UserData } from '@/services/userService';
import Image from 'next/image';

export default function DashboardPage() {
  return (
    <PiAuthProvider autoAuth={true}>
      <DashboardContent />
    </PiAuthProvider>
  );
}

function DashboardContent() {
  const { user } = usePiAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [score, setScore] = useState<number>(0);
  const [estimatedReward, setEstimatedReward] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const [data, userScore, totalReward] = await Promise.all([
        getUser(user.uid),
        getUserScore(user.uid),
        calculateUserTotalReward(user.uid),
      ]);
      setUserData(data);
      setScore(userScore);
      setEstimatedReward(totalReward);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    try {
      setIsUploading(true);
      const avatarUrl = await uploadUserAvatar(user.uid, file);
      setUserData((prev) => (prev ? { ...prev, avatarUrl } : null));
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      alert('Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
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

  if (!user || !userData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-white text-center">Please login first</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Personal Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 用户信息卡片 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">Profile</h2>
            
            {/* 头像 */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-white/20 mb-4">
                {userData.avatarUrl ? (
                  <Image
                    src={userData.avatarUrl}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-2xl">
                    {userData.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 cursor-pointer transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
              {isUploading && (
                <p className="text-white/60 text-sm">Uploading...</p>
              )}
            </div>

            {/* Pi ID */}
            <div className="mb-4">
              <label className="block text-white/60 text-sm mb-1">Pi ID</label>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{userData.username}</span>
              </div>
            </div>

            {/* 钱包地址 */}
            <div className="mb-4">
              <label className="block text-white/60 text-sm mb-1">Wallet Address</label>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono text-sm break-all">
                  {user.uid}
                </span>
                <button
                  onClick={() => copyToClipboard(user.uid, 'uid')}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  {copied === 'uid' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/60" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 积分和余额卡片 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">Statistics</h2>
            
            {/* Pi 币余额 */}
            <div className="mb-6">
              <label className="block text-white/60 text-sm mb-2">Pi Balance</label>
              <div className="text-3xl font-bold text-white">
                {userData.piBalance?.toFixed(2) || '0.00'} π
              </div>
              <p className="text-white/60 text-xs mt-1">From tips and rewards</p>
            </div>

            {/* 积分总数 */}
            <div>
              <label className="block text-white/60 text-sm mb-2">Total Score</label>
              <div className="text-3xl font-bold text-purple-300">
                {score}
              </div>
              <p className="text-white/60 text-xs mt-1">Points earned</p>
            </div>
          </div>

          {/* 预估奖励卡片 */}
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-lg p-6 border border-yellow-500/30">
            <h2 className="text-xl font-semibold text-white mb-4">Estimated Reward</h2>
            <div className="mb-2">
              <div className="text-4xl font-bold text-yellow-300 mb-2">
                {estimatedReward.toFixed(2)} π
              </div>
              <p className="text-white/60 text-sm">
                Based on your contributions across all restaurants
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-yellow-500/30">
              <p className="text-white/80 text-xs">
                Formula: (Your Score / Restaurant Total Score) × (Reward Pool × 90%)
              </p>
              <p className="text-white/60 text-xs mt-2">
                Rewards are distributed annually (Jan 1 - Dec 31)
              </p>
            </div>
          </div>
        </div>

        {/* 积分规则说明 */}
        <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Score Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80 text-sm">
            <div>• Recommend Restaurant: +1 point</div>
            <div>• Like Restaurant: +1 point</div>
            <div>• Rate Restaurant: +1 point</div>
            <div>• Comment on Restaurant: +1 point</div>
            <div>• Tip Restaurant: +1 point</div>
            <div>• Payment: +2 points (once per 24 hours)</div>
          </div>
          <p className="text-white/60 text-xs mt-4">
            Note: Each action can only earn points once per restaurant (anti-fraud protection)
          </p>
        </div>
      </div>
    </div>
  );
}
