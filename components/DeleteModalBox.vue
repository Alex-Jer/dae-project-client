<template>
  <b-modal :active.sync="isModalActive" has-modal-card>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
        <button type="button" class="delete" @click="cancel" />
      </header>
      <section class="modal-card-body">
        <p>{{ body }}</p>
      </section>
      <footer class="modal-card-foot">
        <b-button native-type="button" type="is-danger" outlined @click="confirm">{{ confirmText }}</b-button>
        <b-button type="is-secondary" @click="cancel">{{ cancelText }}</b-button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DeleteModalBox',
  props: {
    isActive: Boolean,
    trashObjectName: {
      type: String,
      default: null,
    },
  },
  emits: ['cancel', 'confirm'],
  computed: {
    isModalActive: {
      get: function () {
        return this.isActive
      },
      set: function (value) {
        if (!value) {
          this.cancel()
        }
      },
    },
  },
  methods: {
    confirm() {
      this.$emit('confirm')
    },
    cancel() {
      this.$emit('cancel')
    },
  },
})
</script>
