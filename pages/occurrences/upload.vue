<template>
  <div>
    <hero-bar> Load Occurrences from CSV </hero-bar>
    <section class="section is-main-section">
      <card-component title="Editing Occurrence" icon="ballot">
        <form @submit.prevent="formAction">
          <b-field label="Customer's VAT" horizontal>
            <b-input v-model="form.customerVat" disabled />
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
      form: {
        customerVat: '',
        files: null,
      },
    }
  },
  computed: {
    hasFile() {
      return this.form.files != null
    },
  },
  methods: {
    formReset() {
      this.form.policy = this.occurrence.policy
      this.form.description = this.occurrence.description
      this.form.files = null
    },
    async formAction() {
      for (const file of this.form.files) {
        const fd = new FormData()
        fd.append('file', file)
        await this.$axios
          .post(`/api/occurrences/upload`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          .then((data) => {
            this.$toast.success('Those occurrences have been uploaded!').goAway(6000)
            this.$router.push('/occurrences')
          })
          .catch(() => {
            this.$toast.error('Unknown error uploading occurrences!').goAway(6000)
          })
      }
    },
  },
})
</script>
