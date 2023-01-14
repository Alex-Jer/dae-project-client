<template>
  <div>
    <hero-bar> Import Occurrences from CSV </hero-bar>
    <section class="section is-main-section">
      <card-component title="Import Occurrences" icon="upload">
        <form @submit.prevent="formAction">
          <!--<b-field label="Customer's VAT" horizontal>
            <b-input v-model="form.customerVat" disabled />
          </b-field> METER AQUI ALGO?

          <hr />-->

          <b-field label="Add CSV Files" horizontal>
            <file-picker v-model="form.files" type="is-info" />
          </b-field>

          <hr />

          <b-field horizontal>
            <div class="control">
              <b-button native-type="submit" type="is-info">Import</b-button>
            </div>
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
    async formAction() {
      for (const file of this.form.files) {
        const fd = new FormData()
        fd.append('file', file)
        await this.$axios
          .post(`/api/occurrences/upload`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          .then(() => {
            this.$toast.success('Occurrences uploaded successfully!').goAway(6000)
          })
          .catch(() => {
            this.$toast.error('Error uploading occurrences!').goAway(6000)
          })
      }
    },
  },
})
</script>
