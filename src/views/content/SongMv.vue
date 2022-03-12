<template>
  <div class="search_view">
    <div class="none_mv"
         v-if="mlogArr.mlogArr.length === 0"
         style="font-size: 20px; height: 20px; font-weight: bolder;">此歌曲没有MV</div>
    <ul class="song_mv_list" v-if="isShowMvList">
      <li class="mv_list_item" v-for="(item, index) in mlogArr.mlogArr">
        <div class="mv_img" @click="handleClickMvImg(index)">
          <img :src="item.resource.mlogBaseData.coverUrl" alt="">
        </div>
        <div class="mv_title">{{item.resource.mlogBaseData.originalTitle}}</div>
      </li>
    </ul>
    <div class="mv" v-if="!isShowMvList">
      <div class="back_wrapper">
        <div class="back_button" title="返回" @click.stop="isShowMvList = true">&lt;</div>
      </div>
<!--      <video controls :src="mvUrl"></video>-->
      <video controls src="../../assets/Content/SongMV/world.execute(me).mp4"></video>

<!--      作者信息-->
      <div class="mv_info">
        <div class="user_info">
          <div class="user_img">
            <img :src="mlogArr.mlogArr[mvArrIndex].resource.userProfile.avatarUrl" alt="">
          </div>
          <div class="user_name">{{mlogArr.mlogArr[mvArrIndex].resource.userProfile.nickname}}</div>
          <div class="follow">关注 + </div>
        </div>
        <div class="mv_title">
          {{mlogArr.mlogArr[mvArrIndex].resource.mlogBaseData.originalTitle}}
        </div>
        <ul class="mv_tags">
          <li class="mv_tag_item" v-for="(item, index) in mvDetail.videoGroup" :key="index">{{item.name}}</li>
        </ul>
        <div class="mv_comments_wrapper">
          <div class="new_comment_title">视频评论</div>
          <ul class="new_comment_wrapper">
            <li class="comment_item" v-for="(item, index) in commentArr.commentArr" :key="index">
              <div class="img"><img :src="item.user.avatarUrl" alt=""></div>
              <div class="content_wrapper">
                <div class="content">
                  <div class="comment_span_wrapper">
                    <span style="color: #00f">{{item.user.nickname}}:</span>{{item.content}}
                  </div>
                </div>
                <div class="comment_date_and_like_btn">
                  <div class="comment_date">{{item.timeStr}}</div>
                  <div class="right_do">
                    <div class="comment_like" title="点赞"
                         :class="{active: item.liked }"
                         @click="handleClickLike(index)">
                      {{item.likedCount}}
                    </div>
                    <div class="comment_share" title="分享"></div>
                    <div class="comment_reply" title="回复评论"
                         @click="isShowWrittenCommentMask = true; replyCommentId = item.commentId ;writtenCommentType = 2"></div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div class="comment_buttons">
            <div class="get_more_comment" @click="commentOffset += 1; getCommentArr(vid, commentOffset)">获取更多评论 &gt; </div>
            <div class="write_comment" @click="isShowWrittenCommentMask = true; writtenCommentType = 1">写评论</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--    写评论遮罩层-->
  <teleport to="body">
    <div class="comment_written_mask" v-if="isShowWrittenCommentMask">
      <div class="comment_wrapper">
        <div class="close_comment" @click="isShowWrittenCommentMask = false">X</div>
        <textarea name="" id="" cols="30" rows="10" v-model="commentWritten"></textarea>
        <div class="comment_submit" @click="sendComment()">评论</div>
      </div>
    </div>
  </teleport>
</template>

<script lang="js">
import {defineComponent, onBeforeMount, reactive, ref, toRefs, watch} from "vue";
import axios from "axios"
import {useStore} from "vuex";

