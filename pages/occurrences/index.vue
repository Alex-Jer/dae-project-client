<template>
  <div>
    <hero-bar>
      {{ getTitle }}
      <router-link slot="right" to="occurrences/create" class="button is-info">
        <b-icon icon="plus-circle" custom-size="default" />
        <span>New Occurrence</span>
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <card-component class="has-table has-mobile-sort-spaced" title="Occurrences" icon="clipboard-list">
        <occurrences-table :occurrences="occurrences" />
      </card-component>

      <hr />
    </section>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import OccurrencesTable from '@/components/OccurrencesTable.vue'
import CardComponent from '@/components/CardComponent.vue'
import HeroBar from '@/components/HeroBar.vue'

export default defineComponent({
  components: {
    HeroBar,
    CardComponent,
    OccurrencesTable,
  },
  data() {
    return {
      occurrences: [],
    }
  },
  computed: {
    getTitle() {
      switch (this.$auth.user.role) {
        case 'Customer':
          return `My Occurrences`
        case 'Repairer':
          return `Approved Occurrences`
        case 'Expert':
          return `Pending Occurrencces`
        default:
          return `All Occurrences`
      }
    },

    getUrl() {
      switch (this.$auth.user.role) {
        case 'Customer':
          return `/api/customers/${this.$auth.user.vat}/occurrences`
        case 'Repairer':
          return `/api/occurrences/approved`
        case 'Expert':
          return `/api/occurrences/pending`
        default:
          return `/api/occurrences`
      }
    },
  },
  created() {
    this.$axios.$get(this.getUrl).then((occurrences) => {
      this.occurrences = occurrences
    })
  },
})
</script>
