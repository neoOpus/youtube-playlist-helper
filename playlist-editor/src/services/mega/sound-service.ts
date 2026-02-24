import { storage } from '../core/storage-service';

class SoundService {
    private enabled = false;

    constructor() {
        this.init();
    }

    async init() {
        this.enabled = await storage.get("ui_sounds_enabled", false);
    }

    play(type: 'click' | 'success' | 'hover' | 'delete') {
        if (!this.enabled) return;

        // Using Web Audio API to synthesize subtle blips to avoid loading heavy assets
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === 'click') {
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.1);
        } else if (type === 'success') {
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.setValueAtTime(900, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.3);
        } else if (type === 'hover') {
            osc.frequency.setValueAtTime(1200, now);
            gain.gain.setValueAtTime(0.02, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.05);
        }

        osc.start();
        osc.stop(now + 0.3);
    }

    async setEnabled(val: boolean) {
        this.enabled = val;
        await storage.set("ui_sounds_enabled", val);
    }
}

export const soundService = new SoundService();
