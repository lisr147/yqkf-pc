export default {
  data() {
    return { multiData: [] };
  },
  methods: {
    tableSelectionChange(selection) {
      this.multiData = selection;
    },
    currentChange(val) {
      this.filter.pageNum = val;
      this.getData();
    },
    sortChange({ column, prop, order }) {
      // console.log(prop, '列排序为', order)
      if (!order) {
        this.filter.sortOrder = "";
        this.filter.sortName = "";
      } else {
        this.filter.sortOrder = order === "ascending" ? "ASC" : "DESC";
        this.filter.sortName = prop;
      }
      this.getData();
    },
    /**
     * ================================查询=================================
     */
    search() {
      this.filter.pageNum = 1;
      this.getData();
    },
    /**
     * @Description:查询重置
     * @param {String} filterName
     * @param {String} callbackName
     */
    resetSearch(filterName = "filter", callbackName = "getData") {
      let pageSize = this[filterName].pageSize;
      this[filterName] = this.$options.data()[filterName];
      this[filterName].pageNum = 1;
      this[filterName].pageSize = pageSize;
      this[callbackName]();
    },
    sizeChange(val, filterName = "filter", callbackName = "getData") {
      this[filterName].pageSize = val;
      this[filterName].pageNum = 1;
      this[callbackName]();
    },
  },
};
