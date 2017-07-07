/*
源格式：
  {
    "code": "110000",
    "sheng": "11",
    "di": "00",
    "xian": "00",
    "name": "北京市",
    "level": 1
  }
需求格式：
  [{
    label:"省",
    value:"110000",
    key:"110000",
    children:[{
      label:"市",
      value:"110100",
      key:"110100",
      children:[{
        label:"区",
        value:"110101",
        key:"110101",
      }]
    }]
  }]
 */
var Cascader = (function(){
    let data = locationList;
    var _cascader = {
      data:[], // 级联数据
      getFullTxt:function(value){// 根据key获取全文本
        var fullTxt = "";
        var level=0;
        if(value.substring(2,6)==="0000"){// 省
          level=1;
        }else if(value.substring(4,6)!=="00"){//区
          level=3;
        }else{//市
          level=2;
        }
        console.log("code=="+value+", 级别=="+level);
        getTxt(this.data,value,level);
        function getTxt(data,value,i){
          let str = value;
          switch(i){
            case 2:
              str = str.substring(0,4)+"00"
            break;
            case 3:
              str = str.substring(0,2)+"0000"
            break;
            default:break;
          }
          const temp = data.filter(item => item.value===str)
          console.log(temp);
          fullTxt+=temp[0].label;
          i--;
          if(i===0){
            return fullTxt
          }else{
            return getTxt(temp[0].children,value,i)
          } 
        }
        return fullTxt
      }
    };
    for(var i=0;i<data.length;i++){
        if(data[i].level===1){  // 判断为省
            let province = {    // 给省添加一个市的集合
              label:data[i].name,
              value:data[i].code,
              key:data[i].code,
              children:[]
            }           
            if(i===data.length-1){     // 当循环到最后时  
                _cascader.data.push(province); // 将省添加到data中
            }
            for(var j=i+1;j<data.length;j++){
                if(data[j].level===2){    // 判断为市
                    let city = {          // 给市添加一个区的集合
                      label:data[j].name,
                      value:data[j].code,
                      key:data[j].code,
                      children:[]
                    }          
                    for(var k=j+1;k<data.length;k++){
                        if(data[k].level===3){   // 判断为区
                          let dist = { 
                            label:data[k].name,
                            value:data[k].code,
                            key:data[k].code,
                          }
                          city.children.push(dist); // 将区添加到市中
                        }else{   
                            province.children.push(city);  // 将市添加到省中
                            j = k-1;
                            k = data.length
                        }
                    }
                }else{  
                    _cascader.data.push(province); // 将省添加到data中
                    i = j-1;
                    j = data.length;
                }
            }
        }
    }
    return _cascader;
})()
