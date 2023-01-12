<template>
  <div>
    <hero-bar> Occurrences </hero-bar>
    <section class="section is-main-section">
      <card-component title="Create Occurrence" icon="ballot">
        <form @submit.prevent="formAction">
          <b-field label="Policy" horizontal>
            <b-input
              v-model="form.policy"
              placeholder="e.g. 65B-510"
              required
            />
          </b-field>
          <b-field
            label="Description"
            message="The description of your occurrence. Max 255 characters"
            horizontal
          >
            <b-input
              v-model="form.description"
              type="textarea"
              maxlength="255"
              required
            />
          </b-field>
          <hr />
          <b-field label="Files" horizontal>
            <file-picker v-model="form.file" type="is-info" />
          </b-field>
          <hr />
          <b-field horizontal>
            <b-field grouped>
              <div class="control">
                <b-button native-type="submit" type="is-info">
                  Submit
                </b-button>
              </div>
              <div class="control">
                <b-button
                  type="is-info is-outlined"
                  @click.prevent="formAction"
                >
                  Reset
                </b-button>
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
        policy: '4241',
        description: 'blablabla',
        file: null,
      },
    }
  },
  computed: {
    hasFile() {
      return this.form.file != null
    },
  },
  methods: {
    formAction() {
      if (!this.hasFile) {
        this.$toast.error('You must include a file!').goAway(3000)
        return
      }

      const promise = this.$axios.$post(
        `/api/customers/${this.$auth.user.vat}/occurrences`,
        {
          description: this.form.description,
          policy: this.form.policy,
        }
      )

      promise.then((occurrence) => {
        const fd = new FormData()
        fd.append('file', this.form.file)

        this.$axios
          .post(`/api/occurrences/${occurrence.id}/documents`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          .then(() => this.$toast.success('Occurrence created!').goAway(3000))
          .catch(() => this.$toast.error('Error uploading file!').goAway(3000))
      })
    },
  },
})
</script>
