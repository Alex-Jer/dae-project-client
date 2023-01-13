<template>
  <card-component title="Edit Profile" icon="account-circle">
    <form @submit.prevent="formAction">
      <b-field label="Name" message="Required. Your name">
        <b-input v-model="form.name" name="name" required />
      </b-field>
      <b-field label="E-mail" message="Required. Your e-mail">
        <b-input v-model="form.email" name="email" type="email" required />
      </b-field>
      <hr />
      <b-field>
        <b-field grouped>
          <div class="control">
            <b-button native-type="submit" type="is-info"> Submit </b-button>
          </div>
          <div class="control">
            <b-button type="is-info" native-type="button" outlined> Reset </b-button>
          </div>
        </b-field>
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
        name: null,
        email: null,
      },
    }
  },
  created() {
    this.form.name = this.$auth.user.name
    this.form.email = this.$auth.user.email
  },
  methods: {
    async formAction() {
      let errorMsg = ''

      await this.$axios
        .$put(`/api/users/${this.$auth.user.vat}`, {
          name: this.form.name,
          email: this.form.email,
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
