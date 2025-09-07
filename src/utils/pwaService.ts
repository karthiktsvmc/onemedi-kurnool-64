import { Workbox } from 'workbox-window';

export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

class PWAService {
  private wb: Workbox | null = null;
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstalled = false;
  private registration: ServiceWorkerRegistration | null = null;

  async initialize(): Promise<void> {
    if ('serviceWorker' in navigator) {
      this.wb = new Workbox('/sw.js');
      
      // Handle service worker updates
      this.wb.addEventListener('waiting', () => {
        this.showUpdateAvailable();
      });

      this.wb.addEventListener('controlling', () => {
        window.location.reload();
      });

      try {
        this.registration = await this.wb.register();
        console.log('Service worker registered successfully');
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }

      // Handle install prompt
      window.addEventListener('beforeinstallprompt', (e: Event) => {
        e.preventDefault();
        this.deferredPrompt = e as BeforeInstallPromptEvent;
        this.showInstallBanner();
      });

      // Check if app is already installed
      window.addEventListener('appinstalled', () => {
        this.isInstalled = true;
        this.hideInstallBanner();
        this.showInstallSuccess();
      });

      // Check for standalone mode (PWA is launched)
      if (window.matchMedia('(display-mode: standalone)').matches) {
        this.isInstalled = true;
      }
    }
  }

  async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        return true;
      } else {
        console.log('User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
      return false;
    } finally {
      this.deferredPrompt = null;
    }
  }

  private showInstallBanner(): void {
    // Create and show install banner
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.className = 'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg z-50 flex items-center justify-between';
    banner.innerHTML = `
      <div class="flex-1">
        <h3 class="font-semibold">Install ONE MEDI</h3>
        <p class="text-sm opacity-90">Get the full app experience</p>
      </div>
      <div class="flex gap-2">
        <button id="pwa-install-btn" class="bg-white text-primary px-3 py-1 rounded text-sm font-medium">
          Install
        </button>
        <button id="pwa-dismiss-btn" class="text-primary-foreground/80 hover:text-primary-foreground p-1">
          ×
        </button>
      </div>
    `;

    document.body.appendChild(banner);

    // Add event listeners
    document.getElementById('pwa-install-btn')?.addEventListener('click', () => {
      this.showInstallPrompt();
      this.hideInstallBanner();
    });

    document.getElementById('pwa-dismiss-btn')?.addEventListener('click', () => {
      this.hideInstallBanner();
    });

    // Auto-hide after 10 seconds
    setTimeout(() => {
      this.hideInstallBanner();
    }, 10000);
  }

  private hideInstallBanner(): void {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.remove();
    }
  }

  private showInstallSuccess(): void {
    // Show success message
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50';
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
        </svg>
        <span>ONE MEDI installed successfully!</span>
      </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 5000);
  }

  private showUpdateAvailable(): void {
    // Show update available notification
    const updateBanner = document.createElement('div');
    updateBanner.id = 'pwa-update-banner';
    updateBanner.className = 'fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50';
    updateBanner.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <h3 class="font-semibold">Update Available</h3>
          <p class="text-sm opacity-90">A new version is ready</p>
        </div>
        <div class="flex gap-2">
          <button id="pwa-update-btn" class="bg-white text-blue-500 px-3 py-1 rounded text-sm font-medium">
            Update
          </button>
          <button id="pwa-update-dismiss-btn" class="text-white/80 hover:text-white p-1">
            ×
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(updateBanner);

    document.getElementById('pwa-update-btn')?.addEventListener('click', () => {
      this.applyUpdate();
      updateBanner.remove();
    });

    document.getElementById('pwa-update-dismiss-btn')?.addEventListener('click', () => {
      updateBanner.remove();
    });
  }

  private async applyUpdate(): Promise<void> {
    if (!this.wb) return;

    try {
      await this.wb.messageSkipWaiting();
    } catch (error) {
      console.error('Error applying update:', error);
    }
  }

  async checkForUpdates(): Promise<void> {
    if (!this.registration) return;

    try {
      await this.registration.update();
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  }

  async enableNotifications(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!this.registration || Notification.permission !== 'granted') {
      return;
    }

    try {
      await this.registration.showNotification(title, {
        icon: '/icon-192.png',
        badge: '/icon-badge.png',
        ...options
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  isAppInstalled(): boolean {
    return this.isInstalled || window.matchMedia('(display-mode: standalone)').matches;
  }

  isInstallable(): boolean {
    return !!this.deferredPrompt;
  }

  async getNetworkStatus(): Promise<boolean> {
    return navigator.onLine;
  }

  onNetworkStatusChange(callback: (online: boolean) => void): void {
    window.addEventListener('online', () => callback(true));
    window.addEventListener('offline', () => callback(false));
  }

  async syncOfflineData(): Promise<void> {
    if (!this.registration) {
      console.log('Service worker not registered');
      return;
    }

    try {
      // Check if sync is supported
      if ('sync' in this.registration) {
        await (this.registration as any).sync.register('background-sync');
        console.log('Background sync registered');
      } else {
        console.log('Background sync not supported');
      }
    } catch (error) {
      console.error('Error registering background sync:', error);
    }
  }
}

export const pwaService = new PWAService();

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  pwaService.initialize().catch(console.error);
}