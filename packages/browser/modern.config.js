import { moduleTools, defineConfig } from '@modern-js/module-tools';

export default defineConfig({
    buildConfig:{
        buildType: 'bundleless',
        sourceDir:"src/lib",
    },
    buildPreset: "npm-library",
    plugins: [moduleTools()],

});