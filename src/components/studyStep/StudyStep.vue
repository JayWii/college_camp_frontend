<template lang="html">
    <div class="study-wrap" v-tit="'单词学习'">
        <div class="progress-wrap">
            <div class="progress" :style="progressState"></div>
        </div>
        <div class="content-container">
            <swiper :options="swiperOption" ref="myStudySwiper">
                <swiper-slide class="swiper-no-swiping">
                    <study-word></study-word>
                </swiper-slide>
                <swiper-slide class="">
                    <word-detail></word-detail>
                </swiper-slide>
            </swiper>
        </div>
        <my-btn value="NEXT" class="btn-with-arrow" @click.native="next"></my-btn>
    </div>
</template>

<script>
import Button from '../util/button.vue'
import { swiper, swiperSlide } from '../../../node_modules/vue-awesome-swiper'
import StudyWord from './Word.vue'
import WordDetail from '../words/WordDetail.vue'

export default {
    name : 'study',
    data () {
        return {
            testFlag : 0,
            nextDetailData : {}
        }
    },
    computed : {
        swiperOption () {
            return {
                slidesPerView: 1,
                spaceBetween: 0,
                noSwiping : true,
                loop: true,
                onlyExternal : true
            }
        },
        progressState () {
            return {
                width : this.$store.state.study_progress + '%'
            }
        },
        studyDataIndex () {
            return this.$store.state.study_data_index
        },
        wordsList () {
            return this.$store.state.active_day_data.camp_data.word_list
        },
        swiper () {
            return this.$refs.myStudySwiper.swiper
        },
        activeWord () {
            if (this.studyDataIndex < this.wordsList.length) {
              return this.$store.state.active_day_data.camp_data.word_list[this.studyDataIndex].en
            }
        }
    },
    methods : {
        updateStudyData (index) {
            this.$store.dispatch('updateStudyData',index)
        },
        next (e) {
            var target = e.currentTarget
            target.className += ' btn-disabled'
            setTimeout(function () {
              target.className = target.className.replace(' btn-disabled','')
            },800)
            var nowWidth = (this.progressState.width.replace('%',''))*1
            var incremental = (1 / (this.wordsList.length * 2)) * 100
            var width = nowWidth + incremental
            if (width > 100) {
                this.$store.dispatch('updateStudyProgress',100)
            }else{
                this.$store.dispatch('updateStudyProgress',width)
            }
            if (nowWidth < 100) {
                if (!this.testFlag) {
                    this.testFlag = 1
                    this.swiper.slideNext()
                }else{
                    this.testFlag = 0
                    this.updateStudyData(this.studyDataIndex + 1)
                    if (this.activeWord) {
                      this.getDetail(this.activeWord)
                    }
                    this.$store.dispatch('setActiveDetail',this.nextDetailData)
                    this.swiper.slideNext()
                    var that = this
                    setTimeout(function () {
                      that.$store.dispatch('initDetailIndex',0)
                    },300)
                }
            }else if (nowWidth === 100) {
                this.$store.dispatch('updateStudyState',{
                    dayIndex : this.$store.state.active_day,
                    dayState : 2
                })
                var newState = this.$store.state.user_info.learning_state_list.join(',')
                this.setNewState(newState)
            }
        },
        setNewState (newState) {
          var requestUrl = this.$store.state.host + '/study/set_learning_state'
          var data = {
              openId : this.$store.state.user_info.open_id,
              newState : newState
          }
          this.$http.post(requestUrl,data).then(response => {
              if (response.body.result === 'success') {
                this.updateStudyData(1)
                this.getDetail(this.activeWord)
                this.$router.push('/study/studycomplete')
              }
          }, response => {
            //error callback
          })
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
              this.nextDetailData = wordDetail
            }, response => {
              //error callback
            })
        }
    },
    components: {
        'my-btn' : Button,
        swiper,
        swiperSlide,
        'study-word' : StudyWord,
        'word-detail' : WordDetail
    },
    created () {
        var nowWidth = this.$store.state.study_progress
        var incremental = (1 / (this.$store.state.active_day_data.camp_data.word_list.length * 2)) * 100
        if (nowWidth === 0) {
            this.$store.dispatch('updateStudyProgress',incremental)
        }
        this.$store.dispatch('updateStudyData',1)
        this.getDetail(this.activeWord)
    }
}
</script>

<style lang="css">
.study-wrap {
    height: 100%;
    width: 100%;
    padding: 20px 20px 100px;
    box-sizing: border-box;
}
.progress-wrap {
    position: relative;
    width: 100%;
    height: 10px;
    border-radius: 5px;
    background-color: #f7f7f7;
}
.progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 10px;
    border-radius: 5px;
    background: linear-gradient(to bottom right,#fded4f,#fbd727);
    transition: .4s;
}
.content-container {
    height: 100%;
    padding-top: 20px;
    box-sizing: border-box;
}

@keyframes slideIn {
    from {
        transform: translate3d(100%, 0, 0);
    }
    to {
        transform: translate3d(0, 0, 0);
    }
}

@keyframes slideOut {
    from {
        transform: translate3d(0, 0, 0);
    }
    to {
        transform: translate3d(100%, 0, 0);
    }
}

/*.inside-page {
}
.page.slide-enter-active {
    animation: slideIn .4s forwards;
    transition: opacity .4s ease;
}
.page.slide-leave-active {
    animation: slideOut .4s forwards;
    transition: opacity .4s ease;
}
.page.slide-leave {
  opacity: 1;
}
.page.slide-enter {
  opacity: 0;
}*/
</style>
