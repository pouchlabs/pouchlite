import * as path from 'path';
import { defineConfig } from 'rspress/config';
import ga from 'rspress-plugin-google-analytics';
export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: ' Brazingly fast js storage engine',
  description: 'pouchlite is a document and files storage engine',
  icon: '/logo.png',
  logo: {
    light: '/logo.png',
    dark: '/logo.svg',
  },
  themeConfig: {
    
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com/pouchlabs/lite' },
    ],
    outlineTitle: 'Outline',
    footer: {
      message:
        '<p>made with love by  <strong><a href="https://github.com/pouchlabs">pouchlabs</a></strong> and founder <strong><a href="https://devfolio.top/ajm">ajm</a></strong></p>',
    },

  
  },
  plugins: [
    ga({
      id: 'UA-123456789',
    }),
  ], 
});
