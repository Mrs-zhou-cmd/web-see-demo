<template>
  <div class="container">
    <div class="loading">
      <div class="dot" v-for="(dot, index) in dots" :key="index">
        <!-- 12312 -->
        <!-- ::before -->
        <!-- ::after -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // dots1: []
    };
  },
  computed: {
    dots() {
      return Array.from({ length: 36 }, (_, i) => i + 1);
    },
  },
};
</script>
<style scoped lang="less">
.container {
  background-color: #66c7f4;
  height: 300px;
}
@ballSize: 10px;
// //装小球容器尺寸
@containerSize: 150px;
@n: 36;
// 每次旋转的角度
@pdeg:360deg /@n;
@ani-druation: 2000ms;
.loading {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  height: @containerSize;
  width: @containerSize;
  border-radius: 50%;
  // outline: 1px solid #fff;
  margin: 50px auto;
  position: relative;
  .dot {
    position: absolute;
    left: 50%;
    top: 50%;
    width: @ballSize;
    height: @ballSize;
    margin-left: calc(-@ballSize / 2);
    margin-top: calc(-@ballSize / 2);
    // background-color: red;
    // 3d效果
    perspective: 70px;
    transform-style: preserve-3d;
    &::before,
    &::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    &::before {
      background-color: #000;
      top: -100%;
      animation: moveBlack @ani-druation infinite;
    }
    &::after {
      top: 100%;
      background-color: #fff;
      animation: moveWhite @ani-druation infinite;
    }
  }
}
@keyframes moveBlack {
  0% {
    animation-timing-function: ease-in;
  }
  25% {
    // 在y轴向上移动了100% 在z轴向屏幕外移动了@ballSize(缩小的效果)
    transform: translate3d(0, 100%, @ballSize);
    animation-timing-function: ease-out;
  }
  50% {
    //
    transform: translate3d(0, 200%, 0);
    animation-timing-function: ease-in;
  }
  75% {
    transform: translate3d(0, 100%, -@ballSize);
    animation-timing-function: ease-out;
  }
}
@keyframes moveWhite {
  0% {
    animation-timing-function: ease-in;
  }
  25% {
    // 在三维空间中移动元素,通过偏移量来改变元素的位置
    // x轴表示元素水平移动,正值向右移动,负值向左移动
    // y轴表示元素垂直移动,正值向下移动,负值向上移动
    // z轴表示元素垂直于屏幕的移动,正值向屏幕外移动,负值向屏幕内移动
    transform: translate3d(0, -100%, -@ballSize);
    animation-timing-function: ease-out;
  }
  50% {
    transform: translate3d(0, -200%, 0);
    animation-timing-function: ease-in;
  }
  75% {
    transform: translate3d(0, -100%, @ballSize);
    animation-timing-function: ease-out;
  }
}
.loop(@i) when(@i <= @n) {
  .dot:nth-child(@{i}) {
    transform: rotate(calc(@pdeg * @i)) translateY(calc(-@containerSize / 2));

    &::before,
    &::after {
      animation-delay: calc(-@ani-druation / @n * 6 * @i);
    } 
  }
  // 球的交替效果 用动画延迟实现
  .loop(@i + 1);
}
// 递归调用 从1开始 直到i<=n(36) 结束递归
.loop(1);
</style>