<template lang="html">
    <div class="page reading-page" v-tit="'拓展阅读'">
        <!-- <my-header headerTitle="拓展阅读"></my-header> -->
        <div class="words-list">
            <div class="words-item border-b" v-for="(word, index) in readingData">
                <h5>{{ word.word }}<span class="phonetic">{{ word.phonetic }}</span></h5>
                <div class="usage">
                    <p class="usage-tit">生活用法</p>
                    <div class="usage-details">
                        <div class="usage-item" v-for="(item, index) in (word.usage)">
                            <pre class="usage-content">{{ item.basic }}</pre>
                            <pre class="usage-eg" v-if="(item.eg !== '')">{{ item.eg }}</pre>
                        </div>
                    </div>
                </div>
                <div class="hints">
                    <p class="hints-tit">常见考点</p>
                    <div class="hints-details">
                        <div class="hints-item" v-for="(item, index) in (word.test_center)">
                            <pre class="hints-content">{{ item.basic }}</pre>
                            <div class="hints-eg" v-if="(item.eg !== '')">
                                <pre class="hints-eg-content">{{ item.eg.content }}</pre>
                                <p class="hints-eg-source" v-if="(item.eg.source !== '')">{{  item.eg.source }}</p>
                            </div>
                        </div>
                    </div>
                </div>
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
    computed : {
        readingData () {
            return this.$store.state.active_day_data.camp_data.reading
        }
    },
    // components : {
    //     'my-header' : Header
    // }
}
</script>

<style lang="css">
.reading-page {
    bottom: inherit;
}
.words-list {
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.words-list pre {
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-weight: normal;
}
.words-item {
    padding: 20px 0 30px;
    box-sizing: border-box;
}
.border-b:before {
    border-color: #deddd3;
}
.words-item h5 {
    color: #f5a623;
    font-size: 1.5rem;
    margin: 0;
    font-weight: normal;
}
.words-item h5 span {
    color: #414b4b;
    font-size: 0.7rem;
    margin-left: 15px;
    font-weight: normal;
}
.usage,
.hints {
    margin-top: 20px;
}
.usage-tit,
.hints-tit {
    color: #414b4b;
    font-size: 0.7rem;
    background-color: #414b4b;
    border-radius: 50px;
    color: #fff;
    width: 65px;
    height: 20px;
    line-height: 20px;
    padding: 0 2px;
    text-align: center;
}
.usage-details,
.hints-details {
    margin-top: 10px;
    color: #414b4b;
    font-size: 0.75rem;
    font-weight: normal;
}
.usage-item pre,
.hints-item pre{
    line-height: 1.5;
    font-size: 0.75rem;
}
pre.usage-eg ,
.hints-eg {
    font-family: Georgia;
    background-color: #f7f7f7;
    border-radius: 4px;
    color: #343a3a;
    font-size: 0.7rem;
    padding: 10px 15px;
    box-sizing: border-box;
    font-weight: normal;
    margin:5px 0 10px;
}
.hints-eg pre {
    font-family: Georgia;
    font-size: 0.7rem;
}
.hints-eg p {
    margin: 0;
    font-size: 0.7rem;
    text-align: right;
}
</style>
