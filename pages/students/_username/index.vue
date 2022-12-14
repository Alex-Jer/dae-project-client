<template>
  <b-container>
    <h4>Student Details:</h4>
    <p>Username: {{ student.username }}</p>
    <p>Name: {{ student.name }}</p>
    <p>Email: {{ student.email }}</p>
    <p>Course: {{ student.courseName }}</p>
    <h4>Subjects enrolled:</h4>
    <b-table
      v-if="subjectsEnrolled.length"
      striped
      over
      :items="subjectsEnrolled"
      :fields="subjectFields"
    />
    <p v-else>No subjects enrolled.</p>
    <h4>Documents</h4>
    <b-table
      v-if="documents.length"
      striped
      over
      :items="documents"
      :fields="documentsFields"
    >
      <template #cell(actions)="row">
        <b-btn
          class="btn btn-link"
          tar-
          get="_blank"
          @click.prevent="download(row.item)"
        >
          Download
        </b-btn>
      </template>
    </b-table>
    <p v-else>No documents.</p>
    <nuxt-link to="/students">Back</nuxt-link>
    &nbsp;
    <nuxt-link to="/students">Go back</nuxt-link>
    &nbsp;
    <nuxt-link :to="`/students/${username}/send-email`">
      Send e-mail
    </nuxt-link>
    &nbsp;
    <nuxt-link :to="`/students/${username}/upload`">Upload</nuxt-link>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      student: {},
      subjectsEnrolled: [],
      documents: [],
      subjectFields: [
        'code',
        'name',
        'courseCode',
        'courseYear',
        'scholarYear',
        'actions'
      ],
      documentsFields: ['filename', 'actions']
    }
  },
  computed: {
    username() {
      return this.$route.params.username
    }
  },
  created() {
    this.$axios
      .$get(`/api/students/${this.username}`)
      .then(student => (this.student = student || {}))
      .then(() => this.$axios.$get(`/api/students/${this.username}/subjects`))
      .then(subjectsEnrolled => (this.subjectsEnrolled = subjectsEnrolled))
      .then(() => this.$axios.$get(`/api/documents/${this.username}`))
      .then(documents => (this.documents = documents))
  },
  methods: {
    download(fileToDownload) {
      const documentId = fileToDownload.id
      this.$axios
        .$get('/api/documents/download/' + documentId, {
          responseType: 'arraybuffer'
        })
        .then((file) => {
          const url = window.URL.createObjectURL(new Blob([file]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', fileToDownload.filename)
          document.body.appendChild(link)
          link.click()
        })
    }
  }
}
</script>
