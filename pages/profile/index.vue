<template>
  <div>
    <hero-bar> Profile </hero-bar>
    <section class="section is-main-section">
      <div class="columns">
        <div class="column">
          <profile-update-form class="tile is-child" />
        </div>
        <div class="column">
          <password-update-form />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
import HeroBar from '@/components/HeroBar.vue'
import ProfileUpdateForm from '@/components/ProfileUpdateForm.vue'
import PasswordUpdateForm from '@/components/PasswordUpdateForm.vue'

export default defineComponent({
  components: {
    PasswordUpdateForm,
    ProfileUpdateForm,
    HeroBar,
  },
  computed: {
    ...mapState(['userName', 'userEmail']),
  },
})
</script>
