import { Scene } from 'phaser';

export class Map extends Scene
{
    constructor ()
    {
        super('Map');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x004400);

        this.add.image(
            this.scale.width / 2,
            this.scale.height / 2,
            'map'
        );
        
        // Create player character
        this.createPlayer();
        
        // Create buildings/shops from map data
        this.createBuildings();
        
        // Setup controls
        this.setupMovementControls();
    }

    createPlayer() {
        const centerY = this.scale.height / 2;
        
        this.player = this.add.image(100, centerY, 'character-1');
        this.player.setDisplaySize(200, 200);
        this.playerSpeed = 100;
        
        // Add image switching animation
        this.time.addEvent({
            delay: 500,
            callback: () => {
                const currentTexture = this.player.texture.key;
                if (currentTexture === 'character-1') {
                    this.player.setTexture('character-2');
                } else {
                    this.player.setTexture('character-1');
                }
            },
            loop: true
        });
    }

    createBuildings() {
        const shopColor = undefined;
        // const shopColor = 0x888888; // Uncomment to visualize building areas
        

        this.buildings = [];
        
        // Get map data from registry
        const mapData = this.registry.get('mapData');
        
        // Create buildings from JSON map data
        mapData.blocks.forEach(blockData => {
            const building = this.add.rectangle(
                blockData.x, 
                blockData.y, 
                blockData.width, 
                blockData.height, 
                shopColor
            );
            this.buildings.push({
                rect: building,
                destinyScene: blockData.destinyScene
            });
        });
    }

    setupMovementControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.cursors && this.player) {
            const speed = this.playerSpeed * (1/60);
            
            if (this.cursors.left.isDown) {
                this.player.x -= speed;
                this.player.setFlipX(true);
            }
            if (this.cursors.right.isDown) {
                this.player.x += speed;
                this.player.setFlipX(false);
            }
            if (this.cursors.up.isDown) {
                this.player.y -= speed;
            }
            if (this.cursors.down.isDown) {
                this.player.y += speed;
            }
            
            // Keep player within screen bounds
            this.player.x = Phaser.Math.Clamp(this.player.x, 15, this.scale.width - 15);
            this.player.y = Phaser.Math.Clamp(this.player.y, 15, this.scale.height - 15);
            
            // Check for building collisions
            this.checkBuildingCollisions();
        }
    }

    checkBuildingCollisions() {
        this.buildings.forEach(building => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                building.rect.x, building.rect.y
            );
            
            // Use half of the building's width as collision distance
            const collisionDistance = building.rect.width / 2;
            
            if (distance < collisionDistance) {
                if (!building.showingPrompt) {
                    building.showingPrompt = true;
                    building.prompt = this.add.text(
                        building.rect.x, building.rect.y - 60,
                        'SPACEを押して入ってみる',
                        {
                            fontSize: '12px',
                            color: '#ffff00',
                            fontFamily: 'Arial',
                            backgroundColor: '#000000',
                            padding: { x: 8, y: 4 }
                        }
                    ).setOrigin(0.5);
                }
                
                if (this.input.keyboard.addKey('SPACE').isDown) {
                    if (building.destinyScene) {
                        this.scene.start(building.destinyScene);
                    }
                }
            } else {
                if (building.showingPrompt) {
                    building.showingPrompt = false;
                    if (building.prompt) {
                        building.prompt.destroy();
                        building.prompt = null;
                    }
                }
            }
        });
    }
}