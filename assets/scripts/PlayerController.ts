// 修仙游戏 - 玩家移动组件
import { _decorator, Component, input, Input, KeyCode, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property({ type: Number, displayName: '移动速度' })
    moveSpeed: number = 200;

    private _keys: Set<number> = new Set();
    private _animState: string = 'idle';

    onLoad() {
        // 监听键盘输入
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        console.log('[PlayerController] 玩家组件已加载');
    }

    onKeyDown(event: any) {
        this._keys.add(event.keyCode);
    }

    onKeyUp(event: any) {
        this._keys.delete(event.keyCode);
    }

    update(deltaTime: number) {
        let dx = 0;
        let dy = 0;

        // WASD 移动
        if (this._keys.has(KeyCode.KEY_W)) dy = 1;
        if (this._keys.has(KeyCode.KEY_S)) dy = -1;
        if (this._keys.has(KeyCode.KEY_A)) dx = -1;
        if (this._keys.has(KeyCode.KEY_D)) dx = 1;

        if (dx !== 0 || dy !== 0) {
            // 归一化移动向量
            const len = Math.sqrt(dx * dx + dy * dy);
            dx = (dx / len) * this.moveSpeed * deltaTime;
            dy = (dy / len) * this.moveSpeed * deltaTime;

            // 更新位置
            const pos = this.node.position;
            this.node.setPosition(pos.x + dx, pos.y + dy, pos.z);
        }
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
}
