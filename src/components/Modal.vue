<template>
  <div>
    <button @click="$emit('close-modal')"></button>
    <slot></slot>
  </div>
</template>

