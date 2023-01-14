<template>
  <div>
    <hero-bar> Occurrences </hero-bar>
    <section class="section is-main-section">
      <card-component title="Create Occurrence" icon="ballot">
        <form @submit.prevent="formAction">
          <b-field label="Policy" horizontal>
            <b-select v-model="form.policy" placeholder="Select a policy" :loading="policiesLoading" expanded required>
              <option disabled value="" selected>Select a policy</option>
              <option v-for="(policy, index) in policies" :key="index" :value="policy.code">
                {{ `#${policy.code} | ${capitalizeFirstLetter(policy.type)} | ${policy.insurerCompany}` }}
              </option>
            </b-select>
          </b-field>

          <b-field label="Description" message="The description of your occurrence. Max 255 characters" horizontal>
            <b-input v-model="form.description" type="textarea" maxlength="255" required />
          </b-field>

          <hr />

          <b-field label="Files" horizontal>
            <file-picker v-model="form.files" type="is-info" />
          </b-field>

          <hr />

          <b-field horizontal>
            <b-field grouped>
              <div class="control">
                <b-button native-type="submit" type="is-info">Submit</b-button>
              </div>
              <div class="control">
                <b-button type="is-info is-outlined" @click.prevent="formReset">Reset</b-button>
              </div>
            </b-field>
          </b-field>
        </form>
      </card-component>
    </section>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import CardComponent from '@/components/CardComponent.vue'
import FilePicker from '@/components/FilePicker.vue'
import HeroBar from '@/components/HeroBar.vue'

export default defineComponent({
  components: {
    HeroBar,
    FilePicker,
    CardComponent,
  },
  data() {
    return {
      form: {
        customer: '',
        policy: '',
        description: '',
        files: null,
      },
      policies: [],
      policiesLoading: true,
    }
  },
  computed: {
    hasFile() {
      return this.form.files != null
    },
    isCustomer() {
      return this.$auth.user.role === 'Customer'
    },
  },
  created() {
    if (this.isCustomer) {
      this.form.customer = this.$auth.user.vat
      this.getPolicies()
    }
  },
  methods: {
    getPolicies() {
      this.$axios.$get(`/api/customers/${this.form.customer}/policies`).then((policies) => {
        this.policies = policies
        this.policiesLoading = false
      })
    },
    formReset() {
      this.form.customer = ''
      this.form.policy = ''
      this.form.description = ''
    },
    formAction() {
      if (!this.hasFile) {
        this.$toast.error('You must include at least one file!').goAway(3000)
        return
      }

      const promise = this.$axios.$post(`/api/customers/${this.form.customer}/occurrences`, {
        description: this.form.description,
        policy: this.form.policy,
      })

      let errorMsg = ''

      promise.then((occurrence) => {
        this.form.files.forEach((file) => {
          const fd = new FormData()
          fd.append('file', file)
          this.$axios
            .post(`/api/occurrences/${occurrence.id}/documents`, fd, {
              headers: { 'Content-Type': 'multipart/form-data' },
            })
            .catch(() => (errorMsg = 'File upload failed!'))
        })
        this.$router.push('/occurrences')
      })

      promise.catch(() => (errorMsg = 'Error creating occurrence!'))

      if (errorMsg) this.$toast.error(errorMsg).goAway(3000)

      this.$toast.success('Occurrence created!').goAway(3000)
    },
    capitalizeFirstLetter(string) {
      if (!string) return ''
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    },
  },
})
</script>
