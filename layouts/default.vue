<template>
  <div id="app">
    <nav-bar />
    <aside-menu :menu="menu" />
    <Nuxt />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import menu from '@/assets/js/menu.js'
import NavBar from '@/components/NavBar.vue'
import AsideMenu from '@/components/AsideMenu.vue'

export default defineComponent({
  name: 'AppComponent',
  components: {
    AsideMenu,
    NavBar,
  },
  data() {
    return {
      menu,
    }
  },
  mounted() {
    this.$store.dispatch('toggleFullPage', false)
    this.$store.dispatch('asideDesktopOnlyToggle', true)

    this.$store.commit('user', {
      name: this.$store.state.userName,
      email: this.$store.state.email,
      avatar: 'https://avatars.dicebear.com/v2/gridy/John-Doe.svg',
    })
  },
  created() {},
})
</script>
