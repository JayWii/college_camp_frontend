<template lang="html">
    <div class="detail-wrap page" v-tit="'详情'">
        <word-detail></word-detail>
        <my-btn value="BACK" @click.native="back"></my-btn>
    </div>
</template>

<script>
import WordDeatil from './WordDetail.vue'
import Button from '../util/button.vue'

export default {
    name : 'wordsDetail',
    components: {
        'my-btn': Button,
        'word-detail': WordDeatil
    },
    methods : {
        back () {
            this.$router.back()
        }
    }
}
</script>
