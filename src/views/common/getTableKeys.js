import moment from 'moment'
export default {
    methods: {
        getTableKeys(index = [],tableId, search = true) {


            return new Promise(async (resolve) => {
                this.tableShow = false;
                this.tableListData = this.$options.data().tableListData;
                let res = await this.$Api().ImportDataController.get_config.request({
                    path: { id: tableId },
                });
                this.dataKeys = res.columns;
                res.columns.forEach((v) => {
                    if (v.show) {

                        this.tableListData.tableKeys.push({
                            id: v.storeFiled,
                            label: v.fieldName,
                            minWidth: v.fieldName.length * 30,
                            searchable: v.searchable,
                            // allways: ['sfzhzhm', 'lxdh', 'xm'].includes(v.storeFiled),
                            formatter: (item) => {
                                let data
                                if (item.hasOwnProperty(v.storeFiled)) {
                                    data = item[v.storeFiled]
                                }
                                else if (item.GAData && item.GAData.hasOwnProperty(v.storeFiled)) {
                                    data = item.GAData[v.storeFiled]
                                }
                                if (data && (v.storeFiled === 'createTime' || v.storeFiled === 'updateTime')) {
                                    data = moment(data).format('YYYY-MM-DD HH:mm:ss')
                                }
                                return data;
                            },
                        });
                    }
                    if (v.searchable) {
                        this.$set(this.filter, v.storeFiled, "");
                        // this.filter[v.storeFiled] = ''
                    }
                });

                this.tableListData.tableKeys.sort((a, b) => {
                    return index.indexOf(b.id) - index.indexOf(a.id)
                })

                this.tableShow = true;
                if (!search) {
                    resolve()
                    return
                }
                this.resetSearch();
                resolve()
                // this.getData()
            })
        }
    }
}