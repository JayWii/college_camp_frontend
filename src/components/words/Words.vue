<template lang="html">
    <div v-tit="'单词列表'">
        <!-- <my-header headerTitle="单词列表"></my-header> -->
        <div class="wordslist">
            <div class="word-item word-item-default border-b flip-container"
            v-for="(item, index) in listData">
                <div class="flipper"
                @click="toggleMeaning">
                    <div class="en front">
                        {{ item.en }}
                    </div>
                    <div class="cn back">
                        {{ item.cn }}
                    </div>
                </div>
                <span :data-index="item.id.split('_')[2]" @click="goToDetail"></span>
            </div>
        </div>
    </div>
</template>

<script>
// import Header from './util/header.vue'

export default {
    data () {
        return {}
    },
    methods: {
        toggleMeaning (e) {
            if (e.currentTarget.className.indexOf(' clicked') > -1) {
                e.currentTarget.className = e.currentTarget.className.replace(' clicked','')
            }else{
                e.currentTarget.className += ' clicked'
            }
        },
        goToDetail (e) {
            var wordIndex = e.currentTarget.getAttribute('data-index')
            this.$store.dispatch('setActiveDetail',wordIndex)
            this.$router.push('wordetail')
        }
    },
    computed : {
        listData () {
            return this.$store.state.active_day_data.camp_data.word_list
        }
    },
    // created () {
    //     for (var i = 0; i < 30; i++) {
    //         var testWord = {
    //             id : i,
    //             word : 'activity',
    //             meaning : '活动'
    //         }
    //         this.listData.push(testWord)
    //     }
    // },
    // components : {
    //     'my-header' : Header
    // }
}
</script>

<style lang="css">
.word-item {
    position: relative;
    width: 100%;
    height: 48px;
    padding-left: 20px;
    box-sizing: border-box;
    line-height: 48px;
    text-align: left;
    font-size: 0.9rem;
    color: #3b3d38;
    background-color: #fff;
}
.word-item-default span {
    width: 24px;
    height: 24px;
    position: absolute;
    right: 15px;
    top: 12px;
    background-image: url(../../assets/img/wiki@2x.png);
    background-size: cover;
    background-repeat: no-repeat;
}
.active-item {
    background-color: #f0f0f0;
}
/* 整个容器，包括透视 */
.flip-container {
    perspective: 1000px;
    padding-right: 40px;
    box-sizing: border-box;
}
/* 翻转控制类 */
.flipper.clicked {
    transform: rotateX(-180deg);
}
/* 翻转速度设置 */
.flipper {
    width: 100%;
    height: 48px;
    transition: 0.8s;
    transform-style: preserve-3d;
    position: relative;
    transform-origin: 100% 24px; /* 高度值的一半 */
}
/* 翻转页的时候隐藏背面 */
.front, .back {
    position: absolute;
    backface-visibility:hidden;
    -webkit-backface-visibility:hidden;	/* Chrome 和 Safari */
    -moz-backface-visibility:hidden; 	/* Firefox */
    -ms-backface-visibility:hidden;
    width: 100%;
    height: 46px;
    top: 1px;
    left: 0;
}
/* 前面板放在上面 */
.front {
    z-index: 2;
    /* for firefox 31 */
    transform: rotateX(0deg);
}
/* 背面初始的时候隐藏 */
.back {
    transform: rotateX(180deg);
}

</style>
