// 测试组件2 - 玩家
import { _decorator, Component, log } from 'cc';

const { ccclass } = _decorator;

@ccclass('TestPlayer')
export class TestPlayer extends Component {
    start() {
        log('[TestPlayer] start() called!');
        console.log('[TestPlayer] Player component started!');
    }
}
