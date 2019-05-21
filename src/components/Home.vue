<template>
  <main class="container">
    <Modal
      :showModal="showModal"
      :selectedBrandId="selectedBrandId"
      :brandList="brandList"
      @close="close"
    ></Modal>
    <div class="store-hot">
      <div
        class="logo-box"
        v-for="(brand, index) in brandList"
        :key="index"
      >
        <a
          href="#"
          :class="['logo-box__link', 'logo-box__link--' + brand.id]"
          @click.stop.exact='show(brand.id)'
          @click.meta.prevent="deleteBrand(brand.name)"
        >
          <span :class="['logo-box__img', 'logo-box__img--light', 'logo-box__img--light-' + brand.id]"></span>
          <span :class="['logo-box__img', 'logo-box__img--dark', 'logo-box__img--dark-' + brand.id]"></span>
        </a>
      </div>
      <!--热区图绘制-->
      <div
        v-if="storeHeight > 0"
        class="heat-map-container"
      >
        <HeatMap
          :heatMapWidth="storeWidth"
          :heatMapHeight="storeHeight"
          :heatData="storeHeatObj.heatData"
          :dayDiff="1"
        >
        </HeatMap>
      </div>
    </div>
  </main>
</template>
<script>
import { baseMixin } from '@/components/mixins/baseMixin'
import {
  appendPrefixStaticUrl,
  getResizedWidthPixel,
  getImageSize,
  startDayUtc,
  endDayUtc,
  appendImageUrl,
  getParameterByName
} from '@/tools/utils'
import {
  login,
  getBrandInfoList,
  deleteBrand,
  getStorePlan
} from '@/service/restApi'
import Modal from '@/components/Home/Modal'
import HeatMap from '@/components/storeHotArea/HeatMap'

