<template>
  <div>
    <Modal
      v-if="status"
      @close-modal="onClose"
    ></Modal>
  </div>
</template>

<script>
import Modal from '../components/Modal.vue'

export default {
  components: {
    Modal
  },
  data() {
    return {
      status: true
    }
  },
  methods: {
    onClose() {
      this.status = false
    }
  }
}
</script>

<style>

</style>