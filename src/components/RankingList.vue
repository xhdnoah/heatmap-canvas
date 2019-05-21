<template>
  <section class="ranking" :style="{width: storeWidth + 'px'}">
    <h4 class="ranking__title">热区排行榜</h4>
    <Row class="ranking__content">
      <Col class="list" span="12">
        <Row class="list__header">
          <Col span="4">
            <span>排名</span>
          </Col>
          <Col span="6">
            <span>区域</span>
          </Col>
          <Col span="8">
            <span>停留占比</span>
          </Col>
          <Col span="6">
            <span>停留时长</span>
          </Col>
        </Row>
        <div class="list__content">
          <Row v-if="bindData.length"
               class="list__item"
               v-for="(camera, index) in firstPart"
               :key="index">
            <Col span="4">
              <span>{{camera.rank}}</span>
            </Col>
            <Col span="6">
              <span>{{camera.name}}</span>
            </Col>
            <Col span="8">
              <span>{{camera.percentage}}</span>
            </Col>
            <Col span="6">
              <span>{{camera.stay_time}}</span>
            </Col>
          </Row>
        </div>
      </Col>
      <div class="seperator"></div>
      <Col class="list" span="12">
        <Row class="list__header">
          <Col span="4">
            <span>排名</span>
          </Col>
          <Col span="6">
            <span>区域</span>
          </Col>
          <Col span="8">
            <span>停留占比</span>
          </Col>
          <Col span="6">
            <span>停留时长</span>
          </Col>
        </Row>
        <div class="list__content">
          <Row v-if="bindData.length"
               class="list__item"
               v-for="(camera, index) in secondPart"
               :key="index">
            <Col span="4">
              <span>{{camera.rank}}</span>
            </Col>
            <Col span="6">
              <span>{{camera.name}}</span>
            </Col>
            <Col span="8">
              <span>{{camera.percentage}}</span>
            </Col>
            <Col span="6">
              <span>{{camera.stay_time}}</span>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  </section>
</template>

<script>
  /* eslint-disable no-undef */
  import {getStoreAttributeData} from '@/service/restApi'
  import {getTimeRangeUtc, formatSeconds} from '@/tools/utils'
  // import _ from 'lodash'
  // import moment from 'moment'

  export default {
    name: "RankingList",
    props: ['storeWidth'],
    data() {
      return {
        bindData: [],
        requestParamKeys: [
          "rankinglist_stay_time_camera"
        ],
        timeRange: [],
        storeAttributeData: [],
        firstPart: [],
        secondPart: []
      }
    },
    computed: {
      rankingData() {
        if (!_.isEmpty(this.storeAttributeData)) {
          return this.storeAttributeData[0]['rankinglist_stay_time_camera']
        } else {
          return []
        }
      }
    },
    created() {
      this.initRankingList()
    },
    methods: {
      async initRankingList() {
        // 设置请求的时间参数
        this.setTimeRange()
        // 请求排行榜原始数据
        await this.getStoreAttributeData()
        // 格式化排行榜数据
        await this.formatRankingData()
        // 将排行榜拆分为两个列表
        this.splitArrayToTwoArrays(this.bindData, this.bindData.length)
      },
      splitArrayToTwoArrays(array, total) {
        let firstArr = array.slice(0, Math.floor(total / 2))
        let secondArr = array.slice(Math.floor(total / 2), total)
        this.firstPart = firstArr
        this.secondPart = secondArr
      },
      formatRankingData() {
        this.bindData = []
        _.each(this.rankingData, (camera, index) => {
          let cameraData = {
            rank: index + 1,
            name: camera.name,
            percentage: (camera.percent * 100).toFixed(2) + '%',
            stay_time: formatSeconds(camera.time)
          }
          this.bindData.push(cameraData)
        })
      },
      setTimeRange() {
        // 默认设置为最近一天
        const selectTimeRangeUTC = getTimeRangeUtc(moment())
        const compareTimeRangeUTC = getTimeRangeUtc(moment().subtract(1, 'days'))
        this.timeRange = [selectTimeRangeUTC, compareTimeRangeUTC]
      },
      async getStoreAttributeData() {
        let res = await getStoreAttributeData(JSON.stringify(this.timeRange), JSON.stringify(this.requestParamKeys))
        if (res && res.code === 200) {
          this.storeAttributeData = res.data
        }
      }
    }
  }
</script>

<style lang="scss">
  /*camera ranking*/

  .ranking {
    border: 1px solid #B1C9F2;
    text-align: center;

    &__title {
      font-size: 16px;
      font-family: PingFangSC-Regular;
      color: #C6E2FF;
      letter-spacing: 2px;
      line-height: 24px;
      padding: 15px 0px 18px 22px;
    }

    &__content {
      padding: 10px 20px;
      display: flex;
    }
    .seperator {
      width: 1px;
      margin: 0 10px;
      background-color: #303E5F;
    }
    .list {
      // reset iView style
        display: block;
        /*width: 50%;*/
        width: calc((100% - 21px) / 2);

      &:last-of-type {
        /*border-left: 1px solid #303E5F;*/
      }

      &__header {

        div {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #C6E2FF;
          letter-spacing: 2px;
          line-height: 24px;
        }
      }

      &__content {
        height: 170px;
        overflow-y: scroll;

        &::-webkit-scrollbar {
          width: 4px;
          background-color: transparent;
        }

        &::-webkit-scrollbar-thumb {
          background-color: #0AE;
          border-radius: 2px;
        }
      }

      &__item {

        div {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #D5F9FF;
          letter-spacing: 2px;
          line-height: 24px;
          margin-top: 9px;
        }
      }
    }
  }


</style>
