<template lang="html">
  <div class="btn-default" @touchstart="ontouch" @touchend="endtouch">{{ value }}</div>
</template>

<script>
export default {
    props : {
        value : ''
    },
    methods : {
        ontouch (e) {
            e.currentTarget.style.backgroundColor = '#ffc624'
        },
        endtouch (e) {
            e.currentTarget.style.backgroundColor = '#ffe43c'
        }
    }
}
</script>

<style lang="css">
.btn-default {
    position: relative;
    width: 13rem;
    height: 2.25rem;
    line-height: 2.25rem;
    background-color: #ffe43c;
    border-radius: 2.25rem;
    border: none;
    text-align: center;
    font-size: 0.9rem;
    font-weight: bold;
    color: #3b3d38;
    outline: 0;
    margin: 1rem auto 0;
}
/*.btn-with-arrow:after,
.btn-disabled:after {
    content: '';
    display: block;
    width: 0.75rem;
    height: 0.75rem;
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    right: 0.75rem;
    top: 50%;
    margin-top: -0.36rem;
}
.btn-with-arrow:after {
    background-image: url(../../assets/img/next@2x.png);
}
.btn-disabled:after {
    background-image: url(../../assets/img/locked@2x.png);
}*/
.btn-with-border {
    background-color: #fff;
    border: 2px solid #ffe43c;
}
.btn-disabled {
    background-color: #e2e2de;
    pointer-events: none;
}
.btn-complete:after,
.btn-with-arrow:after {
    content: '';
    display: block;
    width: 16px;
    height: 16px;
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    right: 15px;
    top: 50%;
    margin-top: -8px;
}
.btn-complete:after {
    background-image: url(../../assets/img/completed@2x.png);
}
.btn-with-arrow:after {
    background-image: url(../../assets/img/next@2x.png);
}
</style>
