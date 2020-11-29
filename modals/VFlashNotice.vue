<template>
  <transition name="flash">
    <div class="v-flash-notice" v-if="text" :class="type">
      {{ text }}
    </div>
  </transition>
</template>

<script lang="ts">
// HOW TO USE:
// this.$root.$emit('v-flash-notice', 'There has been an error')
// this.$root.$emit('v-flash-notice', {error: 'There has been an error'})
// this.$root.$emit('v-flash-notice', {text: 'There has been an error', type: 'error'})

import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class VFlashNotice extends Vue {
  text = "";
  type = "";

  created() {
    this.$root.$on("v-flash-notice", (t: any) => {
      if (t && t.error) {
        this.text = t.error;
        this.type = "error";
      } else if (t && t.type) {
        this.text = t.text;
        this.type = t.type;
      } else {
        this.text = t;
      }

      setTimeout(() => {
        this.text = "";
      }, 3000);
    });
  }
}
</script>

<style lang="stylus" scoped>
@import '../../styles/global/theme.styl'

.v-flash-notice
  position absolute
  z-index 9998
  top 10px
  left 0
  right 0
  width 95%
  max-width 560px
  margin auto
  padding 10px
  border-radius 10px
  height auto
  color #fff
  background-color rgba($color-primary, .9)
  transition opacity .3s ease

  &.error
    background-color rgba($color-error, .9)

/*
 * animations classes for <transition name="modal"> or transition="modal"
 */
.flash-enter-active, .flash-leave-active
  transform translateY(0px)
  transition 1s

.flash-enter, .flash-leave-to /* .fade-leave-active below version 2.1.8 */
  opacity 0
  transform translateY(-200px)
</style>
