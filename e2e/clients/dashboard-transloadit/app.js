import { ImageToolLearn } from '@ImageToolLearn/core'
import Dashboard from '@ImageToolLearn/dashboard'
import Transloadit from '@ImageToolLearn/transloadit'

import generateSignatureIfSecret from './generateSignatureIfSecret.js'

import '@ImageToolLearn/core/dist/style.css'
import '@ImageToolLearn/dashboard/dist/style.css'

// Environment variables:
// https://en.parceljs.org/env.html
const ImageToolLearn = new ImageToolLearn()
  .use(Dashboard, { target: '#app', inline: true })
  .use(Transloadit, {
    service: process.env.VITE_TRANSLOADIT_SERVICE_URL,
    waitForEncoding: true,
    getAssemblyOptions: () => generateSignatureIfSecret(process.env.VITE_TRANSLOADIT_SECRET, {
      auth: { key: process.env.VITE_TRANSLOADIT_KEY },
      template_id: process.env.VITE_TRANSLOADIT_TEMPLATE,
    }),
  })

// Keep this here to access ImageToolLearn in tests
window.ImageToolLearn = ImageToolLearn
