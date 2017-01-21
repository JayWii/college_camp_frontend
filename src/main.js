import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import store from './vuex/store.js'

import App from './components/App.vue'
import Home from './components/Home.vue'
import Study from './components/Study.vue'
import Review from './components/Review.vue'
import WordsList from './components/WordsList.vue'
import Reading from './components/Reading.vue'

import Words from './components/words/Words.vue'
import WordsDetail from './components/words/WordsDeatil.vue'
import WordDeatil from './components/words/WordDetail.vue'

import StudyStep from './components/studyStep/StudyStep.vue'
import StudyComplete from './components/studyStep/StudyComplete.vue'

import ReviewWord from './components/review/Word.vue'
import ReviewUnknownWord from './components/review/WordUnknown.vue'
import ReviewComplete from './components/review/ReviewComplete.vue'

// const Home = r => require.ensure([], () => r(require('./components/Home.vue')), 'group-home')
// const WordsList = r => require.ensure([], () => r(require('./components/WordsList.vue')), 'group-wordslist')
// const Reading = r => require.ensure([], () => r(require('./components/Reading.vue')), 'group-reading')

Vue.use(VueRouter)
Vue.use(VueResource)

const routes = [{
    path : '/',
    redirect: '/index'
},{
    path : '/index',
    component : Home
},{
    path : '/study',
    component : Study,
    children: [
        {
          path: '',
          component : Study
        },
        {
          path: 'studystep',
          component: StudyStep
        },
        {
            path : 'studycomplete',
            component : StudyComplete
        }
      ]
},{
    path : '/review',
    component : Review,
    children : [
        {
            path : '',
            redirect: 'reviewword'
        },
        {
            path : 'reviewword',
            component : ReviewWord
        },
        {
            path : 'unknownword',
            component : ReviewUnknownWord
        },
        {
            path : 'reviewcomplete',
            component : ReviewComplete
        }
    ]
},{
    path : '/wordslist',
    component : WordsList,
    children: [
        {
          path: '',
          redirect: 'words'
        },
        {
          path: 'words',
          component: Words
        },
        {
          path: 'wordetail',
          component: WordsDetail
        }
      ]
},{
    path : '/reading',
    component : Reading
},{
    path : '/studycomplete',
    component : StudyComplete
}];

const router = new VueRouter({
  routes
});

//协助路由变更页面title
Vue.directive('tit', {
  inserted: function (el, binding) {
    update_wx_title(binding.value)
  }
})

new Vue({
  el: '#app',
  template: '<App/>',
  router,
  store,
  components: { App }
});

//更改ios刷新angular等框架利用hash，不刷新页面时，修改微信浏览器的hash写法
function update_wx_title(title) {
   var body = document.getElementsByTagName('body')[0]
   document.title = title
   var iframe = document.createElement("iframe")
   //必须设置，否则手机现实上会出问题，src属性为空将不能变更title
   iframe.setAttribute("src", "/app/study/iframe.html")
   iframe.style.display = "none"
   //必须设置，这一步是关键 -- 促使 title发生改变
   iframe.addEventListener('load', function() {
       setTimeout(function() {
           document.body.removeChild(iframe);
       }, 0);
   });
   document.body.appendChild(iframe);
}

//微信浏览器判断
function is_weixin(){
   var ua = navigator.userAgent.toLowerCase();
   if(ua.match(/MicroMessenger/i)){
       return true;
   }
}
//ios终端判断
function is_ios(){
   var ua = navigator.userAgent.toLowerCase();
   return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i);
}
