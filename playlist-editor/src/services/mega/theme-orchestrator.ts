import { storage } from '../core/storage-service';

class ThemeOrchestrator {
    async extractDominantColor(imageUrl: string): Promise<string | null> {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = imageUrl;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return resolve(null);

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                let r = 0, g = 0, b = 0;

                for (let i = 0; i < data.length; i += 4) {
                    r += data[i];
                    g += data[i+1];
                    b += data[i+2];
                }

                const count = data.length / 4;
                r = Math.floor(r / count);
                g = Math.floor(g / count);
                b = Math.floor(b / count);

                resolve(`rgb(${r}, ${g}, ${b})`);
            };
            img.onerror = () => resolve(null);
        });
    }

    applyDynamicAccent(color: string) {
        document.documentElement.style.setProperty('--dynamic-accent', color);
        // Also compute a subtle version
        const subtle = color.replace('rgb', 'rgba').replace(')', ', 0.15)');
        document.documentElement.style.setProperty('--dynamic-accent-subtle', subtle);
    }

    resetAccent() {
        document.documentElement.style.removeProperty('--dynamic-accent');
        document.documentElement.style.removeProperty('--dynamic-accent-subtle');
    }
}

export const themeOrchestrator = new ThemeOrchestrator();
