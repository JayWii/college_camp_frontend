<template lang="html">
    <div class="flex-middle flex-center flex-vertical complete-wrap page" v-tit="'单词复习'">
        <div class="complete-icon"></div>
        <p class="complete-word">COMPLETED</p>
        <router-link to="/wordslist">
            <my-btn value="单词列表" class="btn-with-arrow"></my-btn>
        </router-link>
        <router-link to="/">
            <my-btn value="HOME" class="btn-with-border"></my-btn>
        </router-link>
    </div>
</template>

<script>
import Button from '../util/button.vue'
export default {
    components: {
        'my-btn': Button
    }
}
</script>

<style lang="css">
</style>
