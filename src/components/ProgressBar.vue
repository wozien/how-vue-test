<template>
  <div :class="[hidden && 'hidden']" :style="{width: `${percent}%`}"></div>
</template>

<script>
export default {
  data() {
    return {
      hidden: true,
      percent: 0
    }
  },

  methods: {
    start() {
      this.percent = 0
      this.hidden = false
      this.timer = setInterval(() => {
        this.percent++
      }, 100)
    },
    finish() {
      this.percent = 100
      this.hidden = true
      clearInterval(this.timer)
    }
  }
}
</script>

<style lang="less">
.hidden {
  display: none;
}
</style>