<template>
  <div class="container">
    <h1>拼图游戏</h1>
    <table>
      <tr>
        <td class="result"><img :src="pic" alt="最终效果"></td>
        <td class="info">规则：先选中一个块作为空白块，然后打乱，移动空白块周围的区域将被打乱的块还原
        <br>
        自动：自动将打乱的块还原</td>
      </tr>
    </table>
    
    <main @click="clickHandle">
      <!-- <p v-for="(item, index) in current" :key="item" v-if="index != emptyIndex" class="block" 
      @click="clickHandle(index)"
      :style="{ 
      top: Math.floor(index/level)*600/level+'px',
      left: (index%level)*(600/level)+'px',
      backgroundImage: emptyIndex === index ? 'initial' : 'url('+pic+')',
      backgroundColor: emptyIndex === index ? 'yellow': 'initial',
      backgroundPositionX: -600/level*(item%level)+'px', 
      backgroundPositionY: -Math.floor(item/level)*600/level+'px'
      }"
      ></p> -->
    </main>
    <div class="controls">
      <label for="level">难度等级
        <select name="level" id="level" v-model.number="level">
          <option value=3>简单</option>
          <option value=4>适中</option>
          <option value=5>困难</option>
        </select>
      </label>
      <br><br>
      <input type="file"accept="image/*"@change="imgChange">
      <button @click="selectPic">选择图片</button>
      <button @click="messUpItems" :disabled="emptyIndex === -1">打乱</button>
      <button @click="complete" :disabled="emptyIndex === -1">自动还原 {{ solution.path.length > 0 ? '('+solution.path.length+')' : '' }}</button>
    </div>
  </div>
</template>

