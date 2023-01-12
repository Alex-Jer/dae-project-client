<template>
  <div>
    <hero-bar> Occurrences </hero-bar>
    <section class="section is-main-section">
      <card-component :title="`Editing Occurrence #${$route.params.id}`" icon="ballot">
        <form @submit.prevent="formAction">
          <b-field label="Policy" horizontal>
            <b-input v-model="form.policy" placeholder="e.g. 65B-510" required />
          </b-field>
          <b-field label="Description" message="The description of your occurrence. Max 255 characters" horizontal>
            <b-input v-model="form.description" type="textarea" maxlength="255" required />
          </b-field>
          <hr />
          <b-field label="Add Files" horizontal>
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
        policy: '4241',
        description: 'blablabla',
        files: null,
      },
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
    this.$axios.$get(`/api/occurrences/${this.id}`).then((occurrence) => {
      this.occurrence = occurrence
      this.form.policy = occurrence.policy
      this.form.description = occurrence.description
    })
  },
  methods: {
    formReset() {
      this.form.policy = this.occurrence.policy
      this.form.description = this.occurrence.description
      this.form.files = null
    },
    formAction() {
      const promise = this.$axios.$put(`/api/customers/${this.$auth.user.vat}/occurrences/${this.id}`, {
        description: this.form.description,
        policy: this.form.policy,
      })

      let errorMsg = ''

      if (this.hasFile)
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
        })

      promise.then(() => this.$router.push('/occurrences'))
      promise.catch(() => (errorMsg = 'Error editing occurrence!'))

      if (errorMsg) this.$toast.error(errorMsg).goAway(3000)

      this.$toast.success('Occurrence edited!').goAway(3000)
    },
  },
})
</script>
