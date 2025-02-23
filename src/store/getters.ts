import { GetterTree } from 'vuex'
import {RootState, RootStateDependency} from '@/store/types'
import semver from 'semver'
import {minKlipperVersion, minMoonrakerVersion} from '@/store/variables'

// eslint-disable-next-line
export const getters: GetterTree<RootState, any> = {
    getVersion: state => {
        return state.packageVersion
    },

    getTitle: (state, getters) => {
        if (state.socket?.isConnected) {
            if (state.server?.klippy_state !== 'ready') return 'ERROR'
            else if (state.printer?.print_stats?.state === 'paused') return 'Pause Print'
            else if (state.printer?.print_stats?.state === 'printing') {
                const eta = getters['printer/getEstimatedTimeETA']

                let output = (getters['printer/getPrintPercent'] * 100).toFixed(0)+'% Printing'
                if (eta) {
                    const date = new Date(eta)
                    const h = date.getHours() >= 10 ? date.getHours() : '0'+date.getHours()
                    const m = date.getMinutes() >= 10 ? date.getMinutes() : '0'+date.getMinutes()
                    const diff = eta - new Date().getTime()
                    output += ' - ETA: '+h+':'+m+((diff > 60*60*24*1000) ? '+'+(diff / (60*60*24*1000)).toFixed() : '')
                }
                output += ' - '+state.printer.print_stats?.filename

                return output
            } else if (state.printer?.print_stats?.state === 'complete') return 'Complete - '+state.printer.print_stats.filename

            return state.gui?.general.printername ?? state.printer?.hostname ?? 'Mainsail'
        }

        return 'Mainsail'
    },

    getDependencies: (state) => {
        const dependencies: RootStateDependency[] = []

        const klipperVersion = state.printer?.software_version ?? ''
        const klipperVersionSplits = klipperVersion.split('-')
        const klipperVersionRelease = klipperVersionSplits[0] ?? ''
        const klipperVersionBuild = klipperVersionSplits[1] ?? 0

        const minKlipperVersionSplits = minKlipperVersion.split('-')
        const minKlipperVersionRelease = minKlipperVersionSplits[0] ?? ''
        const minKlipperVersionBuild = minKlipperVersionSplits[1] ?? 0

        if (
            semver.valid(klipperVersionRelease) && (
                semver.gt(minKlipperVersionRelease, klipperVersionRelease) ||
                (semver.eq(minKlipperVersionRelease, klipperVersionRelease) && klipperVersionBuild < minKlipperVersionBuild)
            )
        ) {
            dependencies.push({
                serviceName: 'Klipper',
                installedVersion: klipperVersion,
                neededVersion: minKlipperVersion
            })
        }

        const moonrakerVersion = state.server?.moonraker_version ?? ''
        const moonrakerVersionSplits = moonrakerVersion.split('-')
        const moonrakerVersionRelease = moonrakerVersionSplits[0] ?? ''
        const moonrakerVersionBuild = moonrakerVersionSplits[1] ?? 0

        const minMoonrakerVersionSplits = minMoonrakerVersion.split('-')
        const minMoonrakerVersionRelease = minMoonrakerVersionSplits[0] ?? ''
        const minMoonrakerVersionBuild = minMoonrakerVersionSplits[1] ?? 0

        if (moonrakerVersion === '') {
            dependencies.push({
                serviceName: 'Moonraker',
                installedVersion: '--',
                neededVersion: minMoonrakerVersion
            })
        } else if (
            semver.valid(moonrakerVersionRelease) && (
                semver.gt(minMoonrakerVersionRelease, moonrakerVersionRelease) ||
                (semver.eq(minMoonrakerVersionRelease, moonrakerVersionRelease) && moonrakerVersionBuild < minMoonrakerVersionBuild)
            )
        ) {
            dependencies.push({
                serviceName: 'Moonraker',
                installedVersion: moonrakerVersion,
                neededVersion: minMoonrakerVersion
            })
        }

        return dependencies
    }
}
