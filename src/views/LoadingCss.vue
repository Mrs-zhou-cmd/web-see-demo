<template>
  <div class="container">
    <div class="loading">
      <div v-for="dot in dots" :key="dot" class="dot"></div>
    </div>
    <el-button @click="setPromise">执行</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dots: Array.from({ length: 36 }, (_, i) => i + 1),
    };
  },
  methods: {
    setPromise() {
      Promise.resolve()
        .then(() => {
          console.log(0);
          return Promise.resolve(4);
        })
        .then((res) => {
          console.log(res);
        });
      Promise.resolve()
        .then(() => {
          console.log(1);
        })
        .then(() => {
          console.log(2);
        })
        .then(() => {
          console.log(3);
        })
        .then(() => {
          console.log(5);
        })
        .then(() => {
          console.log(6);
        });
    },
  },
};
</script>
<style scoped lang='less'>
.container {
  background-color: #66c7f4;
  height: 300px;
}
@ballSize: 10px;
@containerSize: 150px;
@n: 36; //小球个数
@pdeg:360deg /@n; //小球每次旋转的角度
@ani-druation: 2000ms;

.loading {
  height: @containerSize;
  width: @containerSize;
  position: relative;
  border-radius: 50%;
  border: 1px solid #fff;
  margin: 50px auto;
  .dot {
    position: absolute;
    width: @ballSize;
    height: @ballSize;
    // background-color: red;
    border-radius: 50%;
    left: 50%;
    top: 50%;
    margin-left: calc(-@ballSize / 2);
    margin-top: calc(-@ballSize / 2;);
    // 所有小球的3d效果
    perspective: 70px;
    transform-style: preserve-3d;
    &::before,
    &::after {
      content: "";
      width: @ballSize;
      height: @ballSize;
      border-radius: 50%;
      position: absolute;
    }
    &::before {
      background-color: #fff;
      top: 100%;
      animation: moveWhite @ani-druation infinite;
    }
    &::after {
      background-color: #000;
      top: -100%;
      animation: moveBlack @ani-druation infinite;
    }
  }
}
// 使小球动起来
@keyframes moveWhite {
  0% {
    animation-timing-function: ease-in;
  }
  25% {
    //y轴负值向下
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
@keyframes moveBlack {
  0% {
    animation-timing-function: ease-in;
  }
  25% {
    // y向下100% z正值向外 缩小效果
    transform: translate3d(0, 100%, @ballSize);
    animation-timing-function: ease-out;
  }
  50% {
    //y向下200% z不动
    transform: translate3d(0, 200%, 0);
    animation-timing-function: ease-in;
  }
  75% {
    //在200%的基础上向上100%
    transform: translate3d(0, 100%, -@ballSize);
    animation-timing-function: ease-out;
  }
}
// 让36个小球均匀的分布在整个圆面上
// 使用loop()递归
.loop(@i) when(@i<=@n) {
  .dot:nth-child(@{i}) {
    transform: rotate(calc(@i* @pdeg)) translateY(calc(-@containerSize / 2));
    &::before,
    &::after {
      // 如何让小球穿插起来 延迟效果
      animation-delay: calc(-@ani-druation / @n * 6 * @i);
    }
  }
  .loop(@i+1);
}
.loop(1);
</style>