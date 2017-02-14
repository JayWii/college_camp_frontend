<template lang="html">
    <div class="inside-page">
        <div class="detail-types" @click="toggleActive">
            <div class="detail-type test" :class="{'active':(activeBtn === 0)}">test</div>
            <div class="detail-type film" :class="{'active':(activeBtn === 1)}">film</div>
            <div class="detail-type music" :class="{'active':(activeBtn === 2)}">music</div>
        </div>
        <div class="eg">
            <div class="word">
                <p class="en">{{ detailData.en }}</p>
                <p class="cn">{{ detailData.meaning }}</p>
                <div class="sound" @click="playVoice" @touchstart="ontouch" @touchend="endtouch">
                    <div class="sound-icon"></div>
                    <audio id="voice" :src="detailData.audio"></audio>
                </div>
            </div>
            <swiper :options="swiperOption" ref="mySwiper">
                <swiper-slide v-for="(detail, index) in detailData.detail" :data-index="index">
                    <div v-if="detail.img">
                      <img :src="detail.img" class="word-img" alt="单词图片">
                      <p class="eg">{{ detail.eg }}</p>
                      <p class="eg-meaning">{{ detail.eg_meaning }}</p>
                      <p class="time">{{ detail.eg_source }}</p>
                    </div>
                    <div v-if="!detail.img" class="no-data">
                      暂无数据，请左右滑动
                    </div>
                </swiper-slide>
            </swiper>
        </div>
    </div>
</template>

<script>
import { swiper, swiperSlide } from '../../../node_modules/vue-awesome-swiper'

export default {
    name : 'wordDetail',
    data () {
        return {
        }
    },
    computed: {
        activeBtn () {
            return this.$store.state.word_detail_index
        },
        detailData () {
            return this.$store.state.active_word_detail
        },
        swiper () {
            return this.$refs.mySwiper.swiper
        },
        swiperOption () {
            var that = this
            return {
                slidesPerView: 1,
                spaceBetween: 0,
                lazyLoading: true,
                onSlideChangeStart : function (swiper) {
                    that.$store.dispatch('changeDetailIndex',swiper.activeIndex)
                }
            }
        }
    },
    methods : {
        ontouch (e) {
            e.currentTarget.style.backgroundColor = '#ffc624'
        },
        endtouch (e) {
            e.currentTarget.style.backgroundColor = '#ffe43c'
        },
        playVoice () {
            var audio = document.getElementById('voice')
            if (audio.paused) {
                audio.play()
            }else{
                audio.pause()
            }
        },
        toggleActive (e) {
            var target = e.target
            if (target.className.indexOf('test') > -1) {
                this.changeActiveBtn(0)
                this.swiper.slideTo(0, 600, false)
            }else if (target.className.indexOf('film') > -1){
                this.changeActiveBtn(1)
                this.swiper.slideTo(1, 600, false)
            }else{
                this.changeActiveBtn(2)
                this.swiper.slideTo(2, 600, false)
            }
        },
        changeActiveBtn (index) {
            this.$store.dispatch('initDetailIndex',index)
        }
    },
    components: {
        swiper,
        swiperSlide
    },
    created () {
        // if (!(this.$store.state.active_word_detail.id)) {
        //     this.$store.dispatch('setActiveDetail',0)
        // }
        this.$store.dispatch('changeDetailIndex',0)
    },
    watch : {
        'activeBtn' (val) {
            if (document.location.href.indexOf('studystep') > -1) {
              this.swiper.slideTo(val, 600, false)
            }
        }
    }
}
</script>

<style lang="css">
.no-data {
    height: 300px;
    text-align: center;
    line-height: 300px;
    font-size: 20px;
    color: #aaa;
}
.detail-wrap {
    padding: 8px 16px;
    box-sizing: border-box;
}
.detail-types {
    width: 100%;
    background-color: #eff2f2;
    border-radius: 4px;
    height: 34px;
    line-height: 34px;
}
.detail-type {
    width: 33.333%;
    float: left;
    text-align: center;
    font-size: 0.8rem;
    color: #a9aeae;
    transition: .2s;
}
.detail-type.active {
    color: #fff;
    background-color: #7d8484;
    border-radius: 2px;
    height: 30px;
    width: 31.333%;
    margin: 2px 1%;
}
.word-detail {
    min-height: 420px;
}
.eg .word {
    margin-top: 30px;
    position: relative;
    padding: 0 3px;
    padding-right: 36px;
    box-sizing: border-box;
}
.word p {
    margin: 0;
}
.word .en {
    font-size: 1rem;
    color: #343a3a;
}
.word .cn {
    color: #343a3a;
    font-size: 0.75rem;
    opacity: 0.6;
    margin-top: 5px;
}
.word-img {
    height: 150px;
    margin-top: 10px;
}
.sound {
    width: 36px;
    height: 36px;
    background-color: #ffe43c;
    border-radius: 50%;
    position: absolute;
    top: 6px;
    right: 0;
}
.sound-icon {
    position: absolute;
    top: 9px;
    left: 9px;
    width: 18px;
    height: 18px;
    background-image: url(../../assets/img/voice@2x.png);
    background-size: cover;
}
.eg {
    color: #343a3a;
    font-size: 0.75rem;
}
.eg-meaning {
    font-size: 0.75rem;
    color: #343a3a;
    opacity: 0.6;
}
.time {
    font-size: 0.6rem;
    color: #343a3a;
    opacity: 0.4;
    text-align: right;
    margin-top: 30px;
}
</style>
