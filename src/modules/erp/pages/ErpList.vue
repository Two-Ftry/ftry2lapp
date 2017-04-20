<template>
    <div>
        erplist inner
    </div>
</template>
<script>
    import moduleName from '../moduleName';
    import { mapGetters } from 'vuex';
    export default{
        data () {
            return {};
        },
        computed: {
            ...mapGetters({
                erpList: `${name}/moduleName`
            })
        },
        components: {}
    };
</script>
<style lang="less" rel="stylesheet/less">

</style>