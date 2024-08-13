import { ImageToolLearn } from '@ImageToolLearn/core'
import Dashboard from '@ImageToolLearn/dashboard'
import XHRUpload from '@ImageToolLearn/xhr-upload'
import Unsplash from '@ImageToolLearn/unsplash'
import Url from '@ImageToolLearn/url'

import '@ImageToolLearn/core/dist/style.css'
import '@ImageToolLearn/dashboard/dist/style.css'

const companionUrl = 'http://localhost:3020'
const ImageToolLearn = new ImageToolLearn()
  .use(Dashboard, { target: '#app', inline: true })
  .use(XHRUpload, { endpoint: 'https://xhr-server.herokuapp.com/upload', limit: 6 })
  .use(Url, { target: Dashboard, companionUrl })
  .use(Unsplash, { target: Dashboard, companionUrl })

// Keep this here to access ImageToolLearn in tests
window.ImageToolLearn = ImageToolLearn
