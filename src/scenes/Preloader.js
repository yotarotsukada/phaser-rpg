import { Scene } from 'phaser';
import storyData from '../stories/story.json';

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

        // Fonts
        this.load.font('Nosutaru-dot', 'fonts/Nosutaru-dotMPlusH-10-Regular.ttf');
    }

    create ()
    {
        //  Store story data in game registry for global access
        this.registry.set('storyData', storyData);

        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