export default {
  mixins: [baseMixin],
  components: { HeatMap, Modal },
  data() {
    return {
      // 用于定位哪个brand
      currentId: 0,
      // 是否显示弹窗
      showModal: false,
      // 背景图url
      storeImageUrl: '',
      // 移动传过来的店铺标识
      orgId: undefined,
      // 背景图
      storePlan: {},
      // 当前点击的品牌ID
      selectedBrandId: -1,
      // 格式化之后的品牌信息
      brandList: []
    }
  },
  computed: {
    // 所选店铺的所有热区图
    storeHeatObj() {
      return {
        heatData: _.isEmpty(this.storeAttributeData)
          ? []
          : this.storeAttributeData[0].heat_map
      }
    }
  },
  mounted() {
    // 获取url中的参数
    this.getOrgId()
    // 登录成功后初始化页面
    login(this.orgId, this.initControl)
    // 异步获取热力数据
  },
  methods: {
    getOrgId() {
      this.orgId = getParameterByName('orgId')
      window.sessionStorage.setItem('orgId', this.orgId)
    },
    async getBrandInfoList() {
      let res = await getBrandInfoList()
      if (res && res.code === 200) {
        this.brandInfoList = res
      }
    },
    async getStorePlan() {
      let res = await getStorePlan()
      if (res && res.code === 200) {
        this.storePlan = res
      }
    },
    async getStoreInfo() {
      this.storeHeight = 0
      if (this.storePlan.data) {
        this.storeImageUrl = appendPrefixStaticUrl(
          this.storePlan.data.store_img
        )
        let [h, w] = await getImageSize(this.storeImageUrl)
        if (h !== 0 && w !== 0) {
          this.storeHeight = h
          this.storeWidth = w
        }
      }
    },
    async getHeatData(timeout = 10000) {
      await this.getStoreAttributeDataAction(
        [[startDayUtc(this.date), endDayUtc(this.date)]],
        ['heat_map']
      )
    },
    async initControl() {
      // 1. 请求数据
      await this.getBrandInfoList()
      // 1. 获取背景图片
      await this.getStorePlan()
      // 2. 获取店铺图的信息
      await this.getStoreInfo()
      // 3. 获取热力数据
      await this.getHeatData()
      // 4. 设置店铺图
      this.renderStore()
      // 5. 格式化所有的品牌以及对应热区图的信息
      this.getBrandList()
      // 6. Dom上设置这些品牌
      this.$nextTick(this.renderBrandList)
    },
    renderStore() {
      let storeEl = document.querySelector('.store-hot')
      // 设置背景图的宽高
      storeEl.style.height = this.storeHeight + 'px'
      storeEl.style.width = this.storeWidth + 'px'
      storeEl.style.backgroundImage = appendImageUrl(this.storeImageUrl)
      storeEl.style.backgroundSize = 'cover'
    },
    getDisplaySize(percent, planDisplaySize) {
      return (percent * planDisplaySize).toFixed(2) + 'px'
    },
    getBrandList() {
      this.brandList = _.map(this.brandInfoList.data.sku_zone, (v, k) =>
        this.formatBrandInfo(v, k)
      )
    },
    formatBrandInfo(input, name) {
      let res = {}
      res.name = name
      res.id = this.currentId
      res.logoUrlLight = appendImageUrl(appendPrefixStaticUrl(input.logo))
      res.logoUrlDark = appendImageUrl(appendPrefixStaticUrl(input.logo_dark))
      // 相对位置使用百分比
      res.left = (input.vertex[0] * 100).toFixed(2) + '%'
      res.top = (input.vertex[1] * 100).toFixed(2) + '%'
      // 设置logo图标的大小
      res.width = this.getDisplaySize(input.width, this.storeWidth)
      res.height = this.getDisplaySize(input.height, this.storeHeight)
      // 热区图
      res.heatImages = _.map(input.hotzone_images, o =>
        appendPrefixStaticUrl(o)
      )
      this.currentId += 1
      return res
    },
    renderBrandList() {
      _.forEach(this.brandList, o => this.renderBrand(o))
    },
    renderBrand(brand) {
      let logoLightCls = '.logo-box__img--light-' + brand.id
      let logoDarkCls = '.logo-box__img--dark-' + brand.id
      this.renderLogoImage(
        logoLightCls,
        brand.logoUrlLight,
        brand.height,
        brand.width
      )
      this.renderLogoImage(
        logoDarkCls,
        brand.logoUrlDark,
        brand.height,
        brand.width
      )
      // logo背景图上的位置
      let link = document.querySelector('.logo-box__link--' + brand.id)
      link.style.left = brand.left
      link.style.top = brand.top
    },
    renderLogoImage(logoCls, imageUrl, height, width) {
      let el = document.querySelector(logoCls)
      // 设置logo图片
      el.style.background = imageUrl + ' center no-repeat'
      el.style.backgroundSize = 'contain'
      // 图片的宽高
      el.style.height = height
      el.style.width = width
    },
    show(id) {
      // 根据id 切换img资源
      this.selectedBrandId = id
      this.showModal = true
    },
    close() {
      this.showModal = false
    }
  }
}
</script>
<style scoped lang="scss">
// 热区图展示的宽度
$store-width: 100%;
$bg-color: #0b2751;
$break-large: 1500px;

.store-hot {
  grid-row: 2 / 3;
  grid-column: 2 / 3;
  align-self: center;
  width: 100%;

  position: relative;
  background: #ffffff;
  box-shadow: 1px 1px 16px 0 rgba(29, 49, 82, 0.08);
  border-radius: 4px;
  margin: 0 auto;

  @media screen and (max-width: $break-large) {
    width: auto;
    flex: 1;
  }

  .heat-map-container {
    position: absolute;
    top: 0;
    left: 0;
  }
}

// LOGO
.logo-box {
  &__link {
    position: absolute;
    z-index: 20;
    display: inline-block;

    &:hover .logo-box__img--light {
      opacity: 1;
    }

    &:hover .logo-box__img--dark {
      opacity: 0;
    }
  }

  &__img {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    // hover 动画
    transition: opacity 0.5s;

    &--light {
      opacity: 0;
    }

    &--dark {
      opacity: 1;
    }
  }
}
// CONTAINER
.container {
  background-color: $bg-color;
  width: 100vw;
  height: 100vh;

  display: grid;
  grid-template-columns: 0fr $store-width 0fr;
  grid-template-rows: 1fr max-content max-content 1fr;
}
</style>
