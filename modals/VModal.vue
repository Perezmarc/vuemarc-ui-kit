<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-close" @click="$emit('close')"></div>

          <div class="modal-header">
            <slot name="header">
              default header
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              default body
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer"> </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class VModal extends Vue {}
</script>

<style lang="stylus" scoped>
.modal-mask
  position fixed
  overflow auto
  z-index 9998
  top 0
  left 0
  width 100%
  height 100%
  background-color rgba(0, 0, 0, .5)

  @media (min-width: 768px)
    display flex
    justify-content center
    align-items center
    transition opacity .3s ease

.modal-wrapper
  display flex
  flex 1 1 auto
  justify-content center
  align-items center

  @media (min-width: 768px)
    padding 40px

  .modal-container
    position relative
    max-width 800px
    flex 0 1 400px
    margin 0px auto
    padding 40px
    background-color #fff
    border-radius $border-radius-standard
    box-shadow $shadow-1
    transition .3s $transition-standard
    display flex
    flex-direction column

    .modal-close
      position absolute
      right 20px
      top 20px
      height 20px
      width 20px
      cursor pointer
      transition .4s $transition-standard

      &:hover
        transform scale(1.1)

      &:before, &:after
        content ''
        position absolute
        top 10px
        right 0
        display block
        height 2px
        width 100%
        background $color-grey--darken-2
        border-radius 3px
        transition .4s $transition-standard

      &:before
        transform rotate(-45deg) translate3d(0px, 0px, 0)

      &:after
        transform rotate(45deg) translate3d(0px, 0px, 0)

    .modal-header
      flex 0 0 auto

      h3, h2
        margin-top 0
        color $color-grey--darken-3

    .modal-body
      margin 20px 0

    .modal-default-button
      float right

/*
 * animations classes for <transition name="modal"> or transition="modal"
 */
.modal-enter
  opacity 0

.modal-leave-active
  opacity 0

.modal-enter .modal-container, .modal-leave-active .modal-container
  -webkit-transform scale(1.1)
  transform scale(1.1)
</style>
