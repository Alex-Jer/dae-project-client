<template>
  <div>
    <hero-bar>
      {{ getTitle }}
      <nuxt-link v-if="$auth.user.role == 'Customer'" slot="right" to="occurrences/create" class="button is-info">
        <b-icon icon="plus-circle" custom-size="default" />
        <span>New Occurrence</span>
      </nuxt-link>
    </hero-bar>

    <section class="section is-main-section">
      <card-component class="has-table has-mobile-sort-spaced" title="Occurrences" icon="clipboard-list">
        <occurrences-table :occurrences="occurrences" />
      </card-component>

      <div v-if="isAdministrator" :class="occurrences.length >= 8 ? 'filter' : ''">
        <b-field label="Filter by Customer">
          <b-select placeholder="Select a customer" @input="filterByCustomer($event)">
            <option value="" selected>All</option>
            <option v-for="(customer, index) in customers" :key="index" :value="customer.vat">
              {{ `#${customer.vat} | ${customer.name}` }}
            </option>
          </b-select>
        </b-field>
      </div>

      <div v-if="isCustomer" :class="occurrences.length >= 8 ? 'filter' : ''">
        <b-field label="Filter by Status">
          <b-select placeholder="Select a status" @input="filterByStatus($event)">
            <option value="" selected>All</option>
            <option v-for="(status, index) in statuses" :key="index" :value="status">
              {{ capitalizeFirstLetter(status) }}
            </option>
          </b-select>
        </b-field>
      </div>

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
      customers: [],
      statuses: [],
    }
  },
  computed: {
    getTitle() {
      switch (this.$auth.user.role) {
        case 'Customer':
          return 'My Occurrences'
        case 'Repairer':
          return 'Occurrences To Repair'
        case 'Expert':
          return 'Pending Occurrencces'
        default:
          return 'All Occurrences'
      }
    },
    getUrl() {
      switch (this.$auth.user.role) {
        case 'Administrator':
          return '/api/occurrences'
        case 'Repairer':
          return '/api/occurrences/repairing'
        case 'Expert':
          return '/api/occurrences/pending'
        default:
          return `/api/customers/${this.$auth.user.vat}/occurrences`
      }
    },
    isCustomer() {
      return this.$auth.user.role === 'Customer'
    },
    isAdministrator() {
      return this.$auth.user.role === 'Administrator'
    },
  },
  created() {
    this.getOccurrences()
    if (!this.isCustomer) this.getCustomers()
    if (this.isCustomer) this.getStatuses()
  },
  methods: {
    getCustomers() {
      this.$axios.$get(`/api/customers`).then((customers) => {
        this.customers = customers.data
      })
    },
    getOccurrences() {
      this.$axios.$get(this.getUrl).then((occurrences) => (this.occurrences = occurrences))
    },
    getStatuses() {
      this.$axios.$get(`/api/occurrences/status`).then((statuses) => {
        statuses = statuses.map((status) => status.status)
        this.statuses = statuses
      })
    },
    filterByCustomer(vat) {
      if (vat === '') return this.getOccurrences()
      this.$axios.$get(`/api/customers/${vat}/occurrences`).then((occurrences) => (this.occurrences = occurrences))
    },
    filterByStatus(status) {
      if (status === '') return this.getOccurrences()
      this.$axios
        .$get(`/api/customers/${this.$auth.user.vat}/occurrences/status/${status}`)
        .then((occurrences) => (this.occurrences = occurrences))
    },
    capitalizeFirstLetter(string) {
      if (!string) return ''
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    },
  },
})
</script>

<style>
@media screen and (min-width: 768px) {
  .filter {
    margin-top: -5.5rem;
    position: relative;
  }
}
</style>
