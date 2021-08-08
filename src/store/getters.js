
export default {
  displayItems(state) {
    // todo 根据路由参数计算当前列表
    return state.items.slice(0, 20)
  },
  maxPage(state) {
    return Math.ceil(state.items.length / 20)
  }
}