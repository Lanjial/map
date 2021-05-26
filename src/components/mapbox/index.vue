<template>
  <div class="home">
    <div id="map" style="height: 630px;width: 600;" ></div>
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import mapState from "vuex"
import Export_Output from "../../../static/Export_Output.json"
export default {
  name: "mapbox",
  data() {
    return {
      msg: "Welcome to MapBox~",
    };
  },
  computed: {
    // ...mapState({
    //     Export: state => state.mapbox.Export
    // }),
},
  mounted() {
      mapboxgl.accessToken = 'pk.eyJ1Ijoic3l4LS0tIiwiYSI6ImNrazZhOXUxdDAyMTQyb3AyYWl1YjZ3cHMifQ.fziHVOJ-trhLKQbWTyax3g';
        var map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
            center: [98.41, 25.18],
            zoom: 7,
            zoom: 8
      });
    
              var hoveredStateId = null;
        // ----红点----
        var size = 200;

        //实现CustomLayerInterface在地图上绘制一个脉冲点图标
        // see https://docs.mapbox.com/mapbox-gl-js/api/#customlayerinterface for more info
        var pulsingDot = {
            width: size,
            height: size,
            data: new Uint8Array(size * size * 4),

            //当图层被添加到地图中时，获取地图画布的渲染上下文
            onAdd: function() {
                var canvas = document.createElement('canvas');
                canvas.width = this.width;
                canvas.height = this.height;
                this.context = canvas.getContext('2d');
            },

            //在使用图标的每一帧之前调用一次
            render: function() {
                var duration = 1000;
                var t = (performance.now() % duration) / duration;

                var radius = (size / 2) * 0.3;
                var outerRadius = (size / 2) * 0.7 * t + radius;
                var context = this.context;

                context.beginPath();
                context.arc(
                    this.width / 2,
                    this.height / 2,
                    radius,
                    0,
                    Math.PI * 2
                );
                context.fillStyle = 'rgba(255, 100, 100, 1)';
                context.strokeStyle = 'black';
                // context.lineWidth = 2 + 4 * (1 - t);
                context.lineWidth = 4;
                context.fill();
                context.stroke();

                //使用画布中的数据更新这个图像的数据
                this.data = context.getImageData(
                    0,
                    0,
                    this.width,
                    this.height
                ).data;

                //不断重绘地图，导致圆点的平滑动画
                map.triggerRepaint();

                //返回' true '让映射知道图像被更新了
                return true;
            }
        };
        // ----红点----
        map.on('load', function() {
            map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
            map.addSource('rwanda-provinces', {
                'type': 'geojson',
                'data': Export_Output
                // 数据源位置（后续修改为请求返回的数据）
            });
            // 给地图添加数据
            map.addLayer({
                'id': 'rwanda-provinces',
                'type': 'fill',
                'source': 'rwanda-provinces',
                'layout': {},

                // 关于paint 设置3
                "paint": {
                    "fill-color": ["get", 'color'],
                    'fill-opacity': [
                        'case', ['boolean', ['feature-state', 'hover'], false],
                        1,
                        0.5
                    ]
                }
            });
            map.addLayer({
                'id': 'state-borders',
                'type': 'line',
                'source': 'rwanda-provinces',
                'layout': {},
                'paint': {
                    'line-color': '#627BC1',
                    'line-width': 2
                }
            });
            map.addLayer({
                'id': 'points',
                'type': 'symbol',
                'source': 'rwanda-provinces',
                'layout': {
                    'icon-image': 'pulsing-dot',
                    "text-field": ["get", "name"],
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-offset": [0, 1.25], //设置图标与图标注相对之间的距离
                    "text-anchor": "top",
                    "icon-size": ["get", "childNum"], //图标的大小
                },
                'paint': {
                    "text-halo-color": "rgb(255,255,255)",
                    "text-halo-width": 2,
                },
            });
            //当用户将鼠标移到状态填充层上时，我们将更新状态填充层
            //鼠标下特性的状态。
            window.colorList_clear = ['rgba(255,73,51, 0.1)', 'rgba(52,152,219, 0.1)', 'rgba(244,208,63, 0.1)', 'rgba(108,52,131, 0.1)', 'rgba(255,140,51, 0.1)', 'rgba(46,204,113, 0.1)', 'rgba(41,128,185, 0.1)', 'rgba(51,183,255, 0.1)', 'rgba(51,78,255, 0.1)', 'rgba(203,51,255, 0.1)', 'rgba(148,49,38, 0.1)', 'rgba(194,53,49, 0.1)', 'rgba(47,69,84, 0.1)', 'rgba(97,160,168, 0.1)', 'rgba(212,130,101, 0.1)', 'rgba(145,199,174, 0.1)', 'rgba(116,159,131, 0.1)', 'rgba(202,134,34, 0.1)'];
            map.on('mousemove', 'rwanda-provinces', function(e) {
                console.log(window,e);
                console.log(window.hl_line_mark)
                console.log(e.features[0].properties.id)
                // hl_line_mark，linetrend_option为undefined？
                // 什么时候挂载上去的？
                if (window.hl_line_mark != e.features[0].properties.id) {
                    for (var i = 0; i < window.linetrend_option.series.length - 1; i++) {
                        console.log(window.linetrend_option.series[i + 1].name);
                        // if (window.linetrend_option.series[i + 1].name != e.features[0].properties.name)
                        window.linetrend_option.series[i + 1].itemStyle.color = window.colorList[i]
                    }
                    window.linetrend_myChart.setOption(window.linetrend_option);
                    // console.log(hl_line_mark);
                    // console.log(e.features[0].properties)
                    // console.log(e.features[0].properties.name);
                    // console.log(window.linetrend_option.series);
                    // console.log(colorList.length);
                    // console.log(window.linetrend_option.series[1].name);
                    for (var i = 0; i < window.linetrend_option.series.length - 1; i++) {
                        // console.log(window.linetrend_option.series[i + 1].name);
                        if (window.linetrend_option.series[i + 1].name != e.features[0].properties.name)
                            window.linetrend_option.series[i + 1].itemStyle.color = window.colorList_clear[i]
                    }
                    window.linetrend_myChart.setOption(window.linetrend_option);
                    window.hl_line_mark = e.features[0].properties.id;

                }
                // console.log(e.features[0])
                // console.log(hoveredStateId)
                if (e.features.length > 0) {
                    if (hoveredStateId) {
                        map.setFeatureState({
                            source: 'rwanda-provinces',
                            id: hoveredStateId
                        }, {
                            hover: false
                        });
                    }
                    hoveredStateId = e.features[0].id;
                    map.setFeatureState({
                        source: 'rwanda-provinces',
                        id: hoveredStateId
                    }, {
                        hover: true
                    });
                }
            });
            // 鼠标点击后移动到地图的提示框中，鼠标的样式变回正常模式
            map.on('mouseenter', 'rwanda-provinces', function() {
                map.getCanvas().style.cursor = 'pointer';
            });
            //当点击事件发生在状态层的一个功能上，在点击的位置，从它的属性描述HTML。
            map.on('click', 'rwanda-provinces', function(e) {
                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(e.features[0].properties.childNum)
                    .addTo(map);
            });
            //当鼠标离开状态填充层时，更新
            //以前悬停功能。
            map.on('mouseleave', 'rwanda-provinces', function() {
                if (window.hl_line_mark != -1) {
                    // console.log(hl_line_mark);
                    for (var i = 0; i < window.linetrend_option.series.length - 1; i++) {
                        // console.log(window.linetrend_option.series[i + 1].name);
                        window.linetrend_option.series[i + 1].itemStyle.color = window.colorList[i]
                    }
                    window.linetrend_myChart.setOption(window.linetrend_option);
                    window.hl_line_mark = -1;
                }
                if (hoveredStateId) {
                    map.setFeatureState({
                        source: 'rwanda-provinces',
                        id: hoveredStateId
                    }, {
                        hover: false
                    });
                }
                hoveredStateId = null;
                map.getCanvas().style.cursor = '';
            });
        });

    
  
  },
};
</script>
<style scoped>

</style>