<script>
import Solution from './solution.js'
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
      solution: {
        path: 0
      },
      block: {
        width: 0,
        cell: 0
      }
    }
  },
  watch: {
    'level' (to, from) {
      this.init()
      this.emptyIndex = -1
      this.updateView()
    },
    'pic' (to, from) {
      this.updateView()
    }
  },
  created () {
    this.init()
    this.emptyIndex = -1
  },
  mounted () {
    this.updateView()
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
    updateView () {
      var main = document.getElementsByTagName('main')[0]
      main.innerHTML = ''
      var blocks = document.createDocumentFragment()
      var width = main.offsetWidth * 0.95 / this.level
      var cell = main.offsetWidth * 0.05 / (this.level - 1)
      this.block.width = width
      this.block.cell = cell
      for (var i = 0; i < this.current.length; i++) {
        if (i === this.emptyIndex) {
          continue
        }
        var h = Math.floor(i / this.level)
        var l = i % this.level
        var block = document.createElement('p')
        block.setAttribute('class', 'block')
        block.setAttribute('id', 'block-' + h + '-' + l)
        block.style.width = width + 'px'
        block.style.height = width + 'px'
        block.style.backgroundImage = 'url(' + this.pic + ')'
        block.style.top = h * (width + cell) + 'px'
        block.style.left = l * (width + cell) + 'px'
        block.style.backgroundPositionX = -width * (this.current[i] % this.level) + 'px'
        block.style.backgroundPositionY = -width * Math.floor(this.current[i] / this.level) + 'px'
        block.style.backgroundSize = this.level * 100 + '%'
        blocks.appendChild(block)
      }
      main.appendChild(blocks)
    },
    move (direc) {
      var h = Math.floor(this.emptyIndex / this.level)
      var l = this.emptyIndex % this.level
      var block
      var itemIndex
      if (direc === 'up' && h - 1 >= 0) {
        block = document.getElementById('block-' + (h - 1) + '-' + l)
        itemIndex = this.emptyIndex - this.level
        block.style.top = (this.block.width + this.block.cell) * h + 'px'
      } else if (direc === 'down' && h + 1 < this.level) {
        block = document.getElementById('block-' + (h + 1) + '-' + l)
        itemIndex = this.emptyIndex + this.level
        block.style.top = (this.block.width + this.block.cell) * h + 'px'
      } else if (direc === 'left' && l - 1 >= 0) {
        block = document.getElementById('block-' + h + '-' + (l - 1))
        itemIndex = this.emptyIndex - 1
        block.style.left = (this.block.width + this.block.cell) * l + 'px'
      } else if (direc === 'right' && l + 1 < this.level) {
        block = document.getElementById('block-' + h + '-' + (l + 1))
        itemIndex = this.emptyIndex + 1
        block.style.left = (this.block.width + this.block.cell) * l + 'px'
      }
      if (!itemIndex && itemIndex !== 0) {
        return false
      }
      var temp = this.current[itemIndex]
      this.current[itemIndex] = this.current[this.emptyIndex]
      this.current[this.emptyIndex] = temp
      this.emptyIndex = itemIndex
      var _this = this
      setTimeout(function () {
        _this.updateView()
      }, 200)
    },
    getDirection (index) {
      var hd = Math.floor(index / this.level) - Math.floor(this.emptyIndex / this.level)
      var ld = index % this.level - this.emptyIndex % this.level
      if (Math.abs(ld) + Math.abs(hd) === 1) {
        if (ld < 0) {
          return 'left'
        } else if (ld > 0) {
          return 'right'
        } else if (hd < 0) {
          return 'up'
        } else {
          return 'down'
        }
      } else {
        return false
      }
    },
    messUpItems () {
      this.init()
      for (var i = 0; i < this.level * this.level * 10; i++) {
        var random = Math.random()
        var temp
        var move = false
        if (random <= 0.25 && this.canMove('up')) {
          temp = this.current[this.emptyIndex - this.level]
          this.current[this.emptyIndex - this.level] = this.current[this.emptyIndex]
          this.current[this.emptyIndex] = temp
          this.emptyIndex -= this.level
          move = true
        } else if (random <= 0.5 && this.canMove('down')) {
          temp = this.current[this.emptyIndex + this.level]
          this.current[this.emptyIndex + this.level] = this.current[this.emptyIndex]
          this.current[this.emptyIndex] = temp
          this.emptyIndex += this.level
          move = true
        } else if (random <= 0.75 && this.canMove('left')) {
          temp = this.current[this.emptyIndex - 1]
          this.current[this.emptyIndex - 1] = this.current[this.emptyIndex]
          this.current[this.emptyIndex] = temp
          this.emptyIndex--
          move = true
        } else if (this.canMove('right')) {
          temp = this.current[this.emptyIndex + 1]
          this.current[this.emptyIndex + 1] = this.current[this.emptyIndex]
          this.current[this.emptyIndex] = temp
          this.emptyIndex++
          move = true
        }
        if (!move) {
          i--
        }
      }
      this.updateView()
    },
    canMove (direc) {
      var h = Math.floor(this.emptyIndex / this.level)
      var l = this.emptyIndex % this.level
      switch (direc) {
        case 'up': return h - 1 >= 0
        case 'down': return h + 1 < this.level
        case 'left': return l - 1 >= 0
        case 'right': return l + 1 < this.level
      }
      return false
    },
    complete () {
      this.solution = new Solution(this.current, this.level, this.destion, this.emptyIndex)
      this.solution.run()
      console.log(this.solution.path.length)
      this.startMove()
    },
    startMove () {
      if (this.solution.path.length > 0) {
        var direc = this.solution.path.shift()
        this.move(direc)
        this.interval = setTimeout(this.startMove, 300)
      } else {
        this.emptyIndex = -1
        this.interval = setTimeout(this.updateView, 300)
      }
    },
    pickEmpty (index) {
      this.emptyIndex = Number(index)
    },
    clickHandle (event) {
      if (event.target.tagName.toLowerCase() === 'p') {
        var target = event.target
        var strs = target.id.split('-')
        var index = Number(strs[1]) * this.level + Number(strs[2])
        if (this.emptyIndex === -1) {
          this.pickEmpty(index)
          this.updateView()
        } else {
          var direc = this.getDirection(index)
          if (direc) {
            this.move(direc)
          }
        }
      }
    },
    imgChange (event) {
      var file = event.target.files[0]
      if (file) {
        URL.revokeObjectURL(this.pic)
        this.pic = URL.createObjectURL(file)
      }
    },
    selectPic () {
      var input = document.querySelector("input[type='file']")
      input.click()
    }
  }
}
</script>

<style>
.container {
  width: 100%;
  max-width: 500px;
}
h1 {
  margin: 0;
}
td.result {
  width: 23%;
}
td.result img {
  width: 100%;
}
td.info{
  text-align: left;
  font-weight: bold;
}
main {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  margin: 10px auto;
}
p.block {
  position: absolute;
  margin: 0;
  background-repeat: no-repeat;
  display: inline-block;
  transition: all .2s;
}
.controls {
  width: 100%;
}
.controls button {
  font-size: 20px;
  margin: 2px 10px;
}
input[type='file'] {
  display: none;
}
</style>
