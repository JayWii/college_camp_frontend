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
            knowThisWord : false
        }
    },
    computed : {
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
    watch : {
        'review_data_index' (val) {
            this.$store.dispatch('setActiveDetail',val)
        }
    },
    methods:  {
        know () {
            this.knowThisWord = true
            var _this = this
            setTimeout(function () {
                if (_this.review_data_index === (_this.words_list.length - 1)) {
                    _this.$store.dispatch('updateStudyState',{
                        dayIndex : _this.$store.getters.today,
                        dayState : 3
                    })
                    _this.$store.dispatch('updateReviewData',0)
                    _this.$store.dispatch('setActiveDetail',0)
                    _this.knowThisWord = false
                    _this.$router.push('reviewcomplete')
                    return false
                }else if (_this.review_data_index >= (_this.words_list.length - 1)) {
                    return false
                }else{
                    _this.knowThisWord = false
                    var review_data_index  = (_this.review_data_index) + 1
                    // _this.$router.push('reviewword?index=' + review_data_index)
                    _this.swiper.slideTo(review_data_index,600,false)
                    _this.updateReviewData(review_data_index)
                }
            },400)
        },
        back () {
            var review_data_index  = (this.review_data_index) - 1
            this.updateReviewData(review_data_index)
            this.swiper.slideTo(review_data_index - 1,600,false)
        },
        updateReviewData (index) {
            this.$store.dispatch('updateReviewData',index)
        }
    },
    components: {
        'my-btn': Button,
        swiper,
        swiperSlide
    },
    created () {
        this.$store.dispatch('setActiveDetail',this.$store.state.review_data_index)
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
