<template lang="html">
  <div>
      <div class="date-list">
          <swiper :options="swiperOption">
              <swiper-slide class="date-item flex-vertical flex-middle"
                  :class="{'date-item-tody':(dateData.date === today), 'date-active':(index === active_day)}"
                  :data-index="index"
                  v-for="(dateData, index) in dateListData"
                  @click.native="updateActiveDate">
                  <span class="week">{{ (dateData.date === today + 1)?'今天':(weeks[dateData.week]) }}</span>
                  <div class="date"
                  v-bind:class="{'date-complete': ((user_info.learning_state_list[index] === 3)||((user_info.learning_state_list[index] === 0)&&(index <= today+1 ))) }">
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
            if (active_day > 3) {
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
