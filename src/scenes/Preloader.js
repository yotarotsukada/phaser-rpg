import { Scene } from 'phaser';
import gameData from '../stories/data.json';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');
        this.load.image('map', 'map.png');
        this.load.image('character-1', 'character-1.png');
        this.load.image('character-2', 'character-2.png');

        // Fonts
        this.load.font('Nosutaru-dot', 'fonts/Nosutaru-dotMPlusH-10-Regular.ttf');
    }

    create ()
    {
        //  Store all story data in game registry for global access
        this.registry.set('allStories', gameData.stories);
        this.registry.set('currentStoryId', 'main');
        this.registry.set('mapData', gameData.map);

        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
