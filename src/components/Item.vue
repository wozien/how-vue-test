<template>
  <li>
    <a :href="item.url">{{ item.title }}</a>
    {{ item.url }}
  </li>
</template>

<script>
export default {
  props: ['item']
}
</script>