export default defineComponent({
  name: `SongMv`,
  setup() {
    let store = useStore()

    let search = reactive({
      //视频的id，
      vid: 0,
      //存储mlog数组
      mlogArr: {mlogArr: []},
      /**
       * 获取相关歌曲的mlog信息
       * */
      async getSearchList() {
        let res = await axios({
          url: "http://localhost:3000/mlog/music/rcmd",
          method: `get`,
          params: {
            // songid: 435278010,
            // songid: store.state.musicId
            songid: store.state.musicId,
          }
        })
        console.log(res.data, `mv`);
        this.mlogArr.mlogArr = res.data.data.feeds
      },

      /**
       * 点击MV图片时，的处理函数
       * @param index 点击图片的索引值
       * */
      async handleClickMvImg(index) {
        comment.commentOffset = 0
        this.isShowMvList = false
        this.mvArrIndex = index

        /**
         * 将mlog 转换为vid
         * */
        let res = await axios({
          url: `http://localhost:3000/mlog/to/video`,
          method: `get`,
          params: {
            id: this.mlogArr.mlogArr[index].id
          }
        })
        // console.log(res.data);
        //视频的vid
        this.vid = res.data.data
        let vid = this.vid

        // console.log(vid);
        /**
         * 获取视频的播放地址
         * */
        let res1 = await axios({
          url: `http://localhost:3000/video/url`,
          method: `get`,
          params: {
            id: vid
          }
        })
        // console.log(res1.data);
        this.mvUrl = res1.data.urls[0].url
        // console.log(this.mvUrl, `mvUrl`);

        await this.getMvDetail(vid)
        await comment.getCommentArr(vid)
      },

      //是否显示mv列表
      isShowMvList: true,

      //MV的url
      mvUrl: ``,

      //点击的索引值
      mvArrIndex: 0,

      //mv详情
      mvDetail: reactive({}),

      /**
       * 获取MV的详情
       * @param {number} vid mv的id
       * */
      async getMvDetail(vid) {
        let res = await axios({
          url: `http://localhost:3000/video/detail`,
          method: `get`,
          params: {
            id: vid
          }
        })
        console.log(res.data, `mv详情`);
        search.mvDetail = res.data.data
      }
    })

    /**
     * mv评论功能
     * */
    const comment = reactive({
      //评论数组
      commentArr: {commentArr: []},

      //评论的页数
      commentOffset: 0,

      /**
       * 获取视频评论数组
       * @param {number} vid 视频的id
       * @param {number} offset 获取评论的第offset页数据
       * */
      async getCommentArr(vid, offset = 0) {
        let res = await axios({
          url: `http://localhost:3000/comment/video`,
          method: `get`,
          params: {
            id: vid,
            offset: 20 * offset
          }
        })

        console.log(res.data);
        if(offset === 0) {
          this.commentArr.commentArr = res.data.comments
        }else {
          this.commentArr.commentArr.push(...res.data.comments)
        }

      },

      /**
       * 处理点赞事件
       * @param index {number} 点赞评论的id
       * */
      async handleClickLike(index) {
        if(this.commentArr.commentArr[index].liked) {
          this.commentArr.commentArr[index].likedCount -= 1
          await this.likeComment(index, 0)
        }else {
          this.commentArr.commentArr[index].likedCount +=  1
          console.log(this.commentArr.commentArr[index].likedCount);
          await this.likeComment(index, 1)
        }
        this.commentArr.commentArr[index].liked = !this.commentArr.commentArr[index].liked
      },

      /**
       * 给评论点赞
       * @param index 评论的索引值
       * @param t 点赞或取消点赞
       * */
      async likeComment(index, t) {
        // console.log(commentArr[type][index].commentId, `点赞评论id`)
        let res = await axios({
          url: `http://localhost:3000/comment/like`,
          method: `get`,
          params: {
            id: store.state.logInfo.profile.userId,
            cid: this.commentArr.commentArr[index].commentId,
            t,
            type: 5,
            cookie: store.state.cookie,
            time: new Date()
          }
        })
        console.log(res.data);
      },

      /**
       * 写评论和回复评论
       * */
      //是否显示写评论遮罩层
      isShowWrittenCommentMask: false,
      //和v-modle绑定的 用户写的评论
      commentWritten: ``,

      //回复评论的id
      replyCommentId: null,

      //写评论的类型
      writtenCommentType: 1,

      /**
       * 发表评论
       * */
      async sendComment() {
        this.isShowWrittenCommentMask = false
        await axios({
          url: `http://localhost:3000/comment`,
          method: `get`,
          params: {
            t: this.writtenCommentType,
            type: 5,
            id: store.state.musicId,
            content: comment.commentWritten,
            commentId: this.replyCommentId,
            cookie: store.state.cookie
          }
        })
      },
    })

    // let musicId = ref(store.state.musicId)

    watch(() => store.state.musicId, async () => {
      search.isShowMvList = true
      await search.getSearchList()
    })

    onBeforeMount(async () => {
      await search.getSearchList()
    })
    return {
      ...toRefs(search),
      ...toRefs(comment),
    }
  }
})
</script>

