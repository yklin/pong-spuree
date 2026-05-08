import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Boot Scene typically loads tiny assets needed by the Preloader UI.
        // Pong scaffold uses primitives, so nothing to load yet.
    }

    create() {
        this.scene.start('Preloader');
    }
}
