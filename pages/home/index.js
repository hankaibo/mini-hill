// pages/home/index.js
const {
  request
} = require('../../utils/request.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [],
    activeTab: 0,
    listData: [
      [],
      [],
      [],
      [],
      [],
      [],
    ],
    listParam: [
      // 全部
      {
        pageNum: 1,
        pageSize: 10
      },
      // 学习    
      {
        pageNum: 1,
        pageSize: 10
      },
      // 活动    
      {
        pageNum: 1,
        pageSize: 10
      },
      // 绘画
      {
        pageNum: 1,
        pageSize: 10
      },
      // 图书
      {
        pageNum: 1,
        pageSize: 10
      },
      // 知识  
      {
        pageNum: 1,
        pageSize: 10
      },
    ],
  },

  // 进入详情
  handleView(e) {
    const {
      field
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: './detail/detail',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          id: field
        })
      }
    })
  },

  // 加入
  handleJoin(e) {
    const {
      field
    } = e.currentTarget.dataset;
    request(`/mini/api/v1/circles/${field}/relational`, 'post')
      .then(() => {
        this.getData();
      })
      .catch(e => {})
  },

  onChange(e) {
    const {
      index
    } = e.detail;
    this.setData({
      activeTab: index
    });
    let type = this.getTypeByIndex(index);
    this.getData('up', index, type);
  },

  // 获取数据
  getData(direction = 'up', index = 0, type = '') {
    const {
      listData,
      listParam,
    } = this.data;
    const {
      pageNum,
      pageSize,
    } = listParam[index];
    // 向下，页数加1
    if (direction === 'down') {
      request(`/mini/api/v1/circles?pageNum=${pageNum + 1}&pageSize=${pageSize}&type=${type}`, 'get')
        .then(({
          data
        }) => {
          const list = data.list.map(item => ({
            ...item,            
            date: item.startTime.substr(0, 10),
            time: item.startTime.substr(11, 5),
          }));
          listData[index].concat(list);
          listParam[index] = {
            pageNum: pageNum + 1,
            pageSize,
          };
          this.setData({
            listData,
            listParam,
          });
        })
        .catch(e => {
          console.log('上滑事件获取圈子数据失败，失败原因：', e);
        })
    } else if (direction === 'up') {
      request(`/mini/api/v1/circles?pageNum=${1}&pageSize=${pageSize}&type=${type}`, 'get')
        .then(({
          data
        }) => {
          const list = data.list.map(item => ({
            ...item,            
            date: item.startTime.substr(0, 10),
            time: item.startTime.substr(11, 5),
          }));
          listData[index] = list;
          listParam[index] = {
            pageNum: 1,
            pageSize,
          };
          this.setData({
            listData,
            listParam,
          });
        })
        .catch(e => {
          console.log('下拉事件获取圈子数据失败，失败原因：', e);
        })
    }
    setTimeout(() => {
      this.setTableHeight();
    }, 100)
  },

  // 设置高度
  setTableHeight() {
    const {
      activeTab
    } = this.data;
    wx.createSelectorQuery().in(this).select(`#tabsSwiper-${activeTab}`).boundingClientRect(rect => {
      this.setData({
        tabHeiaght: Math.max(rect.height, 300)
      })
    }).exec();
  },

  // 根据索引获取类型
  getTypeByIndex(index) {
    let type = '';
    switch (index) {
      case 0:
        type = '';
        break;
      case 1:
        type = 'STUDY';
        break;
      case 2:
        type = 'PLAY';
        break;
      case 3:
        type = 'PAINING';
        break;
      case 4:
        type = 'BOOK';
        break;
      case 5:
        type = 'KNOW';
        break;
      default:
        type = '';
    }
    return type;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const titles = ['全部', '学习圈', '活动圈', '绘画圈', '图书圈', '知识圈'];
    const tabs = titles.map(item => ({
      title: item
    }));
    //调用应用实例的方法获取全局数据
    this.setData({
      tabs,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let index = this.data.activeTab;
    let type = this.getTypeByIndex(index);
    this.getData('up', index, type);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let index = this.data.activeTab;
    let type = this.getTypeByIndex(index);
    this.getData('down', index, type);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})