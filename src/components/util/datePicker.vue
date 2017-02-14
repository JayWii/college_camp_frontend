<template lang="html">
  <div>
      <div class="date-list">
          <swiper :options="swiperOption" ref="mySwiper">
              <swiper-slide class="date-item flex-vertical flex-middle"
                  v-for="(dateData, index) in dateListData"
                  :class="{'date-item-tody':(dateData.date === today), 'date-active':(index === active_day)}"
                  :data-index="index"
                  @click.native="updateActiveDate">
                  <span class="week">{{ (dateData.date === today + 1)?'今天':(weeks[dateData.week]) }}</span>
                  <div class="date"
                  v-bind:class="{'date-complete': ((((dateData.week === 0)||(dateData.week === 6))&&(dateData.date <= today))||(user_info.learning_state_list[index] === 3)||((user_info.learning_state_list[index] === 0)&&(index <= today+1 ))) }">
                    {{ dateData.date }}
                  </div>
              </swiper-slide>
          </swiper>
      </div>
      <div class="date-count">
          <p>Day <span>{{ active_day + 1 }}</span></p>
      </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { mapState } from 'vuex'

export default {
    name : 'datePicker',
    data() {
        return {
            weeks : ['日','一','二','三','四','五','六']
        }
    },
    methods : {
        updateActiveDate (e) {
            var targetIndex = e.currentTarget.getAttribute('data-index')*1
            this.$store.dispatch('updateActiveDate',targetIndex)
        },
        getDateData (dateStr) {
            var strArr = dateStr.split('-')
            var date = new Date(strArr[0],strArr[1]-1,strArr[2])
            return date
        },
        getDays (date) {
            return (Math.floor(date/1000/60/60/24))
        },
        getActiveDayData () {
          var campCount = 1
          var dateCount = 1
          var requestWordsUrl = this.$store.state.host + '/study/get_word_list?date='+ campCount + '-' + dateCount
          var requestReadingUrl = this.$store.state.host + '/study/get_reading_data?camp_count='+ campCount +'&date_count=' + dateCount
          // 获取单词列表数据
          this.$http.get(requestWordsUrl).then(response => {
            var data = response.body.data.word_list
            var wordList = []
            var words = data.words.split('&')
            var meanings = data.meaning.split('&')
            for (var i = 0; i < words.length; i++) {
              var word = {
                en : words[i],
                meaning : meanings[i],
                detail : {}
              }
              wordList.push(word)
            }
            this.$store.dispatch('updateWordList',wordList)
            this.getFirstDetail()
          }, response => {
            //error callback
          })

          // 获取扩展阅读数据
          this.$http.get(requestReadingUrl).then(response => {
            var wordsData = response.body.data.words
            var readingData = []
            for (var i = 0; i < wordsData.length; i++) {
              var readingObj = {
                word : wordsData[i].word,
                phonetic : wordsData[i].phonetic,//音标
                usage : [],
                test_center : []
              }
              var usagesArr = (wordsData[i].usages == null)?[]:wordsData[i].usages.split('&')
              var usagesEgArr = (wordsData[i].usages_eg == null)?[]:wordsData[i].usages_eg.split('&')
              var keysArr = (wordsData[i].keys == null)?[]:wordsData[i].keys.split('&')
              var keysEgArr = (wordsData[i].keys_eg == null)?[]:wordsData[i].keys_eg.split('&')
              var keysSourceArr = (wordsData[i].keys_source == null)?[]:wordsData[i].keys_source.split('&')
              for (var j = 0; j < usagesArr.length - 1; j++) {
                var usage = {
                  basic : usagesArr[j]?usagesArr[j].replace(/(^\'|\'$)/g,''):'',
                  eg : usagesEgArr[j]?usagesEgArr[j].replace(/(^\'|\'$)/g,''):''
                }
                readingObj.usage.push(usage)
              }
              for (var k = 0; k < keysArr.length - 1; k++) {
                var key = {
                  basic : keysArr[k]?keysArr[k].replace(/(^\'|\'$)/g,''):'',
                  eg : {
                      content : keysEgArr[k]?keysEgArr[k].replace(/(^\'|\'$)/g,''):'',
                      source : keysSourceArr[k]?keysSourceArr[k].replace(/(^\'|\'$)/g,''):''
                  }
                }
                readingObj.test_center.push(key)
              }
              readingData.push(readingObj)
            }
            this.$store.dispatch('updateReadingData',readingData)
          }, response => {
            //error callback
          })
        },
        getFirstDetail () {
            var word = this.$store.state.active_day_data.camp_data.word_list[0].en
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
              this.$store.dispatch('setActiveDetail',wordDetail)
              // console.log(wordDetail)
            }, response => {
              //error callback
            })
        }
    },
    computed: {
        camp_info () {
            return this.$store.state.camp_info
        },
        user_info () {
            return this.$store.state.user_info
        },
        active_day () {
            return this.$store.state.active_day
        },
        swiperOption () {
            var initialSlideIndex = 0
            var active_day = this.active_day
            //将swiper定位到激活的日期
            if (active_day >= 3) {
                initialSlideIndex = active_day - 3
            }else{
                initialSlideIndex = active_day
            }
            return {
                slidesPerView: 7,
                spaceBetween: '4%',
                freeMode: true,
                initialSlide : initialSlideIndex
            }
        },
        today () {
            return this.$store.getters.today
        },
        days () {
            return this.$store.getters.days
        },
        swiper () {
            return this.$refs.mySwiper.swiper
        },
        dateListData () {
            var list = []
            var listLen = this.days
            for (var i = 0; i < listLen; i++) {
                var dateObj = {
                    date : this.getDateData(this.camp_info.time.start_time).getDate() + i,
                    week : (this.getDateData(this.camp_info.time.start_time).getDay() + i)%7
                }
                list.push(dateObj)
            }
            return list
        }
    },
    components: {
        swiper,
        swiperSlide
    },
    watch: {
        'active_day' (val) {
          this.getActiveDayData()
        },
        'swiperOption' (val) {
          if ((val.initialSlide >= 0)&&(this.active_day >= 3)) {
            this.swiper.slideTo(val.initialSlide, 400, false)
          }
        }
    },
    created () {
      this.getActiveDayData()
    }
}
</script>

<style lang="css">
.date-list {
    background-color: #f6f8f8;
    height: auto;
    padding: 12px 10px 0;
    box-sizing: border-box;
}
.week {
    font-size: 0.6rem;
    color: #414b4b;
    opacity: 0.4;
}
.date-item {
    position: relative;
    margin: 0;
    text-align: center;
    width: 36px;
}
.date {
    background-color: #e0e5e5;
    width: 100%;
    height: 0;
    line-height: 0;
    padding: 50% 0;
    border-radius: 50%;
    font-size: 0.8rem;
    color: #414b4b;
    margin-top: 0.25rem;
    margin-bottom: 18px;
}
.date-complete {
    background-color: #414b4b;
    color: #fff;
}
.date-active .date{
    color: #f5a623;
}
.date-active:after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-color: transparent transparent #fff;
    border-width: 0 0.4rem 0.5rem;
    border-style: solid;
    position: absolute;
    bottom: -1px;
    left: 50%;
    margin-left: -0.4rem;
}
.date-item-tody .week {
    opacity: 1;
}
.date-count {
    box-shadow: 0 -1px 3px 0 hsla(180,5%,75%,.3);
}
.date-count p {
    height: 3.4rem;
    margin: 0;
    text-align: center;
    color: #414b4b;
    font-size: 0.75rem;
    line-height: 3.4rem;
}
.swiper-container {
    height: 100%;
    z-index: 0!important;
}
</style>
