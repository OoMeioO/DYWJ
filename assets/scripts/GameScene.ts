// 游戏主场景 - 调试版本
import { _decorator, Component, Vec3, Input, input, KeyCode, Sprite, Node, UITransform, Size, Color, director, DirectorEvent } from 'cc';
import { PlayerController } from './PlayerController';

const { ccclass } = _decorator;

@ccclass('GameScene')
export class GameScene extends Component {
    private players: Node[] = [];
    private obstacles: Node[] = [];
    private keys: Set<number> = new Set();
    
    onLoad() {
        console.log('[GameScene] onLoad called!');
        director.on(DirectorEvent.MAIN_SCENE_BEING_LAUNCHED, this.onSceneLaunch, this);
        director.on(DirectorEvent.MAIN_SCENE_READY, this.onSceneReady, this);
    }
    
    onSceneLaunch() {
        console.log('[GameScene] Scene launching!');
    }
    
    onSceneReady() {
        console.log('[GameScene] Scene ready!');
    }

    start() {
        console.log('[GameScene] start() called!');
        
        setTimeout(() => {
            console.log('[GameScene] Creating map and players...');
            this.createMap();
            this.createPlayers();
            this.setupInput();
            console.log('[GameScene] Initialization complete!');
        }, 100);
    }

    createMap() {
        console.log('[GameScene] Creating map...');
        
        this.createObstacle(400, 0, 800, 20, 'top');
        this.createObstacle(400, 600, 800, 20, 'bottom');
        this.createObstacle(0, 300, 20, 600, 'left');
        this.createObstacle(800, 300, 20, 600, 'right');

        for (let i = 0; i < 10; i++) {
            const x = 50 + Math.random() * 700;
            const y = 50 + Math.random() * 500;
            if (Math.abs(x - 100) > 80 || Math.abs(y - 100) > 80) {
                this.createObstacle(x, y, 40, 40, 'obstacle' + i);
            }
        }
        
        console.log('[GameScene] Map created, obstacles:', this.obstacles.length);
    }

    createObstacle(x: number, y: number, width: number, height: number, name: string) {
        const obstacle = new Node(name);
        obstacle.setPosition(x, y);
        
        const sprite = obstacle.addComponent(Sprite);
        sprite.color = new Color(139, 119, 101, 255);
        
        const transform = obstacle.getComponent(UITransform);
        transform.setContentSize(new Size(width, height);
        
        this.node.addChild(obstacle);
        this.obstacles.push(obstacle);
    }

    createPlayers() {
        console.log('[GameScene] Creating players...');
        
        const colors = [
            new Color(255, 0, 0, 255),
            new Color(0, 255, 0, 255),
            new Color(0, 0, 255, 255),
            new Color(255, 255, 0, 255)
        ];

        const startPositions = [
            new Vec3(80, 80, 0),
            new Vec3(720, 80, 0),
            new Vec3(80, 520, 0),
            new Vec3(720, 520, 0)
        ];

        for (let i = 0; i < 4; i++) {
            const player = new Node('player' + i);
            player.setPosition(startPositions[i]);
            
            const sprite = player.addComponent(Sprite);
            sprite.color = colors[i];
            
            const transform = player.getComponent(UITransform);
            transform.setContentSize(new Size(32, 32));
            
            const controller = player.addComponent(PlayerController);
            controller.playerIndex = i;
            
            this.node.addChild(player);
            this.players.push(player);
            
            console.log('[GameScene] Player', i, 'created');
        }
    }

    setupInput() {
        console.log('[GameScene] Setting up input...');
        
        input.on(Input.EventType.KEY_DOWN, (event: any) => {
            this.keys.add(event.keyCode);
        });
        
        input.on(Input.EventType.KEY_UP, (event: any) => {
            this.keys.delete(event.keyCode);
        });
    }

    update(deltaTime: number) {
        for (const player of this.players) {
            const controller = player.getComponent(PlayerController);
            if (controller) {
                controller.move(this.keys, this.obstacles, deltaTime);
            }
        }
    }
}
