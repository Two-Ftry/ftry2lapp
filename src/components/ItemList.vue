<template>
    <div class="news-view">
        <spinner :show="loading"></spinner>
        <div class="news-list-nav">
            <router-link v-if="page > 1" :to="'/' + type + '/' + (page - 1)">&lt; prev</router-link>
            <a v-else class="disabled">&lt; prev</a>
            <span>{{ page }}/{{ maxPage }}</span>
            <router-link v-if="hasMore" :to="'/' + type + '/' + (page + 1)">more &gt;</router-link>
            <a v-else class="disabled">more &gt;</a>
        </div>
        <transition :name="transition">
            <div class="news-list" :key="displayedPage" v-if="displayedPage > 0">
                <transition-group tag="ul" name="item">
                    <item v-for="item in displayedItems" :key="item.id" :item="item">
                    </item>
                </transition-group>
            </div>
        </transition>
    </div>
</template>

<script>
    import Spinner from './Spinner.vue'
    import Item from './Item.vue'
    import { watchList } from '../store/api'

    let isInitialRender = true

    export default {
        name: 'item-list',

        components: {
            Spinner,
            Item
        },

        props: {
            type: String
        },

        data () {
            const data = {
                loading: false,
                transition: 'slide-up',
                // if this is the initial render, directly render with the store state
                // otherwise this is a page switch, start with blank and wait for data load.
                // we need these local state so that we can precisely control the timing
                // of the transitions.
                displayedPage: isInitialRender ? Number(this.$store.state.route.params.page) || 1 : -1,
                displayedItems: isInitialRender ? this.$store.getters.activeItems : []
            }
            isInitialRender = false
            return data
        },

        computed: {
            page () {
                return Number(this.$store.state.route.params.page) || 1
            },
            maxPage () {
                const { itemsPerPage, lists } = this.$store.state
                return Math.ceil(lists[this.type].length / itemsPerPage)
            },
            hasMore () {
                return this.page < this.maxPage
            }
        },

        beforeMount () {
            if (this.$root._isMounted) {
                this.loadItems(this.page)
            }
            // watch the current list for realtime updates
            this.unwatchList = watchList(this.type, ids => {
                this.$store.commit('SET_LIST', { type: this.type, ids })
                this.$store.dispatch('ENSURE_ACTIVE_ITEMS').then(() => {
                    this.displayedItems = this.$store.getters.activeItems
                })
            })
        },

        beforeDestroy () {
            this.unwatchList()
        },

        watch: {
            page (to, from) {
                this.loadItems(to, from)
            }
        },

        methods: {
            loadItems (to = this.page, from = -1) {
                this.loading = true
                this.$store.dispatch('FETCH_LIST_DATA', {
                    type: this.type
                }).then(() => {
                    if (this.page < 0 || this.page > this.maxPage) {
                        this.$router.replace(`/${this.type}/1`)
                        return
                    }
                    this.transition = from === -1
                        ? null
                        : to > from ? 'slide-left' : 'slide-right'
                    this.displayedPage = to
                    this.displayedItems = this.$store.getters.activeItems
                    this.loading = false
                })
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    .news-view {
        padding-top: 45px
    }

    .news-list, .news-list-nav {
        background-color: #fff;
        border-radius: 2px
    }

    .news-list-nav {
        padding: 15px 30px;
        position: fixed;
        text-align: center;
        top: 55px;
        left: 0;
        right: 0;
        z-index: 998;
        box-shadow: 0 1px 2px rgba(0, 0, 0, .1)
    }

    .news-list-nav a {
        margin: 0 1em
    }

    .news-list-nav .disabled {
        color: #ccc
    }

    .news-list {
        position: absolute;
        margin: 30px 0;
        width: 100%;
        transition: all .5s cubic-bezier(.55, 0, .1, 1)
    }

    .news-list ul {
        list-style-type: none;
        padding: 0;
        margin: 0
    }

    .slide-left-enter, .slide-right-leave-active {
        opacity: 0;
        -ms-transform: translate(30px);
        transform: translate(30px)
    }

    .slide-left-leave-active, .slide-right-enter {
        opacity: 0;
        -ms-transform: translate(-30px);
        transform: translate(-30px)
    }

    .item-enter-active, .item-leave-active, .item-move {
        transition: all .5s cubic-bezier(.55, 0, .1, 1)
    }

    .item-enter, .item-leave-active {
        opacity: 0;
        -ms-transform: translate(30px);
        transform: translate(30px)
    }

    .item-leave-active {
        position: absolute
    }

    @media (max-width: 600px) {
        .news-list {
            margin: 10px 0
        }
    }
</style>
