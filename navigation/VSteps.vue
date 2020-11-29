<template>
  <div class="v-steps" :class="{ loading: loading }" :disabled="loading || disabled">
    <nav v-if="showNav && activeTabIndex >= showNavAfterStep">
      <!-- <span
        @click="prevTab"
        @keyup.enter="prevTab"
        v-if="displayPrevButton"
        role="button"
        tabindex="0"
      >
        <slot name="prev">
          <i class="budicon-chevron-left"></i>
        </slot>
      </span> -->
      <div class="v-steps__nav">
        <div v-if="tabStyle === 'bar'" class="v-steps__progress">
          <div class="v-steps__progress-bar-rail" :style="progressBarStyle"></div>
          <div class="v-steps__progress-bar" :style="progressBarStyle"></div>
        </div>
        <div
          v-else
          v-for="(tab, index) in tabs"
          :key="tab.name"
          class="v-steps__v-step-nav"
          :aria-disabled="tab.active"
          :aria-selected="tab.active"
          :class="{ checked: tab.checked }"
          :style="[tab.checked ? 'checked' : {}, tab.validationError ? 'error' : {}]"
        >
          <div v-if="showNumbers" class="v-step__number">
            <a @click="navigateToTab(index)">{{ index + 1 }}</a>
          </div>
          <div v-if="!showOnlyNumbers">
            <h4 v-if="tab.active">{{ tab.header }}</h4>
            <!-- <h5 v-else> -->
            <a v-else @click="navigateToTab(index)">{{ tab.header }}</a>
            <!-- </h5> -->
          </div>
        </div>
      </div>
    </nav>
    <div class="v-steps__content">
      <slot name="persistantContent" />
      <div class="v-steps__step">
        <slot></slot>
        <!-- <h3>{{ activeStep.header }}</h3> -->
      </div>
    </div>
    <div class="v-steps__footer" v-if="showNextButton">
      <slot name="beforeButton"></slot>
      <template v-if="Array.isArray(nextButtonText)">
        <span @click="nextTab" @keyup.enter="nextTab" role="button" tabindex="0">
          <slot name="next">
            <v-button large class="full-width" :loading="loading">{{
              nextButtonText[activeTabIndex]
            }}</v-button>
          </slot>
        </span>
      </template>

      <template v-else>
        <span
          @click="nextTab"
          @keyup.enter="nextTab"
          role="button"
          tabindex="0"
          v-if="isLastStep"
        >
          <slot name="finnish">
            <v-button large class="full-width" :loading="loading">{{
              finishButtonText
            }}</v-button>
          </slot>
        </span>
        <span @click="nextTab" @keyup.enter="nextTab" role="button" tabindex="0" v-else>
          <slot name="next">
            <v-button large class="full-width" :loading="loading">{{
              nextButtonText
            }}</v-button>
          </slot>
        </span>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Provide } from "vue-property-decorator";
import { isPromise } from "./helpers";

export interface VStepInfo {
  header: string;
  name: string;
}

@Component({})
export default class VSteps extends Vue {
  // @Prop({ type: Boolean })
  loading = false;

  @Prop({ type: Boolean })
  disabled?: boolean;

  @Prop({ type: Boolean, default: true })
  showNumbers?: boolean;

  @Prop({ type: Boolean, default: false })
  showOnlyNumbers?: boolean;

  @Prop({ type: Boolean, default: true })
  showNav?: boolean;

  @Prop({ type: Number, default: 0 })
  showNavAfterStep?: number;

  @Prop({ type: Number, default: 0 })
  nonCountableSteps!: number;

  @Prop({ type: Boolean, default: true })
  showPrevButton?: boolean;

  @Prop({ type: Boolean, default: false })
  showNextButton?: boolean;

  @Prop({ default: "#2963ff" })
  color?: string;

  @Prop({ default: "" })
  tabStyle?: string;

  @Prop({ default: "Next" })
  nextButtonText?: string | Array<string>;

  @Prop({ default: "" })
  transition?: string;

  @Prop({ default: "Back" })
  backButtonText?: string;

  @Prop({ default: "Finish" })
  finishButtonText?: string;

  @Prop({ default: 0 })
  startIndexProp?: number;

  activeTabIndex = 0;
  currentPercentage = 0;
  maxStep = 0;
  tabs: Array<any> = [];
  validateOnBack = false;

  startIndex: number = this.startIndexProp || 0;

  get tabCount() {
    return this.tabs.length;
  }

  get tabCountPercentage() {
    return this.tabs.length - this.nonCountableSteps;
  }

  get isLastStep() {
    return this.activeTabIndex === this.tabCount - 1;
  }
  get displayPrevButton() {
    return this.showPrevButton && this.activeTabIndex !== 0;
  }
  get stepPercentage() {
    return (1 / (this.tabCountPercentage * 2)) * 100;
  }
  get progressBarStyle() {
    return {
      backgroundColor: this.color,
      width: `${this.progress}%`,
      color: this.color
    };
  }
  get fillButtonStyle() {
    return {
      backgroundColor: this.color,
      borderColor: this.color,
      color: "white"
    };
  }

