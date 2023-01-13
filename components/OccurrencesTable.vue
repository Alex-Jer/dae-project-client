<template>
  <div>
    <delete-modal-box
      :is-active="isTrashModalActive"
      :trash-object-name="trashObject ? trashObject.name : null"
      @confirm="trashConfirm"
      @cancel="trashCancel"
    />
    <modal-box
      :is-active="isApproveModalActive"
      :title="'Approve this occurrence?'"
      @confirm="approveConfirm"
      @cancel="approveCancel"
    />
    <modal-box
      :is-active="isRejectModalActive"
      :title="'Reject this occurrence?'"
      @confirm="rejectConfirm"
      @cancel="rejectCancel"
    />
    <b-table :paginated="paginated" :per-page="perPage" :data="occurrences" default-sort="name" striped hoverable>
      <b-table-column v-slot="props" label="ID" field="id" sortable>
        {{ props.row.id }}
      </b-table-column>

      <b-table-column v-slot="props" label="Description" field="description" sortable>
        {{ props.row.description.length > 50 ? props.row.description.substring(0, 50) + '...' : props.row.description }}
      </b-table-column>

      <b-table-column v-if="showPolicy" v-slot="props" label="Policy" field="policy" sortable>
        {{ props.row.policy }}
      </b-table-column>

      <b-table-column v-slot="props" label="Status" field="status" sortable>
        {{ props.row.status }}
      </b-table-column>

      <b-table-column v-slot="props" custom-key="actions" cell-class="is-actions-cell">
        <div class="buttons is-right no-wrap">
          <nuxt-link :to="`/occurrences/${props.row.id}`" class="button is-small is-info">
            <b-icon icon="eye" size="is-small" />
          </nuxt-link>
          <nuxt-link v-if="canEdit" :to="`/occurrences/${props.row.id}/edit`" class="button is-small is-primary">
            <b-icon icon="pencil" size="is-small" />
          </nuxt-link>
          <b-button v-if="canRemove" type="is-danger" size="is-small" @click.prevent="trashModalOpen(props.row)">
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
    </b-table>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import ModalBox from '@/components/ModalBox.vue'
import DeleteModalBox from '@/components/DeleteModalBox.vue'

export default defineComponent({
  components: { ModalBox, DeleteModalBox },
  props: {
    isEmpty: Boolean,
    perPage: {
      type: Number,
      default: 10,
    },
    occurrences: {
      type: Array,
      default: () => [],
    },
    showPolicy: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isTrashModalActive: false,
      trashObject: null,
      isApproveModalActive: false,
      approveObject: null,
      isRejectModalActive: false,
      rejectObject: null,
    }
  },
  computed: {
    paginated() {
      return this.occurrences?.length > this.perPage
    },
    canEdit() {
      return this.$auth.user.role === 'Admin'
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
    trashModalOpen(obj) {
      this.trashObject = obj
      this.isTrashModalActive = true
    },
    trashConfirm() {
      this.isTrashModalActive = false

      this.$buefy.snackbar.open({
        message: 'Confirmed',
        queue: false,
      })
    },
    trashCancel() {
      this.isTrashModalActive = false
    },
    approveModalOpen(obj) {
      this.approveObject = obj
      this.isApproveModalActive = true
    },
    approveConfirm() {
      this.isApproveModalActive = false

      this.$buefy.snackbar.open({
        message: 'Occurrence has been approved',
        queue: false,
      })
    },
    approveCancel() {
      this.isApproveModalActive = false
    },
    rejectModalOpen(obj) {
      this.rejectObject = obj
      this.isRejectModalActive = true
    },
    rejectConfirm() {
      this.isRejectModalActive = false

      this.$buefy.snackbar.open({
        message: 'Occurrence has been rejected',
        queue: false,
      })
    },
    rejectCancel() {
      this.isRejectModalActive = false
    },
  },
})
</script>
