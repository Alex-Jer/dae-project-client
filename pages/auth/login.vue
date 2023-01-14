<template>
  <card-component title="Login" icon="lock">
    <form @submit.prevent="submit">
      <b-field label="VAT / NIF">
        <b-input v-model.trim="vat" name="vat" required />
      </b-field>

      <b-field label="Password">
        <b-input v-model="password" type="password" name="password" required />
      </b-field>

      <hr />

      <b-field grouped>
        <div class="control">
          <b-button native-type="submit" type="is-black">Login</b-button>
        </div>
      </b-field>
    </form>
  </card-component>
</template>

<script>
export default {
  auth: false,

  data() {
    return {
      vat: '321321321',
      password: '123456',
    }
  },

  methods: {
    submit() {
      const promise = this.$auth.loginWith('local', {
        data: {
          vat: this.vat,
          password: this.password,
        },
      })

      promise.then(() => {
        this.$toast.success('You are now logged in.').goAway(3000)
        this.$router.push('/occurrences')
      })

      promise.catch(() => {
        this.$toast.error("We couldn't log you in. Please check your credentials.").goAway(3000)
      })
    },
  },
}
</script>
