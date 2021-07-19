<template>
  <div class="item-list">
    <Item v-for="item in items" :key="item.id" :item="item"/>
  </div>
</template>

<script>
import Item from '../components/Item.vue'

export default {
  components: {
    Item
  },
  data() {
    return {
      items: window.items
    }
  }
}
</script>

<style lang="less" scoped></style>