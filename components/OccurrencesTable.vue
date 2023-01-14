<template>
  <div>
    <modal-box
      is-danger
      :is-active="isDeleteModalActive"
      title="Delete occurrence"
      :body="`Are you sure you want to delete the occurrence #${occurrence?.id}?`"
      confirm-text="Delete"
      :object="occurrence"
      @confirm="deleteConfirm(occurrence)"
      @cancel="deleteCancel"
    />
    <modal-box
      :is-active="isApproveModalActive"
      title="Approve occurrence"
      :body="`Are you sure you want to approve the occurrence #${occurrence?.id}?`"
      confirm-text="Approve"
      :object="occurrence"
      @confirm="approveConfirm(occurrence)"
      @cancel="approveCancel"
    />
    <modal-box
      :is-active="isRejectModalActive"
      title="Reject occurrence"
      :body="`Are you sure you want to reject the occurrence #${occurrence?.id}?`"
      confirm-text="Reject"
      :object="occurrence"
      @confirm="rejectConfirm(occurrence)"
      @cancel="rejectCancel"
    />
    <b-table :paginated="paginated" :per-page="perPage" :data="occurrences" default-sort="id" striped hoverable>
      <b-table-column v-slot="props" label="ID" field="id" sortable>
        {{ props.row.id }}
      </b-table-column>

      <b-table-column v-if="showCustomer" v-slot="props" label="Customer VAT" field="customer" sortable>
        {{ props.row.customerVat }}
      </b-table-column>

      <b-table-column v-if="showPolicy" v-slot="props" label="Policy" field="policy" sortable>
        {{ props.row.policy }}
      </b-table-column>

      <b-table-column v-slot="props" label="Status" field="status" sortable>
        {{ capitalizeFirstLetter(props.row.status) }}
      </b-table-column>

      <b-table-column v-slot="props" label="Description" field="description" sortable>
        {{ props.row.description.length > 50 ? props.row.description.substring(0, 50) + '...' : props.row.description }}
      </b-table-column>

      <b-table-column v-slot="props" custom-key="actions" cell-class="is-actions-cell">
        <div class="buttons is-right no-wrap">
          <nuxt-link :to="`/occurrences/${props.row.id}`" class="button is-small is-info">
            <b-icon icon="eye" size="is-small" />
          </nuxt-link>
          <nuxt-link v-if="canEdit" :to="`/occurrences/${props.row.id}/edit`" class="button is-small is-primary">
            <b-icon icon="pencil" size="is-small" />
          </nuxt-link>
          <b-button v-if="canRemove" type="is-danger" size="is-small" @click.prevent="deleteModalOpen(props.row)">
            <b-icon icon="trash-can" size="is-small" />
          </b-button>
          <b-button v-if="canApprove" type="is-primary" size="is-small" @click.prevent="approveModalOpen(props.row)">
            <b-icon icon="check" size="is-small" />
          </b-button>
          <b-button v-if="canReject" type="is-danger" size="is-small" @click.prevent="rejectModalOpen(props.row)">
            <b-icon icon="close" size="is-small" />
          </b-button>
        </div>
      </b-table-column>

      <template #empty>
        <div class="has-text-centered">No occurrences registered</div>
      </template>
    </b-table>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import ModalBox from '@/components/ModalBox.vue'

export default defineComponent({
  components: { ModalBox },
  props: {
    perPage: {
      type: Number,
      default: 8,
    },
    occurrences: {
      type: Array,
      default: () => [],
    },
    showPolicy: {
      type: Boolean,
      default: true,
    },
    showCustomer: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      occurrence: null,
      isDeleteModalActive: false,
      isApproveModalActive: false,
      isRejectModalActive: false,
    }
  },
  computed: {
    paginated() {
      return this.occurrences?.length > this.perPage
    },
    canEdit() {
      return this.$auth.user.role === 'Administrator'
    },
    canRemove() {
      return this.canEdit
    },
    canApprove() {
      return this.$auth.user.role === 'Expert'
    },
    canReject() {
      return this.canApprove
    },
  },
  methods: {
    deleteModalOpen(obj) {
      this.occurrence = obj
      this.isDeleteModalActive = true
    },
    deleteConfirm(obj) {
      this.isDeleteModalActive = false
      this.$axios.$delete(`/api/occurrences/${obj.id}`).then(() => {
        const index = this.occurrences.findIndex((occurrence) => occurrence.id === obj.id)
        this.occurrences.splice(index, 1)
        this.$toast.success(`Occurrence #${obj.id} deleted`).goAway(3000)
      })
    },
    deleteCancel() {
      this.isDeleteModalActive = false
    },
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
          const index = this.occurrences.findIndex((occurrence) => occurrence.id === obj.id)
          this.occurrences.splice(index, 1)
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
          const index = this.occurrences.findIndex((occurrence) => occurrence.id === obj.id)
          this.occurrences.splice(index, 1)
          this.$toast.success(`Occurrence #${obj.id} rejected`).goAway(3000)
        })
    },
    rejectCancel() {
      this.isRejectModalActive = false
    },
    capitalizeFirstLetter(string) {
      if (!string) return ''
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    },
  },
})
</script>
