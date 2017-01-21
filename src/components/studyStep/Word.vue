<template lang="html">
    <div class="study-word-wrap flex-vertical flex-middle inside-page">
        <p class="word">{{ activeWordDetail.en }}</p>
        <p class="test-count">考频：<span>{{ activeWordDetail.count }}</span> 次 </p>
    </div>
</template>

<script>
export default {
    computed : {
        activeWordDetail () {
            return this.$store.state.active_word_detail
        }
    },
    created () {
        if (!(this.$store.state.active_word_detail.id)) {
            this.$store.dispatch('setActiveDetail',0)
        }
    }
}
</script>

<style lang="css">
.study-word-wrap {
    height: 100%;
    text-align: center;
    color: #343a3a;
}
.study-word-wrap p{
    margin: 0;
}
.study-word-wrap .word {
    font-size: 2rem;
}
.study-word-wrap .test-count {
    opacity: 0.6;
    font-size: 0.8rem;
    margin-top: 0.75rem;
}
</style>
