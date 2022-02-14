<template>
  <div class="header">
<!--    左侧的logo和search框-->
    <div class="left">
      <div class="logo"></div>
      <div class="search">
        <div class="search_icon"></div>
        <input type="text" placeholder="搜索"
               v-model="searchValue"
               @focus="getDefaultList"
               @blur="isShowSearchList = false; isShowDetail = false">
<!--        搜索下拉框-->
<!--        搜索结果列表-->
        <ul class="search_list" v-if="isShowDetail && isShowSearchList">
          <div class="hot_search">热搜榜</div>
          <li v-for="(item, index) in defaultList" class="item">
            <div class="rank_num" :class="{active: index in [0,1,3]}">{{index + 1}}</div>
            <div class="song_name">{{item.searchWord}}</div>
            <div class="score">{{item.score}}</div>
            <div class="song_icon" v-if="item.iconUrl">
              <img :src="item.iconUrl">
            </div>
          </li>
        </ul>
<!--        搜索推荐列表-->
        <ul class="search_recommend" v-if="isShowDetail && !isShowSearchList">
          <li class="recommend_item" v-if="Object.keys(recommendSearchObj).length === 0">无结果</li>
          <li class="recommend_item" v-if="Object.keys(recommendSearchObj).length !== 0 &&  recommendSearchObj.order.includes(`songs`)">
            <div class="recommend_title">单曲</div>
            <div class="recommend_detail" v-for="item in recommendSearchObj.songs">
              {{item.name}} - <span v-for="artist in item.artists"> {{artist.name}}  &nbsp;</span>
            </div>
          </li>
          <li class="recommend_item" v-if="Object.keys(recommendSearchObj).length !== 0 &&  recommendSearchObj.order.includes(`artists`)">
            <div class="recommend_title">歌手</div>
            <div class="recommend_detail" v-for="item in recommendSearchObj.artists">
              {{item.name}}
            </div>
          </li>
          <li class="recommend_item" v-if="Object.keys(recommendSearchObj).length !== 0 &&  recommendSearchObj.order.includes(`albums`)">
            <div class="recommend_title">专辑</div>
            <div class="recommend_detail" v-for="item in recommendSearchObj.albums">
              {{item.name}} - {{item.artist.name}}
            </div>
          </li>
          <li class="recommend_item" v-if="Object.keys(recommendSearchObj).length !== 0 &&  recommendSearchObj.order.includes(`playlists`)">
            <div class="recommend_title">歌单</div>
            <div class="recommend_detail" v-for="item in recommendSearchObj.playlists">
              {{item.name}}
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!--  右侧的登录状态-->
    <div class="right">
      <div class="profilePhoto">
        <img :src="store.state.logInfo.profile.avatarUrl" v-if="store.state.logInfo.status" alt="">
      </div>
      <div v-if="!store.state.logInfo.status"
           class="userName" @click="clickUnName">未登录</div>
      <div v-if="store.state.logInfo.status" class="userName">{{store.state.logInfo.profile.nickname}}</div>
    </div>

<!--    弹出的登录框-->
    <teleport to="body">
      <div class="login_mask" v-if="isShowMask">z
        <div class="log_box">
          <div class="close_log" @click="isShowMask = false; isQueryCode = false;">X</div>
          <div class="log_top"></div>
