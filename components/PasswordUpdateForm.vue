<template>
  <card-component title="Change Password" icon="lock">
    <form @submit.prevent="formAction">
      <b-field label="New password" message="Required. New password">
        <b-input v-model="form.password" name="password" type="password" required autocomplete="new-password" />
      </b-field>
      <b-field label="Confirm password" message="Required. New password one more time">
        <b-input
          v-model="form.password_confirmation"
          name="password_confirmation"
          type="password"
          required
          autocomplete="new-password"
        />
      </b-field>
      <hr />
      <b-field>
        <div class="control">
          <b-button native-type="submit" type="is-info"> Submit </b-button>
        </div>
      </b-field>
    </form>
  </card-component>
</template>

<script>
import { defineComponent } from 'vue'
import CardComponent from '@/components/CardComponent.vue'

export default defineComponent({
  components: {
    CardComponent,
  },
  data() {
    return {
      form: {
        password: '',
        password_confirmation: '',
      },
    }
  },
  methods: {
    validateForm() {
      if (this.form.password !== this.form.password_confirmation) {
        this.$toast.error('New password and confirm password must match!').goAway(6000)
        return false
      }
      return true
    },
    async formAction() {
      if (!this.validateForm()) return
      let errorMsg = ''

      await this.$axios
        .$put(`/api/users/me/password`, {
          password: this.form.password,
        })
        .catch(() => (errorMsg = 'Error editing profile!'))

      if (errorMsg) {
        this.$toast.error(errorMsg).goAway(6000)
        return
      }

      this.$toast.success('Profile updated!').goAway(6000)
    },
  },
})
</script>
