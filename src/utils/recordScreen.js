import { Base64 } from 'js-base64';
import pako from 'pako';

// 解压并解码之前压缩的数据
export function unzip(b64Data) {
  let strData = Base64.atob(b64Data);
  let charData = strData.split('').map(function (x) {
    return x.charCodeAt(0);
  });
  let binData = new Uint8Array(charData);
  let data = pako.ungzip(binData);
  // ↓切片处理数据，防止内存溢出报错↓
  let str = '';
  const chunk = 8 * 1024;
  let i;
  for (i = 0; i < data.length / chunk; i++) {
    // 将Unicode值转换成字符串
    str += String.fromCharCode.apply(null, data.slice(i * chunk, (i + 1) * chunk));
  }
  // 因为data.length/chunk 不一定是整数 所以最后一次循环可能会有剩余
  str += String.fromCharCode.apply(null, data.slice(i * chunk));
  // let _check=createCurry();
  // ↑切片处理数据，防止内存溢出报错↑
  const unzipStr = Base64.decode(str);
  let result = '';
  // 对象或数组进行JSON转换
  try {
    result = JSON.parse(unzipStr);
  } catch (error) {
    if (/Unexpected token o in JSON at position 0/.test(error)) {
      // 如果没有转换成功，代表值为基本数据，直接赋值
      result = unzipStr;
    }
  }
  return result;
}
