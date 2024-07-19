import { ImageToolLearn } from '@ImageToolLearn/core'
import Dashboard from '@ImageToolLearn/dashboard'
import Tus from '@ImageToolLearn/tus'
import Unsplash from '@ImageToolLearn/unsplash'
import Url from '@ImageToolLearn/url'

import '@ImageToolLearn/core/dist/style.css'
import '@ImageToolLearn/dashboard/dist/style.css'

function onShouldRetry (err, retryAttempt, options, next) {
  if (err?.originalResponse?.getStatus() === 418) {
    return true
  }
  return next(err)
}

const companionUrl = 'http://localhost:3020'
const ImageToolLearn = new ImageToolLearn()
  .use(Dashboard, { target: '#app', inline: true })
  .use(Tus, { endpoint: 'https://tusd.tusdemo.net/files', onShouldRetry })
  .use(Url, { target: Dashboard, companionUrl })
  .use(Unsplash, { target: Dashboard, companionUrl })

// Keep this here to access ImageToolLearn in tests
window.ImageToolLearn = ImageToolLearn
