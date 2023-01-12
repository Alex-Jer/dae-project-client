<template>
  <div>
    <hero-bar>
      Occurrences
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
  created() {
    this.$axios.$get(`/api/customers/${this.$auth.user.vat}/occurrences`).then((occurrences) => {
      this.occurrences = occurrences
    })
  },
})
</script>
