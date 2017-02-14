<template>
    <div class="flex-center wrap">
        <div class="container">
            <transition name="slide">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
import FastClick from '../assets/lib/fastclick.js'

FastClick.attach(document.body);

export default {
    name : 'App',
    data() {
        return {
        }
    },
    methods : {
      getDateData (dateStr) {
          var strArr = dateStr.split('-')
          var date = new Date(strArr[0],strArr[1]-1,strArr[2])
          return date
      }
    },
    created () {
      var requestUrl = this.$store.state.host + '/study/get_camp_info?count='+1+'&open_id='+123
      this.$http.get(requestUrl).then(response => {
        var data = response.body.data
        var campData = {
            title : data.camp_info.title,
            sub_title : data.camp_info.sub_title,
            time : {
                start_time : data.camp_info.start_time.replace(/-0/g,'-'),
                end_time : data.camp_info.end_time.replace(/-0/g,'-')
            }
        }
        this.startTime = data.camp_info.start_time.replace(/-0/g,'-')
        this.$store.dispatch('setCampInfo',campData)

        var userInfo = {
            open_id : data.user_info.open_id,
            active_state: data.user_info.active_state,
            daka_state: data.user_info.daka_state.split(',').map(function(i) {return i*1}),
            user_name: data.user_info.user_name,
            learning_state_list : (data.user_info.learning_state_list)?(data.user_info.learning_state_list.split(',').map(function(i) {return i*1})):[4]
        }
        this.$store.dispatch('updateUserInfo', userInfo)
      }, response => {
        //error callback
      }).then(function () {
        // 将未到时间的学习状态置为未到时间状态
        var todayIndex = this.$store.getters.today
        this.$store.dispatch('updateActiveDate',todayIndex)
        var originList = this.$store.state.user_info.learning_state_list
        for (var i = 0; i < this.$store.getters.days; i++) {
            if (i <= todayIndex) {
                if ((originList[i] === 4)||(!originList[i])) {
                    originList[i] = 1
                }else{
                    originList[i] = originList[i]
                }
            }else{
                originList[i] = 4
            }
            var week = (this.getDateData(this.startTime).getDay() + i)%7
            if ((week === 0)||(week === 6)) {
                originList[i] = 0
            }
        }
        this.$store.dispatch('initStateList',originList)
      })
    }
}

</script>

<style>
@import '../assets/lib/reset.css';
@import '../assets/lib/mobi.css';
@import "../assets/lib/fade.css";
@import "../assets/lib/zoom.css";

.vodal-dialog {
  text-align: center;
  line-height: 100px;
}

html, body {
    -webkit-tap-highlight-color: transparent;
}
body {
    background-color: #fff;
    overflow-x: hidden;
}
a {
    text-decoration: none;
    color: transparent;
}
.container {
    padding: 0;
}
/*.wrap {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
}*/
.page {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #fff;
    max-width: 740px;
    min-width: 320px;
    margin: 0 auto;
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

.slide-enter-active, .slide-leave-active {
  transition: opacity .6s ease;
}
.slide-enter {
  opacity: 0;
}
.slide-leave {
  opacity: 1;
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
}
</style>
