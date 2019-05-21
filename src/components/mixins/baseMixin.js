import moment from 'moment'
import {
  getStoreAttributeData
} from '@/service/restApi'

export const baseMixin = {
  data() {
    return {
      storeAttributeData: [],
      date: '',
      // 背景图显示的高度
      storeHeight: 500,
      // 背景图显示的宽度
      storeWidth: 900,
    }
  },
  mounted() {
    // 获取日期
    this.date = moment().subtract(1, 'days')
    setTimeout(() => {
      this.getHeatData()
    }, 0)
  },
  methods: {
    async getStoreAttributeDataAction(
      timeranges,
      attributes,
      timeout = 10000,
    ) {
      let response = await getStoreAttributeData(
        JSON.stringify(timeranges),
        JSON.stringify(attributes),
        timeout
      )
      if (response && response.code === 200) {
        this.storeAttributeData = response.data
        return response.data
      }
    }
  }
}
