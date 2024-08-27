<script >
export default {
  data() {
    return{

    }
  }
}
</script>

<template>
  <header class="fixed-top">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container">
        <a class="navbar-brand" href="#">
          <img class="ms_img-pro" src="https://i.pinimg.com/474x/ec/78/f1/ec78f19f19347ffcf86c2f57177ecc30.jpg" alt="">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-2">
            <li class="nav-item">
              <!-- <a class="nav-link active" aria-current="page" href="#">Home</a> -->
              <router-link :to="{name: 'home'}">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{name: 'chat'}">Chat</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{name: 'newCharacter'}">New Character</router-link>
            </li>
          </ul>
          <!-- <form class="d-flex" role="search">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form> -->
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped lang="scss">
a {
  color: inherit;
  text-decoration: none;
}
.ms_img-pro {
  width: 60px;
}

.router-link-active {
  color: white;
  background-color: blue;
  padding: 5px 10px;
  border-radius: 5px;
}
</style>
