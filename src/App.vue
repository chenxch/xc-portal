<!--
 * @Descripttion: 
 * @Author: chenxch
 * @Date: 2020-07-27 09:06:47
--> 
<template>
  <div id="container">
    <header>
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
    <div id="appContainer" />
  </div>
</template>

<script>
  import { registerMicroApps, runAfterFirstMounted, setDefaultMountApp, start, initGlobalState } from 'qiankun'

	export default {
    name: 'master',
		data () {
      return {
        apps: [
          { name: 'A应用', entry: 'http://192.168.17.231:9090/xc/MicroApp/', container: '#appContainer', activeRule: '/xc-micro-app' },
          { name: 'B应用', entry: '//localhost:8082', container: '#appContainer', activeRule: '/xc-grafana' }
        ],
        text: ''
      }
    },
    created () {
      if (!window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__) {
        this.initQiankun()
      } else {
        // fix hot-reload
        location.reload()
      }
    },
		methods: {
			goto (title, href) {
				window.history.pushState({}, title, href)
      },
      initQiankun () {
        registerMicroApps(
          this.apps,
          {
            beforeLoad: [
              app => {
                // eslint-disable-next-line no-console
                console.log('before load', app)
              }
            ],
            beforeMount: [
              app => {
                // eslint-disable-next-line no-console
                console.log('before mount', app)
              }
            ],
            afterUnmount: [
              app => {
                // eslint-disable-next-line no-console
                console.log('after unload', app)
              }
            ]
          }
        )

        setDefaultMountApp('/slave')

        runAfterFirstMounted(() => {
          // eslint-disable-next-line no-console
          console.info('first app mounted')
        })

        start({ prefetch: true })
      },
      sure(){
        if(this.text){
          const state = { text:this.text};
            const actions = initGlobalState(state);
            actions.setGlobalState(state);
        }
      }
		}
	}
</script>

<style scoped>
  a {
    color: #42b983;
    cursor: pointer;
  }
  .appContainer {
    margin-top: 50px;
  }
</style>
