<template>
  <div>
    <modal-box
      :is-active="isApproveModalActive"
      title="Approve occurrence"
      :body="`Are you sure you want to approve the occurrence #${occurrence?.id}?`"
      confirm-text="Approve Occurrence"
      :object="occurrence"
      @confirm="approveConfirm(occurrence)"
      @cancel="approveCancel"
    />
    <modal-box
      is-danger
      :is-active="isRejectModalActive"
      title="Reject occurrence"
      :body="`Are you sure you want to reject the occurrence #${occurrence?.id}?`"
      confirm-text="Reject Occurrence"
      :object="occurrence"
      @confirm="rejectConfirm(occurrence)"
      @cancel="rejectCancel"
    />

    <hero-bar>
      Occcurrence Details
      <span class="subtitle">#{{ id }}</span>
    </hero-bar>

    <section class="section is-main-section">
      <card-component title="Details" icon="ballot">
        <b-field label="Reference" horizontal>
          <b-input :value="id" disabled />
        </b-field>
        <b-field label="Policy Code" horizontal>
          <b-input :value="occurrence?.policy" disabled />
        </b-field>
        <b-field label="Policy Type" horizontal>
          <b-input :value="capitalizeFirstLetter(policy?.type)" disabled />
        </b-field>
        <b-field label="Status" horizontal>
          <b-input :value="occurrence?.status" disabled />
        </b-field>
        <b-field label="Description" horizontal>
          <b-input :value="occurrence?.description" type="textarea" disabled />
        </b-field>

        <hr />

        <div v-if="canPickService">
          <b-field label="Service" horizontal>
            <b-field>
              <b-select v-model="form.service" placeholder="Select a service" expanded>
                <option disabled value="" selected>Select a service</option>
                <option v-for="(service, index) in services" :key="index" :value="service.id">
                  {{ service.name }}
                </option>
              </b-select>
            </b-field>
            <b-field>
              <div class="control">
                <b-button type="is-primary" @click.prevent="requestRepair(occurrence)">Request Repair</b-button>
              </div>
            </b-field>
          </b-field>

          <b-field label="or" horizontal>
            <b-field />
          </b-field>

          <b-field label="New Service" horizontal>
            <b-field>
              <b-input v-model="form.newService" :value="occurrence?.description" />
            </b-field>
            <b-field>
              <div class="control">
                <b-button type="is-info" @click.prevent="newService(occurrence)">Suggest New Service</b-button>
              </div>
            </b-field>
          </b-field>
        </div>

        <b-field v-if="canApproveReject" label="Actions" horizontal>
          <b-field>
            <div class="control">
              <b-button type="is-primary" @click.prevent="approveModalOpen(occurrence)">Approve Occurrence</b-button>
            </div>
            <div class="control">
              <b-button type="is-danger" @click.prevent="rejectModalOpen(occurrence)">Reject Occurrence</b-button>
            </div>
          </b-field>
        </b-field>

        <div v-if="canSolve">
          <b-field label="Proof" horizontal>
            <file-picker v-model="form.files" type="is-info" />
          </b-field>

          <b-field horizontal>
            <b-field>
              <div class="control">
                <b-button type="is-primary" @click.prevent="solve(occurrence)">Solve Occurrence</b-button>
              </div>
            </b-field>
          </b-field>
        </div>
      </card-component>

      <card-component class="has-table has-mobile-sort-spaced" title="Documents" icon="clipboard-list">
        <documents-table :documents="documents" :occurrence-id="occurrence?.id" />
      </card-component>

      <hr />
    </section>
    <b-loading v-model="isLoading" can-cancel is-full-page />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import CardComponent from '@/components/CardComponent.vue'
import HeroBar from '@/components/HeroBar.vue'
import DocumentsTable from '@/components/DocumentsTable.vue'
import ModalBox from '@/components/ModalBox.vue'

