<template>
  <form @submit.prevent="create">
    <div>username: <input v-model="username" type="text" /></div>
    <div>password: <input v-model="password" type="password" /></div>
    <div>name: <input v-model="name" type="text" /></div>
    <div>email: <input v-model="email" type="email" /></div>
    <div>office: <input v-model="office" type="office" /></div>
    <!-- <div>
      course code:
      <select v-model="courseCode">
        <template v-for="course in courses">
          <option :key="course.code" :value="course.code">
            {{ course.name }}
          </option>
        </template>
      </select>
    </div> -->
    <nuxt-link to="/">Return</nuxt-link>
    <button type="reset">RESET</button>
    <button @click.prevent="create">CREATE</button>
  </form>
</template>
<script>
export default {
  data() {
    return {
      username: null,
      password: null,
      name: null,
      email: null,
      office: null,
    }
  },
  created() {
    // this.$axios.$get('/api/courses').then((courses) => {
    //   this.courses = courses
    // })
  },
  methods: {
    create() {
      this.$axios
        .$post('/api/teachers', {
          username: this.username,
          password: this.password,
          name: this.name,
          email: this.email,
          office: this.office,
        })
        .then(() => {
          this.$router.push('/')
        })
    },
  },
}
</script>
