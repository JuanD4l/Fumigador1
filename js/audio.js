/**
 * CyberExterminator Audio Engine
 * Uses the Web Audio API to synthesize all sound effects natively without any external file dependencies.
 */
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // Key click sound for typing / pressing buttons
    playKeyClick() {
        if (!this.enabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    // Fumigator spray sound (filtered noise burst)
    playSpray() {
        if (!this.enabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;
        const duration = 0.5;

        // White noise buffer
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        // Bandpass filter to make it sound like a high pressure spray
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2200, now);
        filter.Q.setValueAtTime(1.8, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + duration);
    }

    // Bug death pop / squish
    playBugDeath() {
        if (!this.enabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.16);
    }

    // Positive chime when answer is correct
    playCorrect() {
        if (!this.enabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.12, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.32);
        });
    }

    // Intrusion / wrong answer warning buzzer
    playAlarm() {
        if (!this.enabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.setValueAtTime(110, now + 0.12);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.38);
    }

    // Triumphant fanfare when level or game is won ("MISIÓN CUMPLIDA")
    playVictory() {
        if (!this.enabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;

        // Victory melody: C4, E4, G4, C5, G4, C5
        const melody = [
            { f: 523.25, t: 0.0, d: 0.15 },
            { f: 659.25, t: 0.15, d: 0.15 },
            { f: 783.99, t: 0.3, d: 0.15 },
            { f: 1046.50, t: 0.45, d: 0.4 },
            { f: 880.00, t: 0.9, d: 0.2 },
            { f: 1046.50, t: 1.15, d: 0.7 }
        ];

        melody.forEach(note => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.f, now + note.t);

            gain.gain.setValueAtTime(0.18, now + note.t);
            gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + note.t);
            osc.stop(now + note.t + note.d + 0.05);
        });
    }

    // Dramatic defeat sound ("MISIÓN FALLIDA")
    playDefeat() {
        if (!this.enabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;

        // Descending doom chord
        const notes = [
            { f: 330, t: 0.0, d: 0.3 },
            { f: 311, t: 0.25, d: 0.3 },
            { f: 293, t: 0.5, d: 0.3 },
            { f: 220, t: 0.75, d: 0.8 },
            { f: 110, t: 0.75, d: 1.2 }
        ];

        notes.forEach(note => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(note.f, now + note.t);
            osc.frequency.exponentialRampToValueAtTime(note.f * 0.7, now + note.t + note.d);

            gain.gain.setValueAtTime(0.2, now + note.t);
            gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + note.t);
            osc.stop(now + note.t + note.d + 0.05);
        });
    }

    // Sirena de alerta para la cinemática de introducción
    playIntroSiren() {
        if (!this.enabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.35);
        osc.frequency.linearRampToValueAtTime(440, now + 0.7);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.75);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.75);
    }

    // Efecto de teletransporte / despliegue del fumigador
    playDeployTeleport() {
        if (!this.enabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.45);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.52);
    }

    // Mega rayo continuo del fumigador para la cinemática final
    playMegaBeam() {
        if (!this.enabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;

        // Oscilador de zumbido de alta energía
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 1.2);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.45);
    }

    // Gran explosión para destruir al último bicho
    playBossExplosion() {
        if (!this.enabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;

        // Ruido blanco filtrado de explosión
        const bufferSize = ctx.sampleRate * 0.8;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(60, now + 0.7);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + 0.82);
    }

    // Inicio de la carrera (tres tonos ascendentes con toque enérgico)
    playRaceStart() {
        if (!this.enabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const tones = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6
        tones.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.12, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.18);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.2);
        });
    }

    // Tick del temporizador en los últimos segundos
    playRaceCountdownTick(isFinal = false) {
        if (!this.enabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = isFinal ? 'sawtooth' : 'sine';
        const freq = isFinal ? 1200 : 880;
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + 0.06);

        gain.gain.setValueAtTime(isFinal ? 0.22 : 0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    // Bocina / Señal de Tiempo Agotado (30 segundos cumplidos)
    playTimeUp() {
        if (!this.enabled) return;
        this.init();
        const ctx = this.ctx;
        const now = ctx.currentTime;

        // Doble bocinazo de árbitro / tiempo de carrera
        [0, 0.22].forEach(offset => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(420, now + offset);
            osc.frequency.linearRampToValueAtTime(320, now + offset + 0.18);

            gain.gain.setValueAtTime(0.25, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.2);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + offset);
            osc.stop(now + offset + 0.22);
        });
    }
}

window.soundEngine = new SoundEngine();
