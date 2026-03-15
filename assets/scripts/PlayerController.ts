// 玩家控制器组件
import { _decorator, Component, KeyCode, Node, UITransform } from 'cc';
const { ccclass } = _decorator;

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
