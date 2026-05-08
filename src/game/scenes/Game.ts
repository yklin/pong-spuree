import { Scene } from 'phaser';

const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 96;
const PADDLE_SPEED = 600;
const BALL_RADIUS = 10;
const BALL_BASE_SPEED = 500;
const WIN_SCORE = 5;

export class Game extends Scene {
    private playerPaddle!: Phaser.GameObjects.Image;
    private aiPaddle!: Phaser.GameObjects.Image;
    private ball!: Phaser.GameObjects.Arc;
    private scoreText!: Phaser.GameObjects.Text;

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private wKey!: Phaser.Input.Keyboard.Key;
    private sKey!: Phaser.Input.Keyboard.Key;

    private playerScore = 0;
    private aiScore = 0;

    constructor() {
        super('Game');
    }

    create() {
        const { width, height } = this.scale;
        const cx = width / 2;
        const cy = height / 2;

        // Background
        this.add.rectangle(cx, cy, width, height, 0x000018);

        // Center divider — dashed line down the middle
        for (let y = 16; y < height; y += 32) {
            this.add.rectangle(cx, y, 4, 16, 0xffffff, 0.4);
        }

        // Paddles — both are Steamboat Willie Mickey images, scaled
        // to a paddle-shaped display. AI paddle is mirrored so both
        // characters "face the field".
        const PADDLE_DISPLAY_WIDTH = 55;
        this.playerPaddle = this.add
            .image(40, cy, 'mickey')
            .setDisplaySize(PADDLE_DISPLAY_WIDTH, PADDLE_HEIGHT);
        this.aiPaddle = this.add
            .image(width - 40, cy, 'mickey')
            .setDisplaySize(PADDLE_DISPLAY_WIDTH, PADDLE_HEIGHT)
            .setFlipX(true);
        this.physics.add.existing(this.playerPaddle);
        this.physics.add.existing(this.aiPaddle);
        const playerBody = this.playerPaddle.body as Phaser.Physics.Arcade.Body;
        const aiBody = this.aiPaddle.body as Phaser.Physics.Arcade.Body;
        playerBody.setSize(PADDLE_WIDTH, PADDLE_HEIGHT);
        aiBody.setSize(PADDLE_WIDTH, PADDLE_HEIGHT);
        playerBody.setImmovable(true);
        aiBody.setImmovable(true);
        playerBody.setCollideWorldBounds(true);
        aiBody.setCollideWorldBounds(true);

        // Ball
        this.ball = this.add.circle(cx, cy, BALL_RADIUS, 0xffffff);
        this.physics.add.existing(this.ball);
        const ballBody = this.ball.body as Phaser.Physics.Arcade.Body;
        ballBody.setCircle(BALL_RADIUS);
        ballBody.setBounce(1, 1);
        // collideWorldBounds=false so the ball can pass left/right edges (= scoring).
        // Top/bottom bounces handled manually in update().
        ballBody.setCollideWorldBounds(false);

        // Score
        this.scoreText = this.add
            .text(cx, 40, '0   0', {
                fontFamily: 'monospace',
                fontSize: '48px',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        // Input
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.wKey = this.input.keyboard!.addKey('W');
        this.sKey = this.input.keyboard!.addKey('S');

        // Collisions
        this.physics.add.collider(
            this.ball,
            this.playerPaddle,
            this.onPaddleHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this,
        );
        this.physics.add.collider(
            this.ball,
            this.aiPaddle,
            this.onPaddleHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this,
        );

        this.launchBall();
    }

    update() {
        const { height } = this.scale;

        // Player input
        const upDown = this.cursors.up?.isDown || this.wKey.isDown;
        const downDown = this.cursors.down?.isDown || this.sKey.isDown;
        const playerBody = this.playerPaddle.body as Phaser.Physics.Arcade.Body;
        if (upDown) playerBody.setVelocityY(-PADDLE_SPEED);
        else if (downDown) playerBody.setVelocityY(PADDLE_SPEED);
        else playerBody.setVelocityY(0);

        // AI: track ball, slightly slower than player so it's beatable
        const aiBody = this.aiPaddle.body as Phaser.Physics.Arcade.Body;
        const aiSpeed = PADDLE_SPEED * 0.75;
        const dy = this.ball.y - this.aiPaddle.y;
        if (Math.abs(dy) > 8) {
            aiBody.setVelocityY(dy > 0 ? aiSpeed : -aiSpeed);
        } else {
            aiBody.setVelocityY(0);
        }

        // Manual top/bottom bounce
        const ballBody = this.ball.body as Phaser.Physics.Arcade.Body;
        if (this.ball.y < BALL_RADIUS && ballBody.velocity.y < 0) {
            ballBody.setVelocityY(-ballBody.velocity.y);
        } else if (this.ball.y > height - BALL_RADIUS && ballBody.velocity.y > 0) {
            ballBody.setVelocityY(-ballBody.velocity.y);
        }

        // Score detection
        if (this.ball.x < 0) {
            this.aiScore++;
            this.afterScore();
        } else if (this.ball.x > this.scale.width) {
            this.playerScore++;
            this.afterScore();
        }
    }

    private onPaddleHit = (
        _ball: Phaser.Types.Physics.Arcade.GameObjectWithBody,
        paddleObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    ) => {
        const ballBody = this.ball.body as Phaser.Physics.Arcade.Body;
        const paddleBody = paddleObj.body as Phaser.Physics.Arcade.Body;
        // Hit position relative to paddle center → deflection angle
        const offset = (this.ball.y - paddleBody.center.y) / (PADDLE_HEIGHT / 2);
        const clamped = Math.max(-1, Math.min(1, offset));
        const angle = clamped * (Math.PI / 4); // up to 45°
        const speed = BALL_BASE_SPEED * 1.05; // slight rally speedup per hit
        const dirX = ballBody.velocity.x > 0 ? -1 : 1;
        ballBody.setVelocity(dirX * speed * Math.cos(angle), speed * Math.sin(angle));
    };

    private launchBall() {
        const { width, height } = this.scale;
        this.ball.setPosition(width / 2, height / 2);
        const dir = Math.random() < 0.5 ? -1 : 1;
        const angle = (Math.random() - 0.5) * 0.6;
        const ballBody = this.ball.body as Phaser.Physics.Arcade.Body;
        ballBody.setVelocity(dir * BALL_BASE_SPEED * Math.cos(angle), BALL_BASE_SPEED * Math.sin(angle));
    }

    private afterScore() {
        this.scoreText.setText(`${this.playerScore}   ${this.aiScore}`);
        if (this.playerScore >= WIN_SCORE || this.aiScore >= WIN_SCORE) {
            this.scene.start('GameOver', {
                playerWon: this.playerScore >= WIN_SCORE,
                playerScore: this.playerScore,
                aiScore: this.aiScore,
            });
        } else {
            this.launchBall();
        }
    }
}
