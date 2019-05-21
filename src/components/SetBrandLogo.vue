<template>
  <div class="set-logo">
    <header class="header">
      <sx-header title="设置品牌Logo"></sx-header>
    </header>

    <main class="content">
      <section class="form">
        <Form :model="uploadFormData"
              :rules="ruleValidate"
              label-position="left"
              ref="logo-form"
              :label-width="150"
              class="logo__form form__upload">
          <!--上传品牌logo-->
          <section class="logo__upload">
            <div class="upload__header">
              <sx-header :level="3" title="上传品牌Logo"></sx-header>
            </div>
            <div class="upload__content">
              <FormItem :label-width="1" class="form__upload" prop="imgUploaded">
                <Avatar size="large" shape="square" :src="logoSrc"></Avatar>
                <Upload
                  type="drag"
                  :on-success="handleLogoUploadSuccess"
                  :action="uploadAvatar"
                  :format="['jpg','jpeg','png']"
                  :on-format-error="handleLogoFormatError"
                  name="image"
                  :data="uploadParams"
                  ref="imgUpload"
                  :show-upload-list="false">
                  <div class="upload__notice">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或拖拽上传品牌<span class="bold">亮色</span>logo</p>
                  </div>
                </Upload>
              </FormItem>
              <FormItem :label-width="1" class="form__upload" prop="imgDarkUploaded">
                <Avatar size="large" shape="square" :src="logoDarkSrc"></Avatar>
                <Upload
                  type="drag"
                  :on-success="handleLogoDarkUploadSuccess"
                  :action="uploadAvatar"
                  :format="['jpg','jpeg','png']"
                  :on-format-error="handleLogoDarkFormatError"
                  name="image"
                  :data="uploadParams"
                  ref="imgUpload"
                  :show-upload-list="false">
                  <div class="upload__notice">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或拖拽上传品牌<span class="bold">灰色</span>logo</p>
                  </div>
                </Upload>
              </FormItem>
            </div>
          </section>
        </Form>
        <!--设置Logo位置-->
        <section class="position">
          <div class="position__header">
            <sx-header :level="3" title="设置Logo位置"></sx-header>
          </div>
          <div class="position__content">
            <!--热区平面图-->
            <div class="store-plan">
              <canvas id="background-plan" class="position__plan" v-if="storePlan"></canvas>
            </div>
            <!--热区摄像头列表-->
            <div class="position__cameras hot-area-table">
              <sx-header :level="4" title="热门区域列表"></sx-header>
              <div class="hot-area-content-wrapper">
                <Row class="hot-area-header">
                  <Col span="4" class="hot-area-cell index">
                    <span class="PingFangSC-Medium-font">id</span>
                  </Col>
                  <Col span="16" class="hot-area-cell">
                    <span class="PingFangSC-Medium-font">区域</span>
                  </Col>
                  <Col span="4" class="hot-area-cell">
                    <input type="checkbox" id="selectAllCameras" v-model="selectAllCameras" @click="handleSelectAll">
                    <label class="PingFangSC-Medium-font" for="selectAllCameras">全选</label>
                  </Col>
                </Row>
                <!--<loading height="350px" :loadingState="!cameraList.length"></loading>-->
                <div class="hot-area-list">
                  <Row class="hot-area-item"
                       v-if="cameraList.length"
                       v-for="(camera, index) in cameraList"
                       :key="index">
                    <Col span="4" class="hot-area-cell">
                      <span class="PingFangSC-Medium-font">{{camera.camera_id}}</span>
                    </Col>
                    <Col span="16" class="hot-area-cell">
                      <span>{{ camera.name }}</span>
                    </Col>
                    <Col span="4" class="hot-area-cell">
                      <input type="checkbox"
                             :value="camera.camera_id"
                             v-model="inputFormData.cameraIdsSelected"
                             @click="handleCameraMarker(camera)">
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="logo__detail">
          <div class="detail__header">
            <sx-header :level="3" title="设置Logo详情"></sx-header>
          </div>
          <div class="detail__content">
            <Form :model="inputFormData"
                  :rules="ruleValidate"
                  label-position="left"
                  ref="logo-form"
                  :label-width="150"
                  class="logo__form form__upload">
              <FormItem label="品牌名称" prop="name" label-for="logo-name">
                <Input v-model="inputFormData.name" element-id="logo-name">
                <Icon type="social-dribbble" size="20" color="#0098CC" slot="prepend"/>
                </Input>
              </FormItem>
              <FormItem label="点坐标" prop="vertex">
                <Input readonly v-model="inputFormData.vertex">
                <Icon type="ionic" size="20" color="#0098CC" slot="prepend"/>
                </Input>
              </FormItem>
              <FormItem class="logo__size" label="logo宽度" prop="width" label-for="logo-width">
                <!--<Input v-model="inputFormData.width" number element-id="logo-width">-->
                <!--<Icon type="ios-crop-outline" size="20" color="#0098CC" slot="prepend"/>-->
                <!--</Input>-->
                <div class="icon-wrapper" :class="{'input-error': inputFormData.width === null}">
                  <Icon type="arrow-resize" size="20" color="#0098CC"/>
                </div>
                <InputNumber :class="{'input-error': inputFormData.width === null}" :max="maxWidth" :min="minWidth"
                             v-model="inputFormData.width"></InputNumber>
              </FormItem>
              <FormItem class="logo__size" label="logo高度" prop="height" label-for="logo-height">
                <!--<Input v-model="inputFormData.height" number element-id="logo-height">-->
                <!--<Icon type="ios-crop-outline" size="20" color="#0098CC" slot="prepend"/>-->
                <!--</Input>-->
                <div class="icon-wrapper" :class="{'input-error': inputFormData.height === null}">
                  <Icon type="arrow-resize" size="20" color="#0098CC"/>
                </div>
                <InputNumber :class="{'input-error': inputFormData.height === null}" :max="maxHeight" :min="minHeight"
                             v-model="inputFormData.height"></InputNumber>
              </FormItem>
              <FormItem class="btn">
                <Button class="btn__submit" type="primary" @click.native="handleSubmit('logo-form')">
                  提交
                </Button>
                <Button class="btn__cancel" type="default" @click.native="resetForm">
                  重置
                </Button>
              </FormItem>
            </Form>
          </div>
        </section>
      </section>
    </main>

  </div>