  get progress() {
    let percentage = 0;
    if (this.activeTabIndex > 0) {
      const stepsToAdd = 1;
      const stepMultiplier = 2;
      percentage =
        this.stepPercentage * (this.activeTabIndex * stepMultiplier + stepsToAdd);
    } else {
      percentage = this.stepPercentage;
    }
    return percentage;
  }

  initializeTabs() {
    if (this.tabs.length > 0 && this.startIndex === 0) {
      this.activateTab(this.activeTabIndex);
    }
    if (this.startIndex < this.tabs.length) {
      this.activateTabAndCheckStep(this.startIndex);
    } else {
      // window.console.warn(
      //   `Prop startIndex set to ${this.startIndex} is greater than the number of tabs -
      //   ${this.tabs.length}. Make sure that the starting index
      //   is less than the number of tabs registered`
      // );
    }
  }

  emitTabChange(prevIndex: number, nextIndex: number) {
    this.$emit("on-change", prevIndex, nextIndex);
    this.$emit("update:startIndex", nextIndex);
  }
  @Provide()
  addTab(item: any) {
    const index = (this.$slots.default && this.$slots.default.indexOf(item.$vnode)) || 3;
    item.tabId = `${item.title.replace(/ /g, "")}${index}`;
    this.tabs.splice(index, 0, item);
    // if a step is added before the current one, go to it
    if (index < this.activeTabIndex + 1) {
      this.maxStep = index;
      this.changeTab(this.activeTabIndex + 1, index);
    }
  }

  @Provide()
  removeTab(item: any) {
    const tabs = this.tabs;
    const index = tabs.indexOf(item);
    if (index > -1) {
      // Go one step back if the current step is removed
      if (index === this.activeTabIndex) {
        this.maxStep = this.activeTabIndex - 1;
        this.changeTab(this.activeTabIndex, this.activeTabIndex - 1);
      }
      if (index < this.activeTabIndex) {
        this.maxStep = this.activeTabIndex - 1;
        this.activeTabIndex = this.activeTabIndex - 1;
        this.emitTabChange(this.activeTabIndex + 1, this.activeTabIndex);
      }
      tabs.splice(index, 1);
    }
  }

  changeTab(oldIndex: number, newIndex: number, emitChangeEvent = true) {
    const oldTab = this.tabs[oldIndex];
    const newTab = this.tabs[newIndex];
    if (oldTab) {
      oldTab.active = false;
    }
    if (newTab) {
      newTab.active = true;
    }
    if (emitChangeEvent && this.activeTabIndex !== newIndex) {
      this.emitTabChange(oldIndex, newIndex);
    }
    this.activeTabIndex = newIndex;
    this.activateTabAndCheckStep(this.activeTabIndex);
    return true;
  }

  deactivateTabs() {
    this.tabs.forEach(tab => {
      tab.active = false;
    });
  }

  activateTab(index: number) {
    this.deactivateTabs();
    const tab = this.tabs[index];
    if (tab) {
      tab.active = true;
      tab.checked = true;
      this.tryChangeRoute(tab);
    }
  }

  activateTabAndCheckStep(index: number) {
    this.activateTab(index);
    if (index > this.maxStep) {
      this.maxStep = index;
    }
    this.activeTabIndex = index;
  }

  tryChangeRoute(tab: any) {
    if (this.$router.currentRoute.path === "/verify") {
      this.$router.replace(tab.route).catch(() => {
        return;
      });
    } else {
      if (this.$router && tab.route && tab.route !== this.$router.currentRoute.path) {
        this.$router.push(tab.route).catch(() => {
          return;
        });
      }
    }
  }

