<template>
  <div>
    <b-table :paginated="paginated" :per-page="perPage" :data="documents" default-sort="name" striped hoverable>
      <b-table-column v-slot="props" label="ID" field="id" sortable>
        {{ props.row.id }}
      </b-table-column>

      <b-table-column v-slot="props" label="Filename" field="filename" sortable>
        {{ props.row.filename }}
      </b-table-column>

      <b-table-column v-slot="props" custom-key="actions" cell-class="is-actions-cell">
        <!-- v-if="showAdminActions" -->
        <div class="buttons is-right no-wrap">
          <b-button type="is-info" size="is-small" @click.prevent="download(props.row)">
            <b-icon icon="download" size="is-small" />
          </b-button>
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
    documents: {
      type: Array,
      default: () => [],
    },
    occurrenceId: {
      type: Number,
      default: null,
    },
    showAdminActions: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      trashObject: null,
    }
  },
  computed: {
    paginated() {
      return this.documents?.length > this.perPage
    },
  },
  methods: {
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
    download(fileToDownload) {
      this.$axios
        .$get(`/api/occurrences/${this.$props.occurrenceId}/documents/${fileToDownload.id}`, {
          responseType: 'arrayBuffer',
        })
        .then((file) => {
          const url = window.URL.createObjectURL(new Blob([file]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', fileToDownload.filename)
          document.body.appendChild(link)
          link.click()
        })
    },
  },
})
</script>
