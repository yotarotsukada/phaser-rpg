import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(
            this.scale.width / 2,
            this.scale.height / 2,
            'background'
        );

        this.add.text(
            this.scale.width / 2,    
            this.scale.height / 2 - 100,
            'OFFICE RPG',
            {
                fontFamily: 'Nosutaru-dot', fontSize: 120, color: '#ffffff',
                stroke: '#000000', strokeThickness: 8,
                align: 'center'
            }
        ).setOrigin(0.5);

        this.add.text(
            this.scale.width / 2,    
            this.scale.height / 2 + 100,
            'クリック/SPACEでゲーム開始',
            {
                fontFamily: 'Nosutaru-dot', fontSize: 38, color: '#ffffff',
                stroke: '#000000', strokeThickness: 8,
                align: 'center'
            }
        ).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('Map');
        });

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('Map');
        });
    }
}
