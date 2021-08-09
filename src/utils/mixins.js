
export default {
  mounted() {
    const title = this.title || this.$options.title
    if(title) {
      document.title = title
    }
  }
}