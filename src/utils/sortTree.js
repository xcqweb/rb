
import {isNullOrEmpty} from './util'
//排序算法
/**
 * 
 * @param trees 要排序的树结构 Array
 * @param target 当前Vue实例
 */
export default function sortTree(trees, target) {
  const that = target; //Vue 实例
  const arr1 = [];
  const arr2 = [];
  const arr3 = [];
  const arr4 = [];
  for (const key of trees) {
    if (/^[0-9]/.test((key.title + ''))) { //数字排序 
      arr1.push(key);
    } else if (/^[a-z|A-Z]/.test((key.title + ''))) { //字母排序
      arr2.push(key);
    } else if (/^[\u4e00-\u9fa5]/.test((key.title + ''))) { // 中文排序或其他
      arr3.push(key);
    } else {
      arr4.push(key);
    }
  }
  //排序算法
  function insertSort(arr, type) {
    const len = arr.length;
    for (let i = 0; i < len; i++) {
      if (arr[i] && arr[i].children && arr[i].children.length) {
        that.$set(arr[i], 'children', sortTree(arr[i].children, that));
      }
      for (let j = 0; j < len - i - 1; j++) {
        const left = isNullOrEmpty(arr[j].title) ? '' : (arr[j].title).toString();
        const right = isNullOrEmpty(arr[j + 1].title) ? '' : (arr[j + 1].title).toString();
        if (left.localeCompare) {
          if (left.localeCompare(right) > 0) { //节点名称排序
            [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
          }
        } else {
          const leftC = (((arr[j].title + '').charAt(0)).toLowerCase()).charCodeAt(0);
          const rightC = (((arr[j + 1].title + '').charAt(0)).toLowerCase()).charCodeAt(0);
          if (leftC > rightC) { //节点名称排序
            [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
          }
        }
        //递归排序
        if (arr[j] && arr[j].children && arr[j].children.length) {
          that.$set(arr[j], 'children', sortTree(arr[j].children, that));
        }
      }
    }
    return arr;
  }
  return insertSort(arr1).concat(insertSort(arr2)).concat(insertSort(arr3)).concat(insertSort(arr4));
}