  @Watch("$route")
  onRouteChange(to: any, from: any) {
    if (to.path === from.path && to.path !== "/verify") return;
    for (let i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].route === to.path) {
        this.navigateToTab(i);
      }
    }
  }

  navigateToTab(index: number) {
    const validate = index > this.activeTabIndex;
    if (index <= this.maxStep) {
      const cb = () => {
        if (validate && index - this.activeTabIndex > 1) {
          // validate all steps recursively until destination index
          this.changeTab(this.activeTabIndex, this.activeTabIndex + 1);
          this.beforeTabChange(this.activeTabIndex, cb);
        } else {
          this.changeTab(this.activeTabIndex, index);
          this.afterTabChange(this.activeTabIndex);
        }
      };
      if (validate) {
        this.beforeTabChange(this.activeTabIndex, cb);
      } else {
        this.setValidationError(null);
        cb();
      }
    }
    return index <= this.maxStep;
  }

  navigateToLastTab() {
    this.changeTab(this.activeTabIndex, this.tabCount - 1);
    this.afterTabChange(this.activeTabIndex);
    this.$emit("on-complete");
  }

  nextTab() {
    const cb = () => {
      if (this.activeTabIndex < this.tabCount - 1) {
        this.changeTab(this.activeTabIndex, this.activeTabIndex + 1);
        this.afterTabChange(this.activeTabIndex);
      } else {
        this.$emit("on-complete");
      }
    };
    this.beforeTabChange(this.activeTabIndex, cb);
  }

  prevTab() {
    const cb = () => {
      if (this.activeTabIndex > 0) {
        this.setValidationError(null);
        this.changeTab(this.activeTabIndex, this.activeTabIndex - 1);
      }
    };
    if (this.validateOnBack) {
      this.beforeTabChange(this.activeTabIndex, cb);
    } else {
      cb();
    }
  }

  // focusNextTab() {
  //   let tabIndex = getFocusedTabIndex(this.tabs as any);
  //   if (tabIndex !== -1 && tabIndex < this.tabs.length - 1) {
  //     let tabToFocus = this.tabs[tabIndex + 1];
  //     if (tabToFocus.checked) {
  //       findElementAndFocus(tabToFocus.tabId);
  //     }
  //   }
  // }
  // focusPrevTab() {
  //   let tabIndex = getFocusedTabIndex(this.tabs as any);
  //   if (tabIndex !== -1 && tabIndex > 0) {
  //     let toFocusId = this.tabs[tabIndex - 1].tabId;
  //     findElementAndFocus(toFocusId);
  //   }
  // }
  setLoading(value: boolean) {
    this.loading = value;
    this.$emit("on-loading", value);
  }
  setValidationError(error: any) {
    this.tabs[this.activeTabIndex].validationError = error;
    this.$emit("on-error", error);
  }
  validateBeforeChange(promiseFn: any, callback: any) {
    this.setValidationError(null);
    if (isPromise(promiseFn)) {
      this.setLoading(true);
      promiseFn
        .then((res: any) => {
          this.setLoading(false);
          const validationResult = res === true;
          this.executeBeforeChange(validationResult, callback);
        })
        .catch((error: any) => {
          this.setLoading(false);
          this.setValidationError(error);
        });
    } else {
      const validationResult = promiseFn === true;
      this.executeBeforeChange(validationResult, callback);
    }
  }
  executeBeforeChange(validationResult: any, callback: any) {
    this.$emit("on-validate", validationResult, this.activeTabIndex);
    if (validationResult) {
      callback();
    } else {
      this.tabs[this.activeTabIndex].validationError = "error";
    }
  }
  beforeTabChange(index: number, callback: any) {
    if (this.loading) {
      return;
    }
    const oldTab = this.tabs[index];
    if (oldTab && oldTab.beforeChange !== undefined) {
      const tabChangeRes = oldTab.beforeChange();
      this.validateBeforeChange(tabChangeRes, callback);
    } else {
      callback();
    }
  }
  afterTabChange(index: number) {
    if (this.loading) {
      return;
    }
    const newTab = this.tabs[index];
    if (newTab && newTab.afterChange !== undefined) {
      newTab.afterChange();
    }
  }

  mounted() {
    this.initializeTabs();
  }
}
</script>
<style lang="stylus" scoped>
@import '../../../styles/global/theme.styl'

.v-steps
  display flex
  flex-direction column
  justify-content space-between
  flex 1 1 auto

.v-steps__nav
  display flex
  margin-top 20px
  margin-bottom 20px

  .v-steps__progress
    width 60%
    height 2px
    position relative
    margin auto

    .v-steps__progress-bar-rail
      position absolute
      top 0
      left 0
      width 100% !important
      height 100% !important
      opacity .2
      border-radius 5px

    .v-steps__progress-bar
      float left
      width 0%
      height 100%
      border-radius 5px
      transition width .6s ease-out
      box-shadow 0px 0px 1px 0px

  &>div.v-steps__v-step-nav
    display flex
    flex-direction column
    align-items center
    position relative

    &>div
      display flex
      margin-right 20px

    .v-step__number
      color $color-grey--lighten-3
      border 2px solid $color-grey--lighten-4
      background $color-grey--lighten-4
      border-radius 2em
      width 25px
      height 25px
      display flex
      align-items center
      justify-content center
      font-size .9rem
      margin-right 40px
      transition .3s

      a
        cursor default
        color inherit

        &:hover
          text-decoration none

    &.checked
      .v-step__number
        color $color-primary
        border 2px solid lighten($color-primary, 70%)
        background lighten($color-primary, 70%)

        a
          cursor pointer

          &:hover
            text-decoration underline

    &.active, &[aria-selected='true']
      .v-step__number
        background transparent
        border 2px solid $color-primary
        width 25px
        height 25px
        transition .3s

    &:not(:first-child)
      .v-step__number:before
        content ''
        display block
        position absolute
        background $color-grey--lighten-4
        height 2px
        width calc(100% - 25px)
        left calc(-100% + 25px)

      &.checked
        .v-step__number:before
          background lighten($color-primary, 70%)

    a
      padding 15px

  &>div.error
    h1, h2, h3, h4, h5, h6
      color red !important

      a
        color red !important

.v-steps__content
  display flex
  flex-wrap wrap
  flex 1 1 auto

  .v-steps__step
    flex 1 1 auto
    display flex
    flex-direction column

.v-steps__footer
  display flex
  flex-direction column
  justify-content flex-end
  margin-top 20px
  // &>:first-child
  // margin-right: 20px
  // &>:last-child
  // margin-right: 0
  // margin-left: auto
</style>