<style scoped lang="less">
  .search_view {
    width: 100%;
    height: 90%;
    //border: 1px solid #000;
    overflow-x: hidden;
    overflow-y: scroll;
    display: flex;
    min-width: 1200px;
    justify-content: center;

    &::-webkit-scrollbar {
      width: 3px;
      height: 100%;
    }

    &::-webkit-scrollbar-thumb {
      width: 3px;
      background-color: #C20C0C;
      height: 4px;
    }

    &::-webkit-scrollbar-track {
      background-color: #666666;
    }

    .song_mv_list {
      width: 1200px;
      display: flex;
      flex-direction: row;
      //justify-content: space-around;
      flex-wrap: wrap;

      .mv_list_item {
        width: 350px;
        height: 250px;
        //border: 1px solid #000;
        margin: 10px 15px;

        .mv_img, img {
          width: 350px;
          height: 200px;
          border-radius: 10px;
          cursor: pointer;
        }

        .mv_title {
          width: 100%;
          padding-left: 10px;
          padding-right: 10px;
          padding-top: 10px;
          height: 40px;
          font-family: "楷体", serif;
          font-size: 16px;
          font-weight: bolder;
        }
      }
    }

    .mv {
      width: 100%;
      height: 100%;
      //border: 1px solid #000;

      .back_wrapper {
        width: 100%;
        height: 40px;

        .back_button {
          width: 30px;
          height: 30px;
          text-align: center;
          font-size: 30px;
          line-height: 30px;
          font-weight: bolder;
          user-select: none;
          cursor: pointer;
          background-color: #ccc;
          border-radius: 50%;
        }
      }


      video {
        width: 100%;
        height: 90%
        //height: 90%;
      }

      .mv_info {
        width: 100%;
        margin-top: 30px;
        padding: 15px;

        .user_info {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: left;

          .user_img {
            width: 50px;
            height: 50px;

            img {
              width: 50px;
              height: 50px;
              border-radius: 50%;
            }
          }

          .user_name {
            //width: 100px;
            font-size: 20px;
            height: 50px;
            line-height: 50px;
            margin-left: 30px;
          }

          .follow {
            width: 100px;
            font-size: 20px;
            line-height: 50px;
            height: 48px;
            font-weight: bolder;
            margin-left: 20px;
            border: 2px solid #C20C0C;
            color: #C20C0C;
            border-radius: 40px;
            text-align: center;
            background-color: #ddd;
            font-family: "楷体", serif;
            cursor: pointer;
            user-select: none;
          }
        }

        .mv_title {
          margin-top: 10px;
          width: 100%;
          height: 50px;
          font-family: "楷体", serif;
          font-size: 30px;
          font-weight: bolder;
          line-height: 50px;
          //text-align: center;
        }

        .mv_tags {
          width: 100%;
          height: 20px;
          display: flex;
          flex-direction: row;
          margin-top: 10px;

          .mv_tag_item {
            width: 80px;
            height: 20px;
            font-size: 14px;
            line-height: 20px;
            font-weight: bolder;
            border-radius: 20px;
            text-align: center;
            background-color: #ddd;
            margin-right: 10px;
            margin-left: 10px;
            cursor: pointer;
            user-select: none;
          }
        }

        .mv_comments_wrapper {
          margin-top: 30px;
          width: 100%;

          .new_comment_title {
            font-size: 20px;
            color: #000;
            font-family: "楷体", serif;
            font-weight: bolder;
            border-radius: 20px;
            border:1px solid #000;
            background-color: #ccc;
            text-align: center;
          }

          .new_comment_wrapper {
            width: 100%;

            .comment_item{
              display: flex;
              width: 100%;
              //height: 70px;
              padding-top: 10px;
              padding-right: 5px;
              flex-direction: row;
              flex-wrap: nowrap;
              border-bottom: 1px solid #ccc;
              padding-bottom: 5px;

              .img{
                width: 50px;
                height: 100%;

                img {
                  width: 50px;
                  height: 50px;
                  border-radius: 50%;
                }
              }

              .content_wrapper {
                width: 100%;
              }

              .content {
                padding-left: 20px;
                //height: 150px;
                min-height: 53px;
              }

              .comment_date_and_like_btn {
                padding-left: 20px;
                padding-right: 20px;
                display: flex;
                justify-content: space-between;
                height: 20px;

                .right_do {
                  display: flex;
                  flex-direction: row;
                  user-select: none;

                  .comment_like {
                    width: 60px;
                    height: 20px;
                    line-height: 20px;
                    cursor: pointer;
                    padding-left: 20px;
                    background: url("../../assets/Player/like_black.png") no-repeat 2px center;
                    background-size: 16px 16px;

                    &.active {
                      background: url("../../assets/Player/like_red.png") no-repeat 2px center;
                      background-size: 16px 16px;
                    }
                  }

                  .comment_share {
                    width: 20px;
                    height: 20px;
                    background: url("../../assets/Player/share.png") no-repeat center center;
                    background-size: 16px 16px;
                    cursor: pointer;
                  }

                  .comment_reply {
                    width: 20px;
                    height: 20px;
                    background: url("../../assets/Player/reply.png") no-repeat center center;
                    background-size: 16px 16px;
                    margin-left: 20px;
                    cursor: pointer;
                  }
                }
              }
            }

          }

          .comment_buttons {
            width: 100%;
            height: 40px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            margin-top: 30px;

            div {
              width: 200px;
              height: 40px;
              margin-left: 20px;
              margin-right: 20px;
              border-radius: 30px;
              border: 2px solid #ccc;
              background-color: #ddd;
              font-size: 20px;
              line-height: 40px;
              text-align: center;
              font-family: "楷体", serif;
              font-weight: bolder;
              user-select: none;
              cursor: pointer;
            }
          }

          .show_more_wrapper {
            display: flex;
            justify-content: center;
            width: 100%;
            align-items: center;
            margin-top: 20px;
            margin-bottom: 20px;
            height: 60px;
          }

          .show_more_button {
            width: 200px;
            text-align: center;
            border: 1px solid #ccc;
            font-weight: bolder;
            font-family: "楷体", serif;
            background-color: #fff;
            height: 30px;
            font-size: 20px;
            line-height: 30px;
            border-radius: 20px;
            user-select: none;
            cursor: pointer;
          }
        }
      }
    }
  }

  .comment_written_mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;

    .comment_wrapper {
      background-color: #fff;
      width: 400px;
      height: 330px;
      padding: 40px 20px 20px;
      position: relative;
      border-radius: 20px;

      .close_comment {
        position: absolute;
        top: 10px;
        right: 20px;
        user-select: none;
        font-size: 20px;
        font-weight: bolder;
        color: #000;
        //margin-bottom: 20px;
        cursor: pointer;
      }

      textarea {
        width: 360px;
        height: 200px;
        font-weight: bolder;
        font-size: 18px;
        padding: 10px;
        font-family: "楷体", serif;
      }

      .comment_submit {
        position: absolute;
        right: 30px;
        bottom: 30px;
        width: 100px;
        height: 30px;
        background-color: #C20C0C;
        border-radius: 20px;
        font-size: 20px;
        line-height: 30px;
        text-align: center;
        color: #fff;
        font-weight: bolder;
        font-family: "楷体", serif;
        user-select: none;
        cursor: pointer;
      }
    }
  }
</style>