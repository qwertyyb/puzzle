<template>
  <div id="app">
    <Puzzle></Puzzle>
  </div>
</template>

<script>
import Puzzle from './components/Puzzle'

export default {
  name: 'app',
  components: {
    Puzzle
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  justify-content: center;
}
</style>
