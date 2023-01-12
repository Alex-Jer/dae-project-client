<template>
  <div>
    <modal-box
      :is-active="isModalActive"
      :trash-object-name="trashObject ? trashObject.name : null"
      @confirm="trashConfirm"
      @cancel="trashCancel"
    />
    <b-table :paginated="paginated" :per-page="perPage" :data="policies" default-sort="name" striped hoverable>
      <b-table-column v-slot="props" label="Code" field="code" sortable>
        {{ props.row.code }}
      </b-table-column>

      <b-table-column v-slot="props" label="Insurer Company" field="insurerCompany" sortable>
        {{ props.row.insurerCompany }}
      </b-table-column>

      <b-table-column v-slot="props" label="Type" field="type" sortable>
        {{ props.row.type }}
      </b-table-column>

      <b-table-column v-slot="props" custom-key="actions" cell-class="is-actions-cell">
        <div class="buttons is-right no-wrap">
          <nuxt-link :to="`/policies/${props.row.code}`" class="button is-small is-info">
            <b-icon icon="eye" size="is-small" />
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
    policies: {
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
      isModalActive: false,
      trashObject: null,
    }
  },
  computed: {
    paginated() {
      return this.policies?.length > this.perPage
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
    policyDetails(policy) {
      // this.$router.push(`/policies/${policy.code}`)
    },
  },
})
</script>
