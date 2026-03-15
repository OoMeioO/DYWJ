// 游戏主场景
import { _decorator, Component, Vec3, Input, input, KeyCode, Sprite, SpriteFrame, resources, TiledMap, TiledTile, Node, tween, UITransform, Size, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends Component {
    // 玩家数组
    private players: Node[] = [];
    // 障碍物数组
    private obstacles: Node[] = [];
    // 地图尺寸
    private mapWidth = 800;
    private mapHeight = 600;
    // 玩家大小
    private playerSize = 32;
    // 移动速度
    private moveSpeed = 200;

    start() {
        this.createMap();
        this.createPlayers();
        this.setupInput();
    }

    // 创建地图和障碍物
    createMap() {
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
    }

    // 创建单个障碍物
    createObstacle(x: number, y: number, width: number, height: number) {
        const obstacle = new Node('obstacle');
        obstacle.setPosition(x, y);
        
        const sprite = obstacle.addComponent(Sprite);
        sprite.color = new Color(139, 119, 101, 255); // 棕色
        
        const transform = obstacle.getComponent(UITransform);
        transform.setContentSize(new Size(width, height));
        
        this.node.addChild(obstacle);
        this.obstacles.push(obstacle);
    }

    // 创建4个玩家
    createPlayers() {
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
            
            const transform = player.getComponent(UITransform);
            transform.setContentSize(new Size(this.playerSize, this.playerSize));
            
            // 添加玩家控制组件
            player.addComponent(PlayerController);
            player.getComponent(PlayerController)!.playerIndex = i;
            
            this.node.addChild(player);
            this.players.push(player);
        }
    }

    // 设置输入
    setupInput() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    private keys: Set<number> = new Set();

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

// 玩家控制器组件
@ccclass('PlayerController')
export class PlayerController extends Component {
    playerIndex = 0;
    private speed = 200;
    private size = 32;

    move(keys: Set<number>, obstacles: Node[], deltaTime: number) {
        let dx = 0;
        let dy = 0;

        // WASD 控制 (玩家1)
        if (this.playerIndex === 0) {
            if (keys.has(KeyCode.KEY_A)) dx = -1;
            if (keys.has(KeyCode.KEY_D)) dx = 1;
            if (keys.has(KeyCode.KEY_W)) dy = 1;
            if (keys.has(KeyCode.KEY_S)) dy = -1;
        }
        // 方向键控制 (玩家2)
        else if (this.playerIndex === 1) {
            if (keys.has(KeyCode.ARROW_LEFT)) dx = -1;
            if (keys.has(KeyCode.ARROW_RIGHT)) dx = 1;
            if (keys.has(KeyCode.ARROW_UP)) dy = 1;
            if (keys.has(KeyCode.ARROW_DOWN)) dy = -1;
        }
        // 玩家3: IJKL
        else if (this.playerIndex === 2) {
            if (keys.has(KeyCode.KEY_J)) dx = -1;
            if (keys.has(KeyCode.KEY_L)) dx = 1;
            if (keys.has(KeyCode.KEY_I)) dy = 1;
            if (keys.has(KeyCode.KEY_K)) dy = -1;
        }
        // 玩家4: 8456 (数字键盘)
        else if (this.playerIndex === 3) {
            if (keys.has(KeyCode.NUM_4)) dx = -1;
            if (keys.has(KeyCode.NUM_6)) dx = 1;
            if (keys.has(KeyCode.NUM_8)) dy = 1;
            if (keys.has(KeyCode.NUM_5)) dy = -1;
        }

        if (dx !== 0 || dy !== 0) {
            // 归一化
            const length = Math.sqrt(dx * dx + dy * dy);
            dx = (dx / length) * this.speed * deltaTime;
            dy = (dy / length) * this.speed * deltaTime;

            const newPos = this.node.position.clone();
            newPos.x += dx;
            newPos.y += dy;

            // 边界检查
            newPos.x = Math.max(16, Math.min(784, newPos.x));
            newPos.y = Math.max(16, Math.min(584, newPos.y));

            // 简单的碰撞检测
            let canMove = true;
            for (const obs of obstacles) {
                const obsPos = obs.position;
                const obsSize = obs.getComponent(UITransform)!.contentSize;
                
                if (Math.abs(newPos.x - obsPos.x) < (this.size + obsSize.width) / 2 &&
                    Math.abs(newPos.y - obsPos.y) < (this.size + obsSize.height) / 2) {
                    canMove = false;
                    break;
                }
            }

            if (canMove) {
                this.node.setPosition(newPos);
            }
        }
    }
}
