import { Scene } from 'phaser';

interface GameOverData {
    playerWon: boolean;
    playerScore: number;
    aiScore: number;
}

export class GameOver extends Scene {
    constructor() {
        super('GameOver');
    }

    create(data: GameOverData) {
        const { width, height } = this.scale;
        const cx = width / 2;
        const cy = height / 2;

        this.add.rectangle(cx, cy, width, height, 0x000018);

        const title = data.playerWon ? 'YOU WIN' : 'YOU LOSE';
        const titleColor = data.playerWon ? '#66ff66' : '#ff6666';

        this.add
            .text(cx, cy - 80, title, {
                fontFamily: 'monospace',
                fontSize: '96px',
                color: titleColor,
            })
            .setOrigin(0.5);

        this.add
            .text(cx, cy + 40, `${data.playerScore} : ${data.aiScore}`, {
                fontFamily: 'monospace',
                fontSize: '48px',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        this.add
            .text(cx, cy + 160, 'Click or press SPACE to play again', {
                fontFamily: 'monospace',
                fontSize: '20px',
                color: '#ffff66',
            })
            .setOrigin(0.5);

        this.input.once('pointerdown', () => this.scene.start('MainMenu'));
        this.input.keyboard!.once('keydown-SPACE', () => this.scene.start('MainMenu'));
    }
}
