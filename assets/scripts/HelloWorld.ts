// 最小测试 - 单文件
import { _decorator, Component, log } from 'cc';

const { ccclass } = _decorator;

@ccclass('HelloWorld')
export class HelloWorld extends Component {
    start() {
        log('HelloWorld start!');
        console.log('HelloWorld start!');
    }
}
