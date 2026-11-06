/**
 * CyberExterminator Canvas Game Engine - FUMIGADOR
 * Manages the animated cyber-battle, intro invasion cinematic,
 * fumigador deployment, and the grand finale boss execution.
 */
class BattleCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Dimensions
        this.width = this.canvas.width = 900;
        this.height = this.canvas.height = 360;

        // Ground / Motherboard floor
        this.groundY = 280;

        // Mode: 'menu', 'intro', 'deploying', 'playing', 'final_boss'
        this.mode = 'menu';

        // Fumigador character
        this.fumigador = {
            x: 200,
            baseX: 200,
            y: this.groundY,
            targetX: 200,
            width: 48,
            height: 80,
            state: 'idle', // 'idle', 'shooting', 'step_back', 'victory', 'defeat'
            stateTimer: 0,
            animTimer: 0,
            stepCount: 0,
            armAngle: 0,
            isDead: false,
            visible: true
        };

        // Red Bugs list
        this.bugs = [];
        this.targetBugCount = 4;

        // Boss Bug (for final level grand finale)
        this.bossBug = null;

        // Visual FX
        this.teleportEffect = 0; // 0 to 1 for beam-in effect
        this.megaBeam = { active: false, timer: 0 };
        this.alarmPulse = 0;
        this.raceTimeLeft = 30;

        // Particles
        this.particles = [];
        this.circuits = [];
        this.screenShake = 0;

        // Timeout trackers
        this.victoryTimeout = null;
        this.defeatTimeout = null;
        this.killBugTimeout = null;
        this.spawnTimeout = null;
        this.bossTimeout = null;

        // Initialize background digital circuits
        this.initCircuits();
        this.spawnInitialBugs(3);

        // Animation loop
        this.lastTime = performance.now();
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    initCircuits() {
        this.circuits = [];
        for (let i = 0; i < 28; i++) {
            this.circuits.push({
                x: Math.random() * this.width,
                y: Math.random() * (this.groundY - 40),
                length: 40 + Math.random() * 80,
                vertical: Math.random() > 0.5,
                color: Math.random() > 0.3 ? '#00f0ff' : '#ff0055',
                alpha: 0.15 + Math.random() * 0.3,
                pulse: Math.random() * Math.PI * 2,
                speed: 1 + Math.random() * 2
            });
        }
    }

    spawnInitialBugs(count) {
        this.bugs = [];
        for (let i = 0; i < count; i++) {
            this.addBug(540 + i * 65 + Math.random() * 30);
        }
    }

    addBug(customX, customY, customSpeed) {
        const x = customX !== undefined ? customX : (this.width - 60 - Math.random() * 80);
        const y = customY !== undefined ? customY : (this.groundY - 18);
        this.bugs.push({
            x: x,
            baseX: x,
            targetX: x,
            y: y,
            width: 38,
            height: 26,
            legPhase: Math.random() * Math.PI * 2,
            twitchTimer: Math.random() * 50,
            isDying: false,
            scale: 0.9 + Math.random() * 0.3,
            eyeGlow: 1,
            hp: 1,
            speed: customSpeed || (0.6 + Math.random() * 0.6)
        });
    }

    /**
     * CINEMÁTICA DE INTRODUCCIÓN:
     * Invasión de bichos rojos. El fumigador está oculto,
     * los bichos entran corriendo e invaden la placa.
     */
    playIntroInvasion() {
        this.clearAllTimeouts();
        this.mode = 'intro';
        this.fumigador.visible = false;
        this.bossBug = null;
        this.megaBeam.active = false;
        this.bugs = [];
        this.particles = [];

        // Horda de bichos rojos invadiendo rápidamente de derecha a izquierda
        for (let i = 0; i < 9; i++) {
            setTimeout(() => {
                if (this.mode === 'intro') {
                    this.addBug(this.width + 20, this.groundY - 18, 2.5 + Math.random() * 2);
                    const lastBug = this.bugs[this.bugs.length - 1];
                    if (lastBug) {
                        lastBug.targetX = 180 + i * 60 + Math.random() * 30;
                    }
                }
            }, i * 160);
        }
    }

    /**
     * DESPLIEGUE DEL FUMIGADOR TRAS PULSAR TECLA:
     * Haz de teletransporte cian/verde, sonido de aparición,
     * el fumigador se materializa y adopta postura de combate.
     */
    deployFumigador(callback) {
        this.mode = 'deploying';
        this.teleportEffect = 1.0;
        this.fumigador.visible = true;
        this.fumigador.x = 200;
        this.fumigador.baseX = 200;
        this.fumigador.targetX = 200;
        this.fumigador.state = 'idle';
        this.fumigador.isDead = false;

        // Sonido de despliegue
        if (window.soundEngine) {
            window.soundEngine.playDeployTeleport();
        }

        // Chispas de teletransporte
        for (let i = 0; i < 45; i++) {
            this.particles.push({
                x: 200 + (Math.random() * 30 - 15),
                y: this.groundY - 50 + (Math.random() * 80 - 40),
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                size: 3 + Math.random() * 4,
                color: Math.random() > 0.4 ? '#00ffcc' : '#00ff88',
                alpha: 1,
                decay: 0.025,
                type: 'spark'
            });
        }

        // Alejar ligeramente los bichos asustados por el despliegue
        this.bugs.forEach(b => {
            b.targetX = Math.max(500, b.x + 80);
        });

        setTimeout(() => {
            this.mode = 'playing';
            if (callback) callback();
        }, 1100);
    }

    /**
     * CINEMÁTICA FINAL (GRAN FINAL):
     * El fumigador enfrenta al ÚLTIMO BICHO (Jefe gigante),
     * dispara un mega rayo desinfectante, lo destruye en una explosión
     * y alza su arma al cielo en victoria total.
     */
    playFinalBossExecution(onFinish) {
        this.clearAllTimeouts();
        this.mode = 'final_boss';
        this.fumigador.visible = true;
        this.fumigador.state = 'idle';
        this.fumigador.targetX = 240;
        this.bugs = []; // Limpiar bichos pequeños

        // Crear el ÚLTIMO BICHO (Gigante)
        this.bossBug = {
            x: 680,
            y: this.groundY - 35,
            width: 80,
            height: 55,
            scale: 2.2,
            legPhase: 0,
            hp: 100,
            isHit: false,
            twitchTimer: 0
        };

        // Paso 1: El fumigador apunta y carga el arma (1 segundo)
        this.fumigador.armAngle = -0.1;
        for (let i = 0; i < 25; i++) {
            this.particles.push({
                x: this.fumigador.x + 40 + (Math.random() * 40 - 20),
                y: this.fumigador.y - 45 + (Math.random() * 40 - 20),
                vx: (this.fumigador.x + 40 - (this.fumigador.x + 40 + (Math.random() * 40 - 20))) * 0.1,
                vy: (this.fumigador.y - 45 - (this.fumigador.y - 45 + (Math.random() * 40 - 20))) * 0.1,
                size: 3 + Math.random() * 4,
                color: '#00ffcc',
                alpha: 1,
                decay: 0.03,
                type: 'spark'
            });
        }

        // Paso 2: Disparar Mega Rayo Desinfectante continuo
        setTimeout(() => {
            this.megaBeam.active = true;
            this.screenShake = 15;
            if (window.soundEngine) {
                window.soundEngine.playMegaBeam();
            }

            // Sacudida del jefe
            const shakeInterval = setInterval(() => {
                if (this.bossBug) {
                    this.bossBug.isHit = true;
                    this.bossBug.x = 680 + (Math.random() * 12 - 6);
                }
            }, 60);

            // Paso 3: Destrucción y explosión del último bicho
            setTimeout(() => {
                clearInterval(shakeInterval);
                this.megaBeam.active = false;
                this.screenShake = 22;

                if (window.soundEngine) {
                    window.soundEngine.playBossExplosion();
                    window.soundEngine.playVictory();
                }

                // Explosión masiva del jefe
                for (let i = 0; i < 110; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 3 + Math.random() * 9;
                    this.particles.push({
                        x: 680,
                        y: this.groundY - 35,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed - 3,
                        size: 4 + Math.random() * 6,
                        color: ['#ff0055', '#ff9900', '#00ffcc', '#ffff00', '#00ff88'][Math.floor(Math.random() * 5)],
                        alpha: 1,
                        decay: 0.015,
                        type: 'victory_star'
                    });
                }

                this.bossBug = null;

                // Fumigador camina al centro y alza el arma arriba
                this.fumigador.state = 'victory';
                this.fumigador.targetX = 420;

                // Mostrar el letrero final
                setTimeout(() => {
                    if (onFinish) onFinish();
                }, 1800);

            }, 1400);

        }, 900);
    }

    /**
     * Respuesta Correcta durante el juego
     */
    triggerCorrect() {
        this.fumigador.state = 'shooting';
        this.fumigador.stateTimer = 45;
        this.fumigador.targetX = Math.min(360, this.fumigador.targetX + 30);

        if (window.soundEngine) {
            window.soundEngine.playSpray();
        }

        // Emisión de partículas de spray
        for (let i = 0; i < 40; i++) {
            this.particles.push({
                x: this.fumigador.x + 45,
                y: this.fumigador.y - 45 + (Math.random() * 8 - 4),
                vx: 7 + Math.random() * 6,
                vy: (Math.random() - 0.5) * 3,
                size: 4 + Math.random() * 7,
                color: Math.random() > 0.4 ? '#00ffaa' : '#00e5ff',
                alpha: 0.8,
                decay: 0.02 + Math.random() * 0.02,
                type: 'spray'
            });
        }

        if (this.killBugTimeout) clearTimeout(this.killBugTimeout);
        this.killBugTimeout = setTimeout(() => {
            const aliveBugs = this.bugs.filter(b => !b.isDying);
            if (aliveBugs.length > 0) {
                aliveBugs.sort((a, b) => a.x - b.x);
                const victim = aliveBugs[0];
                this.killBug(victim);

                if (window.soundEngine) {
                    window.soundEngine.playBugDeath();
                }
            }
        }, 150);
    }

    killBug(bug) {
        bug.isDying = true;
        bug.deathTimer = 30;

        for (let i = 0; i < 35; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 5;
            this.particles.push({
                x: bug.x,
                y: bug.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                size: 3 + Math.random() * 4,
                color: Math.random() > 0.5 ? '#ff2255' : '#ff7700',
                alpha: 1,
                decay: 0.03 + Math.random() * 0.03,
                type: 'bug_splat'
            });
        }
    }

    /**
     * Respuesta Incorrecta durante el juego
     */
    triggerWrong() {
        this.fumigador.state = 'step_back';
        this.fumigador.stateTimer = 50;
        this.fumigador.targetX = Math.max(80, this.fumigador.targetX - 45);
        this.screenShake = 12;

        if (window.soundEngine) {
            window.soundEngine.playAlarm();
        }

        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: this.fumigador.x + (Math.random() * 30 - 15),
                y: this.fumigador.y - 40 + (Math.random() * 40 - 20),
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                size: 2 + Math.random() * 3,
                color: '#ff0055',
                alpha: 1,
                decay: 0.04,
                type: 'spark'
            });
        }

        this.bugs.forEach(bug => {
            if (!bug.isDying) {
                bug.targetX = Math.max(this.fumigador.targetX + 60, bug.targetX - 55);
            }
        });

        if (this.spawnTimeout) clearTimeout(this.spawnTimeout);
        this.spawnTimeout = setTimeout(() => {
            this.addBug(this.width - 40);
            this.addBug(this.width - 15);
        }, 200);
    }

    /**
     * Victoria de nivel individual:
     * El fumigador alza su arma arriba en señal de victoria
     */
    triggerVictory(onBannerShow) {
        this.fumigador.state = 'victory';
        this.fumigador.targetX = 400;
        this.fumigador.stateTimer = 99999;

        this.bugs.forEach(b => {
            if (!b.isDying) this.killBug(b);
        });

        if (window.soundEngine) {
            window.soundEngine.playVictory();
        }

        if (this.victoryTimeout) clearTimeout(this.victoryTimeout);
        this.victoryTimeout = setTimeout(() => {
            if (onBannerShow) onBannerShow();
        }, 1600);
    }

    /**
     * Derrota: Bichos se abalanzan sobre el fumigador
     */
    triggerDefeat(onBannerShow) {
        this.fumigador.state = 'defeat';
        this.fumigador.stateTimer = 99999;
        this.screenShake = 20;

        if (window.soundEngine) {
            window.soundEngine.playDefeat();
        }

        for (let i = 0; i < 6; i++) {
            this.addBug(this.width - 20 - i * 30);
        }

        this.bugs.forEach((b, idx) => {
            b.isDying = false;
            b.targetX = this.fumigador.x + (Math.random() * 40 - 20);
            b.speed = 4 + Math.random() * 3;
        });

        if (this.defeatTimeout) clearTimeout(this.defeatTimeout);
        this.defeatTimeout = setTimeout(() => {
            this.fumigador.isDead = true;
            if (onBannerShow) onBannerShow();
        }, 1400);
    }

    clearAllTimeouts() {
        if (this.victoryTimeout) { clearTimeout(this.victoryTimeout); this.victoryTimeout = null; }
        if (this.defeatTimeout) { clearTimeout(this.defeatTimeout); this.defeatTimeout = null; }
        if (this.killBugTimeout) { clearTimeout(this.killBugTimeout); this.killBugTimeout = null; }
        if (this.spawnTimeout) { clearTimeout(this.spawnTimeout); this.spawnTimeout = null; }
        if (this.bossTimeout) { clearTimeout(this.bossTimeout); this.bossTimeout = null; }
    }

    reset(initialBugCount = 4) {
        this.clearAllTimeouts();
        this.mode = 'playing';
        this.fumigador.visible = true;
        this.fumigador.x = 200;
        this.fumigador.baseX = 200;
        this.fumigador.targetX = 200;
        this.fumigador.state = 'idle';
        this.fumigador.stateTimer = 0;
        this.fumigador.armAngle = 0;
        this.fumigador.isDead = false;
        this.screenShake = 0;
        this.bossBug = null;
        this.megaBeam.active = false;
        this.teleportEffect = 0;
        this.particles = [];
        this.spawnInitialBugs(initialBugCount);
    }

    resetForRace(initialBugCount = 4) {
        this.clearAllTimeouts();
        this.mode = 'race';
        this.raceTimeLeft = 30;
        this.fumigador.visible = true;
        this.fumigador.x = 200;
        this.fumigador.baseX = 200;
        this.fumigador.targetX = 200;
        this.fumigador.state = 'idle';
        this.fumigador.stateTimer = 0;
        this.fumigador.armAngle = 0;
        this.fumigador.isDead = false;
        this.screenShake = 0;
        this.bossBug = null;
        this.megaBeam.active = false;
        this.teleportEffect = 0;
        this.particles = [];
        this.spawnInitialBugs(initialBugCount);
    }

    update(dt) {
        if (this.screenShake > 0) {
            this.screenShake *= 0.88;
            if (this.screenShake < 0.2) this.screenShake = 0;
        }

        // Teletransporte fade
        if (this.teleportEffect > 0) {
            this.teleportEffect -= 0.025;
            if (this.teleportEffect < 0) this.teleportEffect = 0;
        }

        this.alarmPulse += 0.05;

        // Fumigador posición
        this.fumigador.x += (this.fumigador.targetX - this.fumigador.x) * 0.12;
        this.fumigador.animTimer += 0.08;

        // Estados de fumigador
        if (this.fumigador.state === 'shooting') {
            this.fumigador.stateTimer--;
            if (this.fumigador.stateTimer > 10) {
                for (let i = 0; i < 3; i++) {
                    this.particles.push({
                        x: this.fumigador.x + 46,
                        y: this.fumigador.y - 45 + (Math.random() * 6 - 3),
                        vx: 8 + Math.random() * 5,
                        vy: (Math.random() - 0.5) * 3,
                        size: 3 + Math.random() * 5,
                        color: Math.random() > 0.4 ? '#00ffcc' : '#22ff88',
                        alpha: 0.7,
                        decay: 0.025,
                        type: 'spray'
                    });
                }
            }
            if (this.fumigador.stateTimer <= 0) {
                this.fumigador.state = 'idle';
            }
        } else if (this.fumigador.state === 'step_back') {
            this.fumigador.stateTimer--;
            if (this.fumigador.stateTimer <= 0) {
                this.fumigador.state = 'idle';
            }
        } else if (this.fumigador.state === 'victory') {
            if (this.fumigador.armAngle > -Math.PI * 0.45) {
                this.fumigador.armAngle -= 0.04;
            } else {
                if (Math.random() > 0.4) {
                    this.particles.push({
                        x: this.fumigador.x + 18,
                        y: this.fumigador.y - 75,
                        vx: (Math.random() - 0.5) * 4,
                        vy: -5 - Math.random() * 5,
                        size: 3 + Math.random() * 4,
                        color: ['#00ffea', '#ffea00', '#ff00aa', '#00ff88'][Math.floor(Math.random() * 4)],
                        alpha: 1,
                        decay: 0.02,
                        type: 'victory_star'
                    });
                }
            }
        }

        // Mega rayo continuo
        if (this.megaBeam.active) {
            for (let i = 0; i < 5; i++) {
                this.particles.push({
                    x: this.fumigador.x + 48 + Math.random() * 400,
                    y: this.fumigador.y - 46 + (Math.random() * 16 - 8),
                    vx: 12 + Math.random() * 8,
                    vy: (Math.random() - 0.5) * 4,
                    size: 4 + Math.random() * 8,
                    color: Math.random() > 0.3 ? '#00ffcc' : '#ffffff',
                    alpha: 0.9,
                    decay: 0.04,
                    type: 'spray'
                });
            }
        }

        // Actualizar Bugs
        for (let i = this.bugs.length - 1; i >= 0; i--) {
            const bug = this.bugs[i];

            if (bug.isDying) {
                bug.deathTimer--;
                bug.scale *= 0.92;
                if (bug.deathTimer <= 0) {
                    this.bugs.splice(i, 1);
                    continue;
                }
            } else {
                bug.x += (bug.targetX - bug.x) * (bug.speed * 0.05);
                bug.legPhase += 0.18;
                bug.twitchTimer--;
                if (bug.twitchTimer <= 0) {
                    bug.twitchTimer = 20 + Math.random() * 60;
                    if (this.fumigador.state !== 'defeat' && this.mode !== 'intro') {
                        bug.targetX += (Math.random() - 0.5) * 15;
                    }
                }
            }
        }

        // Jefe bicho actualización
        if (this.bossBug) {
            this.bossBug.legPhase += 0.22;
        }

        // Mantener bichos si estamos jugando normal o en modo carrera
        if ((this.mode === 'playing' || this.mode === 'race') && this.fumigador.state !== 'victory' && this.bugs.filter(b => !b.isDying).length < 2) {
            this.addBug(this.width - 50);
        }

        // Partículas
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (p.type === 'spray') {
                p.size += 0.25;
                p.vx *= 0.96;
            } else if (p.type === 'victory_star') {
                p.vy += 0.15;
            }

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Circuitos
        this.circuits.forEach(c => {
            c.pulse += 0.03;
        });
    }

    render() {
        const ctx = this.ctx;
        ctx.save();

        if (this.screenShake > 0) {
            const dx = (Math.random() - 0.5) * this.screenShake;
            const dy = (Math.random() - 0.5) * this.screenShake;
            ctx.translate(dx, dy);
        }

        ctx.fillStyle = '#070a14';
        ctx.fillRect(0, 0, this.width, this.height);

        // Fondo y circuitos
        this.drawMotherboard(ctx);

        // Rayo de teletransporte
        if (this.teleportEffect > 0) {
            this.drawTeleportBeam(ctx);
        }

        // Mega rayo
        if (this.megaBeam.active) {
            this.drawMegaBeam(ctx);
        }

        this.drawParticles(ctx, 'behind');

        // Dibujar bichos pequeños
        this.drawBugs(ctx);

        // Dibujar Jefe bicho final
        if (this.bossBug) {
            this.drawBossBug(ctx);
        }

        // Dibujar Fumigador
        if (this.fumigador.visible) {
            this.drawFumigador(ctx);
        }

        this.drawParticles(ctx, 'front');

        // Overlay y alertas
        this.drawCanvasOverlay(ctx);

        ctx.restore();
    }

    drawMotherboard(ctx) {
        ctx.strokeStyle = this.mode === 'intro' ? 'rgba(255, 0, 85, 0.2)' : 'rgba(0, 240, 255, 0.08)';
        ctx.lineWidth = 1;

        for (let x = 0; x < this.width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }
        for (let y = 0; y < this.height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }

        // Plataforma
        const gradient = ctx.createLinearGradient(0, 0, this.width, 0);
        gradient.addColorStop(0, '#00ffcc');
        gradient.addColorStop(0.5, '#0077ff');
        gradient.addColorStop(1, '#ff0055');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, this.groundY, this.width, 4);

        ctx.fillStyle = 'rgba(10, 16, 32, 0.9)';
        ctx.fillRect(0, this.groundY + 4, this.width, this.height - this.groundY);

        // Circuitos
        this.circuits.forEach(c => {
            ctx.strokeStyle = c.color;
            ctx.globalAlpha = Math.abs(Math.sin(c.pulse)) * c.alpha;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(c.x, c.y);
            if (c.vertical) {
                ctx.lineTo(c.x, c.y + c.length);
            } else {
                ctx.lineTo(c.x + c.length, c.y);
            }
            ctx.stroke();

            ctx.fillStyle = c.color;
            ctx.beginPath();
            ctx.arc(c.x, c.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        // CPU Chip
        ctx.fillStyle = 'rgba(0, 30, 60, 0.35)';
        ctx.strokeStyle = this.mode === 'intro' ? 'rgba(255, 0, 85, 0.6)' : 'rgba(0, 240, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(360, 40, 180, 110);
        ctx.fillRect(360, 40, 180, 110);

        ctx.font = '11px "Courier New", monospace';
        ctx.fillStyle = this.mode === 'intro' ? '#ff0055' : 'rgba(0, 240, 255, 0.7)';
        ctx.fillText('FIREWALL_CORE::CPU', 390, 80);
        ctx.fillStyle = this.mode === 'intro' ? '#ff3366' : 'rgba(0, 255, 170, 0.8)';
        ctx.fillText(this.mode === 'intro' ? '¡BRECHA ACTIVA!' : 'STATUS: ONLINE', 400, 105);
    }

    drawTeleportBeam(ctx) {
        ctx.save();
        ctx.globalAlpha = this.teleportEffect;
        const grad = ctx.createLinearGradient(200, 0, 200, this.groundY);
        grad.addColorStop(0, 'rgba(0, 255, 200, 0.8)');
        grad.addColorStop(0.8, 'rgba(0, 255, 136, 0.4)');
        grad.addColorStop(1, 'rgba(0, 255, 200, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(160, 0, 80, this.groundY);

        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(200, 0);
        ctx.lineTo(200, this.groundY);
        ctx.stroke();
        ctx.restore();
    }

    drawMegaBeam(ctx) {
        ctx.save();
        const startX = this.fumigador.x + 46;
        const startY = this.fumigador.y - 45;
        const endX = this.bossBug ? this.bossBug.x : this.width;
        const endY = this.bossBug ? this.bossBug.y : startY;

        // Halo exterior
        ctx.strokeStyle = 'rgba(0, 255, 200, 0.4)';
        ctx.lineWidth = 26 + Math.sin(this.fumigador.animTimer * 6) * 6;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Rayo central
        ctx.strokeStyle = '#ffffff';
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 18;
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        ctx.restore();
    }

    drawBossBug(ctx) {
        const b = this.bossBug;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.scale(b.scale, b.scale);

        // Sombra gigante
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.beginPath();
        ctx.ellipse(0, 14, 28, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // 6 Patas gigantes
        ctx.strokeStyle = '#550011';
        ctx.lineWidth = 3.5;
        for (let i = -1; i <= 1; i++) {
            const legWiggle = Math.sin(b.legPhase + i * 1.5) * 6;
            ctx.beginPath();
            ctx.moveTo(-10 + i * 12, 0);
            ctx.lineTo(-26 + i * 12, 10 + legWiggle);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(-10 + i * 12, 0);
            ctx.lineTo(16 + i * 12, 10 - legWiggle);
            ctx.stroke();
        }

        // Caparazón del Jefe Bicho
        const redGradient = ctx.createLinearGradient(-22, -18, 22, 18);
        redGradient.addColorStop(0, b.isHit ? '#ffffff' : '#ff0033');
        redGradient.addColorStop(0.5, b.isHit ? '#ff9999' : '#990018');
        redGradient.addColorStop(1, '#44000b');

        ctx.fillStyle = redGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, 25, 16, 0, 0, Math.PI * 2);
        ctx.fill();

        // Placas y corazas
        ctx.strokeStyle = '#ff99aa';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-16, 0);
        ctx.lineTo(16, 0);
        ctx.moveTo(0, -12);
        ctx.lineTo(0, 12);
        ctx.stroke();

        // Cabeza
        ctx.fillStyle = '#220005';
        ctx.beginPath();
        ctx.arc(-20, 0, 10, 0, Math.PI * 2);
        ctx.fill();

        // Ojos amenazantes
        ctx.fillStyle = '#ffff00';
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(-24, -4, 3.5, 0, Math.PI * 2);
        ctx.arc(-24, 4, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Antenas
        ctx.strokeStyle = '#ff0055';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-25, -4);
        ctx.lineTo(-38, -14);
        ctx.moveTo(-25, 4);
        ctx.lineTo(-38, 14);
        ctx.stroke();

        ctx.restore();
    }

    drawFumigador(ctx) {
        const f = this.fumigador;
        ctx.save();
        ctx.translate(f.x, f.y);

        if (f.state === 'defeat' && f.isDead) {
            ctx.rotate(0.35);
            ctx.translate(-15, 10);
        }

        const bob = Math.sin(f.animTimer) * 2;

        // Sombra
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 26, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tanque de antivirus en la espalda
        ctx.fillStyle = '#1a2634';
        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 1.5;
        ctx.fillRect(-22, -68 + bob, 14, 38);
        ctx.strokeRect(-22, -68 + bob, 14, 38);

        ctx.fillStyle = '#00ffaa';
        ctx.shadowColor = '#00ffaa';
        ctx.shadowBlur = 8;
        ctx.fillRect(-20, -52 + bob, 10, 20);
        ctx.shadowBlur = 0;

        // Manguera
        ctx.strokeStyle = '#ffbb00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-16, -32 + bob);
        ctx.bezierCurveTo(-10, -18 + bob, 8, -25 + bob, 18, -40 + bob);
        ctx.stroke();

        // Piernas
        const legWalk = f.state === 'step_back' ? Math.sin(f.animTimer * 2) * 6 : 0;
        ctx.fillStyle = '#f5b000';
        ctx.fillRect(-12, -26 + bob, 10, 24 + legWalk);
        ctx.fillRect(4, -26 + bob, 10, 24 - legWalk);

        // Botas
        ctx.fillStyle = '#1e2836';
        ctx.fillRect(-14, -6 + bob + legWalk, 14, 8);
        ctx.fillRect(2, -6 + bob - legWalk, 14, 8);

        // Cuerpo (Traje Hazmat)
        ctx.fillStyle = '#f5b000';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-16, -60 + bob, 32, 36, 6);
        ctx.fill();

        // Placa pectoral
        ctx.fillStyle = '#223042';
        ctx.fillRect(-10, -54 + bob, 20, 20);
        ctx.fillStyle = '#00ffcc';
        ctx.fillRect(-2, -50 + bob, 4, 12);
        ctx.fillRect(-6, -46 + bob, 12, 4);

        // Casco
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, -68 + bob, 16, 0, Math.PI * 2);
        ctx.fill();

        // Visor
        const visorColor = f.state === 'step_back' ? '#ff0055' : (f.state === 'defeat' ? '#333333' : '#00ffff');
        ctx.fillStyle = visorColor;
        ctx.shadowColor = visorColor;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(1, -72 + bob, 14, 9, 3);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Brazo y Arma
        ctx.save();
        ctx.translate(6, -46 + bob);

        if (f.state === 'victory') {
            ctx.rotate(f.armAngle);
        } else if (f.state === 'step_back') {
            ctx.rotate(0.2);
        }

        ctx.fillStyle = '#f5b000';
        ctx.fillRect(0, -4, 18, 8);

        // Pistola blaster
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(14, -8, 26, 12);

        ctx.fillStyle = '#00ffcc';
        ctx.fillRect(40, -6, 8, 8);

        ctx.fillStyle = '#111';
        ctx.fillRect(16, 2, 6, 8);

        ctx.fillStyle = (f.state === 'shooting' || this.megaBeam.active) ? '#ffffff' : '#00ff88';
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 10;
        ctx.fillRect(24, -6, 5, 3);
        ctx.shadowBlur = 0;

        ctx.restore();
        ctx.restore();
    }

    drawBugs(ctx) {
        this.bugs.forEach(bug => {
            ctx.save();
            ctx.translate(bug.x, bug.y);
            ctx.scale(bug.scale, bug.scale);

            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.beginPath();
            ctx.ellipse(0, 10, 16, 5, 0, 0, Math.PI * 2);
            ctx.fill();

            // 6 Patas
            ctx.strokeStyle = '#990022';
            ctx.lineWidth = 2.5;
            for (let i = -1; i <= 1; i++) {
                const legWiggle = Math.sin(bug.legPhase + i * 1.5) * 5;
                ctx.beginPath();
                ctx.moveTo(-6 + i * 8, 0);
                ctx.lineTo(-18 + i * 8, 6 + legWiggle);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(-6 + i * 8, 0);
                ctx.lineTo(12 + i * 8, 6 - legWiggle);
                ctx.stroke();
            }

            // Cuerpo
            const redGradient = ctx.createLinearGradient(-15, -12, 15, 12);
            redGradient.addColorStop(0, '#ff1144');
            redGradient.addColorStop(0.5, '#cc0022');
            redGradient.addColorStop(1, '#660011');

            ctx.fillStyle = redGradient;
            ctx.beginPath();
            ctx.ellipse(0, 0, 17, 11, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#ff99aa';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(-10, 0);
            ctx.lineTo(10, 0);
            ctx.moveTo(0, -9);
            ctx.lineTo(0, 9);
            ctx.stroke();

            // Cabeza
            ctx.fillStyle = '#44000e';
            ctx.beginPath();
            ctx.arc(-14, 0, 7, 0, Math.PI * 2);
            ctx.fill();

            // Ojos
            ctx.fillStyle = '#ffff00';
            ctx.shadowColor = '#ff0033';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(-17, -2.5, 2.5, 0, Math.PI * 2);
            ctx.arc(-17, 2.5, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Antenas
            const antTwitch = Math.sin(bug.legPhase * 2) * 3;
            ctx.strokeStyle = '#ff0033';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-18, -3);
            ctx.lineTo(-26, -9 + antTwitch);
            ctx.moveTo(-18, 3);
            ctx.lineTo(-26, 9 - antTwitch);
            ctx.stroke();

            ctx.restore();
        });
    }

    drawParticles(ctx, layer) {
        this.particles.forEach(p => {
            if (layer === 'behind' && (p.type === 'spray' || p.type === 'victory_star')) return;
            if (layer === 'front' && p.type === 'bug_splat') return;

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    drawCanvasOverlay(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        for (let y = 0; y < this.height; y += 4) {
            ctx.fillRect(0, y, this.width, 1.5);
        }

        // Badge de invasión o carrera en la esquina
        if (this.mode === 'playing') {
            ctx.fillStyle = 'rgba(20, 0, 10, 0.6)';
            ctx.strokeStyle = '#ff0055';
            ctx.lineWidth = 1;
            ctx.fillRect(this.width - 170, 15, 155, 30);
            ctx.strokeRect(this.width - 170, 15, 155, 30);

            const aliveCount = this.bugs.filter(b => !b.isDying).length;
            ctx.fillStyle = '#ff2a6d';
            ctx.font = 'bold 12px "Courier New", monospace';
            ctx.fillText(`INFESTACIÓN: ${aliveCount} BUGS`, this.width - 158, 35);
        } else if (this.mode === 'race') {
            const isCritical = (this.raceTimeLeft <= 10);
            const isVeryLow = (this.raceTimeLeft <= 5);

            ctx.fillStyle = isCritical ? 'rgba(35, 5, 15, 0.85)' : 'rgba(8, 20, 35, 0.85)';
            ctx.strokeStyle = isCritical ? '#ff0055' : '#00f0ff';
            ctx.lineWidth = 1.5;
            ctx.fillRect(this.width - 225, 14, 210, 32);
            ctx.strokeRect(this.width - 225, 14, 210, 32);

            const seconds = Math.max(0, Math.ceil(this.raceTimeLeft || 0));
            ctx.font = 'bold 13px "Courier New", monospace';
            ctx.fillStyle = isVeryLow ? '#ff0055' : (isCritical ? '#ffee00' : '#00ffcc');
            ctx.fillText(`🏁 CARRERA: ⏱️ ${seconds}s RESTANTES`, this.width - 215, 35);

            if (isVeryLow) {
                // Alerta roja sutil de tiempo crítico en los bordes
                ctx.fillStyle = `rgba(255, 0, 85, ${0.08 + Math.sin(this.alarmPulse * 4) * 0.05})`;
                ctx.fillRect(0, 0, this.width, this.height);
            }
        } else if (this.mode === 'intro') {
            // Pulso rojo de alerta en el lienzo
            ctx.fillStyle = `rgba(255, 0, 85, ${0.1 + Math.sin(this.alarmPulse * 2) * 0.06})`;
            ctx.fillRect(0, 0, this.width, this.height);
        }
    }

    animate(now) {
        const dt = (now - this.lastTime) / 1000;
        this.lastTime = now;

        this.update(dt);
        this.render();

        requestAnimationFrame(this.animate);
    }
}

window.BattleCanvas = BattleCanvas;
