<template>
  <div class="container">
    <h1>拼图游戏</h1>
    <main>
      <p v-for="(item, index) in current" class="block" 
      @click="clickHandle(index)"
      :style="{ 
      backgroundImage: emptyIndex === index ? 'initial' : 'url('+pic+')',
      backgroundColor: emptyIndex === index ? 'yellow': 'initial',
      backgroundPositionX: -600/level*(item%level)+'px', 
      backgroundPositionY: -Math.floor(item/level)*600/level+'px',
      width: 600/level+'px',
      height: 600/level+'px'
      // top: Math.floor(item/level)*600/level+'px',
      // left: (item%level)*(600/level)+'px'
      }"
      ></p>
    </main>
    <div class="controls">
      <label for="level">难度等级
        <select name="level" id="level" v-model.number="level">
          <option value=3>简单</option>
          <option value=4>适中</option>
          <option value=5>困难</option>
        </select>
      </label>
      <button @click="messUpItems" :disabled="emptyIndex === -1">打乱</button>
      <button @click="complete" :disabled="emptyIndex === -1">自动</button>
    </div>
  </div>
</template>

<script>
import Solution from '../solution.js'

export default {
  name: 'puzzle',
  data () {
    return {
      level: 4,
      destion: [],
      current: [],
      emptyIndex: -1,
      pic: require('../assets/1.jpg'),
      interval: '',
      solution: ''
    }
  },
  watch: {
    'level' (to, from) {
      this.init()
      this.emptyIndex = -1
    }
  },
  created () {
    this.init()
    this.emptyIndex = -1
  },
  methods: {
    init () {
      this.destion = []
      this.current = []
      for (var i = 0; i < this.level * this.level; i++) {
        this.destion.push(i)
        this.current.push(i)
      }
    },
    switchItem (index) {
      var hd = Math.abs(Math.floor(index / this.level) - Math.floor(this.emptyIndex / this.level))
      var ld = Math.abs(index % this.level - this.emptyIndex % this.level)
      if (ld + hd === 1) {
        var temp = this.current[this.emptyIndex]
        this.current[this.emptyIndex] = this.current[index]
        this.current[index] = temp
        this.emptyIndex = index
      }
    },
    messUpItems () {
      this.init()
      for (var i = 0; i < this.level * this.level * 10; i++) {
        var h = Math.floor(this.emptyIndex / this.level)
        var l = this.emptyIndex % this.level
        if (Math.random() >= 0.5) {
          h = Math.random() >= 0.5 ? h + 1 : h - 1
          h = h < 0 ? h + 2 : h
          h = h >= this.level ? h - 2 : h
        } else {
          l = Math.random() >= 0.5 ? l + 1 : l - 1
          l = l < 0 ? l + 2 : l
          l = l >= this.level ? l - 2 : l
        }
        var itemIndex = this.level * h + l
        this.switchItem(itemIndex)
      }
    },
    complete () {
      this.solution = new Solution(this.current, this.level, this.destion, this.emptyIndex)
      this.solution.run()
      console.log(this.solution.path.length)
      this.startMove()
    },
    startMove () {
      if (this.solution.path.length > 0) {
        var state = this.solution.path.shift()
        this.current = state.items
        this.emptyIndex = state.empty
        this.interval = setTimeout(this.startMove, 150)
      } else {
        this.emptyIndex = -1
      }
    },
    pickEmpty (index) {
      this.emptyIndex = Number(index)
    },
    clickHandle (index) {
      if (this.emptyIndex === -1) {
        this.pickEmpty(index)
      } else {
        this.switchItem(index)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
main {
  max-width: 610px;
  min-height: 610px;
  display: flex;
  flex-wrap: wrap;
  align-items: space-between;
  justify-content: space-between;
}
p.block {
  width: 200px;
  background-repeat: no-repeat;
  height: 200px;
  display: inline-block;
  padding: 0;
  margin: 0;
  transition: top .4s, left .4s;
}
.controls {
  display: flex;
  justify-content: space-around;
}
</style>
