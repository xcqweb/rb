// 此目录下公共组件命名规则：前面加 gt- 标识
import Vue from "vue";
import Page from "@/components/Page";
import PageTitle from "@/components/PageTitle";
import BottomAutoload from './bottomAutoload'
import NoData from './NoData'
import Icon from './Icon'
import Search from './Search'
import Edit from './Edit'
import DeviceTree from './DeviceTree'
import Label from './Label'
import ModalSelectTree from './ModalSelectTree'
import CollapseList from './CollapseList'
import CycleList from './CycleList'
import InfinitySelect from './InfinitySelect'
import Copy from './Copy'
[
  Page,
  PageTitle,
  BottomAutoload,
  NoData,
  Icon,
  Search,
  Edit,
  DeviceTree,
  Label,
  ModalSelectTree,
  CollapseList,
  CycleList,
  InfinitySelect,
  Copy
].forEach(el => Vue.use(el));