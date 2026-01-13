export type Locale = 'en' | 'fr' | 'es' | 'zh-TW' | 'zh-CN' | 'jp' | 'kr' | 'vn';

export const locales: Locale[] = ['en', 'fr', 'es', 'zh-TW', 'zh-CN', 'jp', 'kr', 'vn'];

export const localeNames: Record<Locale, string> = {
  'en': 'EN',
  'fr': 'FR',
  'es': 'ES',
  'zh-TW': 'ZH-TW',
  'zh-CN': 'ZH-CN',
  'jp': 'JP',
  'kr': 'KR',
  'vn': 'VN',
};

export const translations: Record<Locale, Record<string, string>> = {
  en: {
    'app.name': 'FoodiePi Map',
    'nav.map': 'Map Search',
    'nav.restaurants': 'Restaurant Recommendations',
    'nav.tutorial': 'Tutorial',
    'nav.dashboard': 'Dashboard',
    'search.placeholder': 'Search restaurants by name or address...',
  },
  fr: {
    'app.name': 'FoodiePi Map',
    'nav.map': 'Recherche de Carte',
    'nav.restaurants': 'Recommandations de Restaurants',
    'nav.tutorial': 'Tutoriel',
    'nav.dashboard': 'Tableau de Bord',
    'search.placeholder': 'Rechercher des restaurants par nom ou adresse...',
  },
  es: {
    'app.name': 'FoodiePi Map',
    'nav.map': 'Búsqueda de Mapa',
    'nav.restaurants': 'Recomendaciones de Restaurantes',
    'nav.tutorial': 'Tutorial',
    'nav.dashboard': 'Panel de Control',
    'search.placeholder': 'Buscar restaurantes por nombre o dirección...',
  },
  'zh-TW': {
    'app.name': 'FoodiePi Map',
    'nav.map': '地圖搜尋',
    'nav.restaurants': '餐廳推薦',
    'nav.tutorial': '教學',
    'nav.dashboard': '儀表板',
    'search.placeholder': '搜尋餐廳名稱或地址...',
  },
  'zh-CN': {
    'app.name': 'FoodiePi Map',
    'nav.map': '地图搜索',
    'nav.restaurants': '餐厅推荐',
    'nav.tutorial': '教程',
    'nav.dashboard': '仪表板',
    'search.placeholder': '搜索餐厅名称或地址...',
  },
  jp: {
    'app.name': 'FoodiePi Map',
    'nav.map': '地図検索',
    'nav.restaurants': 'レストラン推奨',
    'nav.tutorial': 'チュートリアル',
    'nav.dashboard': 'ダッシュボード',
    'search.placeholder': 'レストラン名または住所で検索...',
  },
  kr: {
    'app.name': 'FoodiePi Map',
    'nav.map': '지도 검색',
    'nav.restaurants': '레스토랑 추천',
    'nav.tutorial': '튜토리얼',
    'nav.dashboard': '대시보드',
    'search.placeholder': '레스토랑 이름 또는 주소로 검색...',
  },
  vn: {
    'app.name': 'FoodiePi Map',
    'nav.map': 'Tìm Kiếm Bản Đồ',
    'nav.restaurants': 'Đề Xuất Nhà Hàng',
    'nav.tutorial': 'Hướng Dẫn',
    'nav.dashboard': 'Bảng Điều Khiển',
    'search.placeholder': 'Tìm kiếm nhà hàng theo tên hoặc địa chỉ...',
  },
};

export function getTranslation(locale: Locale, key: string): string {
  return translations[locale]?.[key] || translations['en'][key] || key;
}
