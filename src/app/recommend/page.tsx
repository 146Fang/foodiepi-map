'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PiAuthProvider } from '@/components/PiAuthProvider';
import { usePiAuth } from '@/hooks/usePiAuth';
import { Plus } from 'lucide-react';
import { AdUploadModal } from '@/components/AdUploadModal';

export default function RecommendPage() {
  return (
    <PiAuthProvider autoAuth={true}>
      <RecommendContent />
    </PiAuthProvider>
  );
}

function RecommendContent() {
  const { user } = usePiAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Success!</h2>
            <p className="text-white/80 mb-4">
              Restaurant submitted successfully! You earned +1 point.
            </p>
            <p className="text-white/60">Redirecting to map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Recommend a Restaurant
            </h1>
            <p className="text-white/80">
              Share your favorite restaurants with the community
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 border border-white/20 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Plus className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Ready to Recommend?
              </h2>
              <p className="text-white/70 text-sm mb-6">
                Help others discover great restaurants and earn points!
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!user}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Recommend Restaurant
            </button>

            {!user && (
              <p className="text-white/60 text-sm mt-4">
                Please login first to recommend restaurants
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 广告上传模态框 */}
      {user && (
        <AdUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
          userId={user.uid}
        />
      )}
    </>
  );
}
