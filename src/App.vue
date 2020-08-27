<!--
 * @Descripttion: 
 * @Author: chenxch
 * @Date: 2020-07-27 09:06:47
-->
<template>
  <div id="container">
    <!-- <header>
      <nav>
        <ol>
          <li v-for="app of apps" :key="app.name">
            <a @click="goto(app.name, `${app.activeRule}`)">{{app.name}}</a>
          </li>
        </ol>
      </nav>
    </header>
    <div>
      <input v-model="text"/><button @click="sure">传给微应用</button>
    </div>
    <div id="appContainer" /> -->
    <el-container class="container">
      <el-aside class="hg-full" :width="isCollapse?'64px':'250px'">
        <el-menu
          default-active="2"
          class="hg-full"
          @select="handleSelect"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#1890ff"
          :collapse="isCollapse"
          router
        >
        <div  v-for="item in menu" :key="item.activeRule">
          <el-submenu :index="item.activeRule" v-if="item.childrens">
            <template slot="title">{{item.name}}</template>
            <el-menu-item :index="child.path" v-for="child in item.childrens" :key="child.path">{{child.name}}</el-menu-item>
          </el-submenu>
          <el-menu-item :index="item.activeRule" v-else>
              <i class="el-icon-location"></i>
              <span>{{item.name}}</span>
              <!-- <el-menu-item index="1-1">选项1</el-menu-item> -->
          </el-menu-item>
        </div>
        </el-menu>
      </el-aside>
      <div class="hm">
        <el-header class="navbar" height="50px">
          <div class="hamburger-container">
            <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"  @click="isCollapse=!isCollapse"></i>
          </div>
        </el-header>
        <el-main>
          <div id="appA" />
          <div id="appB"/>
          <router-view v-if="!isMicroApp"></router-view>
        </el-main>
      </div>
    </el-container>
  </div>
</template>

<script>
import {
  registerMicroApps,
  runAfterFirstMounted,
  // setDefaultMountApp,
  start,
  initGlobalState,
} from "qiankun";

export default {
  name: "master",
  data() {
    return {
      apps: [
        {
          name: "A应用",
          entry: '//localhost:8083',//"http://192.168.17.231:9090/xc/MicroApp/",
          container: "#appA",
          activeRule: "/microApp/xc-micro-app",
          childrens:[
            {
              name:'A1',
              path:'/microApp/xc-micro-app#/'
            },
            {
              name:'A2',
              path:'/microApp/xc-micro-app#/about'
            }
          ]
          // sandbox: {experimentalStyleIsolation: true}
        },
        {
          name: "统一监控",
          entry: "//localhost:8081/ptoBo.html",
          container: "#appB",
          activeRule: "/microApp/ptoBo",
          childrens:[
            {
              name:'概况',
              path:'/microApp/ptoBo#/generalSituation'
            },
            {
              name:'告警管理',
              path:'/microApp/ptoBo#/alarmManage'
            }
          ],
          sandbox: {experimentalStyleIsolation: true}
        },
        {
          name: "文件管理",
          entry: "//localhost:8082/fileManage.html",
          container: "#appB",
          activeRule: "/microApp/fileManage",
          childrens:[
            {
              name:'文件列表',
              path:'/microApp/fileManage#/fm/fileManage'
            }
          ],
          sandbox: {experimentalStyleIsolation: true}
        }
      ],
      text: "",
      isCollapse: false,
      menu: [{
          name: "Portal应用",
          // entry: "http://192.168.17.231:9090/xc/MicroApp/",
          // container: "#appA",
          activeRule: "/home",
          childrens:[
            {
              name:'home',
              path:'/home'
            },
            {
              name:'About',
              path:'/About'
            }
          ]
          // sandbox: {experimentalStyleIsolation: true}
        }],
        isMicroApp: false
    };
  },
  created() {
    if (!window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__) {
      this.initQiankun();
    } else {
      // fix hot-reload
      location.reload();
    }
    this.menu = this.menu.concat(this.apps);
  },
  methods: {
    goto(title, href) {
      if(href.indexOf('/microApp')!==-1){   
        window.history.pushState({}, title, href);
        this.isMicroApp = true;
      } else{
        this.isMicroApp = false;
      }
    },
    initQiankun() {
      registerMicroApps(this.apps, {
        beforeLoad: [
          (app) => {
            // eslint-disable-next-line no-console
            console.log("before load", app);
          },
        ],
        beforeMount: [
          (app) => {
            // eslint-disable-next-line no-console
            console.log("before mount", app);
          },
        ],
        afterUnmount: [
          (app) => {
            // eslint-disable-next-line no-console
            console.log("after unload", app);
          },
        ],
      });

      // setDefaultMountApp("/microApp/xc-micro-app");

      runAfterFirstMounted(() => {
        // eslint-disable-next-line no-console
        console.info("first app mounted");
      });

      start({ prefetch: true });
    },
    sure() {
      if (this.text) {
        const state = { text: this.text };
        const actions = initGlobalState(state);
        actions.setGlobalState(state);
      }
    },
    handleSelect(path){
      this.goto('',path)
    }
  },
};
</script>

<style scoped lan="scss">
#container {
  height: 100%;
}
a {
  color: #42b983;
  cursor: pointer;
}
.appContainer {
  margin-top: 50px;
}
.container {
  display: flex;
  height: 100%;
}
.hm {
  flex: 1;
}
.menu {
  width: 250px;
}
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    -webkit-box-shadow: 0 1px 4px rgba(0,21,41,.08);
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
}
::v-deep .el-main{
  padding: 10px;
}
.hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    -webkit-transition: background .3s;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;
}

</style>
