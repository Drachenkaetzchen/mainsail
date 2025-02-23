<style>
    .nav-logo {
        height: 32px;
    }
    .small-list-item {
        height: var(--sidebar-menu-item-height);
    }
    .no-text-decoration {
        text-decoration: none;
        background-color: transparent;
    }
    .no-background:before {
        background-color: rgba(255, 255, 255, 0) !important;
    }
</style>
<style scoped>
    .active-nav-item {
        border-right: 4px solid var(--v-primary-base);
    }
    .menu-item-icon {
        opacity: .85;
    }
    .menu-item-title {
        line-height: 30px;
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        opacity: .85;
    }
</style>

<template>
    <v-navigation-drawer v-model="naviDrawer" :src="sidebarBackground" :mini-variant="(navigationStyle === 'iconsOnly')" :key="navigationStyle" :width="navigationWidth" clipped app> 
        <v-list class="pr-0 pt-0 ml-0">
            <v-list-item-group active-class="active-nav-item">
                <template v-if="countPrinters">
                    <v-list-item 
                        router to="/allPrinters"
                        class="small-list-item mt-1"
                    >
                        <v-list-item-icon class="my-3 mr-3 menu-item-icon">
                            <v-icon>mdi-view-dashboard-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title tile class="menu-item-title">{{ $t("App.Printers")}}</v-list-item-title>
                        </v-list-item-content>

                    </v-list-item>
                    <v-divider class="my-1"></v-divider>
                </template>
                <div v-for="(category, index) in naviPoints" :key="index"> 
                    <v-list-item 
                        router :to="category.path"
                        v-if="showInNavi(category)"
                        class="small-list-item"
                    >
                        <v-list-item-icon class="my-3 mr-3 menu-item-icon">
                            <v-icon>mdi-{{ category.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title tile class="menu-item-title">{{ $t(`Router.${category.title}`) }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </div>
            </v-list-item-group>
        </v-list>
        <template v-slot:append>
            <v-list-item class="small-list-item mb-2">
                <v-list-item-icon class="menu-item-icon">
                    <about-modal></about-modal>
                </v-list-item-icon>
            </v-list-item>
        </template>
    </v-navigation-drawer>  
</template>

<script lang="ts">
import Component from 'vue-class-component'
import routes, {AppRoute} from '@/routes'
import {Mixins} from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import {PrinterStateKlipperConfig} from '@/store/printer/types'
import TheSelectPrinterDialog from '@/components/TheSelectPrinterDialog.vue'
import AboutModal from '@/components/modals/AboutModal.vue'
import {navigationWidth} from '@/store/variables'

@Component({
    components: {
        TheSelectPrinterDialog,
        AboutModal
    }
})

export default class TheSidebarAlt extends Mixins(BaseMixin) {
    navigationWidth = navigationWidth

    get naviDrawer(): boolean {
        return this.$store.state.naviDrawer
    }

    set naviDrawer(newVal: boolean) {
        this.$store.dispatch('setNaviDrawer', newVal)
    }

    get navigationStyle() {
        return this.$store.state.gui.dashboard.navigationStyle
    }

    get sidebarBackground(): string {
        return this.$store.getters['files/getSidebarBackground']
    }

    get naviPoints(): AppRoute[] {
        return routes.filter((element) => element.showInNavi)
    }

    get klippy_state(): string {
        return this.$store.state.server.klippy_state
    }

    get boolNaviWebcam(): boolean {
        return this.$store.state.gui.webcamSettings.boolNavi
    }

    get moonrakerComponents(): string[] {
        return this.$store.state.server.components
    }

    get registeredDirectories(): string[] {
        return this.$store.state.server.registered_directories
    }

    get klipperConfigfileSettings(): PrinterStateKlipperConfig[] {
        return this.$store.state.printer.configfile?.settings ?? {}
    }

    get currentPage(): string {
        return this.$route.fullPath
    }

    get isUpdateAvailable(): boolean {
        return this.$store.getters['server/updateManager/isUpdateAvailable']
    }

    get countPrinters() {
        return this.$store.getters['farm/countPrinters']
    }

    showInNavi(route: AppRoute): boolean {
        if (['shutdown', 'error', 'disconnected'].includes(this.klippy_state) && !route.alwaysShow) return false

        if (route.title === 'Webcam') return this.boolNaviWebcam

        if (route.moonrakerComponent) return this.moonrakerComponents.includes(route.moonrakerComponent)
        if (route.registeredDirectory) return this.registeredDirectories.includes(route.registeredDirectory)
        if (route.klipperComponent) return (route.klipperComponent in this.klipperConfigfileSettings)

        return true
    }

    mounted() {
        this.naviDrawer = this.$vuetify.breakpoint.lgAndUp
    }
}
</script>