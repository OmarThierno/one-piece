<script>
import axios from "axios";
import AppHeader from "./components/AppHeader.vue";

export default {
  components: {
    AppHeader,
  },
  data() {
    return {

    }
  }
}
</script>

<template>
  <AppHeader />
  <!-- <h1>One Piece</h1> -->

  <router-view></router-view>

</template>

<style lang="scss"></style>
