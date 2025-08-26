import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x000000);

        this.add.image(512, 384, 'background').setAlpha(0.3);

        this.initializeStory();
        this.setupStoryDisplay();
        this.setupInput();
    }

    initializeStory() {
        const storyData = this.registry.get('storyData');
        this.data.set('storyData', storyData);
        
        this.data.set('currentSceneIndex', 0);
        this.data.set('isStoryActive', true);
    }

    setupStoryDisplay() {
        this.storyContainer = this.add.container(512, 600);
        
        this.storyBox = this.add.rectangle(0, 0, 900, 150, 0x000000, 0.5);
        this.storyBox.setStrokeStyle(2, 0xffffff);
        
        this.speakerText = this.add.text(-420, -50, '', {
            fontFamily: 'Nosutaru-dot',
            fontSize: 24,
            color: '#ffff00',
            fontStyle: 'bold'
        });
        
        this.storyText = this.add.text(-420, -20, '', {
            fontFamily: 'Nosutaru-dot',
            fontSize: 20,
            color: '#ffffff',
            wordWrap: { width: 850 },
            lineSpacing: 5
        });
        
        this.continueText = this.add.text(420, 50, 'クリックで続行', {
            fontFamily: 'Nosutaru-dot',
            fontSize: 14,
            color: '#aaaaaa'
        }).setOrigin(1, 0.5);
        
        this.storyContainer.add([this.storyBox, this.speakerText, this.storyText, this.continueText]);
        
        this.displayCurrentScene();
    }

    setupInput() {
        this.input.on('pointerdown', () => {
            if (this.data.get('isStoryActive')) {
                this.advanceStory();
            }
        });
    }

    displayCurrentScene() {
        const storyData = this.data.get('storyData');
        const currentIndex = this.data.get('currentSceneIndex');
        const currentScene = storyData.scenes[currentIndex];
        
        if (currentScene) {
            this.speakerText.setText(currentScene.speaker + ':');
            this.storyText.setText(currentScene.text);
        }
    }

    advanceStory() {
        const storyData = this.data.get('storyData');
        let currentIndex = this.data.get('currentSceneIndex');
        
        currentIndex++;
        
        if (currentIndex >= storyData.scenes.length) {
            this.endStory();
        } else {
            this.data.set('currentSceneIndex', currentIndex);
            this.displayCurrentScene();
        }
    }

    endStory() {
        this.data.set('isStoryActive', false);
        this.storyContainer.setVisible(false);

        this.scene.start('GameOver');
    }

    setStoryData(newStoryData) {
        this.data.set('storyData', newStoryData);
        this.data.set('currentSceneIndex', 0);
        this.data.set('isStoryActive', true);
        
        if (this.storyContainer) {
            this.storyContainer.setVisible(true);
            this.displayCurrentScene();
        }
    }
}
