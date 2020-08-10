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
        >
          <el-menu-item :index="item.activeRule" v-for="item in apps" :key="item.activeRule">
              <i class="el-icon-location"></i>
              <span>{{item.name}}</span>
              <!-- <el-menu-item index="1-1">选项1</el-menu-item> -->
          </el-menu-item>
        </el-menu>
      </el-aside>
      <div class="hm">
        <el-header class="navbar" height="50px">
          <div class="hamburger-container">
            <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"  @click="isCollapse=!isCollapse"></i>
          </div>
        </el-header>
        <el-main>
          <div id="appContainer" />
        </el-main>
      </div>
    </el-container>
  </div>
</template>

<script>
import {
  registerMicroApps,
  runAfterFirstMounted,
  setDefaultMountApp,
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
          entry: "http://192.168.17.231:9090/xc/MicroApp/",
          container: "#appContainer",
          activeRule: "/xc-micro-app",
        },
        {
          name: "B应用",
          entry: "//localhost:8082",
          container: "#appContainer",
          activeRule: "/xc-grafana",
        },
      ],
      text: "",
      isCollapse: false
    };
  },
  created() {
    if (!window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__) {
      this.initQiankun();
    } else {
      // fix hot-reload
      location.reload();
    }
  },
  methods: {
    goto(title, href) {
      window.history.pushState({}, title, href);
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

      setDefaultMountApp("/slave");

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

<style scoped>
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
