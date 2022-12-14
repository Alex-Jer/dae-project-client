<template>
  <div>
    <b-container>
      <b-table striped over :items="students" :fields="fields">
        <template #cell(actions)="row">
          <nuxt-link
            class="btn btn-link"
            :to="`/students/${row.item.username}`"
          >
            Details
          </nuxt-link>
          <nuxt-link :to="`/students/${row.item.username}/send-email`">
            Send e- mail
          </nuxt-link>
        </template>
      </b-table>
      <nuxt-link to="/">Back</nuxt-link>
    </b-container>
    <nuxt-link to="students/create">Create a New Student</nuxt-link>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fields: ['username', 'name', 'email', 'courseName', 'actions'],
      students: []
    }
  },
  created() {
    this.$axios.$get('/api/students').then((students) => {
      this.students = students
    })
  }
}
</script>
<style></style>
