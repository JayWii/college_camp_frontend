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
    created () {
        var todayIndex = this.$store.getters.today
        this.$store.dispatch('updateActiveDate',todayIndex)
        var originList = this.$store.state.user_info.learning_state_list
        for (var i = 0; i < this.$store.getters.days; i++) {
            if (i >= originList.length) {
                if (i <= (todayIndex)) {
                    originList.push(1);
                }else{
                    originList.push(4);
                }
            }
        }
        this.$store.dispatch('initStateList',originList)
    }
}

</script>

<style>
@import '../assets/lib/reset.css';
@import '../assets/lib/mobi.css';

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
