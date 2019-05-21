<template>
  <div>
    <div class="doodle--header">{{}}</div>
    <div class="doodle__list">
      <div class="doodle__imgs">
        <div
          class="doodle__img"
          v-for="(img,index) in brandImgsInfo"
          :key="index"
          @click="showImg(img)"
        >
          <img
            :src="img"
            alt=""
          >
        </div>
      </div>
    </div>
    <div class="doodle--right">
      <div id="doodle--canvas__container">
        <div
          class="doodle"
          v-on:mousemove="drawCanvas($event)"
        >
          <!-- <canvas class="doodle--canvas"></canvas> -->
        </div>
      </div>
      <div class="buttons">
        <div
          class="button__save"
          @click="saveImg()"
        >保存</div>
        <div
          class="button__reset"
          @click="resetCanvas()"
        >重置</div>
      </div>
    </div>
    <a
      :href=this.upLoadUrl
      target="_blank"
    >`查看图片`</a>
  </div>
</template>
<script>
import h337 from 'heatmap.js'
import {
  appendImageUrl,
  appendPrefixStaticUrl,
  getImageSize
} from '../tools/utils'
import { getBrandImg, getStorePlan, uploadCanvas } from '@/service/restApi'
export default {
  name: 'Doodle',
  data() {
    return {
      presentStore: {
        name: 'xxx'
      },
      ratio: 1,
      // 当前 img
      img: '',
      upLoadUrl: '',
      brandImgsInfo: [],
      // storeImg: '',
      heatmapInstance: {}
    }
  },
  mounted() {
    this.getStorePlan()
    this.getBrandImg()
  },
  methods: {
    async getStorePlan() {
      let res = await getStorePlan()
      if (res && res.code === 200) {
        let storeImg = appendPrefixStaticUrl(res.data.store_img)
        this.brandImgsInfo.unshift(storeImg)
        await this.showImg(storeImg)
        // this.heatmapInstance = h337.create({
        //   container: document.querySelector('.doodle'),
        //   radius: 60,
        //   blur: 1
        // })
      }
    },
    async getBrandImg() {
      let that = this
      let res = await getBrandImg()
      if (res && res.code === 200) {
        res.data.forEach(function(o) {
          let bigImgUrl = appendPrefixStaticUrl(o.big_image)
          that.brandImgsInfo.push(bigImgUrl)
        })
      }
    },
    async showImg(img) {
      this.img = img
      let doodleEl = document.querySelector('.doodle')
      let [h, w] = await getImageSize(img)
      if (h !== 0 && w !== 0) {
        doodleEl.style.height = (doodleEl.clientWidth * h) / w + 'px'
        doodleEl.style.backgroundImage = appendImageUrl(img)
        doodleEl.style.backgroundSize = 'cover'
        if (document.querySelector('.heatmap-canvas')) {
          document.querySelector('.heatmap-canvas').remove()
        }
        this.heatmapInstance = h337.create({
          container: document.querySelector('.doodle'),
          radius: 60,
          blur: 1
        })
      }
    },
    drawCanvas(event) {
      this.heatmapInstance.addData({
        x: event.layerX,
        y: event.layerY,
        value: 0.5
      })
    },
    resetCanvas() {
      document.querySelector('.heatmap-canvas').remove()
      this.heatmapInstance = h337.create({
        container: document.querySelector('.doodle'),
        radius: 60,
        blur: 1
      })
    },
    saveImg() {
      let that = this
      let can = document.querySelector('.haetmap-canvas')
      let ctx = can.getContext('2d')
      ctx.drawImage(this.img, 0, 0, can.width, can.height)
      let canvasImg = can.toDataURL('image/png')
      console.log(canvasImg)
      uploadCanvas(canvasImg)
    }
  }
}
</script>

<style lang="scss" scoped>
// X/2/12px rem
.doodle__list {
  position: absolute;
  left: 1.25rem;
  top: 3.3rem;
  width: 38.1rem;
  height: 40.5rem;
  overflow: scroll;
  background-color: #fff;
  box-shadow: 1px 1px 16px 0 rgba($color: #1d3152, $alpha: 0.08);
  .doodle__imgs {
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;
    div:nth-child(1) {
      margin-top: 1.25rem;
    }
    div:nth-child(2) {
      margin-top: 1.25rem;
    }
    .doodle__img {
      box-sizing: border-box;
      flex: 0 0 50%;
      flex-wrap: wrap;
      img {
        width: 100%;
        // height: 275px;
        padding: 0 1.25rem 1.25rem 1.25rem;
      }
    }
  }
}
.doodle--right {
  position: absolute;
  left: 40.6rem;
  top: 3.3rem;
  width: 38.1rem;
  height: 40.5rem;
  background: #fff;
  box-shadow: 1px 1px 16px 0 rgba($color: #1d3152, $alpha: 0.08);
  #doodle--canvas__container {
    position: absolute;
    top: 5rem;
    left: 1.25rem;
    width: 35.6rem;
    height: 23.8rem;
    .heatmpa-canvas {
      z-index: 99;
    }
  }
}

// Button
.buttons {
  margin: 1.25rem 0 1.25rem 1.1rem;
  // position: relative;
  cursor: pointer;
  font-size: 14px;
  .button__save {
    position: absolute;
    top: 29rem;
    left: 14rem;
    margin-right: 1.25rem;
    background-color: #4883fb;
    color: #fff;
    width: 3.9rem;
    height: 1.5rem;
    line-height: 1.5rem;
    text-align: center;
    border: none;
    border-radius: 2px;
  }
  .button__reset {
    position: absolute;
    top: 29rem;
    left: 20.3rem;
    background-color: #ffffff;
    color: #000;
    width: 3.9rem;
    height: 1.5rem;
    line-height: 1.5rem;
    border-radius: 2px;
    border: 1px solid rgba($color: #c9c9c9, $alpha: 1);
    text-align: center;
  }
}
</style>
