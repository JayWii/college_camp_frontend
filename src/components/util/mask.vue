<template lang="html">
    <div class="mask-wrap">
        <div class="arrow"></div>
        <p class="tip">点击<span>发送给朋友</span>或<span>分享到朋友圈</span>完成打卡</p>
    </div>
</template>

<script>

export default {
}
</script>

<style lang="css">
.mask-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #404143;
    opacity: 0.8;
}
.tip {
    position: absolute;
    top: 53px;
    right: 10px;
    width: 172px;
    height: 42px;
    font-size: 0.75rem;
    color: #fff;
    opacity: 1;
    margin: 0;
}
.tip span {
    color: #fce23a;
}
.arrow {
    position: absolute;
    top: 0;
    right: 17px;
    width: 35px;
    height: 40px;
    background-image: url(../../assets/img/arrow@2x.png);
    background-size: cover;
}
</style>
