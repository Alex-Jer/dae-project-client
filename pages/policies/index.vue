<template>
  <div>
    <hero-bar> {{ $auth.user.role == 'Customer' ? 'My Policies' : 'All Policies' }} </hero-bar>
    <section class="section is-main-section">
      <card-component class="has-table has-mobile-sort-spaced" title="Policies" icon="clipboard-list">
        <policies-table :policies="policies" />
      </card-component>
      <hr />
    </section>
    <b-loading v-model="isLoading" can-cancel is-full-page></b-loading>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import PoliciesTable from '@/components/PoliciesTable.vue'
import CardComponent from '@/components/CardComponent.vue'
import HeroBar from '@/components/HeroBar.vue'

export default defineComponent({
  components: {
    HeroBar,
    CardComponent,
    PoliciesTable,
  },
  data() {
    return {
      policies: [],
      isLoading: true,
    }
  },
  created() {
    this.$axios
      .$get(this.$auth.user.role === 'Customer' ? `/api/customers/${this.$auth.user.vat}/policies` : `/api/policies`)
      .then((policies) => {
        this.policies = policies
        this.isLoading = false
      })
  },
})
</script>
