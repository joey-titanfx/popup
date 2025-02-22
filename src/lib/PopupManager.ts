"use client";

type Environment = "desktop" | "mobile" | "in_app" | "iframe";
type PopupOptions = {
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  name?: string;
  loadingPath?: string;
  loadingTimeout?: number;
};

interface PopupConfig {
  targetUrl: string;
  options?: PopupOptions;
  callbackUrl?: string;
  onSuccess?: (data: unknown) => void;
  onCancel?: (reason?: string) => void;
  onError?: (error: Error) => void;
}

export class PopupManager {
  private static instance: PopupManager;
  private popup: Window | null = null;
  private loadingTimer: NodeJS.Timeout | null = null;
  private checkClosedInterval: NodeJS.Timeout | null = null;
  private currentConfig: PopupConfig | null = null;
  private hasReceivedResponse = false;

  private defaultOptions: PopupOptions = {
    width: 640,
    height: 720,
    top: 100,
    left: 100,
    name: "PopupWindow",
    loadingPath: "/loading",
    loadingTimeout: 2000,
  };

  private constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("message", this.handleMessage.bind(this));
    }
  }

  public static getInstance(): PopupManager {
    if (!PopupManager.instance) {
      PopupManager.instance = new PopupManager();
    }
    return PopupManager.instance;
  }

  private detectEnvironment(): Environment {
    if (typeof window === "undefined") return "desktop";

    const ua = navigator.userAgent;
    const isInApp = /Facebook|IEMobile|Twitter|FBAN|Android SDK/i.test(ua);
    const isWebview = /; wv\)/i.test(ua);
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

    if (this.isIframe()) return "iframe";
    if (isInApp || isWebview) return "in_app";
    if (isMobile) return "mobile";
    return "desktop";
  }

  private isIframe(): boolean {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  }

  private getPopupPosition(
    width: number,
    height: number
  ): { top: number; left: number } {
    const screenLeft = window.screenLeft ?? window.screenX;
    const screenTop = window.screenTop ?? window.screenY;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    return {
      left: screenLeft + windowWidth / 2 - width / 2,
      top: screenTop + windowHeight / 2 - height / 2,
    };
  }

  private createPopupWindow(options: PopupOptions): Window | null {
    const mergedOptions = {
      ...this.defaultOptions,
      ...options,
    };

    const { width, height, name, loadingPath } = mergedOptions;
    const { top, left } = this.getPopupPosition(width!, height!);

    const features = [
      `width=${width}`,
      `height=${height}`,
      `top=${top}`,
      `left=${left}`,
      "scrollbars=yes",
      "resizable=no",
      "status=no",
      "location=no",
      "menubar=no",
      "toolbar=no",
    ].join(",");

    const popup = window.open(loadingPath, name, features);

    if (popup) {
      popup.resizeTo(width!, height!);
      popup.moveTo(left, top);
      popup.focus();
    }

    return popup;
  }

  private handleMessage = (event: MessageEvent): void => {
    const allowedOrigins = [window.location.origin];
    if (!allowedOrigins.includes(event.origin)) return;

    try {
      const { type, data } = event.data;

      switch (type) {
        case "POPUP_SUCCESS":
          this.hasReceivedResponse = true;
          this.currentConfig?.onSuccess?.(data);
          break;

        case "POPUP_CANCEL":
          this.hasReceivedResponse = true;
          this.currentConfig?.onCancel?.("user_cancelled");
          break;

        case "POPUP_ERROR":
          this.currentConfig?.onError?.(new Error(data.message));
          break;

        case "APP_CLOSE":
          this.closePopup();
          break;
      }
    } catch (error) {
      console.error("Error parsing popup response:", error);
      this.currentConfig?.onCancel?.("error_parsing");
    }
  };

  private cleanup(): void {
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
      this.loadingTimer = null;
    }
    if (this.checkClosedInterval) {
      clearInterval(this.checkClosedInterval);
      this.checkClosedInterval = null;
    }
    if (this.popup && !this.popup.closed) {
      this.popup.close();
    }
    this.popup = null;
    this.currentConfig = null;
  }

  private handlePopupClosure(popup: Window, config: PopupConfig) {
    return setInterval(() => {
      if (popup.closed) {
        this.cleanup();
        if (!this.hasReceivedResponse) {
          config.onCancel?.("manual_close");
        }
      }
    }, 100);
  }

  private setupMobileTabTracking(): void {
    const openedTime = Date.now();
    let hasResponse = false;

    const isLegitimateClose = () => {
      const timePassed = Date.now() - openedTime;
      return timePassed > 2000;
    };

    const handleMessage = (event: MessageEvent) => {
      const { type } = event.data;
      if (["POPUP_SUCCESS", "POPUP_CANCEL", "POPUP_ERROR"].includes(type)) {
        hasResponse = true;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setTimeout(() => {
          const response = sessionStorage.getItem("popup_response");

          if (response) {
            try {
              sessionStorage.removeItem("popup_response");
              const data = JSON.parse(response);
              this.handleMessage({ data } as MessageEvent);
            } catch (error) {
              console.error("Error parsing popup response:", error);
              this.handleManualClose();
            }
          } else if (!hasResponse && isLegitimateClose()) {
            this.handleManualClose();
          }

          document.removeEventListener(
            "visibilitychange",
            handleVisibilityChange
          );
          window.removeEventListener("message", handleMessage);
        }, 100);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("message", handleMessage);
  }

  private handleManualClose(): void {
    const cancelResponse = {
      type: "POPUP_CANCEL",
      data: {
        message: "Tab closed by user",
      },
    };

    sessionStorage.setItem("popup_response", JSON.stringify(cancelResponse));
    this.currentConfig?.onCancel?.("manual_close");

    const iframe = document.querySelector<HTMLIFrameElement>("#deposit-iframe");
    iframe?.contentWindow?.postMessage(
      {
        type: "OTP_CANCELLED",
        data: { message: "Tab closed by user" },
      },
      "*"
    );
  }

  public async openPopup(config: PopupConfig): Promise<void> {
    this.hasReceivedResponse = false;
    this.cleanup();

    const environment = this.detectEnvironment();
    this.currentConfig = config;
    const options = { ...this.defaultOptions, ...config.options };

    let targetUrl = config.targetUrl;
    if (config.callbackUrl) {
      targetUrl += `${
        targetUrl.includes("?") ? "&" : "?"
      }callback_url=${encodeURIComponent(config.callbackUrl)}`;
    }

    switch (environment) {
      case "in_app":
      case "mobile": {
        const newTab = window.open(options.loadingPath, "_blank");
        if (newTab) {
          this.setupMobileTabTracking();

          setTimeout(() => {
            try {
              newTab.location.href = targetUrl;
            } catch (e) {
              console.error("Error accessing new tab:", e);
              newTab.close();
              window.location.href = targetUrl;
            }
          }, options.loadingTimeout);
        } else {
          window.location.href = targetUrl;
        }
        break;
      }

      case "iframe":
        if (window.top) {
          window.top.postMessage(
            {
              type: "OPEN_POPUP",
              url: targetUrl,
            },
            "*"
          );
        }
        break;

      case "desktop": {
        this.popup = this.createPopupWindow(options);

        if (!this.popup) {
          config.onError?.(new Error("Popup was blocked"));
          return;
        }

        this.checkClosedInterval = this.handlePopupClosure(this.popup, config);

        this.loadingTimer = setTimeout(() => {
          try {
            if (this.popup && !this.popup.closed) {
              this.popup.location.href = targetUrl;
            }
          } catch {
            this.cleanup();
            config.onError?.(new Error("Failed to redirect popup"));
          }
        }, options.loadingTimeout);
        break;
      }
    }
  }

  public closePopup(): void {
    const environment = this.detectEnvironment();

    switch (environment) {
      case "in_app":
      case "mobile":
        this.cleanup();
        break;

      case "iframe":
        window.top?.postMessage("APP_CLOSE", "*");
        break;

      case "desktop":
        this.cleanup();
        break;
    }
  }
}
