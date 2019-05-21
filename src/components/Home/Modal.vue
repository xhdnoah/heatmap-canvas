<template>
  <div
    class="modal"
    v-show="showModal"
  >
    <div class="modal__header">
      <a
        href="javascript:;"
        class="modal__close-btn"
        @click.stop="close()"
      >X</a>
    </div>
    <div class="modal__main">
      <swiper :options="swiperOption">
        <origin-heat-map
          v-for="(item,index) in storeImgUrls"
          :item="item"
          :key="index"
          :index="index"
          :heatMapWidth="storeWidth"
          :heatMapHeight="storeHeight"
          :heatDatas="storeHeatObj.heatData"
          :heatImages="heatImages"
          :dayDiff="1"
        ></origin-heat-map>
        <!-- </div> -->
        <!-- </div> -->
        <div
          class="swiper-pagination"
          slot="pagination"
        ></div>
        <div
          class="swiper-button-next"
          slot="button-prev"
        ></div>
        <div
          class="swiper-button-prev"
          slot="button-next"
        ></div>
      </swiper>
    </div>
  </div>
</template>
<script>
import Swiper from 'swiper'
import { baseMixin } from '@/components/mixins/baseMixin'
import {
  appendPrefixStaticUrl,
  getResizedWidthPixel,
  getImageSize,
  startDayUtc,
  endDayUtc,
  randKey,
  appendImageUrl,
  getParameterByName
} from '@/tools/utils'
import { getBrandImg, getBrandInfoList, deleteBrand } from '@/service/restApi'
import OriginHeatMap from '@/components/OriginHeatMap'

export default {
  name: 'Modal',
  mixins: [baseMixin],
  components: { OriginHeatMap },
  data() {
    return {
      cameraId: 0,
      swiperOption: {
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        pagination: {
          el: '.swiper-pagination'
        }
      },
      // 接口返回的数据(未格式化)
      brandInfoList: {},
      brandImgsInfo: []
    }
  },
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    selectedBrandId: {
      type: Number,
      default: -1
    },
    brandList: {
      type: Array,
      default: []
    }
  },
  computed: {
    brandInfos() {
      if (this.selectedBrandId !== -1) {
        let brandImgsObj = this.brandList[this.selectedBrandId].heatImages
        let arr = []
        for (let i of brandImgsObj) {
          let s = i.split('/').pop()
          arr.push(s.split('_').shift())
        }
        let brandInfos = {}
        brandInfos[this.selectedBrandId] = arr
        return brandInfos
      }
    },
    heatImages() {
      var that = this
      let copybrandInfos = []
      if (this.brandInfos) {
        let brandInfo = this.brandInfos[this.selectedBrandId]
        for (let i = 0; i < brandInfo.length; i++) {
          let imgId = parseInt(brandInfo[i])
          copybrandInfos[i] = {}
          copybrandInfos[i][imgId] = _.find(that.brandImgsInfo, {
            id: imgId
          }).big_image
        }
      }
      return copybrandInfos
    },
    storeImgUrls() {
      return this.heatImages.map(i => appendPrefixStaticUrl(Object.values(i)))
    },
    // 所选店铺的所有热区图
    storeHeatObj() {
      return {
        heatData: _.isEmpty(this.storeAttributeData)
          ? []
          : this.storeAttributeData[0].heat_map_origin_g_camera
      }
    }
  },
  mounted() {
    this.initControl()
    // var swiper = new Swiper('.swiper-container', {
    //   pagination: {
    //     el: '.swiper-pagination',
    //     type: 'fraction'
    //   },
    //   autoplay: false,
    //   navigation: {
    //     nextEl: '.swiper-button-next',
    //     prevEl: '.swiper-button-prev'
    //   }
    // })
  },
  watch: {
    cameraId() {
      // 宽度变化先移除已有的热力图
      this.clearElNode(this.heatMapEl)
      clearTimeout(this.drawTimer)
      this.drawTimer = setTimeout(() => {
        this.drawHeatMap()
      }, 1500)
    }
  },
  methods: {
    async deleteBrand(name) {
      if (confirm('确定删除该品牌？')) {
        let res = await deleteBrand(name)
        if (res && res.code === 200) {
          this.$Message.success('删除成功')
        }
      }
    },
    // 获取原实景图
    async getBrandImg() {
      let res = await getBrandImg()
      if (res && res.code === 200) {
        this.brandImgsInfo = res.data
      }
    },
    async getHeatData(timeout = 10000) {
      await this.getStoreAttributeDataAction(
        [[startDayUtc(this.date), endDayUtc(this.date)]],
        ['heat_map_origin_g_camera']
      )
    },
    async getImgSize() {
      this.storeHeight = 0
      if (this.heatImages) {
        let [h, w] = await getImageSize(this.heatImages[0])
        if (h !== 0 && w !== 0) {
          this.storeHeight = h
          this.storeWidth = w
        }
      }
    },
    async initControl() {
      await this.getBrandImg()
      this.renderStore()
      // 3. 获取店铺图的信息
      // await this.getStoreInfo()
      // 4. 设置店铺图
      // this.renderStore()
      // 5. 格式化所有的品牌以及对应热区图的信息
      // this.getBrandList()
      // 6. Dom上设置这些品牌
      // this.$nextTick(this.renderBrandList)
    },
    renderStore() {
      let storeEl = document.querySelector('.modal')
      // 设置背景图的宽高
      storeEl.style.height = this.storeHeight + 'px'
      storeEl.style.width = this.storeWidth + 'px'
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
$store-width: 100%;
$bg-color: #0b2751;
$break-large: 1500px;

// MODAL STYLE
.modal {
  grid-column: 2 / 3;
  grid-row: 2 / 4;
  z-index: 30;
  background-color: rgba($bg-color, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;

  &__header {
    display: flex;
    flex-direction: row-reverse;
    padding: 0 20px;
    height: 20px;
  }

  &__close-btn {
    font-size: 16px;
    padding: 10px;
    text-decoration: none;
    z-index: 40;
  }

  &__main {
    margin-top: -40px;
  }
}
</style>
