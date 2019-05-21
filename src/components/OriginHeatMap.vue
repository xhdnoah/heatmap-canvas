<template>
  <swiper-slide
    class="swiper-slide"
    :style="`height: heatMapHeight; `"
  >
    <img
      :src="item"
      alt=""
      class="swiper__img"
    />
    <div class="originHeatmap">
      <div
        :id="heatmapId"
        :style="`height: heatMapHeight; width: heatMapWidth; `"
      ></div>
    </div>
  </swiper-slide>
</template>

<script>
import Heatmap from 'heatmap.js'

export default {
  name: 'OriginHeatMap',
  props: {
    // 实景图 url
    item: {
      type: String,
      default: ''
    },
    // 实景图索引
    index: {
      type: Number,
      default: 0
    },
    // 实景图集
    heatImages: {
      type: Array,
      default: []
    },
    // 热力图宽度
    heatMapWidth: {
      type: Number,
      default: 0
    },
    // 热力图高度
    heatMapHeight: {
      type: Number,
      default: 0
    },
    // 热力数据
    heatDatas: {
      type: Object
    },
    // 日期间隔
    dayDiff: {
      type: Number,
      default: 1
    },
    // 摄像头 id
    local_camera_id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // intervalList: [0, 30, 30 * 60, 60 * 60, 120 * 60],
      // intervalList: [0, 30, 30 * 60, 60 * 60, 120 * 60],
      // 五种颜色的比例(蓝－>红)
      intervalRateList: [0.1, 0.35, 0.7, 0.9, 1],
      colorList: [
        'rgb(0,0,255)',
        'rgb(0,255,0)',
        'rgb(255,255,0)',
        'rgb(255,115,0)',
        'rgb(255,0,0)'
      ],
      heatmapInstance: null,
      // 店铺热区信息
      this: {
        // 热区数据的最大值
        max: 0,
        // 热区数据
        heatmapPoints: []
      },
      maxValue: 0,
      // 横轴上格子数量
      cellNoX: 0,
      // 纵轴上格子数量
      cellNoY: 0,
      // 每一个格子的宽度
      cellWidth: 0,
      // 每一个格子的高度
      cellHeight: 0,
      // hotzoneData: null,
      // hotzoneData: [],
      gradient: {},
      height: 0,
      heatmapId: 'heatmap' + this.local_camera_id,
      drawTimer: null,
      // dom上的热区图对象
      heatMapEl: null,
      // 绘图相关超参数
      heatMapParam: {
        maxOpacity: 1,
        minOpacity: 0.01,
        blur: 0.85
      }
    }
  },

  watch: {
    heatData: { handler: 'drawHeatMap', deep: true },
    heatMapWidth() {
      // 宽度变化先移除已有的热力图
      this.clearElNode(this.heatMapEl)
      clearTimeout(this.drawTimer)
      this.drawTimer = setTimeout(() => {
        this.drawHeatMap()
      }, 1500)
    }
  },
  mounted() {
    // 加载完成 通知StoreHot组件
    this.$nextTick(() => {
      this.drawHeatMap()
    })
    this.setHeatMapEl()
  },
  computed: {
    heatData() {
      let heatImage = this.heatImages[this.index]
      return this.heatDatas[Object.keys(heatImage)]
    },
    // 当前宽度和最佳展示宽度700px的比率
    ratio() {
      return this.heatMapWidth / 1040
    },
    // 根据当前大格子的大小改变绘制圆半径
    radius() {
      return 2 * Math.min(this.cellHeight, this.cellWidth)
    }
  },
  methods: {
    initData() {
      // this.hotzoneData = this.heatData
      if (!_.isEmpty(this.heatData)) {
        this.gradient = this.getGradient()
        this.height = this.getHeight()
        this.cellNoX = this.getCellNoX()
        this.cellNoY = this.getCellNoY()
        this.cellWidth = this.getCellWidth()
        this.cellHeight = this.getCellHeight()
        this.maxValue = this.getHeatMapDataMax()
        this.this.heatmapPoints = this.getHeatMapPoints()
        // 通过heatmapPoints计算"颜色－数量"指示图
        // this.getIntervalList()
      }
    },
    setHeatMapEl() {
      this.heatMapEl = document.getElementById(this.heatmapId)
    },
    getIntervalList() {
      // 获取所有的value并且从小到大排序
      let pointValueList = _.map(this.this.heatmapPoints, o => o.value).sort(
        function(a, b) {
          return a - b
        }
      )
      // 计算不同比例对应的landmark值
      let valueLandmarkList = _.map(_.chunk(this.intervalRateList, 4)[0], o =>
        parseInt(pointValueList[parseInt(o * pointValueList.length)])
      )
      // 将最小值加入列表第一位
      valueLandmarkList.unshift(parseInt(pointValueList[0]))
      // 将最大值加入列表最后一位
      valueLandmarkList.push(
        parseInt(pointValueList[pointValueList.length - 1])
      )
      // 计算出尺度区间向eventBus发送
      if (!this.local_camera_id) {
        this.$bus.$emit('valueLandmarkList', valueLandmarkList)
      }
    },
    // 删除一个结点下所有内容
    clearElNode(el) {
      let child
      if (el.firstChild) {
        while (el.firstChild) {
          child = el.firstChild
          el.removeChild(child)
        }
      }
    },
    // 创建顾客热区热力图
    createHeatMapInstance() {
      // 移除heatmap中多余的canvas
      this.clearElNode(this.heatMapEl)
      // 创建一个heatmap-canvas实例对象
      // 这里直接指定热点图渲染的div了.heatmap支持自定义的样式方案
      // 由于加载店铺背景图片，div初始高度为0，所以在创建heatmap时，为div手动赋值高度
      // 在创建heatmap时，一定要确保可以获取到节点
      if (this.heatMapEl) {
        this.heatMapEl.style.height = this.heatMapHeight + 'px'
        this.heatMapEl.style.width = this.heatMapWidth + 'px'
        this.heatmapInstance = Heatmap.create({
          container: this.heatMapEl,
          radius: this.radius,
          maxOpacity: this.heatMapParam.maxOpacity,
          minOpacity: this.heatMapParam.minOpacity,
          blur: this.heatMapParam.blur,
          // 热区颜色设置
          gradient: this.gradient
          // minOpacity: 0.01,
        })
      }
    },
    // 设置热区图的数据
    setHeatMapInstance() {
      // 热点数据的集合
      let heatmapPointData = {
        // 设置热点集合的最大值
        // 'max': this.this.max,
        max: this.maxValue / this.dayDiff,
        min: 1,
        data: this.this.heatmapPoints
      }
      this.heatmapInstance.setData(heatmapPointData)
    },
    // 重新绘制热区
    drawHeatMap() {
      this.initData()
      this.createHeatMapInstance()
      this.setHeatMapInstance()
    },
    // 换算坐标
    getHeatMapPoints() {
      let heatmapPoints = []
      // 遍历一个二元数组的热区数据，纵向数据
      for (let j in this.heatData) {
        let cellTop = this.cellHeight * j
        // 遍历一个二元数组的热区数据，横向数据
        for (let i in this.heatData[j]) {
          let cellLeft = this.cellWidth * i
          // 计算平均每天
          let cellScaledValue = this.local_camera_id
            ? this.heatData[j][i] / this.dayDiff
            : this.heatData[j][i] / this.dayDiff

          heatmapPoints.push(
            ...this.getCellPoints(cellLeft, cellTop, cellScaledValue)
          )
        }
      }

      return heatmapPoints
    },

    getCellPoints(cellLeft, cellTop, value) {
      let heatmapPoints = []
      // 步长是大格子长度
      let step_y = this.cellHeight
      let step_x = this.cellWidth
      for (let hk = 0; hk < this.cellHeight; hk += step_y) {
        for (let wk = 0; wk < this.cellWidth; wk += step_x) {
          // 将数值放在大格子中心
          let cellData = {
            x: _.floor(cellLeft + 0.5 * step_x + wk),
            y: _.floor(cellTop + 0.5 * step_y + hk),
            value: _.floor(value)
          }
          if (cellData.value > 0) {
            heatmapPoints.push(cellData)
          }
        }
      }
      return heatmapPoints
    },
    getHeatMapMax() {
      return _.last(this.intervalList)
    },
    getHeatMapDataMax() {
      return _.max(_.flattenDeep(this.heatData))
    },
    getHeight() {
      return this.heatMapHeight
    },
    // 热区的颜色配置
    getGradient() {
      this.this.max = this.getHeatMapMax()
      let scaleHeatInterval = this.intervalRateList
      // scaleHeatInterval = [0.2, 0.6, 0.7, 0.8, 0.99]
      return _.zipObject(scaleHeatInterval, this.colorList)
    },
    // 热区图横向单元格个数
    getCellNoX() {
      return this.heatData[0].length
    },
    // 热区图纵向单元格个数
    getCellNoY() {
      return this.heatData.length
    },
    // 热区图的宽度分割，最小刻度
    getCellWidth() {
      // return _.floor(700 / this.cellNoX);
      return _.floor(this.heatMapWidth / this.cellNoX)
    },
    // 热区图的高度分割，最小刻度
    getCellHeight() {
      return _.floor(this.height / this.cellNoY)
    }
  }
}
</script>

<style lang="scss" scoped>
.swiper-slide {
  height: 500px;
  position: relative;
  .swiper__img {
    margin: 0 auto;
    width: 100%;
    display: block;
  }
  .originHeatmap {
    position: absolute;
    top: 0;
  }
}
</style>