</template>

<script>
  /* eslint-disable no-undef */
  import {
    getBrandLogoInfo,
    setBrandLogo,
    getStorePlan,
    getStoreCameraList,
    getCamerasPosition
  } from '@/service/restApi'
  import Config from '@/tools/config'
  import SxHeader from "./common/Header"
  import {appendPrefixStaticUrl} from "@/tools/utils"
  // import _ from 'lodash'
  import Fabric from 'fabric'
  // import moment from 'moment'

  export default {
    name: "SetLogoPosition",
    components: {
      'sx-header': SxHeader
    },
    data() {
      return {
        // 平面图url
        storePlan: '',
        // 设置logo详情表单的数据
        inputFormData: {
          name: '',
          vertex: '(0, 0)',
          cameraIdsSelected: [],
          width: 20,
          height: 20,
        },
        // 上传logo表单的数据
        uploadFormData: {
          imgUploaded: '',
          imgDarkUploaded: '',
        },
        // 设置logo在fabric上的offset
        vertexObj: {
          x: 0,
          y: 0
        },
        // 请求的时间参数
        dateRange: [
          moment().subtract(1, 'days').startOf('day').unix(),
          moment().subtract(1, 'days').endOf('day').unix()
        ],
        // 摄像头数据
        cameraList: [],
        // 上传logo至服务器携带的数据
        uploadParams: {type: 'retailwell', cate: 'store'},
        // 摄像头位置数据
        camerasPosition: [],
        // 摄像头在平面图上的4个点坐标
        camerasPoints: [],
        // 存储canvas对象
        storeCanvas: '',
        // 绘制fabric对象
        poly: {},
        // 平面图宽度
        canvasWidth: 700,
        // 平面图高度
        canvasHeight: 0,
        // 图像请求的baseURL
        uploadAvatar: Config.imageUploadUrl,
        // 是否全选摄像头
        selectAllCameras: false,
        // logo上传至服务器后返回的url
        logoSrc: '',
        // 灰色logo上传至服务器后返回的url
        logoDarkSrc: '',
        // 将logo画到cameraCanvas上
        logoCanvas: undefined,
        // form表单验证规则
        ruleValidate: {
          name: [
            {required: true, message: '品牌名称不能为空！', trigger: 'change'}
          ],
          vertex: [
            {required: true}
          ],
          width: [
            {required: true, type: 'number', message: '', trigger: 'blur'}
          ],
          height: [
            {required: true, type: 'number', message: '', trigger: 'blur'}
          ],
          imgUploaded: [
            {required: true, message: '请上传品牌logo！', trigger: 'blur'}
          ],
          imgDarkUploaded: [
            {required: true, message: '请上传品牌灰色logo！', trigger: 'blur'}
          ]
        },
        // 设置logo size范围
        minWidth: 20,
        maxWidth: 100,
        minHeight: 20,
        maxHeight: 100
      }
    },
    mounted() {
      // 请求店铺平面图和所有品牌logo信息
      // this.getBrandLogoInfo()
      this.initControl()
    },
    computed: {
      firstCameraSelected() {
        if (!_.isEmpty(this.inputFormData.cameraIdsSelected) && !_.isEmpty(this.camerasPoints)) {
          return _.find(this.camerasPoints, (camera) => {
            return camera.id === this.inputFormData.cameraIdsSelected[0]
          })
        } else {
          return {x: 0, y: 0}
        }
      },
      logoSize() {
        return [this.inputFormData.width, this.inputFormData.height].join('')
      }
    },
    watch: {
      'logoSize': 'setLogoCanvasPosition',
      logoCanvas() {
        this.watchLogoCanvasScaling()
        this.watchLogoCanvasMoving()
      }
    },
    methods: {
      async initControl() {

        // // 请求店铺平面图,并绘制到canvas上
        // this.getStorePlan().then(() => {
        //   this.drawStorePlan()
        // })
        // // 请求摄像头列表所需数据，id, name, percent, time.
        // await this.getStoreCameraList()
        // // 请求摄像头所在位置数据，并格式化为4个点坐标，将摄像头区域绘制在fabric上
        // this.getCamerasPosition().then(() => {
        //   this.formatCamerasPoints()
        //   this.drawCameraMarker()
        // })
        // 请求店铺平面图,并绘制到canvas上
        await this.getStorePlan()
        await this.getCamerasPosition()
        await this.getStoreCameraList()
        this.drawStorePlan().then(() => {
          this.formatCamerasPoints()
          this.drawCameraMarker()
        })
      },
      // 将所有摄像头区域画到fabric对象上
      drawCameraMarker() {
        // 获取所有摄像头4个点坐标
        let _cameraPoints = this.camerasPoints
        _.each(this.cameraList, (camera, index) => {
          camera.poly = new Fabric.fabric.Polyline(_cameraPoints[index].points, {
            stroke: 'rgba(13,126,219,0.80)',
            fill: 'rgba(14,131,228,0.18)',
            // left: 0,
            // top: 0,
            opacity: 0,
            hasControls: false, // 去除控件
            hasRotatingPoint: false, // 禁止rotate
            selectable: false, // 禁止选中, 移动
            objectCaching: false
          })
          this.storeCanvas.add(camera.poly)
        })
      },
      // 获取店铺热区平面图
      async getStorePlan() {
        let res = await getStorePlan()
        if (res && res.code === 200) {
          this.storePlan = appendPrefixStaticUrl(res.data.store_img)
        } else {
          console.log('get store plan error')
        }
      },
      // 获取摄像头列表信息，camera_id, name, percent, time等
      async getStoreCameraList() {
        let res = await getStoreCameraList(JSON.stringify([this.dateRange]))
        if (res && res.code === 200) {
          this.cameraList = res.data[0]['rankinglist_stay_time_camera']
          _.each(this.cameraList, camera => {
            camera.poly = {}
          })
        }
      },
      async getCamerasPosition() {
        let res = await getCamerasPosition()
        if (res && res.code === 200) {
          this.camerasPosition = res.data
        }
      },
      drawStorePlan() {
        // 初始化fabric实例对象
        this.storeCanvas = new Fabric.fabric.Canvas('background-plan')
        return new Promise((resolve, reject) => {
          Fabric.fabric.Image.fromURL(this.storePlan, (oImg) => {

            // setCanvasHeight
            this.setCanvasHeight(oImg.width, oImg.height)
            this.storeCanvas.add(oImg)
            this.storeCanvas.setHeight(this.canvasHeight)
            this.storeCanvas.setWidth(this.canvasWidth)
            this.storeCanvas.setBackgroundImage(oImg, this.storeCanvas.renderAll.bind(this.storeCanvas), {
              selectable: false,
              evented: false
            })
            this.storeCanvas.renderAll()
            resolve()
          })
        })
      },
      setCanvasHeight(img_width, img_height) {
        this.canvasHeight = _.floor(img_height * this.canvasWidth / img_width)
      },
      handleCameraMarker(camera) {
        // 设置poly点坐标
        if (!_.isEmpty(this.camerasPoints)) {
          this.$nextTick(() => {
            /* 更新全选状态 */
            // 未选
            if (_.isEmpty(this.inputFormData.cameraIdsSelected)) {
              this.selectAllCameras = false
              this.toggleLogoCanvas('hide')
            } else {
              this.toggleLogoCanvas('show')
              // 全选
              if (_.size(this.inputFormData.cameraIdsSelected) === _.size(this.cameraList)) {
                this.selectAllCameras = true
              }
            }

            // 判断点击的camera是否已选
            let cameraIdSelected = _.find(this.inputFormData.cameraIdsSelected, cameraId => cameraId === camera.camera_id)
            if (cameraIdSelected) {
              _.map(this.cameraList, (camera, index) => {
                if (camera.camera_id === cameraIdSelected) {

                  // show camera marker
                  this.toggleCameraMarker(camera, 'show')
                  this.inputFormData.width = this.camerasPoints[index].width
                  this.inputFormData.height = this.camerasPoints[index].height
                  this.inputFormData.vertex = `(${this.camerasPoints[index].vertex.x}, ${this.camerasPoints[index].vertex.y})`
                  this.vertexObj = {
                    x: this.camerasPoints[index].vertex.x,
                    y: this.camerasPoints[index].vertex.y
                  }
                  // 更新logo canvas 位置
                  this.$nextTick(() => {
                    this.setLogoCanvasPosition()
                  })
                  this.maxWidth = this.inputFormData.width
                  this.maxHeight = this.inputFormData.height
                }
              })
            } else if (!_.isEmpty(this.inputFormData.cameraIdsSelected)) {
              // hide camera marker
              this.toggleCameraMarker(camera, 'hide')
              _.each(this.inputFormData.cameraIdsSelected, cameraId => {
                let firstCameraIndexSelected = _.findIndex(this.cameraList, camera => camera.camera_id === cameraId)
                this.inputFormData.width = this.camerasPoints[firstCameraIndexSelected].width
                this.inputFormData.height = this.camerasPoints[firstCameraIndexSelected].height
                this.inputFormData.vertex = `(${this.camerasPoints[firstCameraIndexSelected].vertex.x}, ${this.camerasPoints[firstCameraIndexSelected].vertex.y})`
                this.vertexObj = {
                  x: this.camerasPoints[firstCameraIndexSelected].vertex.x,
                  y: this.camerasPoints[firstCameraIndexSelected].vertex.y
                }
                // 更新logo canvas 位置
                this.$nextTick(() => {
                  this.setLogoCanvasPosition()
                })
                this.maxWidth = this.inputFormData.width
                this.maxHeight = this.inputFormData.height
              })
            } else {
              // hide camera marker
              this.toggleCameraMarker(camera, 'hide')
            }
          })
        } else {
          console.log('没有该摄像头，请debug!')
        }
      },
      // logo上传成功
      handleLogoUploadSuccess(res, file) {
        if (res && res.error === 'success') {
          this.$Message.success('logo上传成功！')
          this.inputFormData.imgUploaded = res.uri
          this.logoSrc = appendPrefixStaticUrl(res.uri)
          this.addLogoToCameraFabric(this.logoSrc)
        } else {
          this.$Message.error('logo上传失败！')
        }
      },
      // logo上传成功
      handleLogoDarkUploadSuccess(res, file) {
        if (res && res.error === 'success') {
          this.$Message.success('logo dark上传成功！')
          this.inputFormData.imgDarkUploaded = res.uri
          this.logoDarkSrc = appendPrefixStaticUrl(res.uri)
        } else {
          this.$Message.error('logo上传失败！')
        }
      },
      // logo格式不正确
      handleLogoFormatError(file) {
        this.$Notice.warning({
          title: '图片格式不正确',
          desc: '图片"' + file.name + '"格式不正确，请重新上传jpeg/jpg/png等格式图片!'
        })
      },
      // logo格式不正确
      handleLogoDarkFormatError(file) {
        this.$Notice.warning({
          title: '图片格式不正确',
          desc: '图片"' + file.name + '"格式不正确，请重新上传jpeg/jpg/png等格式图片!'
        })
      },
      formatCamerasPoints() {
        let _camerasPoints = _.each(this.camerasPosition, cameraPos => _.pick(cameraPos, ['id', 'position']))
        let res = _.map(_camerasPoints, cameraPoint => {
          let _points = cameraPoint.position.split(',').slice(0, 8)
          _points = _.chunk(_points, 2)
          let pointsFormatted = []
          _.each(_points, point => {
            let pointFormatted = {}
            pointFormatted['x'] = point[0]
            pointFormatted['y'] = point[1]
            if (this.canvasWidth && this.canvasHeight) {
              pointFormatted.x = parseInt(_.multiply(parseFloat(pointFormatted.x), this.canvasWidth))
              pointFormatted.y = parseInt(_.multiply(parseFloat(pointFormatted.y), this.canvasHeight))
            }
            pointsFormatted.push(pointFormatted)
          })
          pointsFormatted.push(pointsFormatted[0])
          let maxWidth, minWidth, maxHeight, minHeight
          maxWidth = _.maxBy(pointsFormatted, 'x').x
          minWidth = _.minBy(pointsFormatted, 'x').x
          maxHeight = _.maxBy(pointsFormatted, 'y').y
          minHeight = _.minBy(pointsFormatted, 'y').y
          // 获取摄像头区域左上角顶点坐标
          let _vertex = _.orderBy(_.cloneDeep(pointsFormatted), ['x', 'y'], ['asc', 'asc'])[0]
          return {
            id: cameraPoint.id,
            points: pointsFormatted,
            width: maxWidth - minWidth,
            height: maxHeight - minHeight,
            vertex: _vertex
          }
        })
        this.camerasPoints = res
        this.drawCameraMarker()
      },
      // 提交品牌logo设置
      async setBrandLogo() {
        // format vertex to percentage
        let vertexXAxis = parseFloat((this.vertexObj.x / this.canvasWidth).toFixed(2))
        let vertexYAxis = parseFloat((this.vertexObj.y / this.canvasHeight).toFixed(2))

        let data = {
          tag: this.inputFormData.name,
          logo: this.inputFormData.imgUploaded,
          logo_dark: this.inputFormData.imgDarkUploaded,
          width: parseFloat((this.inputFormData.width / this.canvasWidth).toFixed(2)),
          height: parseFloat((this.inputFormData.height / this.canvasHeight).toFixed(2)),
          cameras: this.inputFormData.cameraIdsSelected,
          vertex: [vertexXAxis, vertexYAxis]
        }
        console.log('data', data)
        let res = await setBrandLogo(data)
        if (res && res.code === 200) {
          this.$Message.success('品牌logo上传成功！')
        } else {
          this.$Message.error('品牌logo上传失败!请重新上传！')
        }
      },
      // 跳转到首页
      redirectToHomePage() {
        const orgId = window.sessionStorage.getItem('orgId')
        this.$router.push({name: 'Home', query: {orgId: orgId}})
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.setBrandLogo()
            this.redirectToHomePage()
          } else {
            this.$Message.error('请填写表单！')
          }
        })
      },
      resetForm() {
        this.$refs['logo-form'].resetFields()
        this.logoSrc = ''
        this.logoDarkSrc = ''
      },
      handleSelectAll() {
        this.$nextTick(() => {
          // 如果全选
          if (this.selectAllCameras) {
            this.inputFormData.cameraIdsSelected = _.map(this.cameraList, 'camera_id')
            _.each(this.cameraList, camera => {
              this.toggleCameraMarker(camera, 'show')
            })
            // show logoCanvas
            this.toggleLogoCanvas('show')
          } else {
            this.inputFormData.cameraIdsSelected = []
            // hide camera unselected
            _.each(this.cameraList, camera => {
              this.toggleCameraMarker(camera, 'hide')
            })
            // hide logoCanvas
            this.toggleLogoCanvas('hide')
          }
        })
      },
      addLogoToCameraFabric(imgSrc) {
        Fabric.fabric.Image.fromURL(imgSrc, (oImg) => {
          this.logoCanvas = oImg
          oImg.set({
            opacity: 0
          })
          this.storeCanvas.add(oImg)
        })
      },
      setLogoCanvasPosition() {
        if (this.logoCanvas) {
          // get scale ratio
          const scaleX = parseInt(this.inputFormData.width) / this.logoCanvas.width
          const scaleY = parseInt(this.inputFormData.height) / this.logoCanvas.height
          // get offset pixels
          const l = this.vertexObj.x
          const t = this.vertexObj.y
          // update config
          this.logoCanvas.set({
            left: l,
            top: t,
            // opacity: 1,
            scaleX: scaleX,
            scaleY: scaleY, // relative to original image size, not canvas size
            hasRotatingPoint: false, // 禁止rotate
            lockScalingFlip: true,
            maxScaleLimit: '',
          })
          this.toggleLogoCanvas('show')
          this.logoCanvas.setCoords()
        }
      },
      toggleLogoCanvas(type) {
        if (type === 'show') {
          this.logoCanvas.animate('opacity', 1, {
            onChange: this.storeCanvas.renderAll.bind(this.storeCanvas),
            duration: 400
          })
        } else if (type === 'hide') {
          this.logoCanvas.animate('opacity', 0, {
            onChange: this.storeCanvas.renderAll.bind(this.storeCanvas),
            duration: 400
          })
        }
      },
      toggleCameraMarker(camera, type) {
        if (type === 'show') {
          camera.poly.animate('opacity', 1, {
            onChange: this.storeCanvas.renderAll.bind(this.storeCanvas),
            duration: 300
          })
        } else if (type === 'hide') {
          camera.poly.animate('opacity', 0, {
            onChange: this.storeCanvas.renderAll.bind(this.storeCanvas),
            duration: 300
          })
        }
      },
      // 监听logoCanvas scale事件，更新宽度和高度
      watchLogoCanvasScaling() {
        this.logoCanvas.on("scaling", (e) => {
          this.logoCanvas.setCoords()
          const shape = e.target
          const width = shape.get("width")
          const height = shape.get("height")
          const scaleX = shape.get('scaleX')
          const scaleY = shape.get('scaleY')
          this.inputFormData.width = parseInt(width * scaleX)
          this.inputFormData.height = parseInt(height * scaleY)
          this.vertexObj.x = parseInt(this.logoCanvas.oCoords.tl.x)
          this.vertexObj.y = parseInt(this.logoCanvas.oCoords.tl.y)
          this.inputFormData.vertex = `(${this.vertexObj.x}, ${this.vertexObj.y})`
        })
      },
      watchLogoCanvasMoving() {
        this.logoCanvas.on("moving", (e) => {
          this.logoCanvas.setCoords()
          console.log('moving e', e)
          this.vertexObj.x = parseInt(this.logoCanvas.oCoords.tl.x)
          this.vertexObj.y = parseInt(this.logoCanvas.oCoords.tl.y)
          this.inputFormData.vertex = `(${this.vertexObj.x}, ${this.vertexObj.y})`
        })
      }
    }
  }
