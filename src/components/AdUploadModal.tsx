'use client';

import { useState, FormEvent } from 'react';
import { X, Upload, MapPin, Utensils, Loader2, Play } from 'lucide-react';
import { createRestaurant, uploadRestaurantPhoto, updateRestaurant } from '@/services/restaurantService';
import { recordActionAndAddScore } from '@/services/actionService';

interface AdUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

interface FormData {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  dishes: string;
}

export function AdUploadModal({ isOpen, onClose, onSuccess, userId }: AdUploadModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    dishes: '',
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShowingAd, setIsShowingAd] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adStatus, setAdStatus] = useState<'idle' | 'ready' | 'playing' | 'completed' | 'closed'>('idle');

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const allFiles = [...photos, ...newFiles].slice(0, 5);
      setPhotos(allFiles);

      const previews = allFiles.map((file) => URL.createObjectURL(file));
      setPhotoPreviews(previews);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = photoPreviews.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
  };

  const handleGeocode = async () => {
    if (!formData.address.trim()) {
      setError('Please enter an address first');
      return;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          formData.address
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setFormData((prev) => ({
          ...prev,
          latitude: location.lat.toString(),
          longitude: location.lng.toString(),
        }));
        setError(null);
      } else {
        setError('Could not find coordinates for this address');
      }
    } catch (err) {
      setError('Failed to geocode address');
    }
  };

  const showAd = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!window.Pi || !window.Pi.ads) {
        reject(new Error('Pi Ad Network SDK not available'));
        return;
      }

      setIsShowingAd(true);
      setAdStatus('ready');

      window.Pi.ads.showAd({
        onReady: () => {
          setAdStatus('playing');
          console.log('Ad is ready');
        },
        onCompleted: () => {
          setAdStatus('completed');
          setIsShowingAd(false);
          resolve();
        },
        onClosed: () => {
          setAdStatus('closed');
          setIsShowingAd(false);
          resolve();
        },
        onError: (error: any) => {
          console.error('Ad error:', error);
          setAdStatus('closed');
          setIsShowingAd(false);
          // 即使广告出错，也继续执行上传
          resolve();
        },
      });
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.address.trim()) {
      setError('Please fill in restaurant name and address');
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      setError('Please get coordinates for the address');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // 步骤 1: 显示广告
      await showAd();

      // 步骤 2: 广告播放完成后，开始上传数据
      setIsUploading(true);

      // 创建餐厅记录
      const restaurantId = await createRestaurant({
        name: formData.name.trim(),
        address: formData.address.trim(),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        photos: [],
        dishes: formData.dishes
          .split(',')
          .map((dish) => dish.trim())
          .filter((dish) => dish.length > 0),
        createdBy: userId,
        totalScore: 0,
        balance: 0,
      });

      // 上传照片
      const photoUrls: string[] = [];
      for (const photo of photos) {
        try {
          const url = await uploadRestaurantPhoto(photo, restaurantId);
          photoUrls.push(url);
        } catch (err) {
          console.error('Failed to upload photo:', err);
        }
      }

      // 更新餐厅记录，添加照片 URL
      if (photoUrls.length > 0) {
        await updateRestaurant(restaurantId, { photos: photoUrls });
      }

      // 给用户加分
      await recordActionAndAddScore(userId, restaurantId, 'recommend', 1);

      setIsUploading(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to submit:', err);
      setError(err.message || 'Failed to submit restaurant');
      setIsUploading(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting || isUploading || isShowingAd) {
      return; // 防止在提交或上传时关闭
    }
    setFormData({
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      dishes: '',
    });
    setPhotos([]);
    setPhotoPreviews([]);
    setError(null);
    setAdStatus('idle');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* 模态框内容 */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-600/90 to-blue-900/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          disabled={isSubmitting || isUploading || isShowingAd}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Recommend a Restaurant
          </h2>

          {/* 广告状态提示 */}
          {isShowingAd && (
            <div className="mb-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Play className="w-5 h-5 text-yellow-300 animate-pulse" />
                <div>
                  <p className="text-white font-medium">Watching Ad...</p>
                  <p className="text-white/60 text-sm">
                    {adStatus === 'ready' && 'Ad is loading...'}
                    {adStatus === 'playing' && 'Please watch the ad to continue'}
                    {adStatus === 'completed' && 'Ad completed! Uploading...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 上传状态提示 */}
          {isUploading && (
            <div className="mb-4 bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-300 animate-spin" />
                <div>
                  <p className="text-white font-medium">Uploading...</p>
                  <p className="text-white/60 text-sm">
                    Please wait while we upload your restaurant information
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 餐厅名称 */}
            <div>
              <label className="block text-white mb-2 font-medium">
                Restaurant Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isSubmitting || isUploading || isShowingAd}
                className="w-full px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
                placeholder="Enter restaurant name"
              />
            </div>

            {/* 地址 */}
            <div>
              <label className="block text-white mb-2 font-medium">
                Address *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting || isUploading || isShowingAd}
                  className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
                  placeholder="Enter full address"
                />
                <button
                  type="button"
                  onClick={handleGeocode}
                  disabled={isSubmitting || isUploading || isShowingAd}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MapPin className="w-4 h-4" />
                  Get Location
                </button>
              </div>
              {(formData.latitude || formData.longitude) && (
                <p className="mt-2 text-sm text-white/60">
                  Coordinates: {formData.latitude}, {formData.longitude}
                </p>
              )}
            </div>

            {/* 餐饮品相 */}
            <div>
              <label className="block text-white mb-2 font-medium">
                <Utensils className="w-4 h-4 inline mr-2" />
                Dishes (comma-separated)
              </label>
              <textarea
                name="dishes"
                value={formData.dishes}
                onChange={handleInputChange}
                rows={3}
                disabled={isSubmitting || isUploading || isShowingAd}
                className="w-full px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
                placeholder="e.g., Pizza, Pasta, Salad"
              />
            </div>

            {/* 照片上传 */}
            <div>
              <label className="block text-white mb-2 font-medium">
                Photos (up to 5)
              </label>
              <div className="space-y-4">
                <label
                  className={`flex items-center justify-center w-full h-32 border-2 border-dashed border-white/30 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors ${
                    isSubmitting || isUploading || isShowingAd
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-6 h-6 text-white/60" />
                    <span className="text-white/60 text-sm">
                      Click to upload photos
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoChange}
                    disabled={isSubmitting || isUploading || isShowingAd}
                    className="hidden"
                  />
                </label>

                {/* 照片预览 */}
                {photoPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {photoPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        {!isSubmitting && !isUploading && !isShowingAd && (
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 错误信息 */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <p className="text-white">{error}</p>
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={isSubmitting || isUploading || isShowingAd}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isShowingAd ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Watching Ad...</span>
                </>
              ) : isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>看廣告並支持 App 升級</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
