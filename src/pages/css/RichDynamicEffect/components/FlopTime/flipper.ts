interface FlipperConfig {
  node: any;
  frontNum: number;
  backNum: number;
  frontText: string;
  backText: string;
  duration: number;
}

class Flipper {
  config: FlipperConfig;
  nodeClass: {
    flip: string;
    front: string;
    back: string;
  };
  frontNode: any;
  backNode: any;
  isFlipping: boolean;
  allNumberClass: string[];
  constructor(config: Partial<FlipperConfig>) {
    this.config = {
      // 时钟模块的节点
      node: null,
      frontNum: 0,
      backNum: 1,
      // 初始前牌文字
      frontText: "number0",
      // 初始后牌文字
      backText: "number1",
      // 翻转动画时间（毫秒，与翻转动画CSS 设置的animation-duration时间要一致）
      duration: 600,
    };
    Object.assign(this.config, config);
    this.nodeClass = {
      flip: "flip",
      front: "digital front",
      back: "digital back",
    };
    this.frontNode = this.config.node.children[0];
    this.backNode = this.config.node.children[1];
    this.isFlipping = false;
    this.allNumberClass = [];
    this._init();
  }

  // 设置初始牌面字符
  _init() {
    for (let i = 0; i < 10; i++) {
      this.allNumberClass.push(`number${i}`);
    }
    const { frontNum, frontText, backNum, backText } = this.config;
    this._setFront(frontNum, frontText);
    this._setBack(backNum, backText);
  }

  // 设置前牌文字
  _setFront(num: number, className: string) {
    this.allNumberClass.forEach((numberClass: string) => {
      if (
        Array.prototype.includes.call(this.frontNode.classList, numberClass)
      ) {
        this.frontNode.classList.remove(numberClass);
      }
    });
    this.config.frontNum = num;
    this.config.frontText = `number${num}`;
    this.frontNode.classList.add(className);
  }

  // 设置后牌文字
  _setBack(num: number, className: string) {
    this.allNumberClass.forEach((numberClass: string) => {
      if (Array.prototype.includes.call(this.backNode.classList, numberClass)) {
        this.backNode.classList.remove(numberClass);
      }
    });
    this.config.backNum = num;
    this.config.backText = `number${num}`;
    this.backNode.classList.add(className);
  }

  _flip(
    type: "down" | "up",
    frontNum: number,
    front: string,
    backNum: number,
    back: string
  ) {
    // 如果处于翻转中，则不执行
    if (this.isFlipping) {
      return false;
    }
    // 设置翻转状态为true
    this.isFlipping = true;
    // 设置前牌文字
    this._setFront(frontNum, front);
    // 设置后牌文字
    this._setBack(backNum, back);
    // 根据传递过来的type设置翻转方向
    let flipClass = "down";
    if (type === "up") {
      flipClass = "up";
    }
    // 添加翻转方向和执行动画的class，执行翻转动画
    this.config.node.classList.add(flipClass, "go");
    // 根据设置的动画时间，在动画结束后，还原class并更新前牌文字
    setTimeout(() => {
      // 还原class
      this.config.node.classList.remove("go");
      // 设置翻转状态为false
      this.isFlipping = false;
      // 将前牌文字设置为当前新的数字，后牌因为被前牌挡住了，就不用设置了。
      this._setFront(backNum, back);
      const newBackNum = backNum >= 9 ? 0 : backNum + 1;
      this._setBack(newBackNum, `number${newBackNum}`);
    }, this.config.duration);
  }

  // 下翻牌
  flipDown(frontNum: number, front: string, backNum: number, back: string) {
    this._flip("down", frontNum, front, backNum, back);
  }

  // 上翻牌
  //   flipUp(front: string, back: string) {
  //     this._flip("up", front, back);
  //   }
}

export default Flipper;
