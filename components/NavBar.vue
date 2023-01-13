<template>
  <nav v-show="isNavBarVisible" id="navbar-main" class="navbar is-fixed-top">
    <div class="navbar-brand">
      <a class="navbar-item is-hidden-desktop" @click.prevent="asideToggleMobile">
        <b-icon :icon="asideMobileIcon" />
      </a>
      <a
        class="navbar-item is-hidden-touch is-hidden-widescreen is-desktop-icon-only"
        @click.prevent="asideDesktopOnlyToggle"
      >
        <b-icon icon="menu" />
      </a>
    </div>
    <div class="navbar-brand is-right">
      <a class="navbar-item navbar-item-menu-toggle is-hidden-desktop" @click.prevent="menuToggle">
        <b-icon :icon="menuToggleIcon" custom-size="default" />
      </a>
    </div>
    <div v-if="$auth.loggedIn" class="navbar-menu fadeIn animated faster" :class="{ 'is-active': isMenuActive }">
      <div class="navbar-end">
        <nav-bar-menu class="has-divider has-user-avatar">
          <div class="is-user-name">
            <span> {{ $auth?.user?.name }} </span>
          </div>

          <div slot="dropdown" class="navbar-dropdown">
            <router-link to="/profile" class="navbar-item" exact-active-class="is-active">
              <b-icon icon="account" custom-size="default" />
              <span>My Profile</span>
            </router-link>
          </div>
        </nav-bar-menu>
        <a class="navbar-item is-desktop-icon-only" title="Log out" @click.prevent="logout">
          <b-icon icon="logout" custom-size="default" />
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
import NavBarMenu from '@/components/NavBarMenu.vue'

export default defineComponent({
  components: {
    NavBarMenu,
  },
  data() {
    return {
      isMenuActive: false,
    }
  },
  computed: {
    asideMobileIcon() {
      return this.isAsideMobileExpanded ? 'backburger' : 'forwardburger'
    },
    menuToggleIcon() {
      return this.isMenuActive ? 'close' : 'dots-vertical'
    },
    ...mapState(['isAsideMobileExpanded', 'isNavBarVisible', 'userName']),
  },
  mounted() {
    this.$router.afterEach(() => {
      this.isMenuActive = false
    })
  },
  methods: {
    asideToggleMobile() {
      this.$store.commit('asideMobileStateToggle')
    },
    asideDesktopOnlyToggle() {
      this.$store.dispatch('asideDesktopOnlyToggle')
    },
    menuToggle() {
      this.isMenuActive = !this.isMenuActive
    },
    logout() {
      this.$toast.success('You have been logged out').goAway(2000)
      this.$auth.logout()
      this.$router.push('/')
    },
  },
})
</script>
