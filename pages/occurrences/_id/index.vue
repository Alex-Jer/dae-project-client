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
        <b-field label="Policy Code" horizontal>
          <b-input :value="occurrence?.policy" disabled />
        </b-field>
        <b-field label="Reference" horizontal>
          <b-input :value="id" disabled />
        </b-field>
        <b-field label="Status" horizontal>
          <b-input :value="occurrence?.status" disabled />
        </b-field>
        <b-field label="Description" horizontal>
          <b-input :value="occurrence?.description" type="textarea" disabled />
        </b-field>

        <hr />

        <b-field v-if="canApproveReject" label="Actions" horizontal>
          <b-field grouped>
            <div class="control">
              <b-button type="is-primary" @click.prevent="approveModalOpen(occurrence)">Approve Occurrence</b-button>
            </div>
            <div class="control">
              <b-button type="is-danger" @click.prevent="rejectModalOpen(occurrence)">Reject Occurrence</b-button>
            </div>
          </b-field>
        </b-field>
      </card-component>

      <!--<card-component class="" title="Documents" icon="clipboard-list">
        V-IF Perito some actions (LATER, ISSUE TA NO TRELLO)
        https://trello.com/c/igdk9rsa/20-perito-valida-ocorrências
      </card-component>-->

      <card-component class="has-table has-mobile-sort-spaced" title="Documents" icon="clipboard-list">
        <documents-table :documents="documents" :occurrence-id="occurrence?.id" />
      </card-component>

      <hr />
    </section>
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
      documents: [],
      occurrence: {},
      isApproveModalActive: false,
      isRejectModalActive: false,
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    canApproveReject() {
      return this.$auth.user.role === 'Expert'
    },
  },
  created() {
    this.$axios.$get(`/api/occurrences/${this.id}`).then((occurrence) => {
      if (occurrence) this.occurrence = occurrence
    })

    this.$axios.$get(`/api/occurrences/${this.id}/documents`).then((documents) => {
      if (documents) this.documents = documents
    })
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
          this.$toast.success(`Occurrence #${obj.id} approved`).goAway(3000)
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
          this.$toast.success(`Occurrence #${obj.id} rejected`).goAway(3000)
        })
    },
    rejectCancel() {
      this.isRejectModalActive = false
    },
  },
})
</script>
