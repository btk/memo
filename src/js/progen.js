const randSet = [1,4,5,4,6,2,5,7,8,2,5,7,9,0,6,3,2,5,6,7,5,2,2,3,4,1,2,3,4,6,6,8,9,9,0,9,7,6,5,4,3,3];

function getColors(baseKey){
  let firstColorHue = (3 * Math.abs(baseKey) + 2 * Math.abs(baseKey) + 11 * randSet[baseKey % (randSet.length - 1)]) % 36 * 10;
  //let secondColorHue = (13 * Math.abs(x) + 7 * Math.abs(y)) % 36 * 10;
  //"hsl("+secondColorHue+", 20%, 44%)"
  return firstColorHue;
}

function GNT(data){
  let total = 0;
  while(1){
    if(typeof(data) == "string"){
      if(isNaN(data.substr(0,1))){
        total = total + (data.substr(0,1).charCodeAt(0) - 97);
      }else{
        total = total + parseInt(data.substr(0,1));
      }
      data = data.substr(1);
    }else{
      total = total + data % 10;
      data = parseInt(data / 10);
    }
    if(data == 0 || data == ""){
      break;
    }
  }
  return total;
}

// Generate statically expected data/datasets
// using the current planet identity
export default function Progen(word, variation){
  let baseKey = GNT(word + variation);
  //console.log(baseKey);
  return getColors(baseKey);
  //return  (Math.abs(abs.x) * (baseKey * 13 % 11) + Math.abs(abs.y) * (baseKey * 11 % 13)) % (end - start + 1) + start;
}