<!--          手机号登录-->
          <div class="log_by_phone" v-if="!isLoginByQrCode">
            <div class="log_info_error">
              <div class="info_error_img" v-if="isCaptchaError || isPasswordError"></div>
              <span v-if="isPasswordError">手机号或密码错误</span>
              <span v-if="isCaptchaError">验证码错误</span>
            </div>
            <div class="log_by_phone_wrapper">
              <div class="phone_wrapper">
                <div class="log_reminder_phone"></div>
                <input type="text" placeholder="请输入手机号" v-model="phoneNum">
              </div>
              <div class="password_wrapper">
                <div class="log_reminder_password" v-if="isLoginByPassword"></div>
                <div class="log_reminder_captcha" v-if="!isLoginByPassword"></div>
                <input type="password" placeholder="请输入密码" v-model="password" v-if="isLoginByPassword">
                <input type="text" placeholder="请输入验证码" v-model="captcha" v-if="!isLoginByPassword">
                <div v-if="!isLoginByPassword" class="get_check_code" @click="getCheckCode">获取验证码</div>
              </div>
            </div>
            <div class="use_qr" @click="isLoginByPassword = true;isCaptchaError= false" v-if="!isLoginByPassword">
              <span>使用密码登录 >>></span>
            </div>
            <div class="use_qr" @click="isLoginByPassword = false;isPasswordError=false" v-if="isLoginByPassword">
              <span>使用验证码登录 >>></span>
            </div>
            <div class="login_submit" @click="loginByPhone">登录</div>
            <div class="use_qr" @click="getLogInByQRCode"><span>使用二维码登录 >>></span></div>
          </div>
<!--          二维码登录-->
          <div class="log_by_code" v-if="isLoginByQrCode">
            <div class="reminder_timeout" v-if="timeout && !waitForScan">
              <div class="reminder_img_timeout"></div>
              <div class="reminder_content timeout">二维码已过期</div>
            </div>
            <div class="reminder_wait" v-if="!waitForScan && scanOk">
              <div class="reminder_img_wait"></div>
              <div class="reminder_content wait">扫码成功，等待用户授权</div>
            </div>
            <div class="QrImg">
              <img :src="imgBase64" alt="登录二维码">
            </div>
            <div class="refresh_code" @click="getLogInByQRCode">刷新二维码</div>
            <div class="chang_login_way" @click="changWayPhone">使用手机号登录 >>></div>
          </div>
        </div>
      </div>
    </teleport>
    <!--  <button @click="text" style="width: 100px; height: 100px;">测试用</button>-->
  </div>
</template>

<script lang = "ts">
import {defineComponent, reactive, ref, watch, toRefs} from "vue";
import {useStore} from "vuex";
import axios from "axios";

