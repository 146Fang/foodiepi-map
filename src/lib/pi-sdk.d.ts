// Pi Network SDK 类型定义
declare global {
  interface Window {
    Pi: {
      init: (config: { version: string; sandbox?: boolean }) => void;
      authenticate: (
        scopes: string[],
        onIncompletePaymentFound: (payment: PiPayment) => void
      ) => Promise<PiAuthResult>;
      createPayment: (paymentData: any, callbacks: any) => Promise<any>;
      openShareDialog: (content: string, callbacks: any) => Promise<any>;
      ads: {
        showAd: (callbacks: PiAdCallbacks) => void;
      };
    };
  }
}

export interface PiAdCallbacks {
  onReady?: () => void;
  onCompleted?: () => void;
  onClosed?: () => void;
  onError?: (error: any) => void;
}

export interface PiAuthResult {
  accessToken: string;
  user: {
    uid: string; // Pi Network 钱包地址
    username: string;
  };
}

export interface PiPayment {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata?: Record<string, any>;
}

export {};
