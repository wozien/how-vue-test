<template>
  <form @submit="onSubmit">
    <button></button>
  </form>
</template>

<script>
export default {
  methods: {
    onSubmit() {
      this.$emit('form-submitted')
    }
  }
}
</script>