export default defineComponent({
  name: `Header`,
  setup() {
    //用于导入store
    let store = useStore()

    /**
     * @date: 2022.2.3
     * @brief 搜索框显示功能
     * @finished 2022.2.4
     * @todo
     *    @problem 搜索框有一个小问题
     * */

    //是否显示搜索下拉框
    let isShowDetail = ref(false)

    let searchValue:any = ref(``)
    //存放获取默认搜索列表的数据
    let defaultList:Array<any> = reactive([])

    /**
     * 调用接口获取
     * */
    async function getDefaultList() {
      isShowDetail.value = true;
      //当没有输入内容的时候才，显示search热门框
      if(!searchValue.value) {
        isShowSearchList.value = true
      }
      //当 defaultList 变量没有值的时候才想服务器请求数据
      if(Object.keys(defaultList).length === 0) {
        let res = await axios.get(`http://localhost:3000/search/hot/detail`)
        console.log(res.data.data)
        defaultList.push(...res.data.data)
        console.log(`请求数据了`)
      }
    }

    //存储定时器用于消抖
    let recommendTimer:any;
    //存储推荐内容
    let recommendSearchObj = ref({})

    /**
     * 调用接口获取搜索建议
     * */
    async function getRecommendSearchList() {
      let res = await axios.get(`http://localhost:3000/search/suggest?keywords= ${searchValue.value}`)
        recommendSearchObj.value = res.data.result

      console.log(recommendSearchObj.value);
    }

    //是否显示搜索列表
    let isShowSearchList = ref(false)
    //监视输入内容的变化
    watch(searchValue, async (value) => {
      console.log(value)
      if(!value) {
        //如果没有输入内容，就显示推荐热门列表
        await getDefaultList()
      }else {
        //如果有输入内容，根据输入内容进行推荐
        clearTimeout(recommendTimer) //消抖
        recommendTimer = setTimeout( async () => {
          isShowSearchList.value = false
          await getRecommendSearchList()
        },100)
      }
    })

    /**
     * @date 2022.2.4
     * @brief 登录功能
     * @finished 2022.2.6
     * */


    /**
     * @date 2022.2.4
     * @brief 手机号登录功能 (密码和验证码)
     * @finished 2020.2.5
     * */
    //是否显示登录遮罩层
    let isShowMask = ref(false)
    //使用密码或者验证码登录
    let isLoginByPassword = ref(true)

    //用于绑定用户登录账号密码
    let phoneLoginInfo = reactive({
      phoneNum: ``,
      password: ``,
      captcha: ``
    })

    /**
     * 点击`未登录` 时的 处理函数
     * */
    async function clickUnName() {
      isShowMask.value = true;
      isPasswordError.value = false;
      isCaptchaError.value = false

      if(isLoginByQrCode.value) {
        //如果使用二维码登录，打开轮询开关
        isQueryCode.value = true
        await getLogInByQRCode()
      }
    }

    /**
     * 切换到手机号登录的模式
     * */
    function changWayPhone() {
      isQueryCode.value = false
      isLoginByQrCode.value = false
    }

    /**
     * 获取验证码
     * */
    async function getCheckCode() {
      //当传入手机号后，点击 按钮才请求数据
      if(phoneLoginInfo.phoneNum) {
        console.log(`向服务器发出请求`);
        let res = await axios.get(`http://localhost:3000/captcha/sent?phone=${phoneLoginInfo.phoneNum}`)
        console.log(res.data);
      }
    }

    /**
     * 验证验证码是否正确
     * */
    async function verifyCheckCode() {
      return axios.get(`http://localhost:3000/captcha/verify?phone=${phoneLoginInfo.phoneNum}&captcha=${phoneLoginInfo.captcha}`)
    }

    //登录时，密码是否错误
    let isPasswordError = ref(false)
    //登录时，验证码是否错误
    let isCaptchaError = ref(false)

    /**
     * 使用手机号登录
     * */
    async function loginByPhone() {
      //存放获取的数据
      let res;
      if(isLoginByPassword.value) {
        //使用密码登录
        if(phoneLoginInfo.phoneNum && phoneLoginInfo.password) {
          console.log(`密码登录，向服务器发送登录请求`);
          //当手机号和密码都不为空时，才能向服务器发送请求
          res = await axios.get(`http://localhost:3000/login/cellphone?phone=${phoneLoginInfo.phoneNum}&password=${phoneLoginInfo.password}`)
          console.log(res.data);
          if(res.data.code === 502) {
            //密码错误
            console.log(`密码错误`);
            isPasswordError.value = true
          }else if(res.data.code === 200) {
            //将登录后获取的用户信息存放到store中
            store.commit(`changeCookie`, res.data.cookie)
            store.commit(`addUserInfo`, res.data.profile)
            isShowMask.value = false
          }
        }
      }else{
        //使用验证码登录
        if(phoneLoginInfo.phoneNum && phoneLoginInfo.captcha) {
          //当手机号和验证码都不为空时，才能向服务器发送请求
          console.log(`验证码登录，向服务器发送登录请求`);
          try{
            //校验验证码
            let verifyObj = await verifyCheckCode()
            console.log(verifyObj.data);
            //当验证码正确的时候，向服务器发送请求，获取用户信息
            res = await axios.get(`http://localhost:3000/login/cellphone?phone=${phoneLoginInfo.phoneNum}&captcha=${phoneLoginInfo.captcha}`)
            console.log(res.data);
            // 将登录后获取的用户信息存放到store中
            store.commit(`addUserInfo`, res.data.profile)
            store.commit(`changeCookie`, res.data.cookie)
            isShowMask.value = false
            isCaptchaError.value = false
          }catch (error) {
            console.log(`验证码错误`);
            isCaptchaError.value = true
          }
        }
      }
    }

    /**
     * @date 2022.2.5
     * @brief 二维码登录功能
     * @finished 2022.2.6
     * */

    //是否使用二维码进行登录
    let isLoginByQrCode = ref(false)

    //用于存放二维码的base64码
    let imgBase64 = ref(``)

    //二维的状态对象
    let QrCodeStatus = reactive({
      timeout: false,
      waitForScan: true,
      scanOk: false
    })

    async function getLogInByQRCode() {
      //显示二维码登录页面
      isLoginByQrCode.value = true
      //获取二维码的kdy
      let keyObj = await axios.get(`http://localhost:3000/login/qr/key?date=${new Date()}`)
      //打开二维码轮询开关
      isQueryCode.value = true
      console.log(keyObj.data.data.unikey);
      //二维码的key
      let uniKey:string = keyObj.data.data.unikey
      let QrCodeObj = await axios.get(`http://localhost:3000/login/qr/create?key=${uniKey}&qrimg=true`)
      console.log(QrCodeObj.data.data.qrimg);
      imgBase64.value = QrCodeObj.data.data.qrimg

      //询问二维码状态
      queryCodeStatus(uniKey)
    }

    //是否进行二维码的轮询
    let isQueryCode = ref(true)

    //扫码获取的未授权的用户信息
    let userInfo = reactive({
      nickname: ``,
      avatarUrl: ``,
      cookie: ``
    })

    /**
     * 轮询二维码状态
     * */
    function queryCodeStatus(uniKey:string) {
      //当轮询开关打开时，才进行轮询
      if(isQueryCode.value) {
        /**
         * codeStatus 二维码的状态
         * @args 800 二维码过期
         * @args 801 等待扫码
         * @args 802 待确认
         * @args 803 授权成功
         * */
        let codeStatus:number = 804;
        axios.get(`http://localhost:3000/login/qr/check?key=${uniKey}&date=${new Date()}`)
          .then(statusObj => {
            console.log(statusObj.data);
            codeStatus = statusObj.data.code

            if(codeStatus === 800) {
              console.log(`二维码过期`);
              QrCodeStatus.timeout = true
              QrCodeStatus.waitForScan = false
              QrCodeStatus.scanOk = false
            }else if(codeStatus === 803) {
              console.log(`授权成功`);
              QrCodeStatus.timeout = false
              QrCodeStatus.waitForScan = false
              QrCodeStatus.scanOk = false
              userInfo.cookie = statusObj.data.cookie
              store.commit(`addUserInfo`, userInfo)
              isShowMask.value = false
            }else if(codeStatus === 801) {
              console.log(`等待扫码`);
              setTimeout( async () => {queryCodeStatus(uniKey)}, 500)
            }else if(codeStatus === 802) {
              console.log(`扫码成功，待确认`);
              QrCodeStatus.timeout = false
              QrCodeStatus.waitForScan = false
              QrCodeStatus.scanOk = true
              userInfo.nickname = statusObj.data.nickname
              userInfo.avatarUrl = statusObj.data.avatarUrl
              userInfo.cookie = statusObj.data.cookie
              setTimeout(async () => {queryCodeStatus(uniKey)}, 500)
            }else {
              throw new Error(`状态码错误`)
            }
          })
      }
    }

    return {
      store,

      //搜索框
      isShowDetail,
      searchValue,
      defaultList,
      getDefaultList,
      isShowSearchList,
      recommendSearchObj,
      getRecommendSearchList,

      //手机号登录
      isShowMask,
      clickUnName,
      changWayPhone,
      isLoginByPassword,
      ...toRefs(phoneLoginInfo),
      getCheckCode,
      isPasswordError,
      isCaptchaError,
      loginByPhone,
      verifyCheckCode,

      //二维码登录
      isLoginByQrCode,
      imgBase64,
      getLogInByQRCode,
      ...toRefs(QrCodeStatus),
      isQueryCode,
      queryCodeStatus,
      userInfo
    }
  }
})
</script>