</script>

<style lang="scss">

  .set-logo {
    width: 70%;
    margin: 0 auto;
    min-width: 1200px;

    /* style the error input */
    .input-error {
      border-color: #ed4014 !important;
    }

    /*styling header*/
    .header {
      border-bottom: 1px solid #DDD;
    }

    /*styling content*/
    .content {
      margin-top: 20px;
    }

    /*STYLE LOGO FORM*/
    .form {

      /*STYLE LOGO UPLOAD*/
      .logo__upload {

        .upload__header {

        }

        .upload__content {
          display: flex;
          justify-content: space-between;
          padding: 0 70px;
        }

        .upload__notice {
          padding: 20px 0;
        }

        .form__upload {
          /*flex: 1;*/
          width: calc((100% - 50px) / 2);
          display: flex;
          align-items: center;

          &:last-child {
            margin-left: 50px;
          }

          .ivu-form-item-content {
            display: flex;
            align-items: center;
            width: 100%;
          }

          .ivu-upload {
            flex: 1;
            margin-left: 30px;
          }
        }
      }

      /*STYLE LOGO POSITION*/
      .position {

        &__header {

        }

        &__content {
          display: flex;
          justify-content: center;
        }

        .store-plan {
          min-width: 700px;
          min-height: 420px;
        }

        &__cameras {
          margin-left: 50px;
        }
      }

      /* STYLE LOGO DETAIL, eg: name, vertex, size */
      .logo__detail {

        .detail__header {

        }

        .detail__content {
          width: 500px;
          padding-left: 50px;
        }

        /*STYLE LOGO SIZE*/
        .logo__size {

          .ivu-form-item-content {
            display: flex;

            .icon-wrapper {
              width: 35px;
              height: 32px;
              color: #515a6e;
              text-align: center;
              background-color: #f8f8f9;
              border: 1px solid #dcdee2;
              border-radius: 4px 0 0 4px;
              border-right-width: 0;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .ivu-input-number {
              flex: 1;
              border-radius: 0 4px 4px 0;
            }
          }

        }
      }

    }

    /*STYLE BUTTON*/
    .btn {

      &__submit {
        margin-right: 30px;

      }
    }

    /*STYLE CAMERAS LIST*/
    .hot-area-table {
      width: 350px;
      margin-left: 10px;
    }

    .hot-area-list {
      height: 350px;
      overflow: scroll;
    }

    .hot-area-header,
    .hot-area-list {
      text-align: center;
    }

    .hot-area-header,
    .hot-area-item.ivu-row {
      display: flex;
      justify-content: center;
    }

    .hot-area-item.ivu-row {
      cursor: pointer;
    }

    .hot-area-cell {
      padding: 10px 0;

    }

    .hot-area-cell.index {
      padding: 10px 0;
    }

    .hot-area-list-compareTrend {
      display: inline-block;
      background-size: 8px 8px;
      background-position: 0 center;
      background-repeat: no-repeat;
    }

    .hot-area-content-wrapper {
      border: 1px solid #DDD;
      margin-top: 9px;
      padding-left: 0;
    }

    /*RESET IVIEW STYLE*/
    .ivu-avatar {
      border: 1px solid #EEE;
      background-color: #FFF;
    }

    .ivu-avatar-large {
      width: 80px;
      height: 80px;
    }

    .ivu-btn-group:not(.ivu-btn-group-vertical) .ivu-btn-primary + .ivu-btn, .ivu-btn-group:not(.ivu-btn-group-vertical) .ivu-btn-primary:last-child:not(:first-child) {
      border-color: #dcdee2;
    }

    .ivu-form-item-label {
      padding: 10px 12px 10px 30px;
    }

  }
</style>
