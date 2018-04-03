Component({
  data: {
    list: [],
    startX: 0,
    actionBlock: 120,
    outOfBound: 20
  },
  attached: function () {
    this.initEleWidth('actionBlock', 'outOfBound')
    // 可以在这里发起网络请求获取插件的数据
    this.setData({
      list: [{
        name: '电视',
        price: 1000,
        isTouchMoveEnd: false,
        left: 0
      }, {
        name: '电脑',
        price: 4000,
        isTouchMoveEnd: false,
        left: 0
      }, {
        name: '手机',
        price: 3000,
        isTouchMoveEnd: false,
        left: 0
      }]
    })
  },
  methods: {
    touchStart: function (e) {
      const curIndex = e.currentTarget.dataset.index
      const _startX = e.touches[0].clientX
      const _list = this.data.list.slice()
      const status = _list[curIndex].left === 0 ? 0 : 1
      _list[curIndex].isTouchMoveEnd = false
      _list.forEach((el, index) => {
        if (el.left !== 0 && curIndex === index) {
          return
        } else {
          el.left = 0
        }
      })
      this.setData({
        startX: _startX,
        list: _list,
        status: status
      })
    },
    touchMove(e) {
      const moveX = e.touches[0].clientX
      const index = e.currentTarget.dataset.index
      const _list = this.data.list.slice()
      const dis = this.data.status === 0 ? this.data.startX - moveX : this.data.startX - moveX + this.data.actionBlock
      if (dis <= -this.data.outOfBound) {
        _list[index].left = this.data.outOfBound
        this.setData({
          list: _list,
          dis: dis
        })
      } else if (dis > this.data.actionBlock) {
        _list[index].left = -((this.data.actionBlock) + ((dis - this.data.actionBlock) * .3))
        this.setData({
          list: _list,
          dis: dis
        })
      } else {
        _list[index].left = -dis
        this.setData({
          list: _list,
          dis: dis
        })
      }
    },
    touchEnd(e) {
      const endX = e.changedTouches[0].clientX
      if (e.changedTouches.length == 1 && endX !== this.data.startX) {
        const disX = this.data.dis
        const actionBlock = this.data.actionBlock
        //如果距离小于删除按钮的1/2，不显示删除按钮
        const _left = disX > actionBlock / 2 ? -actionBlock : 0
        const index = e.currentTarget.dataset.index
        const _list = this.data.list.slice()
        if (index >= 0) {
          _list[index].left = _left
          _list[index].isTouchMoveEnd = true
          //更新列表的状态
          this.setData({
            list: _list
          })
        }
      }
    },
    getEleWidth: function (w) {
      var real = 0
      try {
        var res = wx.getSystemInfoSync().windowWidth
        var scale = (750 / 2) / (w / 2) // 以宽度750px设计稿做宽度的自适应
        // console.log(scale)
        real = Math.floor(res / scale)
        return real
      } catch (e) {
        return false
        // Do something when catch error
      }
    },
    initEleWidth: function (actionBlock, outOfBound) {
      const _actionBlock = this.getEleWidth(this.data[actionBlock])
      const _outOfBound = this.getEleWidth(this.data[outOfBound])
      this.setData({
        actionBlock: _actionBlock,
        outOfBound: _outOfBound
      })
    }
  }
})