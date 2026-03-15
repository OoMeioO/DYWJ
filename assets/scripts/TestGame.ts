// 简单的测试组件
import { _decorator, Component, log } from 'cc';

const { ccclass } = _decorator;

@ccclass('TestGame')
export class TestGame extends Component {
    start() {
        log('[TestGame] start() called!');
        console.log('[TestGame] Game started!');
    }

    update(deltaTime: number) {
        // 简单的旋转测试
        this.node.angle += 36 * deltaTime;
    }
}
