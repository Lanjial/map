<template>
  <div id="app">
    <!-- <Case></Case> -->
    <div class="map">
      <div class="map_le">
        <div class="map_content">
            <MapBox class="mapbox"></MapBox>
            <div class="Suspension">
            <h5>Town Name</h5>
            <div v-for="(item,index) in colorList" :key="index" class="option">
            <span :style="`background-color:${item.properties.color}`"></span>
            {{item.properties.name}}
        </div>
    </div>
        </div>
      </div>
      <div class="map_ri">
        <Weight class="weight"></Weight>
        <Mobility class="mobility"></Mobility>
      </div>
    </div>
    
  </div>
</template>

<script>
import MapBox from "@/components/mapbox";
import Weight from "@/components/weightChart";
import Mobility from "@/components/mobilityChart";
import Case from '@/components/caseChart';
import Export from "../../static/Export_Output.json"
export default {
  components:{
    MapBox,
    Weight,
    Mobility,
    Case
  },
  data(){
    return{
      colorList:[],
    }
  },
  created(){
    this.setColor()
  },
  methods:{
    
    setColor(){
      this.colorList = Export.features
      console.log(this.colorList);
    }
    
  }
}
</script>

<style lang="less">
#app{
  .map{
    display: flex;
    width: 100%;
    height: 660px;
    .map_le{
      width: 50%;
        .map_content{
            position: absolute;
            width: 50%;
          .Suspension{
            background-color: #fff;
            position: absolute;
            right: 10px;
            top: 10px;
            width: 120px;
           .option{
             display: flex;
             text-align:left;
             align-items: center;
             padding-left: 10px;
               span{
               display: block;
               margin-right: 5px;
               width: 15px;
               height: 15px;
               border-radius: 50%;
             }
           }
          }
        }
      }
    .map_ri{
      width: 50%;
      .mobility{
        height: 300px;
      }
    }
  }

}
</style>
