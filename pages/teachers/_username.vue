<template>
  <b-container>
    <h4>Teacher Details:</h4>
    <p>Username: {{ teacher.username }}</p>
    <p>Name: {{ teacher.name }}</p>
    <p>Email: {{ teacher.email }}</p>
    <p>Office: {{ teacher.office }}</p>
    <nuxt-link to="/teachers">Back</nuxt-link>
  </b-container>
</template>
<script>
export default {
  data() {
    return {
      teacher: {},
      subjects: [],
      subjectFields: ['code', 'name', 'office']
    }
  },
  computed: {
    username() {
      return this.$route.params.username
    }
  },
  created() {
    this.$axios.$get(`/api/teachers/${this.username}`)
      .then(teacher => this.teacher = teacher || {})
      .then(() => this.$axios.$get(`/api/teachers/${this.username}/subjects`))
      .then(subjects => this.subjects = subjects)
  },
}
</script>
