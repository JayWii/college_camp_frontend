<template lang="html">
    <div class="flex-middle flex-center flex-vertical complete-wrap page" v-tit="'单词学习'">
        <div class="complete-icon"></div>
        <p class="complete-word">COMPLETED</p>
        <router-link to="/review">
            <my-btn value="单词复习" class="btn-with-arrow"></my-btn>
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
    },
    created () {
    }
}
</script>

<style lang="css">
.complete-wrap {
    height: 100%;
}
.complete-word {
    font-size: 1rem;
    color: #343a3a;
    margin-bottom: 65px;
}
.complete-icon {
    width: 81px;
    height: 81px;
    background-image: url(../../assets/img/completed_img@2x.png);
    background-size: cover;
}
</style>
