<template lang="html">
    <div class="header border-b">
        <div class="back-icon" @click="back"></div>
        {{ headerTitle }}
    </div>
</template>

<script>
export default {
    name : 'my-header',
    props : {
        headerTitle : ''
    },
    methods : {
        back () {
            this.$router.back()
        }
    }
}
</script>

<style lang="css">
.header {
    height: 55px;
    width: 100%;
    position: relative;
    text-align: center;
    line-height: 55px;
    font-size: 18px;
    color: #414b4b;
}
.border-b:before {
    border-color: #deddd3;
}
.back-icon {
    width: 25px;
    height: 25px;
    position: absolute;
    top: 15px;
    left: 15px;
    background-image: url(../../assets/img/back@2x.png);
    background-size: cover;
    background-repeat: no-repeat;
}
</style>
