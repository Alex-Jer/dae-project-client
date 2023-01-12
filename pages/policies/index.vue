<template>
  <div>
    <hero-bar>
      My Policies
      <router-link slot="right" to="policies/create" class="button is-info">
        <b-icon icon="plus-circle" custom-size="default" />
        <span>New Policy</span>
      </router-link>
    </hero-bar>
    <section class="section is-main-section">
      <card-component class="has-table has-mobile-sort-spaced" title="Policies" icon="clipboard-list">
        <policies-table :policies="policies" />
      </card-component>

      <hr />
    </section>
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
    }
  },
  created() {
    this.$axios.$get(`/api/customers/${this.$auth.user.vat}/policies`).then((policies) => {
      this.policies = policies
    })
  },
})
</script>