<style scoped lang="less">
//顶部导航栏
.header {
  background-color: #C20C0C;
  height: 70px;
  width: 100%;
  padding-left: 150px;
  display: flex;
  position: absolute;

  //左侧的logo和search框
  .left {
    display: flex;
    align-items: center;

    .logo {
      width: 160px;
      height: 70px;
      background: url("../assets/Header/topbar.png");
    }
    .search {
      display: flex;
      width: 300px;
      background-color: rgba(0,0,0,.15);
      height: 30px;
      margin-left: 80px;
      border-radius: 15px;
      position: relative;

      .search_icon {
        width: 30px;
        height:30px;
        background: url("../assets/Header/search.png") no-repeat center center;
        background-size: 20px 20px;
        margin-left: 15px;
      }

      input {
        display: block;
        width: 255px;
        height: 30px;
        background-color: transparent;
        border: none;
        padding-right: 10px;
        padding-left: 15px;
        color: #fff;
        font-size: 16px;
      }

      //设置placeholder的样式
      input::-webkit-input-placeholder {
        color: rgba(255,255,255,.5);
      }

      .search_list {
        background: #fff;
        width: 350px;
        position: absolute;
        top: 50px;
        height: 300px;
        overflow-y: scroll;
        overflow-x: hidden;
        border: 2px solid #ddd;
        border-radius: 10px;
        z-index: 1000;

        /*设置滚动样式*/
        &::-webkit-scrollbar {
          width: 3px;
        }
        /* 滚动槽 */
        &::-webkit-scrollbar-track {
          -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }
        /* 滚动条滑块 */
        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.1);
          -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
        }
        &::-webkit-scrollbar-thumb:window-inactive {
          background: rgba(255, 0, 0, 0.4);
        }

        div.hot_search{
          width: 300px;
          height: 50px;
          font-size: 16px;
          line-height: 50px;
          padding-left: 30px;
        }

        li {
          width: 350px;
          height: 50px;
          font-size: 20px;
          line-height: 50px;
          padding-left: 30px;
          display: flex;
          flex-direction: row;

          &:hover {
            background-color: rgb(240,240,240);
          }

          div.active {
            color: #f00;
          }

          div.rank_num {
            width: 50px;
            height: 50px;
            text-align: center;
          }

          div.song_name {
            font-size: 15px;
            font-weight: bolder;
            margin-right: 20px;
          }

          div.score {
            color: #ccc;
            font-size: 15px;
            margin-right: 15px;
          }

          .song_icon{
            img {
              width: 30px;
              height: 15px;
            }
          }
        }
      }
      .search_recommend {
        width: 350px;
        position: absolute;
        top: 50px;
        height: 300px;
        overflow-y: scroll;
        overflow-x: hidden;
        border: 2px solid #ddd;
        border-radius: 10px;
        background: #fff;
        z-index: 5;

        /*设置滚动样式*/
        &::-webkit-scrollbar {
          width: 3px;
        }
        /* 滚动槽 */
        &::-webkit-scrollbar-track {
          -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }
        /* 滚动条滑块 */
        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.1);
          -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
        }
        &::-webkit-scrollbar-thumb:window-inactive {
          background: rgba(255, 0, 0, 0.4);
        }

        .recommend_item {
          color: #aaa;
          font-size: 16px;
          margin-top: 10px;

          .recommend_title {
            margin-left: 10px;
          }

          div.recommend_detail {
            font-size: 14px;
            color: #000;
            padding: 5px;
            padding-left: 20px;

            &:hover {
              background-color: rgb(240,240,240);
            }
          }
        }
      }
    }
  }

  .right {
    width: 300px;
    height: 70px;
    //border: 1px solid #000;
    position: absolute;
    right: 50px;
    display: flex;
    align-items: center;

    .profilePhoto {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #ddd;

      img {
        width: 50px;
        height: 50px;
      }
    }

    .userName {
      font-size: 16px;
      color: #fff;
      margin-left: 20px;
    }
  }
  .userName {
    &:hover {
      cursor: pointer;
    }
  }
}

