<template>
  <form name="email-form" @submit.prevent="onSubmit">
    <input type="email" v-model="email">
    <input type="radio" name="enterCompetition" v-model="enterCompetition" value="yes">
    <input type="radio" name="enterCompetition" v-model="enterCompetition" value="no">
    <button type="submit">Submit</button>
  </form>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      email: '',
      enterCompetition: 'yes'
    }
  },
  methods: {
    onSubmit() {
      axios.post('http://demo7437963.mockable.io/validate', { 
        email: this.email,
        enterCompetition: this.enterCompetition  === 'yes'
      })
      this.$emit('form-submitted')
    }
  }
}
</script>
