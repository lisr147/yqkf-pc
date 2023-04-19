export default {
  methods: {
      async getTableKeys(index=[]) {
      this.tableShow = false;
      this.tableListData = this.$options.data().tableListData;
      this.tableListData.tableKeys.sort((a, b) => {
          return index.indexOf(b.id) - index.indexOf(a.id)
      })

      this.tableShow = true;
      this.resetSearch();
    }
  }
}