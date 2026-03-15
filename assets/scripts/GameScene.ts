// 游戏主场景
import { _decorator, Component, Vec3, Input, input, KeyCode, Sprite, Node, UITransform, Size, Color, resources, SpriteFrame, assetManager } from 'cc';
import { PlayerController } from './PlayerController';

const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends Component {
    // 玩家数组
    private players: Node[] = [];
    // 障碍物数组
    private obstacles: Node[] = [];
    // 移动速度
    private moveSpeed = 200;
    
    // 临时存储按键状态
    private keys: Set<number> = new Set();

    start() {
        console.log('[GameScene] start called!');
        this.createMap();
        this.createPlayers();
        this.setupInput();
        console.log('[GameScene] Initialization complete!');
    }

    // 创建地图和障碍物
    createMap() {
        console.log('[GameScene] Creating map...');
        
        // 创建边界障碍物
        this.createObstacle(400, 0, 800, 20); // 上
        this.createObstacle(400, 600, 800, 20); // 下
        this.createObstacle(0, 300, 20, 600); // 左
        this.createObstacle(800, 300, 20, 600); // 右

        // 创建随机障碍物
        for (let i = 0; i < 15; i++) {
            const x = 50 + Math.random() * 700;
            const y = 50 + Math.random() * 500;
            // 避免与玩家出生点冲突
            if (Math.abs(x - 100) > 80 || Math.abs(y - 100) > 80) {
                this.createObstacle(x, y, 40, 40);
            }
        }
        
        console.log('[GameScene] Map created, obstacles:', this.obstacles.length);
    }

    // 创建单个障碍物
    createObstacle(x: number, y: number, width: number, height: number) {
        const obstacle = new Node('obstacle');
        obstacle.setPosition(x, y);
        
        const sprite = obstacle.addComponent(Sprite);
        sprite.color = new Color(139, 119, 101, 255); // 棕色
        
        // 创建一个简单的白色精灵作为默认精灵
        this.createDefaultSprite(sprite);
        
        const transform = obstacle.getComponent(UITransform);
        transform.setContentSize(new Size(width, height));
        
        this.node.addChild(obstacle);
        this.obstacles.push(obstacle);
    }

    // 创建默认精灵
    private createDefaultSprite(spriteComponent: Sprite) {
        // 使用引擎内置的默认精灵
        try {
            // 尝试从资源加载默认精灵
            resources.load('internal/default-ui/sprite', SpriteFrame, (err, frame) => {
                if (!err && frame) {
                    spriteComponent.spriteFrame = frame;
                }
            });
        } catch (e) {
            console.log('[GameScene] Using color only, no sprite frame');
        }
    }

    // 创建4个玩家
    createPlayers() {
        console.log('[GameScene] Creating players...');
        
        const colors = [
            new Color(255, 0, 0, 255),    // 红
            new Color(0, 255, 0, 255),    // 绿
            new Color(0, 0, 255, 255),    // 蓝
            new Color(255, 255, 0, 255)   // 黄
        ];

        const startPositions = [
            new Vec3(80, 80, 0),      // 左下
            new Vec3(720, 80, 0),     // 右下
            new Vec3(80, 520, 0),     // 左上
            new Vec3(720, 520, 0)     // 右上
        ];

        for (let i = 0; i < 4; i++) {
            const player = new Node(`player${i}`);
            player.setPosition(startPositions[i]);
            
            const sprite = player.addComponent(Sprite);
            sprite.color = colors[i];
            
            // 创建默认精灵
            this.createDefaultSprite(sprite);
            
            const transform = player.getComponent(UITransform);
            transform.setContentSize(new Size(32, 32));
            
            // 添加玩家控制组件
            const controller = player.addComponent(PlayerController);
            controller.playerIndex = i;
            
            this.node.addChild(player);
            this.players.push(player);
            
            console.log(`[GameScene] Player ${i} created at position:`, startPositions[i]);
        }
        
        console.log('[GameScene] Players created:', this.players.length);
    }

    // 设置输入
    setupInput() {
        console.log('[GameScene] Setting up input...');
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: any) {
        this.keys.add(event.keyCode);
    }

    onKeyUp(event: any) {
        this.keys.delete(event.keyCode);
    }

    update(deltaTime: number) {
        // 更新每个玩家
        for (const player of this.players) {
            const controller = player.getComponent(PlayerController);
            if (controller) {
                controller.move(this.keys, this.obstacles, deltaTime);
            }
        }
    }
}
