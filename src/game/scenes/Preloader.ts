import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        const { width, height } = this.scale;
        const cx = width / 2;
        const cy = height / 2;

        this.add.rectangle(cx, cy, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(cx - 230, cy, 4, 28, 0xffffff);

        this.load.on('progress', (progress: number) => {
            bar.width = 4 + 460 * progress;
        });
    }

    preload() {
        this.load.setPath('assets');
        // Mickey from Steamboat Willie (1928, US public domain since
        // Jan 1, 2024). Cropped from the iconic boat-wheel scene.
        this.load.image('mickey', 'mickey.png');
    }

    create() {
        this.scene.start('MainMenu');
    }
}
