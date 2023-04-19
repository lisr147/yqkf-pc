

import moment from 'moment'
export default {
    methods: {
        getTableKeys(index = [], tableId = '10001', search = true, rylb = '') {
            return new Promise(async (resolve) => {
                this.tableShow = false;
                this.tableListData = this.$options.data().tableListData;
                let res = await this.$Api().ImportDataController.get_config.request({
                    path: { id: tableId === 10116 ? 10119 : tableId }, // 移动运营商特殊处理
                });
                let { columns } = res;
                if (tableId === 6002 && rylb === '工作人员') {
                    columns = columns.filter(v => ![203267, 203269, 203268].includes(v.id));
                }
                if (tableId === 10089) { //采集点台账
                    columns.map(v => {
                        if (['ztmc', 'sszj', 'fzrxm', 'fzrdh'].includes(v.storeFiled)) {
                            v.required = true
                        }
                        if (['xkz', 'xkzffrq'].includes(v.storeFiled) && !['cjdtz6050'].includes(this.$route.name)) { //课外机构特殊处理
                            v.show = false
                            v.editable = false
                        }
                    })
                }
                if (tableId === 10089 && this.$route.name === 'cjdtz6063') { //工地项目特殊处理
                    columns.map(v => {
                        if (['xmbm', 'zgbm', 'jsdwmc', 'sgdwmc', 'jldwmc', 'zjlgcs', 'xmfzr'].includes(v.storeFiled)) {
                            v.show = true
                            v.editable = true
                            v.header = true
                        }
                        switch (v.storeFiled) {
                            case 'ztmc':
                                v.fieldName = '项目名称'
                                break
                            case 'fzrxm':
                                v.fieldName = '项目经理'
                                break
                            case 'fzrdh':
                                v.fieldName = '项目经理电话'
                                break
                            case 'szxxdz':
                                v.fieldName = '项目地址'
                                break
                            case 'zgbm':
                                v.searchable = true
                                v.required = true
                                break
                            case 'xmbm':
                                v.required = true
                                break
                        }
                    })
                }
                if (tableId === 10116) {
                    columns = columns.filter(v => ![204667].includes(v.id));
                }
                if (tableId === 12139) {
                  columns.map(v=>{
                    if (['id'].includes(v.storeFiled)) {
                      v.header = false
                    }
                  })
                }
                this.dataKeys = columns;

                // this.dataKeys.forEach(v=>{
                //     if (v.storeFiled === 'jdid'){
                //         v.fieldName = '隔离酒店'
                //     }
                // })
                // if(tableId === '10001'){
                // this.tableListData.tableKeys.push({
                //     id: "glzt",
                //     label: "隔离状态",
                //     minWidth: 120,
                // });
                // this.tableListData.tableKeys.push({
                //     id: "yglsc",
                //     label: "已隔离时长",
                //     minWidth: 120,
                //     formatter: (item) => {
                //         if (!item.ksglsj){
                //             return '未知'
                //         }
                //         let startTime = new Date(item.ksglsj).getTime()
                //         let now = new Date().getTime()
                //         let res = (now - startTime)/1000/60/60
                //         // console.log(item)
                //         if(res<0){
                //             return '未知'
                //         }
                //         if(res<24){
                //             return Math.floor(res)+'小时'
                //         }
                //         let hour = Math.floor(res%24)
                //         res = Math.floor(res/24)
                //         return res + '天'+hour+'小时';
                //     },
                // });
                // this.tableListData.tableKeys.push({
                //     id: "ksglsj",
                //     label: "开始隔离时间",
                //     minWidth: 160,
                // });}
                columns.forEach((v) => {
                    // console.log(101,v)
                    if (v.show) {
                        let minWidth = ((v.fieldName || '').length || 2) * 15 + 40
                        if (tableId === '100081' && v.storeFiled === 'mc') {
                            minWidth = 200
                        }
                        let key = {
                            id: v.storeFiled,
                            label: v.fieldName,
                            minWidth,
                            searchable: v.searchable,
                            // allways: ['sfzhzhm', 'lxdh', 'xm'].includes(v.storeFiled),
                            formatter: (item) => {
                                // console.log(116,item)
                                let data
                                if (item.hasOwnProperty(v.storeFiled)) {
                                    data = item[v.storeFiled]
                                }
                                if (data && (v.storeFiled === 'createTime' || v.storeFiled === 'updateTime')) {
                                    data = moment(data).format('YYYY-MM-DD HH:mm:ss')
                                }
                                return data;
                            },
                        }
                        if (v.storeFiled === 'createTime' || v.storeFiled === 'updateTime') {
                            key.formatter = (item) => {
                                let data
                                if (item.hasOwnProperty(v.storeFiled)) {
                                    data = item[v.storeFiled]
                                }
                                if (data) {
                                    data = moment(data).format('YYYY-MM-DD HH:mm:ss')
                                }
                                return data;
                            }
                        }

                        this.tableListData.tableKeys.push(key);
                    }
                    if (v.storeFiled === 'sszj' && this.sszjList && this.sszjList.includes(this.$store.getters.departmentName)) {
                        v.searchable = false
                    }
                    // 流调信息--人员地址坐标调整
                    if ((v.storeFiled === 'glry' || v.storeFiled === 'mqscwz') && tableId === 10123) {
                        v.searchable = true
                    }
                    if (v.searchable) {
                        this.$set(this.filter, v.storeFiled, "");
                        // this.filter[v.storeFiled] = ''
                    }
                });

                this.tableListData.tableKeys.sort((a, b) => {
                    return index.indexOf(b.id) - index.indexOf(a.id)
                })



                this.originalTableKeys = this.tableListData.tableKeys.slice()
                if (this.statCategoryList) this.getDataKeysByStatType();
                this.tableShow = true;
                if (!search) {
                    resolve()
                    return
                }
                this.resetSearch();
                resolve()
                // this.getData()
            })
        },
        // 筛选查询条件
        filterSearchableColumns(searchKeys) {
            this.dataKeys = this.dataKeys.map(v => {
                if (searchKeys.includes(v.storeFiled)) {
                    v.searchable = true
                } else {
                    v.searchable = false
                }
                return v;
            })
        },
        // 筛选table展示字段
        filterTableKeys(tableKeys) {
            const newTableKeys = tableKeys.map(v => {
                return this.originalTableKeys.find((key) => key.id === v) || {}
            })
            if (this.tableId === 12131) {
                newTableKeys.map(v => {
                    if (['hscyrs', 'cjgrs', 'cyrszb', 'yxrs'].includes(v.id)) {
                        if (!v.label.includes('.')) v.label = `${moment().subtract(1, "day").format("MM.DD")}${v.label}` //取当前日期前一天
                        v.width = 150
                    }
                })
            } else if (this.tableId === 12132) {
                newTableKeys.map(v => {
                    if (['yjrs'].includes(v.id)) {
                        if (v.label.indexOf('.') !== -1) return
                        v.label = `${moment().add(1, "day").format("MM.DD")}${v.label}` //取当前日期 + 1 天
                        v.width = 150
                    }
                })

            }
            this.tableListData.tableKeys = newTableKeys
        },
        // 根据统计类型，筛选查询条件和table展示字段
        getDataKeysByStatType() {
            const classifyKey = this.statCategoryList[this.selectedStatIdx].key
            if (this.tableId === 12130) {
                switch (classifyKey) {
                    case 'azjtj':
                        this.filterSearchableColumns(['sszj', 'zgzt', 'ztlx', 'sjxz'])
                        this.filterTableKeys(['sszj', 'ztsl', 'gzrysl', 'whsjcrs', 'hsjcrc', 'hsjcrs', 'fgl', 'yxrs', 'wcjgrs'])
                        break;
                    case 'azdhytj':
                        this.filterSearchableColumns(['sszj', 'zgzt', 'ztlx', 'sjxz'])
                        this.filterTableKeys(['ztlx', 'ztsl', 'gzrysl', 'whsjcrs', 'hsjcrc', 'hsjcrs', 'fgl', 'yxrs', 'wcjgrs'])
                        break;
                    case 'aqyzttj':
                        this.filterSearchableColumns(['sszj', 'zgzt', 'qymc', 'sjxz'])
                        this.filterTableKeys(['qymc', 'ztlx', 'fzr', 'fzrlxfs', 'sszj', 'gzrysl', 'whsjcrs', 'hsjcrc', 'hsjcrs', 'fgl', 'yxrs', 'wcjgrs'])
                        break
                    case 'azrdwtj':
                        this.filterSearchableColumns(['sszj', 'zgzt', 'zrdw', 'sjxz'])
                        this.filterTableKeys(['zrdw', 'xl', 'jcdx', 'gzrysl', 'whsjcrs', 'hsjcrc', 'hsjcrs', 'fgl', 'yxrs', 'wcjgrs'])
                        break;
                }
            } else if (this.tableId === 12228) {
                switch (classifyKey) {
                    case 'azjtj':
                        this.filterSearchableColumns(['sszj', 'zgzt', 'ztlx'])
                        this.filterTableKeys(['sszj', 'ztsl', 'gzrysl', 'dyzkjzrs', 'dyzjzrs', 'wcdyzjzl', 'dezkjzrs', 'dezjzrs', 'wcdezjzl', 'dszkjzrs', 'dszjzrs', 'wcdszjzl'])
                        break;
                    case 'azdhytj':
                        this.filterSearchableColumns(['sszj', 'zgzt', 'ztlx'])
                        this.filterTableKeys(['ztlx', 'ztsl', 'gzrysl', 'dyzkjzrs', 'dyzjzrs', 'wcdyzjzl', 'dezkjzrs', 'dezjzrs', 'wcdezjzl', 'dszkjzrs', 'dszjzrs', 'wcdszjzl'])
                        break;
                    case 'aqyzttj':
                        this.filterSearchableColumns(['sszj', 'zgzt', 'qymc'])
                        this.filterTableKeys(['qymc', 'ztlx', 'fzr', 'fzrlxfs', 'sszj', 'gzrysl', 'dyzkjzrs', 'dyzjzrs', 'wcdyzjzl', 'dezkjzrs', 'dezjzrs', 'wcdezjzl', 'dszkjzrs', 'dszjzrs', 'wcdszjzl'])
                        break
                    case 'azrdwtj':
                        this.filterSearchableColumns(['ztlx', 'zgzt', 'zrdw'])
                        this.filterTableKeys(['zrdw', 'xl', 'jcdx', 'gzrysl', 'dyzkjzrs', 'dyzjzrs', 'wcdyzjzl', 'dezkjzrs', 'dezjzrs', 'wcdezjzl', 'dszkjzrs', 'dszjzrs', 'wcdszjzl'])
                        break
                }
            } else if (this.tableId === 12132) {
                switch (classifyKey) {
                    case 'azjtj':
                        this.filterSearchableColumns(['sszj', 'zgzt', 'ztlx', 'sjxz'])
                        this.filterTableKeys(['sszj', 'ztsl', 'whsjcgzryrs', 'gzrysl', 'yjrs'])
                        break;
                    case 'azdhytj':
                        this.filterSearchableColumns(['sszj', 'zgzt', 'ztlx', 'sjxz'])
                        this.filterTableKeys(['ztlx', 'ztsl', 'whsjcgzryrs', 'gzrysl', 'yjrs'])
                        break;
                    case 'aqyzttj':
                        this.filterSearchableColumns(['sszj', 'zgzt', 'ztlx', 'qymc', 'sjxz'])
                        this.filterTableKeys(['qymc', 'ztlx', 'whsjcgzryrs', 'fzr', 'fzrlxfs', 'sszj', 'rylb', 'hsjcgz', 'gzrysl', 'yjrs'])
                        break
                    case 'azrdwtj':
                        this.filterSearchableColumns(['zrdw', 'ztlx', 'zgzt', 'sjxz'])
                        this.filterTableKeys(['zrdw', 'xl', 'whsjcgzryrs', 'jcdx', 'hsjcgz', 'gzrysl', 'yjrs'])
                        break;
                }
            } else if (this.tableId === 12131) {
                switch (classifyKey) {
                    case 'azjtj':
                        this.filterSearchableColumns(['sszj', 'zgzt', 'ztlx'])
                        this.filterTableKeys(['sszj', 'ztsl', 'whsjcgzryrs', 'gzrysl', 'hscyrs', 'cjgrs', 'yxrs', 'cyrszb', 'wagzhsjcrs', 'wagzhsjcrsbl'])
                        break;
                    case 'azdhytj':
                        this.filterSearchableColumns(['sszj', 'zgzt', 'ztlx'])
                        this.filterTableKeys(['ztlx', 'ztsl', 'whsjcgzryrs', 'gzrysl', 'hscyrs', 'cjgrs', 'yxrs', 'cyrszb', 'wagzhsjcrs', 'wagzhsjcrsbl'])
                        break;
                    case 'aqyzttj':
                        this.filterSearchableColumns(['sszj', 'ztlx', 'zgzt', 'qymc'])
                        this.filterTableKeys(['qymc', 'fzr', 'whsjcgzryrs', 'fzrlxfs', 'sszj', 'rylb', 'hsjcgz', 'gzrysl', 'hscyrs', 'cjgrs', 'yxrs', 'cyrszb', 'wagzhsjcrs', 'wagzhsjcrsbl'])
                        break
                    case 'azrdwtj':
                        this.filterSearchableColumns(['zrdw', 'ztlx', 'zgzt'])
                        this.filterTableKeys(['zrdw', 'xl', 'whsjcgzryrs', 'jcdx', 'hsjcgz', 'gzrysl', 'hscyrs', 'cjgrs', 'yxrs', 'cyrszb', 'wagzhsjcrs', 'wagzhsjcrsbl'])
                        break;
                }
            }
        },

    }
}
