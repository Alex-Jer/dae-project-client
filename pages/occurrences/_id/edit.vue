<template>
  <div>
    <hero-bar> Occurrences </hero-bar>
    <section class="section is-main-section">
      <card-component :title="`Editing Occurrence #${$route.params.id}`" icon="ballot">
        <form @submit.prevent="formAction">
          <b-field label="Customer's VAT" horizontal>
            <b-input v-model="form.customerVat" disabled />
          </b-field>

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

          <b-field label="Add Documents" horizontal>
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
      occurrence: {},
      form: {
        customerVat: '',
        policy: '',
        description: '',
        files: null,
      },
      policies: [],
      policiesLoading: true,
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    hasFile() {
      return this.form.files != null
    },
  },
  created() {
    this.$axios
      .$get(`/api/occurrences/${this.id}`)
      .then((occurrence) => {
        this.occurrence = occurrence
        this.form.customerVat = occurrence.customerVat
        this.form.policy = occurrence.policy
        this.form.description = occurrence.description
      })
      .then(() => {
        this.getPolicies()
      })
  },
  methods: {
    getPolicies() {
      this.$axios.$get(`/api/customers/${this.form.customerVat}/policies`).then((policies) => {
        this.policies = policies
        this.policiesLoading = false
      })
    },
    formReset() {
      this.form.policy = this.occurrence.policy
      this.form.description = this.occurrence.description
      this.form.files = null
    },
    async formAction() {
      let errorMsg = ''
      let occurrence = {}

      await this.$axios
        .$put(`/api/occurrences/${this.id}`, {
          description: this.form.description,
          policy: this.form.policy,
        })
        .then((occ) => (occurrence = occ))
        .catch(() => (errorMsg = 'Error editing occurrence!'))

      if (errorMsg) {
        this.$toast.error(errorMsg).goAway(6000)
        return
      }

      if (!this.hasFile) {
        this.$toast.success('Occurrence edited!').goAway(6000)
        this.$router.push('/occurrences')
        return
      }

      for (const file of this.form.files) {
        const fd = new FormData()
        fd.append('file', file)
        await this.$axios
          .post(`/api/occurrences/${occurrence.id}/documents`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          .catch(() => (errorMsg = 'Error editing occurrence!'))
      }

      if (errorMsg) {
        this.$toast.error(errorMsg).goAway(6000)
        return
      }

      if (this.form.policy !== this.occurrence.policy || this.form.description !== this.occurrence.description) {
        this.$toast.success('Occurrence edited and documents uploaded!').goAway(6000)
        this.$router.push('/occurrences')
        return
      }

      if (this.hasFile) {
        this.$toast.success('Documents uploaded!').goAway(6000)
        this.$router.push('/occurrences')
      }
    },
    capitalizeFirstLetter(string) {
      if (!string) return ''
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    },
  },
})
</script>
