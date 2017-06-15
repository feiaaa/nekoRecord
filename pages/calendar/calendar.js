var util = require('../../utils/util.js');
const conf = {
  
  data: {
    hasEmptyGrid: false,
    today: util.today(new Date),//for today
    curMonth: util.curMonth(new Date),//for today
    can:false,// for switch
    out:false,// for switch
    items: [
        {name: 'food', value: '喂食'},
        {name: 'water', value: '换水'},
        {name: 'shit', value: '便便'},
        {name: 'sand', value: '换沙'}
    ]// for checkbox
  },
  onLoad(options) {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    this.setData({
      cur_year,
      cur_month,
      weeks_ch
    })
  },
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month) {
    let days = [];

    const thisMonthDays = this.getThisMonthDays(year, month);

    for (let i = 1; i <= thisMonthDays; i++) {
      days.push(i);
    }

    this.setData({
      days
    });
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
  },
  onShareAppMessage() {
    return {
      title: '小程序日历',
      desc: '小程序日历',
      path: 'pages/calendar/calendar'
    }
  },

//calendar end,switch start

 canlistenerSwitch: function(e) {
   this.data.can = e.detail.value;
    console.log('can开关当前状态-----', this.data.can);

  },
  outlistenerSwitch: function(e) {
    this.data.out = e.detail.value;
    console.log('out开关当前状态-----', this.data.out);

  },
  /**
   * checkbox
   */
  listenerCheckboxChange: function(e) {
    this.data.items = e.detail.value;
    console.log('checkbox当前状态-----', this.data.items)
  }




};

Page(conf);
