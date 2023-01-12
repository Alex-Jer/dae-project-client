<template>
  <div>
    <hero-bar>
      Occcurrence Details
      <span class="subtitle">#{{ id }}</span>
    </hero-bar>
    <section class="section is-main-section">
      <card-component title="Details" icon="ballot">
        <b-field label="Policy Code" horizontal> {{ occurrence?.policy }} </b-field>
        <b-field label="Reference" horizontal> {{ id }} </b-field>
        <b-field label="Description" horizontal> {{ occurrence?.description }} </b-field>
        <b-field label="Status" horizontal> {{ occurrence?.status }} </b-field>
      </card-component>
      <card-component class="" title="Documents" icon="clipboard-list"> Files... </card-component>
      <!--<card-component class="" title="Documents" icon="clipboard-list">
        V-IF Perito some actions (LATER, ISSUE TA NO TRELLO)
        https://trello.com/c/igdk9rsa/20-perito-valida-ocorrências
      </card-component>-->

      <hr />
    </section>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import CardComponent from '@/components/CardComponent.vue'
import HeroBar from '@/components/HeroBar.vue'

export default defineComponent({
  components: {
    HeroBar,
    CardComponent,
  },
  data() {
    return {
      occurrence: {},
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
  },
})
</script>
