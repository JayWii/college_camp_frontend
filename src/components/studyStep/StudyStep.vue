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
            testFlag : 0
        }
    },
    computed : {
        swiperOption () {
            var that = this
            return {
                slidesPerView: 1,
                spaceBetween: 0,
                noSwiping : true,
                loop: true,
                onlyExternal : true,
                initialSlide : that.studyDataIndex
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
        }
    },
    watch : {
        'studyDataIndex' (val) {
            this.$store.dispatch('setActiveDetail',val)
        }
    },
    methods : {
        updateStudyData (index) {
            this.$store.dispatch('updateStudyData',index)
        },
        next () {
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
                    this.$store.dispatch('initDetailIndex',0)
                    this.swiper.slideNext()
                }else{
                    this.updateStudyData(this.studyDataIndex + 1)
                    this.testFlag = 0
                    this.swiper.slideNext()
                }
            }else if (nowWidth === 100) {
                this.$store.dispatch('updateStudyState',{
                    dayIndex : this.$store.getters.today,
                    dayState : 2
                })
                this.$store.dispatch('updateStudyData',0)
                this.$store.dispatch('setActiveDetail',0)
                this.$router.push('/study/studycomplete')
            }
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
