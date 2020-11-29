<template>
  <div id="media-video" class="v-media-video">
    <video
      ref="video"
      id="inputVideo"
      autoplay
      muted
      :facingMode="facingMode"
      playsinline
      :class="facingMode === 'user' ? 'selfie' : ''"
    ></video>
    <canvas id="overlay" ref="overlayCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import adapter from "webrtc-adapter";

@Component({
  inheritAttrs: false
})
export default class VMediaVideo extends Vue {
  loading = true;
  videoDom: any = null;
  tempStream: any = null;
  @Prop({ default: "user" })
  facingMode?: "user" | "environment";
  maxVideoResWidth = 200;
  maxVideoResHeight = 200;
  $refs!: {
    overlayCanvas: HTMLCanvasElement;
    video: HTMLVideoElement;
  };

  @Watch("loading")
  onChangedLoading(val: boolean) {
    this.$emit("on-changed-loading", val);
  }

  get listeners() {
    return Object.assign({}, this.$listeners, {
      // This ensures that the component works with v-model
      change: (event: any) => {
        this.$emit("change", event.target.value);
      }
    });
  }

  async increasedSupportMediaDevices() {
    // Some browsers partially implement mediaDevices. We can't just assign an object
    // with getUserMedia as it would overwrite existing properties.
    // Here, we will just add the getUserMedia property if it's missing.
    if (!navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia = constraints => {
        // First get ahold of the legacy getUserMedia, if present
        const getUserMedia =
          (navigator as any).webkitGetUserMedia || (navigator as any).mozGetUserMedia;

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
          this.$root.$emit(
            "v-flash-notice",
            "getUserMedia is not implemented in this browser"
          );
          return Promise.reject(
            new Error("getUserMedia is not implemented in this browser")
          );
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    } else {
      return Promise.resolve();
    }
  }

  async getAvailableResolutions() {
    const resolutions = [
      // {
      //   label: "4K(UHD)",
      //   width: 3840,
      //   height: 2160,
      //   ratio: "16:9"
      // },
      // {
      //   label: "1080p(FHD)",
      //   width: 1920,
      //   height: 1080,
      //   ratio: "16:9"
      // },
      // {
      //   label: "UXGA",
      //   width: 1600,
      //   height: 1200,
      //   ratio: "4:3"
      // },
      {
        label: "720p",
        width: 1280,
        height: 720,
        ratio: "16:9",
        frameRate: 30
      },
      {
        label: "SVGA",
        width: 800,
        height: 600,
        ratio: "4:3",
        frameRate: 30
      },
      {
        label: "VGA",
        width: 640,
        height: 480,
        ratio: "4:3",
        frameRate: 30
      },
      {
        label: "360p(nHD)",
        width: 640,
        height: 360,
        ratio: "16:9",
        frameRate: 30
      },
      {
        label: "CIF",
        width: 352,
        height: 288,
        ratio: "4:3"
      },
      {
        label: "QVGA",
        width: 320,
        height: 240,
        ratio: "4:3"
      }
    ];

    for (const resolution of resolutions) {
      try {
        this.tempStream = await navigator.mediaDevices.getUserMedia({
          video: { width: resolution.width, height: resolution.height }
        });
        this.maxVideoResWidth = resolution.width;
        this.maxVideoResHeight = resolution.height;
        await this.stopTracks(this.tempStream);
        break;
      } catch (error) {
        continue;
      }
    }
    return Promise.resolve({
      width: this.maxVideoResWidth,
      height: this.maxVideoResHeight
    });
  }

  async scanDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();

    const facingLabel = this.facingMode === "user" ? "front" : "back";
    const videoDevices = devices.filter(d => d.kind === "videoinput");

    const devicesFacingMode = videoDevices.filter(
      d => d.label.toLowerCase().search(facingLabel.toLowerCase()) > -1
    );
    let idealDeviceId = undefined;
    if (videoDevices.length > 2) {
      // Has more than two cameras
      if (devicesFacingMode && devicesFacingMode.length > 1) {
        // We select the camera of the front
        idealDeviceId =
          devicesFacingMode[devicesFacingMode.length - 1] &&
          devicesFacingMode[devicesFacingMode.length - 1].deviceId;
      } else {
        // The app has no access to labels, we set a default
        if (!idealDeviceId && this.facingMode === "environment") {
          idealDeviceId = videoDevices[videoDevices.length - 1].deviceId;
        }
      }
    }
    return idealDeviceId;
  }

  async startCamera() {
    this.loading = true;
    await this.increasedSupportMediaDevices();
    // needed to get the labels of devices in order to open the required camera
    await this.stopTracksCamera();
    let idealDeviceId = undefined;
    idealDeviceId = await this.scanDevices();
    await this.getAvailableResolutions();
    try {
      const constraints = {
        video: {
          width: this.maxVideoResWidth,
          height: this.maxVideoResHeight,
          deviceId: idealDeviceId ? idealDeviceId : undefined,
          facingMode: this.facingMode
        }
      };

      this.videoDom = this.$refs.video;
      if (!this.videoDom) return;
      // await this.stopTracksCamera();
      await navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        this.videoDom.srcObject = stream;
        if ("srcObject" in this.videoDom) {
          this.videoDom.srcObject = stream;
        } else {
          // Avoid using this in new browsers, as it is going away.
          this.videoDom.src = window.URL.createObjectURL(stream);
        }
        this.videoDom.onloadedmetadata = () => {
          this.videoDom.play();
          this.loading = false;
        };
      });
    } catch (err) {
      this.$root.$emit("v-flash-notice", { text: err.message, type: "error" });
      await this.stopTracksCamera();
      this.$emit("error");
      this.loading = true;
      throw err;
    }
  }

  async stopTracksCamera() {
    this.videoDom &&
      this.videoDom.srcObject &&
      (await this.stopTracks(this.videoDom.srcObject));
    this.tempStream && (await this.stopTracks(this.tempStream));
  }

  async stopTracks(stream: any) {
    stream &&
      (await stream.getTracks().forEach((track: any) => {
        track.stop();
      }));
    this.loading = true;
  }

  async mounted() {
    await this.startCamera();
  }
}
</script>
<style lang="stylus" scoped>
.v-media-video
  position absolute
  box-sizing border-box
  height 100%
  width 100%
  overflow hidden
  display flex
  justify-content center

  video
    position absolute
    right auto
    left auto
    width 100%
    height auto
    object-fit cover
    @media (min-width 768px)
      max-width: 100%
      max-height 100%
      position relative

    &.selfie
      transform scaleX(-1)
      min-width 100%
      min-height 100%

  &.vertical
    video
      min-width 100%
      min-height 100%

  canvas
    position absolute
    top 0
    left 0
    width 100%
    height 100%

    &#overlay
      visibility hidden
</style>
