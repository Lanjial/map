<template>
  <div id="case" style="height: 330px;width: 200;"></div>
</template>

<script>
import Cases_Number_Monthly from "../../../static/Cases_Number_Monthly.json"
export default {
    data(){
        return{
            
        }
    },
    mounted(){
        
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('case'));

        // 指定图表的配置项和数据
        var data_set_from_json = [];
        var date_set_from_json = [];
        var TownName_set_from_json = [];
        var a;
        Cases_Number_Monthly.casenumbermonthly.forEach(element => {
            // if (element['Attributes'] === 'Historical') {
            TownName_set_from_json.push(element['TownName']);
            a = element['Month'].split("/");
            a = a[2] + '/' + a[0] + '/' + a[1];
            date_set_from_json.push(a);
            // }
        });
        // 数组去重
        date_set_from_json = [...new Set(date_set_from_json)];
        // console.log(date_set_from_json)
        TownName_set_from_json = [...new Set(TownName_set_from_json)];

        // 根据名字的总长度创建对应的数组
        var data_set_from_json = new Array(TownName_set_from_json.length);
        for (var i = 0; i < data_set_from_json.length; i++) {
            data_set_from_json[i] = new Array(date_set_from_json.length);
        }


        Cases_Number_Monthly.casenumbermonthly.forEach(element => {

            // if (element['Attributes'] === 'Historical') {
            TownName_set_from_json.findIndex(function(TownName_value, TownName_index) {
                    if (TownName_value === element['TownName']) {
                        //则包含该元素
                        a = element['Month'].split("/");
                        a = a[2] + '/' + a[0] + '/' + a[1];
                        date_set_from_json.findIndex(function(date_value, date_index) {
                            if (date_value === a) {
                                //则包含该元素
                                data_set_from_json[TownName_index][date_index] = element['The number of cases']
                                    // agency.push(date_index)
                            }

                        })
                    }
                })
                // }
        });
        // console.log(data_set_from_json)
        for (var i = 0; i < data_set_from_json.length; i++) {
            data_set_from_json[i] = eval(data_set_from_json[i].join("+"))
        }

        var data_set1_from_json = []
            // console.log(tengchongdata.features[0])
            // tengchongdata.features.forEach(element => {
        for (var i = 0; i < data_set_from_json.length; i++) {
            var agency = [];
            agency.push(data_set_from_json[i]);
            agency.push(TownName_set_from_json[i]);
            data_set1_from_json.push(agency)
        }
        // ------------冒泡排序法(降序)-----------
        function bubbleSort(arr) {
            var max = arr.length - 1;
            for (var j = 0; j < max; j++) {
                // 声明一个变量，作为标志位
                var done = true;
                for (var i = 0; i < max - j; i++) {
                    if (arr[i][0] < arr[i + 1][0]) {
                        var temp = arr[i];
                        arr[i] = arr[i + 1];
                        arr[i + 1] = temp;
                        done = false;
                    }
                }
                if (done) {
                    break;
                }
            }
            return arr;
        }
        bubbleSort(data_set1_from_json);
        window.horizhist_data_set1_from_json = data_set1_from_json
        window.horizhist_colorlist = [];
        window.horizhist_colorlist_clear = [];

        window.horizhist_arealist = [];

        for (var i = 0; i < data_set1_from_json.length; i++) {
            // color_list.push(window.colorList[window.geojson_info[data_set1_from_json[i][1]]])
            // window.horizhist_colorlist.push(window.colorList[window.geojson_info[data_set1_from_json[i][1]] - 1])
            window.horizhist_colorlist.push(window.colorList[window.relation_between_area_colorlist[data_set1_from_json[i][1]]])
            window.horizhist_arealist.push(data_set1_from_json[i][1])
                // console.log(window.colorList[window.geojson_info[data_set1_from_json[i][1]] - 1])
                // console.log(window.geojson_info[data_set1_from_json[i][1]])
        }

        window.horizhist_option = {
            title: {
                top: '0%',
                left: 'center',
                text: 'Rank of Case Number',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: { containLabel: true },
            xAxis: { name: 'amount' },
            yAxis: {
                type: 'category',
                // name: 'Town Name',
                axisLabel: {
                    show: true,
                    textStyle: {
                        // color: '#fff',
                        fontSize: '9'
                    }
                },
                inverse: true
            },
            grid: {
                left: '11%',
                top: '8%',
                right: '10%',
                bottom: '10%',
                // containLabel: true

            },
            series: [{

                type: 'bar',
                encode: {
                    // Map the "amount" column to X axis.
                    x: 'amount',
                    // Map the "townname" column to Y axis
                    y: 'townname'
                },
                // 为每个柱子给定颜色，不够的话开始循环
                itemStyle: {
                    normal: {
                        //这里是重点
                        // 循环这样子方便点 
                        color: function(params) {
                            var colorList = window.horizhist_colorlist;
                            return colorList[params.dataIndex % colorList.length];
                        }
                    }
                },
                data: data_set1_from_json
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        // console.log(data_set1_from_json)
        myChart.setOption(window.horizhist_option);



        // 把配置项给实例对象，跟着浏览器同比例缩放
        window.addEventListener('resize', function() {
            myChart.resize();
        })

    

    }
}
</script>

<style>

</style>