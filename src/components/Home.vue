<template lang="html">
    <div v-tit="'百词斩大学生课堂'">
        <div class="banner">
            <h2 class="course-title">{{ camp_info.title }}</h2>
            <p class="sub_title">{{ camp_info.sub_title }}</p>
            <p class="time-section"><span class="start-time">{{ start_time }}</span> - <span class="end-time">{{ end_time }}</span></p>
            <div class="share-btn" v-if="showShareBtn" @click="toggleShare"></div>
        </div>
        <date-picker></date-picker>
        <div class="rest-day flex-vertical flex-center" v-show="(active_dayState === 0)">
            <div class="rest-icon"></div>
            <p>休息日</p>
        </div>
        <div class="btns flex-vertical" v-show="(active_dayState !== 0)">
            <div class="words-and-reading" :class="{'cannot-jump' : (active_dayState === 4) }">
                <router-link to="/wordslist">
                    <div class="list flex-vertical flex-center">
                        <div class="icon list-icon"></div>
                        <p>单词列表</p>
                    </div>
                </router-link>
                <router-link to="/reading">
                  <div class="reading flex-vertical flex-center">
                      <div class="icon reading-icon"></div>
                      <p>拓展阅读</p>
                  </div>
                </router-link>
            </div>
            <router-link to="/study" :class="canLearning">
                <college-btn :class="learnBtnState" value="单词学习"></college-btn>
            </router-link>
            <router-link to="/review" :class="canReview">
                <college-btn :class="reviewBtnState" value="单词复习" ></college-btn>
            </router-link>
        </div>
        <!-- 分享引导 -->
        <my-mask v-if="goShare" @click.native="toggleShare"></my-mask>
        <vodal :show="show" :width="150" :height="100" :closeButton="false" animation="zoom" @hide="show = false">
            <div>加载中...</div>
        </vodal>
    </div>
</template>

<script>
    import Button from './util/button.vue'
    import DatePicker from './util/datePicker.vue'
    import Mask from './util/mask.vue'

    export default {
        name : 'Home',
        data() {
            return {
                goShare : false,
                startTime : 0,
                show : false
            }
        },
        computed: {
            camp_info () {
                return this.$store.state.camp_info
            },
            active_day () {
              return this.$store.state.active_day
            },
            active_dayState () {
                return this.$store.getters.active_dayState
            },
            today () {
              return this.$store.getters.today
            },
            start_time () {
                var strArr = this.camp_info.time.start_time.split('-')
                return (strArr[1] + '月' + strArr[2] + '日')
            },
            end_time () {
                var strArr = this.camp_info.time.end_time.split('-')
                return (strArr[1] + '月' + strArr[2] + '日')
            },
            canLearning () {
                return (this.active_dayState === 4)?'cannot-jump':''
            },
            canReview () {
                return ((this.active_dayState === 4)||(this.active_dayState === 1))?'cannot-jump':''
            },
            showShareBtn () {
                return (this.active_dayState === 3)&&(this.active_day === (this.today))
            },
            learnBtnState () {
                return {
                    'btn-disabled': (this.active_dayState === 4),
                    'btn-complete': ((this.active_dayState === 2) || (this.active_dayState === 3))
                }
            },
            reviewBtnState () {
                return {
                    'btn-disabled': ((this.active_dayState === 4)||(this.active_dayState === 1)),
                    'btn-complete': (this.active_dayState === 3)
                }
            }
        },
        methods : {
            toggleShare () {
                this.goShare = !this.goShare
            },
            getDateData (dateStr) {
                var strArr = dateStr.split('-')
                var date = new Date(strArr[0],strArr[1]-1,strArr[2])
                return date
            },
            getDays (date) {
                return (Math.floor(date/1000/60/60/24))
            }
        },
        components: {
            'college-btn': Button,
            'date-picker': DatePicker,
            'my-mask': Mask
        }
    }
</script>

<style lang="css">
.banner {
    width: 100%;
    height: 190px;
    position: relative;
    padding: 1.2rem 1.25rem 0;
    background: -webkit-linear-gradient(left top,#fded4f,#fbd727);
    background: linear-gradient(to bottom right,#fded4f,#fbd727);
    text-align: left;
    color: #3b3d38;
    box-sizing: border-box;
}
.course-title,
.sub_title,
.time-section {
    margin: 0;
}
.course-title {
    font-size: 2.5rem;
}
.sub_title {
    font-size: 1rem;
}
.time-section {
    font-size: 0.75rem;
    margin-top: 0.65rem;
    opacity: 0.6;
}
.rest-day p {
    margin: 0;
    color: #525252;
    font-size: 0.9rem;
    opacity: 0.4;
}
.share-btn {
    width: 75px;
    height: 76px;
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    right: 4%;
    top: 4%;
    background-image: url(../assets/img/share@2x.png);
}
.rest-icon {
    width: 100px;
    height: 100px;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url(../assets/img/rest@2x.png);
}
.btns {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    padding-bottom: 20px;
}
.btns input {
    margin: 0;
    margin-top: 20px;
}
.words-and-reading {
    width: 100%;
}
.words-and-reading a {
    width: 50%;
    float: left;
}
.words-and-reading .icon {
    width: 40px;
    height: 40px;
    background-repeat: no-repeat;
    background-size: cover;
}
.list-icon {
    background-image: url(../assets/img/wordslist@2x.png);
}
.reading-icon {
    background-image: url(../assets/img/expandreading@2x.png);
}
.words-and-reading p {
    margin: 0;
    margin-top: 10px;
    color: #414b4b;
    font-size: 0.75rem;
}
.cannot-jump {
    pointer-events: none;
}
</style>
