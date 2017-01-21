<template lang="html">
    <div class="review-wrap page">
        <word-detail></word-detail>
        <my-btn value="BACK" @click.native="back"></my-btn>
    </div>
</template>

<script>
import WordDeatil from '../words/WordDetail.vue'
import Button from '../util/button.vue'

export default {
    methods : {
        back () {
            this.$router.back()
        }
    },
    components: {
        'my-btn': Button,
        'word-detail' : WordDeatil
    }
}
</script>

<style lang="css">
</style>
