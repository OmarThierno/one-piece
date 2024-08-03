<script>
import axios from "axios";

export default {
  data() {
    return {
      characterArr: [],
    }
  },
  created() {
    this.getCharacter();
  },
  methods: {
    getCharacter() {
      axios.get("http://localhost:8888/boolean/one-piece-api/server.php").then((resp) => {
        // console.log(resp.data.results);
        this.characterArr = resp.data.results;
      })
    }
  }
}
</script>

<template>
  
  <div class="container my-5">

    <h1 class="mb-3">Home Page</h1>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 row-cols-xl-5 g-3">
      <div v-for="character in characterArr" class="col">
        <div class="card h-100">
          <img :src="character.photo" class="card-img-top" :alt="`photo of ${character.name} in One piece`">
          <div class="card-body">
            <h5 class="card-title">{{ character.name }}</h5>
            <h6>{{ character.fullName === '' ? '' : character.fullName }}</h6>
            <p class="card-text">{{ character.epithet }}.</p>
            <!-- <a href="#" class="btn btn-primary">Go somewhere</a> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
