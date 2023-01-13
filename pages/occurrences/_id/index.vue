<template>
  <div>
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

export default defineComponent({
  components: {
    HeroBar,
    CardComponent,
    DocumentsTable,
  },
  data() {
    return {
      occurrence: {},
      documents: [],
    }
  },
  computed: {
    id() {
      return this.$route.params.id
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
})
</script>
