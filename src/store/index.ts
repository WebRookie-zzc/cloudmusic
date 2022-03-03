import { createStore } from 'vuex'

export default createStore({
  state: {
    //todo 将LogInfo替换为带有status 的空对象 (防止过多请求导致Ip被封)
    logInfo: {
      status: false,
      // profile: {"followed":false,"backgroundUrl":"https://p2.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg","detailDescription":"","backgroundImgIdStr":"109951162868126486","avatarImgIdStr":"109951165401327429","userId":3346081755,"userType":0,"accountStatus":0,"gender":0,"vipType":0,"avatarImgId":109951165401327420,"nickname":"陌陌还不睡嘛","backgroundImgId":109951162868126480,"birthday":-2209017600000,"city":360100,"avatarUrl":"https://p3.music.126.net/k_NmRBwaCIvdepvs-DINBA==/109951165401327429.jpg","defaultAvatar":false,"province":360000,"expertTags":null,"experts":{},"mutual":false,"remarkName":null,"authStatus":0,"djStatus":0,"description":"","signature":"","authority":0,"avatarImgId_str":"109951165401327429","followeds":0,"follows":4,"eventCount":0,"avatarDetail":null,"playlistCount":4,"playlistBeSubscribedCount":0},
      profile: {}
    },
    token: ``,
    // token:"3444773f291218f76bceda642bb77f707a79b4fc88ce1d7f5d7e51ede3752937993166e004087dd3d78b6050a17a35e705925a4e6992f61d07c385928f88e8de",
    // cookie: ``,
    cookie: "__remember_me=true; Max-Age=1296000; Expires=Mon, 21 Feb 2022 10:56:53 GMT; Path=/;;MUSIC_A_T=1590498593870; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/weapi/feedback;;MUSIC_A_T=1590498593870; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/eapi/feedback;;MUSIC_R_T=1591409369456; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/eapi/feedback;;MUSIC_A_T=1590498593870; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/openapi/clientlog;;NMTID=00OUq71xMBAY3YoakYou6g_HJb38d0AAAF-zq3yYA; Max-Age=315360000; Expires=Wed, 4 Feb 2032 10:56:53 GMT; Path=/;;MUSIC_R_T=1591409369456; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/openapi/clientlog;;MUSIC_A_T=1590498593870; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/api/clientlog;;MUSIC_R_T=1591409369456; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/neapi/clientlog;;MUSIC_R_T=1591409369456; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/wapi/feedback;;MUSIC_R_T=1591409369456; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/weapi/feedback;;MUSIC_R_T=1591409369456; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/neapi/feedback;;MUSIC_A_T=1590498593870; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/eapi/clientlog;;MUSIC_A_T=1590498593870; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/neapi/feedback;;MUSIC_A_T=1590498593870; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/wapi/clientlog;;MUSIC_R_T=1591409369456; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/wapi/clientlog;;MUSIC_A_T=1590498593870; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/wapi/feedback;;MUSIC_A_T=1590498593870; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/api/feedback;;MUSIC_A_T=1590498593870; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/neapi/clientlog;;MUSIC_A_T=1590498593870; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/weapi/clientlog;;MUSIC_R_T=1591409369456; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/eapi/clientlog;;MUSIC_U=3444773f291218f76bceda642bb77f707a79b4fc88ce1d7f52b1b24112853abb993166e004087dd3d78b6050a17a35e705925a4e6992f61d07c385928f88e8de; Max-Age=1296000; Expires=Mon, 21 Feb 2022 10:56:53 GMT; Path=/;;__csrf=2b828c9b8b1ad37f340a52caffa6ec35; Max-Age=1296010; Expires=Mon, 21 Feb 2022 10:57:03 GMT; Path=/;;MUSIC_SNS=; Max-Age=0; Expires=Sun, 6 Feb 2022 10:56:53 GMT; Path=/;MUSIC_R_T=1591409369456; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/api/clientlog;;MUSIC_R_T=1591409369456; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/weapi/clientlog;;MUSIC_R_T=1591409369456; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/api/feedback;",
    //要播放的音乐ID
    // musicId: 1824457777,
    // musicId: 1910911958,
    musicId : 1824454149
  },
  mutations: {
    addUserInfo(state, userInfo) {
      state.logInfo = {
        status: true,
        profile: userInfo
      }
    },
    changeToken(state, token) {
      state.token = token
    },
    changeCookie(state, cookie) {
      state.cookie = cookie
    },
    changeMusicId(state, newMusicId){
      state.musicId = newMusicId
    }
  },
  actions: {
  },
  modules: {
  }
})
