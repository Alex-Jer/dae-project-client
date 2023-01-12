<template>
  <div>
    <modal-box
      :is-active="isModalActive"
      :trash-object-name="trashObject ? trashObject.name : null"
      @confirm="trashConfirm"
      @cancel="trashCancel"
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

      <b-table-column v-if="showAdminActions" v-slot="props" custom-key="actions" cell-class="is-actions-cell">
        <div class="buttons is-right no-wrap">
          <nuxt-link :to="`/occurrences/${props.row.id}`" class="button is-small is-info">
            <b-icon icon="eye" size="is-small" />
          </nuxt-link>
          <nuxt-link :to="`/occurrences/${props.row.id}/edit`" class="button is-small is-primary">
            <b-icon icon="pencil" size="is-small" />
          </nuxt-link>
          <b-button type="is-danger" size="is-small" @click.prevent="trashModalOpen(props.row)">
            <b-icon icon="trash-can" size="is-small" />
          </b-button>
        </div>
      </b-table-column>
    </b-table>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import ModalBox from '@/components/ModalBox.vue'

export default defineComponent({
  components: { ModalBox },
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
    showAdminActions: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isModalActive: false,
      trashObject: null,
    }
  },
  computed: {
    paginated() {
      return this.occurrences?.length > this.perPage
    },
  },
  methods: {
    trashModalOpen(obj) {
      this.trashObject = obj
      this.isModalActive = true
    },
    trashConfirm() {
      this.isModalActive = false

      this.$buefy.snackbar.open({
        message: 'Confirmed',
        queue: false,
      })
    },
    trashCancel() {
      this.isModalActive = false
    },
  },
})
</script>
