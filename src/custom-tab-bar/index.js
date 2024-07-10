Component({
  data: {
    currentPagePath: null,
    color: "#7A7E83",
    selectedColor: "#000",
    list: [
      {
        text: "发现",
        iconPath: "/static/custom-tab-bar/home.png",
        selectedIconPath: "/static/custom-tab-bar/home_a.png",
        pagePath: "pages/index/index",
      },
      {
        text: "管家",
        iconPath: "/static/custom-tab-bar/ai.png",
        selectedIconPath: "/static/custom-tab-bar/ai_a.png",
        pagePath: "pages/chat/chat",
      },
      {
        text: "我的",
        iconPath: "/static/custom-tab-bar/my.png",
        selectedIconPath: "/static/custom-tab-bar/my_a.png",
        pagePath: "pages/my/my",
      },
    ],
  },

  attached() {
    wx.onAppRoute((route) => {
      this.setData({
        currentPagePath: route.path,
      });
    });
  },
  ready() {},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      wx.switchTab({ url: `/${data.path}` });
      this.setData({
        currentPagePath: data.path,
      });
    },
  },
});
