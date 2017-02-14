<template lang="html">
    <div class="review-wrap">
        <div class="review-word-head">
            <p>
                <span class="word" @click="back" v-show="lastReviewData.en !== ''">{{lastReviewData.en + ' ' + lastReviewData.meaning }}</span>
                <span class="word-index">{{ (review_data_index + 1) + '/' + words_list.length }}</span>
            </p>
        </div>
        <swiper :options="swiperOption" ref="mySwiper" class="noTouch">
            <swiper-slide v-for="(word, index) in words_list" :data-index="index" class="swiper-no-swiping">
                <div class="review-word-detail flex-vertical flex-middle">
                    <p class="review-word-en">{{ word.en }}</p>
                    <transition name="fade">
                        <p class="review-word-cn" v-if="knowThisWord && (index === review_data_index)">{{ word.meaning }}</p>
                    </transition>
                </div>
            </swiper-slide>
        </swiper>
        <div class="review-btns">
            <router-link to="unknownword">
                <my-btn value="不认识"></my-btn>
            </router-link>
            <my-btn value="认识" @click.native="know"></my-btn>
        </div>
    </div>
</template>

<script>
import Button from '../util/button.vue'
import { swiper, swiperSlide } from '../../../node_modules/vue-awesome-swiper'

export default {
    data () {
        return {
            knowThisWord : false,
            detailDataList : {}
        }
    },
    computed : {
        activeWord () {
            if (this.review_data_index < this.words_list.length) {
              return this.$store.state.active_day_data.camp_data.word_list[this.review_data_index].en
            }
        },
        swiperOption () {
            var that = this
            return {
                slidesPerView: 1,
                spaceBetween: 0,
                noSwiping : true,
                initialSlide : that.review_data_index
            }
        },
        swiper () {
            return this.$refs.mySwiper.swiper
        },
        review_data_index () {
            return this.$store.state.review_data_index
        },
        words_list () {
            return this.$store.state.active_day_data.camp_data.word_list
        },
        currentReviewData () {
            return this.words_list[this.review_data_index]
        },
        lastReviewData () {
            var obj = {}
            if ((this.review_data_index - 1) >= 0) {
                obj = {
                    en :  this.words_list[this.review_data_index - 1].en,
                    meaning :this.words_list[this.review_data_index - 1].meaning
                }
            }else{
                obj = {
                    en : '',
                    meaning : ''
                }
            }
            return obj
        }
    },
    // watch : {
    //     'review_data_index' (val) {
    //         this.$store.dispatch('setActiveDetail',val)
    //     }
    // },
    methods:  {
        know () {
            this.knowThisWord = true
            var _this = this
            setTimeout(function () {
                if (_this.review_data_index === (_this.words_list.length - 1)) {
                    _this.$store.dispatch('updateStudyState',{
                        dayIndex : _this.$store.state.active_day,
                        dayState : 3
                    })
                    var newState = _this.$store.state.user_info.learning_state_list.join(',')
                    _this.setNewState(newState)
                    return false
                }else if (_this.review_data_index >= (_this.words_list.length - 1)) {
                    return false
                }else{
                    _this.knowThisWord = false
                    var review_data_index  = (_this.review_data_index) + 1
                    _this.$store.dispatch('setActiveDetail',_this.detailDataList[_this.words_list[review_data_index].en])
                    // _this.$router.push('reviewword?index=' + review_data_index)
                    _this.swiper.slideTo(review_data_index,600,false)
                    _this.updateReviewData(review_data_index)
                }
            },400)
        },
        setNewState (newState) {
          var requestUrl = this.$store.state.host + '/study/set_learning_state'
          var data = {
              openId : this.$store.state.user_info.open_id,
              newState : newState
          }
          this.$http.post(requestUrl,data).then(response => {
              if (response.body.result === 'success') {
                this.$store.dispatch('updateReviewData',0)
                this.$store.dispatch('setActiveDetail',this.detailDataList[0])
                this.knowThisWord = false
                this.$router.push('reviewcomplete')
              }
          }, response => {
            //error callback
          })
        },
        back () {
            var review_data_index  = (this.review_data_index) - 1
            this.updateReviewData(review_data_index)
            this.$store.dispatch('setActiveDetail',this.detailDataList[this.words_list[review_data_index].en])
            this.swiper.slideTo(review_data_index ,600,false)
        },
        updateReviewData (index) {
            this.$store.dispatch('updateReviewData',index)
        },
        getDetail (word) {
            var requestUrl = 'http://fun.baicizhan.com/data_maker/word_topic/list?page=1&value='+word+'&status=10'
            this.$http.get(requestUrl).then(response => {
              var data = response.body.data[0]
              var wordDetail = {
                  //id : '0_0_1', //第1期,第1天,第1个单词
                  en : data.word,
                  cn : data.mean_cn,
                  meaning : data.mean_cn,
                  pronounce : data.word_audio_name,//音频链接
                  count : data.freq, // 考试频率
                  // study_state : 0,//当前用户学习状态
                  // review_state : 0,//当前用户复习状态
                  audio : data.word_audio_name,
                  detail : {
                      test : {},
                      film : {},
                      music : {}
                  }
              }
              var assetsBaseUrl = 'http://assets.baicizhan.com/ada/cet4/'
              for (var i = 0; i < data.sentences.length; i++) {
                  var detailType = ''
                  if (data.sentences[i].from_type === 1) {
                    detailType = 'test'
                  }else if (data.sentences[i].from_type === 2) {
                    detailType = 'film'
                  }else if (data.sentences[i].from_type === 3) {
                    detailType = 'music'
                  }
                  if (detailType !== '') {
                    wordDetail.detail[detailType] = {
                      img : (data.sentences[i].pic.indexOf('http') > -1)?(data.sentences[i].pic):(assetsBaseUrl + data.sentences[i].pic),
                      eg : data.sentences[i].text_en,
                      eg_meaning : data.sentences[i].text_cn,
                      eg_source : data.sentences[i].from
                    }
                  }
              }
              this.detailDataList[wordDetail.en] = wordDetail
            }, response => {
              //error callback
            })
        }
    },
    components: {
        'my-btn': Button,
        swiper,
        swiperSlide
    },
    created () {
        for (var i = 0; i < this.words_list.length; i++) {
            var word = this.words_list[i].en
            this.getDetail(word)
        }
    }
}

</script>

<style lang="css">
.review-wrap {
    padding: 17px 15px;
    box-sizing: border-box;
    height: 100%;
}
.review-word-head p{
    height: 23px;
    line-height: 23px;
    margin: 0;
}
.review-word-head .word {
    font-size: 16px;
    color: #a9aeae;
}
.review-word-head .word-index {
    float: right;
    font-size: 18px;
    color: #3b3d38;
}
.review-btns {
    text-align: center;
    position: absolute;
    width: 100%;
    bottom: 50px;
    left: 0;
}
.review-btns .btn-default {
    width: 37.3%;
    display: inline-block;
    margin: 0 8px;
}
.review-word-detail {
    position: absolute;
    top: 40px;
    left: 15px;
    right: 15px;
    bottom: 95px;
    text-align: center;
}
.review-word-en {
    font-size: 2rem;
    color: #343a3a;
    word-wrap:break-word;
    margin: 0;
}
.review-word-cn {
    font-size: 1rem;
    color: #414b4b;
    opacity: 0.6;
    margin-top: 10px;
    margin: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: .4s;
}
.fade-enter, .fade-leave-active {
  opacity: 0;
}
</style>
