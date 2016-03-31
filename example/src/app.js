import {div, nav} from 'cycle-snabbdom'

import Sidebar from './components/sidebar'
import Home from './components/home'
import Inbox from './components/inbox'
import Compose from './components/compose'
import Contact from './components/contact'
import NotFound from './components/notfound'

const routes = {
  '/': Home,
  '/inbox': Inbox,
  '/compose': Compose,
  '/contact': Contact,
  '*': NotFound,
}

const containerStyle = {
  position: 'fixed',
  top: '0',
  bottom: '0',
  left: '0',
  right: '0',
}

const navStyle = {
  zIndex: '1',
  position: 'fixed',
  top: '0',
  bottom: '0',
  left: '0',
  width: '10em',
  backgroundColor: '#cccccc',
  borderRight: '2px solid rgba(34, 34, 34, 0.4)',
}

const childrenStyle = {
  marginLeft: '10em',
  position: 'fixed',
  top: '0',
  bottom: '0',
  left: '0',
  right: '0',
  backgroundColor: '#dfdfdf',
}

function view(sidebar, children) {
  return div({style: containerStyle}, [
    nav({style: navStyle}, [sidebar]),
    div({style: childrenStyle}, [children]),
  ])
}

function App(sources) {
  const {router} = sources
  const match$ = router.define(routes)
  const sidebar = Sidebar(sources, match$.pluck('path'))
  const children$ = match$.map(
    ({path, value}) => value({...sources, router: router.path(path)})
  )

  return {
    DOM: sidebar.DOM.combineLatest(children$.map(x => x.DOM), view),
    HTTP: children$.map(x => x.HTTP).filter(x => !!x).mergeAll(),
  }
}

export default App
