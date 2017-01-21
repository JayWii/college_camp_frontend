<template lang="html">
    <div class="page">
        <transition name="slide">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>

export default {
    created () {
        if (this.$store.getters.active_dayState === 1) {
            this.$router.replace('/study/studystep')
        }else{
            this.$router.replace('/study/studycomplete')
        }
    }
}
</script>

<style lang="css">
</style>
