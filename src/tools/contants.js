import miLogo from '@/assets/images/mi-light.jpeg'
import miLogoDark from '@/assets/images/mi.png'
import huaweiLogo from '@/assets/images/huawei-light.jpeg'
import huaweiLogoDark from '@/assets/images/huawei.png'

export const brandInfoList = {
  code: 200,
  data: {

    plan: 'public/MjAxOC82LzIy/ei1j8bsjngz8dsbb797umobt9Jietu20180622-113238.jpg',
    sku_zone: {
      xiaomi: {
        big_image: [
          `public/MjAxOC82LzIy/405586g0wy6us136r98rwtrzfr电视沙发.jpg`,
          `public/MjAxOC82LzIy/qeofihxcqd0l8ecpeolth85mi门锁.jpg`,
          `public/MjAxOC82LzIy/mwhajqeor6dgrzdib4g9cnmi休息区.jpg`,
          `public/MjAxOC82LzIy/ktujngujvwx9z6ayska3v7vi正门.jpg`,
          `public/MjAxOC82LzIy/axlpgrdvzhh02zdagwlbzw7b9咨询台.jpg`,
          `public/MjAxOC82LzIy/ntf94wb8eiv8nnh8t0ne6zuxr玩具.jpg`
        ],
        height: 0.1,
        width: 0.1,
        logo: miLogo,
        logo_dark: miLogoDark,
        vertex: [0.2, 0.2]
      },
      huawei: {
        big_image: [
          `public/MjAxOC82LzIy/405586g0wy6us136r98rwtrzfr电视沙发.jpg`,
          `public/MjAxOC82LzIy/qeofihxcqd0l8ecpeolth85mi门锁.jpg`,
          `public/MjAxOC82LzIy/mwhajqeor6dgrzdib4g9cnmi休息区.jpg`,
        ],
        height: 0.1,
        width: 0.1,
        logo: huaweiLogo,
        logo_dark: huaweiLogoDark,
        vertex: [0.5, 0.5]
      },
    }
  }
}


export const getBrandInfoList = () => {
  return brandInfoList
}

export default {
  getBrandInfoList,
  brandInfoList
}