export default defineComponent({
  components: {
    HeroBar,
    CardComponent,
    DocumentsTable,
    ModalBox,
  },
  data() {
    return {
      form: {
        service: '',
        newService: '',
        files: [],
      },
      occurrence: {},
      policy: {},
      documents: [],
      services: [],
      isApproveModalActive: false,
      isRejectModalActive: false,
      isLoading: true,
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    canApproveReject() {
      return this.$auth.user.role === 'Expert' && this.occurrence?.status === 'PENDING'
    },
    canPickService() {
      return this.$auth.user.role === 'Customer' && this.occurrence?.status === 'APPROVED'
    },
    canSolve() {
      return this.$auth.user.role === 'Repairer' && this.occurrence?.status === 'REPAIRING'
    },
  },
  async created() {
    await this.$axios.$get(`/api/occurrences/${this.id}`).then((occurrence) => {
      if (occurrence) this.occurrence = occurrence
    })

    await this.$axios.$get(`/api/policies/${this.occurrence?.policy}`).then((policy) => {
      if (policy) this.policy = policy
    })

    await this.$axios.$get(`/api/services/${this.policy.type}`).then((services) => {
      if (services) this.services = services
    })

    await this.$axios.$get(`/api/occurrences/${this.id}/documents`).then((documents) => {
      if (documents) this.documents = documents
    })

    this.isLoading = false
  },
  methods: {
    approveModalOpen(obj) {
      this.occurrence = obj
      this.isApproveModalActive = true
    },
    approveConfirm(obj) {
      this.isApproveModalActive = false
      this.$axios
        .$patch(`/api/occurrences/${obj.id}/approve`, {
          expertVat: this.$auth.user.vat,
        })
        .then(() => {
          this.occurrence.status = 'APPROVED'
          this.$router.push('/occurrences')
          this.$toast.success(`Occurrence #${obj.id} approved. Customer notified.`).goAway(6000)

          this.$axios.$post(`/api/users/${obj.customerVat}/email/send`, {
            subject: 'Occurrence Approved',
            body: `Your occurrence (ref: #${obj.id}) has been approved by an expert. You can now pick a service to repair the damage.`,
          })
        })
    },
    approveCancel() {
      this.isApproveModalActive = false
    },
    rejectModalOpen(obj) {
      this.occurrence = obj
      this.isRejectModalActive = true
    },
    rejectConfirm(obj) {
      this.isRejectModalActive = false
      this.$axios
        .$patch(`/api/occurrences/${obj.id}/reject`, {
          expertVat: this.$auth.user.vat,
        })
        .then(() => {
          this.occurrence.status = 'REJECTED'
          this.$router.push('/occurrences')
          this.$toast.success(`Occurrence #${obj.id} rejected. Customer notified.`).goAway(6000)

          this.$axios.$post(`/api/users/${obj.customerVat}/email/send`, {
            subject: 'Occurrence Rejected',
            body: `Your occurrence (ref: #${obj.id}) has been rejected by an expert. You can create a new occurrence if you wish.`,
          })
        })
    },
    rejectCancel() {
      this.isRejectModalActive = false
    },
    requestRepair(obj) {
      this.$axios
        .$patch(`/api/occurrences/${obj.id}/service`, {
          id: this.form.service,
        })
        .then((msg) => {
          this.$router.push('/occurrences')
          this.$toast.success(msg).goAway(6000)

          this.$axios.$post(`/api/users/${obj.customerVat}/email/send`, {
            subject: 'Occurrence Repairing',
            body: `Your occurrence (ref: #${obj.id}) has been assigned to a repairer. You will be notified once the repair is done.`,
          })

          this.$axios.$post(`/api/services/${this.form.service}/email/send`, {
            subject: 'Occurrence Repairing',
            body: `Customer 'VAT: ${obj.customerVat}' has requested a repair for the occurrence ref: #${obj.id}.`,
          })
        })
        .catch((err) => {
          if (err.response?.data[0]?.reason) this.$toast.error(err.response.data[0].reason).goAway(6000)
          else this.$toast.error(err.response?.data?.reason).goAway(6000)
        })
    },
    async solve(obj) {
      if (this.form.files.length === 0) {
        this.$toast.error('You must upload at least one document that proves the repair').goAway(6000)
        return
      }

      let errorMsg = ''

      for (const file of this.form.files) {
        const fd = new FormData()
        fd.append('file', file)
        await this.$axios
          .post(`/api/occurrences/${obj.id}/documents`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          .catch(() => (errorMsg = 'Error uploading files!'))
      }

      if (errorMsg) {
        this.$toast.error(errorMsg).goAway(6000)
        return
      }

      this.$axios
        .$patch(`/api/occurrences/${obj.id}/solve`, {
          repairerVat: this.$auth.user.vat,
        })
        .then((msg) => {
          this.$router.push('/occurrences')
          this.$toast.success(msg).goAway(6000)

          this.$axios.$post(`/api/users/${obj.customerVat}/email/send`, {
            subject: 'Occurrence Repaired',
            body: `Your occurrence (ref: #${obj.id}) has been repaired.`,
          })
        })
        .catch((err) => {
          if (err.response?.data[0]?.reason) this.$toast.error(err.response.data[0].reason).goAway(6000)
          else this.$toast.error(err.response?.data?.reason).goAway(6000)
        })
    },
    newService(obj) {
      if (!this.form.newService) {
        this.$toast.error('Please enter a service name').goAway(3000)
        return
      }
      this.$axios
        .$post(`/api/occurrences/${obj.id}/service`, {
          name: this.form.newService,
        })
        .then((msg) => {
          this.$router.push('/occurrences')
          this.$toast.success(msg).goAway(6000)

          this.$axios.$post(`/api/users/${obj.customerVat}/email/send`, {
            subject: 'Occurrence Repairing',
            body: `Your occurrence (ref: #${obj.id}) has been assigned to a repairer. You will be notified once the repair is done.`,
          })
        })
        .catch((err) => {
          if (err.response?.data[0]?.reason) this.$toast.error(err.response.data[0].reason).goAway(6000)
          else this.$toast.error(err.response?.data?.reason).goAway(6000)
        })
    },
    capitalizeFirstLetter(string) {
      if (!string) return ''
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    },
  },
})
</script>
