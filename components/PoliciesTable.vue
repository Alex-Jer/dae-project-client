<template>
  <div>
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
        </div>
      </b-table-column>
    </b-table>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
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
  computed: {
    paginated() {
      return this.policies?.length > this.perPage
    },
  },
})
</script>