/*用于登录的遮罩层*/
.login_mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,.3);
  z-index: 99;

  .log_box {
    width: 340px;
    height: 500px;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .close_log {
      position: absolute;
      top: 10px;
      right: 10px;
      color: #cccccc;
      font-size: 20px;

      &:hover {
        cursor: pointer;
      }
    }

    .log_top {
      width: 340px;
      height: 140px;
      background: url("../assets/Header/log_top.png");
    }
    .log_by_phone {
      .log_by_phone_wrapper {
        width: 270px;
        height: 100px;
        border: 3px solid #ccc;
        border-radius: 15px;
        margin-left: 35px;
        margin-top: 20px;
        overflow: hidden;

        .phone_wrapper {
          width: 270px;
          height: 50px;
          border-bottom: 3px solid #ccc;
          display: flex;
          overflow: hidden;

          .log_reminder_phone {
            width: 50px;
            height: 50px;
            border-right: 3px solid #ccc;
            background: url("../assets/Header/phone.png") no-repeat center center;
            background-size: 30px 30px;
          }

          input {
            height: 50px;
            width: 200px;
            padding-left: 30px;
            font-size: 15px;
          }
        }

        .password_wrapper {
          width: 270px;
          height: 50px;
          border-bottom: 3px solid #ccc;
          display: flex;
          overflow: hidden;

          .log_reminder_password, .log_reminder_captcha {
            width: 50px;
            height: 50px;
            border-right: 3px solid #ccc;
            background: url("../assets/Header/password.png") no-repeat center center;
            background-size: 25px 25px;
          }

          .log_reminder_captcha {
            background: url("../assets/Header/checkCode.png") no-repeat center center;
            background-size: 25px 25px;
          }

          input {
            height: 50px;
            width: 200px;
            padding-left: 30px;
            font-size: 15px;
          }

          input[type="text"] {
            width: 130px;
          }

          .get_check_code {
            width: 80px;
            height: 50px;
            font-size: 13px;
            border-left: 3px solid #ccc;
            line-height: 50px;
            text-align: center;
            color: #C20C0C;
            font-weight: bolder;

            &:hover{
              cursor: pointer;
            }
          }
        }
        }

      .login_submit {
        width: 250px;
        height: 35px;
        background: #EA4242F1;
        color: #fff;
        line-height: 35px;
        text-align: center;
        font-size: 18px;
        margin-top: 40px;
        margin-left: 45px;
        border-radius: 20px;

        &:hover {
          cursor: pointer;
        }
      }

      .use_qr{
        padding-top: 20px;
        display: flex;
        justify-content: center;

        span {
          text-decoration: underline;
          color: blue;
          font-size: 20px;
          font-family: "楷体";
          font-weight: bolder;

          &:hover {
            cursor: pointer;
          }
        }
      }

      .log_info_error {
        width: 200px;
        height: 20px;
        font-size: 16px;
        color: #f00;
        margin-left: 70px;
        font-weight: bolder;
        display: flex;

        .info_error_img {
          width: 20px;
          height: 20px;
          background: url("../assets/Header/error.png") no-repeat;
          background-size: 20px 20px;
          margin-right: 20px;
        }
      }
    }

    .log_by_code {
      margin-top: 10px;

      .reminder_timeout, .reminder_wait {
        width:200px;
        height: 25px;
        display: flex;
        margin-left: 70px;
        justify-content: center;

        .reminder_img_timeout, .reminder_img_wait {
          width: 25px;
          height: 25px;
          background: url("../assets/Header/error.png") no-repeat center center;
          background-size: 20px 20px;
        }

        .reminder_img_wait {
          background: url("../assets/Header/wait.png") no-repeat center center;
          background-size: 20px 20px;
        }

        .reminder_content {
          font-size: 15px;
          line-height: 25px;
          font-weight: bolder;
        }

        .timeout {
          color: #f00;
        }

        .wait {
          color: #1afa29;
        }
      }

      .QrImg {
        width: 180px;
        height: 180px;
        margin-left: 80px;
        margin-top: 20px;
      }

      .refresh_code {
        width: 200px;
        margin-left: 70px;
        background-color: orange;
        color: #fff;
        height: 30px;
        font-size: 18px;
        line-height: 30px;
        border-radius: 20px;
        text-align: center;
        font-weight: bolder;
        font-family: "楷体";

        &:hover {
          cursor: pointer;
        }
      }

      .chang_login_way {
        width: 200px;
        height: 30px;
        font-size: 20px;
        line-height: 30px;
        color: blue;
        margin-top: 20px;
        font-weight: bolder;
        font-family: "楷体";
        margin-left: 70px;
        text-decoration: underline;

        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}
</style>