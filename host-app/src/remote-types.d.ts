// Type declarations for remote modules

declare module 'listUserApp/ListUser' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'createUserApp/CreateUpdateUser' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{
    userId?: string | number
  }, {}, any>
  export default component
}

declare module 'host/store' {
  import { Store } from 'vuex'
  import { RootState } from './store'
  export const store: Store<RootState>
  export default store
}

