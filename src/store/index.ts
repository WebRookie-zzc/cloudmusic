import { createStore } from 'vuex'
import axios from "axios";

export default createStore({
  state: {
    //todo 将LogInfo替换为带有status 的空对象 (防止过多请求导致Ip被封)
    logInfo: {
      status: true,
      profile: {"followed":false,"backgroundUrl":"https://p2.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg","detailDescription":"","backgroundImgIdStr":"109951162868126486","avatarImgIdStr":"109951165401327429","userId":3346081755,"userType":0,"accountStatus":0,"gender":0,"vipType":0,"avatarImgId":109951165401327420,"nickname":"陌陌还不睡嘛","backgroundImgId":109951162868126480,"birthday":-2209017600000,"city":360100,"avatarUrl":"https://p3.music.126.net/k_NmRBwaCIvdepvs-DINBA==/109951165401327429.jpg","defaultAvatar":false,"province":360000,"expertTags":null,"experts":{},"mutual":false,"remarkName":null,"authStatus":0,"djStatus":0,"description":"","signature":"","authority":0,"avatarImgId_str":"109951165401327429","followeds":0,"follows":4,"eventCount":0,"avatarDetail":null,"playlistCount":4,"playlistBeSubscribedCount":0},
      // profile: {}
    },
    token: ``,
    // token:"3444773f291218f76bceda642bb77f707a79b4fc88ce1d7f5d7e51ede3752937993166e004087dd3d78b6050a17a35e705925a4e6992f61d07c385928f88e8de",
    // cookie: ``,
    cookie: "__remember_me=true; Max-Age=1296000; Expires=Mon, 21 Feb 2022 10:56:53 GMT; Path=/;;MUSIC_A_T=1590498593870; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/weapi/feedback;;MUSIC_A_T=1590498593870; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/eapi/feedback;;MUSIC_R_T=1591409369456; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/eapi/feedback;;MUSIC_A_T=1590498593870; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/openapi/clientlog;;NMTID=00OUq71xMBAY3YoakYou6g_HJb38d0AAAF-zq3yYA; Max-Age=315360000; Expires=Wed, 4 Feb 2032 10:56:53 GMT; Path=/;;MUSIC_R_T=1591409369456; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/openapi/clientlog;;MUSIC_A_T=1590498593870; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/api/clientlog;;MUSIC_R_T=1591409369456; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/neapi/clientlog;;MUSIC_R_T=1591409369456; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/wapi/feedback;;MUSIC_R_T=1591409369456; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/weapi/feedback;;MUSIC_R_T=1591409369456; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/neapi/feedback;;MUSIC_A_T=1590498593870; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/eapi/clientlog;;MUSIC_A_T=1590498593870; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/neapi/feedback;;MUSIC_A_T=1590498593870; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/wapi/clientlog;;MUSIC_R_T=1591409369456; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/wapi/clientlog;;MUSIC_A_T=1590498593870; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/wapi/feedback;;MUSIC_A_T=1590498593870; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/api/feedback;;MUSIC_A_T=1590498593870; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/neapi/clientlog;;MUSIC_A_T=1590498593870; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/weapi/clientlog;;MUSIC_R_T=1591409369456; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/eapi/clientlog;;MUSIC_U=3444773f291218f76bceda642bb77f707a79b4fc88ce1d7f52b1b24112853abb993166e004087dd3d78b6050a17a35e705925a4e6992f61d07c385928f88e8de; Max-Age=1296000; Expires=Mon, 21 Feb 2022 10:56:53 GMT; Path=/;;__csrf=2b828c9b8b1ad37f340a52caffa6ec35; Max-Age=1296010; Expires=Mon, 21 Feb 2022 10:57:03 GMT; Path=/;;MUSIC_SNS=; Max-Age=0; Expires=Sun, 6 Feb 2022 10:56:53 GMT; Path=/;MUSIC_R_T=1591409369456; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/api/clientlog;;MUSIC_R_T=1591409369456; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/weapi/clientlog;;MUSIC_R_T=1591409369456; Max-Age=2147483647; Expires=Fri, 24 Feb 2090 14:11:00 GMT; Path=/api/feedback;",
    //要播放的音乐ID
    // musicId: 1824457777,
    // musicId: 1910911958,
    //现在播放的音乐的单曲id
    musicId : 1910966474,
    // musicId: 0,
    // 用户所有的歌单
    userPlayList: [{id: 0}],
    //现在正在播放的歌单
    // playingPlaylist: {songs:[{"name": ''}]}
    playingPlaylist: {songs:[{"name":"华灯星聚 Myriad of Lights","id":1910966474,"pst":0,"t":0,"ar":[{"id":12487174,"name":"HOYO-MiX","tns":[],"alias":[]}],"alia":[],"pop":100,"st":0,"rt":"","fee":0,"v":12,"crbt":null,"cf":"","al":{"id":138671335,"name":"「飞彩镌流年」游戏原声EP专辑","picUrl":"https://p1.music.126.net/8gMfTTbDifrypmWQ2fM0Ig==/109951166919194723.jpg","tns":[],"pic_str":"109951166919194723","pic":109951166919194720},"dt":248021,"h":{"br":320001,"fid":0,"size":9923565,"vd":-10410},"m":{"br":192001,"fid":0,"size":5954157,"vd":-7828},"l":{"br":128001,"fid":0,"size":3969453,"vd":-6099},"a":null,"cd":"01","no":3,"rtUrl":null,"ftype":0,"rtUrls":[],"djId":0,"copyright":0,"s_id":0,"mark":0,"originCoverType":0,"originSongSimpleData":null,"tagPicList":null,"resourceState":true,"version":12,"songJumpInfo":null,"entertainmentTags":null,"single":0,"noCopyrightRcmd":null,"rurl":null,"rtype":0,"mst":9,"cp":2710648,"mv":0,"publishTime":1643558400000}]},
    //当前播放歌曲所处于歌单的索引值
    playingSongIndex: 0,
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
    },
    changePlayingPlaylist(state, newPlayList) {
      state.playingPlaylist.songs = newPlayList

      /**
       * 更换播放的歌单后，更换播放的歌曲
       * */
      state.playingSongIndex = 0
      state.musicId = newPlayList[state.playingSongIndex].id
    },
    changePlayingSongIndex: function (state, newIndex) {
      if (newIndex >= state.playingPlaylist.songs.length) newIndex = 0
      else if (newIndex < 0) newIndex = state.playingPlaylist.songs.length - 1
      state.playingSongIndex = newIndex

      //更换播放音乐的ID
      state.musicId = state.playingPlaylist.songs[state.playingSongIndex].id
    },

    /**
     * 用于搜索并点击后，添加到播放列表
     * */
    addElementToPlayingPlaylist(state, newValue:any) {
      state.playingPlaylist.songs.splice(state.playingSongIndex + 1, 0, newValue)
      state.playingSongIndex += 1
      state.musicId = state.playingPlaylist.songs[state.playingSongIndex].id
    },

    /**
     * 删除播放列表中的某一首歌曲
     * @param state state 对象
     * @param index 要删除歌曲的索引值
     * */
    deleteElementOfPlayPlaylist(state, index:number) {
      //播放列表中至少有一首歌曲
      if(state.playingPlaylist.songs.length === 1) return
      if(index === state.playingSongIndex) {
        //删除点击个歌曲
        state.playingPlaylist.songs.splice(index,1)

        //如果删除的是正在播放的歌曲，那么需要切换播放的歌曲
        state.musicId = state.playingPlaylist.songs[state.playingSongIndex].id
      }else if (index < state.playingSongIndex) {
        state.playingSongIndex = state.playingSongIndex - 1
        state.playingPlaylist.songs.splice(index,1)
      }
        else{
        state.playingPlaylist.songs.splice(index,1)
      }
    }
  },
  actions: {
    /**
     * 获取用户歌单列表
     * */
    async getUserPlayList(context) {
      if(context.state.userPlayList[0].id === 0 && context.state.logInfo.status) {
        console.log(`向服务器发送请求，获取用户歌单`);
        //当本地没有用户歌单时，才向服务器发送请求
        let res = await axios({
          url: `http://localhost:3000/user/playlist?uid=${context.state.logInfo.profile.userId}`,
          method: "get",
        })
        if(res.data.code === 200) {
          console.log(res.data.playlist);
          context.state.userPlayList = res.data.playlist
        }
      }
    },

    /**
     * 获取本歌单的所有的歌曲
     * @param context 上下文
     * @param playlistIndex 歌单的索引值
     * */
    async getSongsListInOnePlaylist(context, playlistIndex:number) {
      let res = await axios({
        url:`http://localhost:3000/playlist/track/all`,
        method: "get",
        params: {
          id: context.state.userPlayList[playlistIndex].id
        }
      })
      // console.log(res.data);
      context.commit(`changePlayingPlaylist`, res.data.songs)
    }
  },
  modules: {
  }
})
