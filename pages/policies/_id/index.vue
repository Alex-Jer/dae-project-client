<template>
  <div>
    <hero-bar>
      Policy Details
      <span class="subtitle">#{{ id }}</span>
    </hero-bar>
    <section class="section is-main-section">
      <card-component title="Details" icon="ballot">
        <b-field label="Policy Code" horizontal> {{ id }} </b-field>
        <b-field label="Insurer Company" horizontal> {{ policy.insurerCompany }} </b-field>
        <b-field label="Type" horizontal> {{ policy.type }} </b-field>
        <b-field label="Covers" horizontal> {{ formatCovers ?? 'unknown' }} </b-field>
      </card-component>
      <card-component class="has-table has-mobile-sort-spaced" title="Occurrences" icon="clipboard-list">
        <occurrences-table :occurrences="occurrences" :show-policy="false" />
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
      policy: {},
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    formatCovers() {
      if (this.policy.covers) {
        let covers = ''
        this.policy.covers.forEach((cover) => {
          covers += cover + ', '
        })
        return covers.slice(0, -2)
      }
      return ''
    },
  },
  created() {
    this.$axios.$get(`/api/policies/${this.id}`).then((policy) => {
      if (policy && policy[0]) this.policy = policy[0]
    })
    this.$axios.$get(`/api/policies/${this.id}/occurrences`).then((occurrences) => {
      this.occurrences = occurrences
    })
  },
})
</script>
