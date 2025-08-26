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

        this.add.image(
            this.scale.width / 2,
            this.scale.height / 2,
            'background'
        ).setAlpha(0.3);

        // Reset story to beginning when scene starts
        this.resetStoryToBeginning();
        this.initializeStory();
        this.setupStoryDisplay();
        this.setupInput();
    }

    initializeStory() {
        const currentStoryId = this.registry.get('currentStoryId');
        const allStories = this.registry.get('allStories');
        const storyData = allStories[currentStoryId];
        this.data.set('storyData', storyData);
        
        this.data.set('currentSceneIndex', 0);
        this.data.set('isStoryActive', true);
    }

    setupStoryDisplay() {
        this.storyContainer = this.add.container(
            this.scale.width / 2,
            600
        );
        
        this.storyBox = this.add.rectangle(0, 0, 900, 150, 0x000000, 0.5);
        this.storyBox.setStrokeStyle(2, 0xffffff);
        
        this.speakerText = this.add.text(-420, -50, '', {
            fontFamily: 'Nosutaru-dot',
            fontSize: 20,
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
        
        // Choice buttons container - positioned below story container
        this.choicesContainer = this.add.container(this.scale.width / 2, 450);
        this.choiceButtons = [];
        
        this.storyContainer.add([this.storyBox, this.speakerText, this.storyText, this.continueText]);
        
        this.displayCurrentScene();
    }

    setupInput() {
        this.input.on('pointerdown', () => {
            if (this.data.get('isStoryActive')) {
                const storyData = this.data.get('storyData');
                const currentIndex = this.data.get('currentSceneIndex');
                const currentScene = storyData.scenes[currentIndex];
                
                // Only advance if no choices are shown
                if (!currentScene.choices) {
                    this.advanceStory();
                }
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
            
            // Clear previous choices
            this.clearChoices();
            
            // Show choices if available
            if (currentScene.choices) {
                this.showChoices(currentScene.choices);
                this.continueText.setVisible(false);
            } else {
                this.continueText.setVisible(true);
            }
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

    showChoices(choices) {
        this.clearChoices();
        
        choices.forEach((choice, index) => {
            // Position buttons horizontally: first choice on left (-200), second on right (+200)
            const xPos = index === 0 ? -200 : 200;
            const yPos = 0;
            
            const choiceButton = this.add.rectangle(xPos, yPos, 350, 50, 0x333333, 0.8);
            choiceButton.setStrokeStyle(2, 0xffffff);
            
            const choiceText = this.add.text(xPos, yPos, choice.text, {
                fontFamily: 'Nosutaru-dot',
                fontSize: 18,
                color: '#ffffff',
                wordWrap: { width: 330 },
                align: 'center'
            }).setOrigin(0.5);
            
            choiceButton.setInteractive();
            choiceButton.on('pointerdown', () => {
                this.handleChoice(choice.nextStory);
            });
            
            choiceButton.on('pointerover', () => {
                choiceButton.setFillStyle(0x555555, 0.8);
            });
            
            choiceButton.on('pointerout', () => {
                choiceButton.setFillStyle(0x333333, 0.8);
            });
            
            this.choicesContainer.add([choiceButton, choiceText]);
            this.choiceButtons.push({ button: choiceButton, text: choiceText });
        });
        
        this.choicesContainer.setVisible(true);
    }

    clearChoices() {
        this.choiceButtons.forEach(choice => {
            choice.button.destroy();
            choice.text.destroy();
        });
        this.choiceButtons = [];
        this.choicesContainer.removeAll();
        this.choicesContainer.setVisible(false);
    }

    handleChoice(nextStoryId) {
        this.clearChoices();
        this.continueText.setVisible(true);
        
        // Switch to the next story
        if (nextStoryId) {
            const allStories = this.registry.get('allStories');
            if (allStories[nextStoryId]) {
                this.registry.set('currentStoryId', nextStoryId);
                this.data.set('storyData', allStories[nextStoryId]);
                this.data.set('currentSceneIndex', 0);
                this.displayCurrentScene();
            }
        }
    }

    resetStoryToBeginning() {
        // Reset to main story and first scene
        this.registry.set('currentStoryId', 'main');
    }
}
