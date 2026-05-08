import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        const { width, height } = this.scale;
        const cx = width / 2;
        const cy = height / 2;

        this.add.rectangle(cx, cy, width, height, 0x000018);

        this.add
            .text(cx, cy - 80, 'PONG', {
                fontFamily: 'monospace',
                fontSize: '96px',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        this.add
            .text(cx, cy + 40, 'First to 5 wins', {
                fontFamily: 'monospace',
                fontSize: '24px',
                color: '#cccccc',
            })
            .setOrigin(0.5);

        this.add
            .text(cx, cy + 100, 'W / S or ↑ / ↓ to move', {
                fontFamily: 'monospace',
                fontSize: '20px',
                color: '#888888',
            })
            .setOrigin(0.5);

        this.add
            .text(cx, cy + 180, 'Click or press SPACE to start', {
                fontFamily: 'monospace',
                fontSize: '20px',
                color: '#ffff66',
            })
            .setOrigin(0.5);

        this.input.once('pointerdown', () => this.scene.start('Game'));
        this.input.keyboard!.once('keydown-SPACE', () => this.scene.start('Game'));
    }
}
