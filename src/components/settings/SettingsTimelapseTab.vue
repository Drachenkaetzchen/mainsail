<template>
    <div>
        <v-card flat>
            <v-card-text>
                <h3 class="text-h5 mb-3">{{ $t('Settings.TimelapseTab.General') }}</h3>
                <settings-row :title="$t('Settings.TimelapseTab.Enabled')" :sub-title="$t('Settings.TimelapseTab.EnabledDescription')" :dynamicSlotWidth="true">
                    <v-switch v-model="enabled" hide-details class="mt-0" :disabled="blockedsettings.includes('enabled')"></v-switch>
                </settings-row>
                <v-divider class="my-2"></v-divider>
                <settings-row :title="$t('Settings.TimelapseTab.Autorender')" :sub-title="$t('Settings.TimelapseTab.AutorenderDescription')" :dynamicSlotWidth="true">
                    <v-switch v-model="autorender" hide-details class="mt-0" :disabled="blockedsettings.includes('autorender')"></v-switch>
                </settings-row>
                <v-divider class="my-2"></v-divider>
                <settings-row :title="$t('Settings.TimelapseTab.Camera')" :sub-title="$t('Settings.TimelapseTab.CameraDescription')">
                    <v-select v-model="camera" :items="cameraOptions" hide-details outlined dense :disabled="blockedsettings.includes('camera') || blockedsettings.includes('snapshoturl')"></v-select>
                </settings-row>
                <v-divider class="my-2"></v-divider>
                <settings-row :title="$t('Settings.TimelapseTab.Mode')" :sub-title="$t('Settings.TimelapseTab.ModeDescription')">
                    <v-select v-model="mode" :items="modeOptions" hide-details outlined dense :disabled="blockedsettings.includes('modeOptions')"></v-select>
                </settings-row>
                <template v-if="mode === 'hyperlapse'">
                    <v-divider class="my-2"></v-divider>
                    <settings-row :title="$t('Settings.TimelapseTab.HyperlapseCycle')" :sub-title="$t('Settings.TimelapseTab.HyperlapseCycleDescription')">
                        <v-text-field v-model="hyperlapseCycle" type="number" suffix="s" hide-details="auto" outlined dense :disabled="blockedsettings.includes('hyperlapseCycle')"></v-text-field>
                    </settings-row>
                </template>
                <v-divider class="my-2"></v-divider>
                <settings-row :title="$t('Settings.TimelapseTab.PreviewImage')" :sub-title="$t('Settings.TimelapseTab.PreviewImageDescription')" :dynamicSlotWidth="true">
                    <v-switch v-model="previewimage" hide-details class="mt-0" :disabled="blockedsettings.includes('previewimage')"></v-switch>
                </settings-row>
                <v-divider class="my-2"></v-divider>
                <settings-row :title="$t('Settings.TimelapseTab.SaveFrames')" :sub-title="$t('Settings.TimelapseTab.SaveFramesDescription')" :dynamicSlotWidth="true">
                    <v-switch v-model="saveframes" hide-details class="mt-0" :disabled="blockedsettings.includes('saveframes')"></v-switch>
                </settings-row>
                <v-divider class="my-2"></v-divider>
                <settings-row :title="$t('Settings.TimelapseTab.GcodeVerbose')" :sub-title="$t('Settings.TimelapseTab.GcodeVerboseDescription')" :dynamicSlotWidth="true">
                    <v-switch v-model="gcode_verbose" hide-details class="mt-0" :disabled="blockedsettings.includes('gcode_verbose')"></v-switch>
                </settings-row><v-divider class="my-2"></v-divider>
                <h3 class="text-h5 mt-6 mb-3">{{ $t('Settings.TimelapseTab.Parkhead') }}</h3>
                <settings-row :title="$t('Settings.TimelapseTab.Parkhead')"  :sub-title="$t('Settings.TimelapseTab.ParkheadDescription')" :dynamicSlotWidth="true">
                    <v-switch v-model="parkhead" hide-details class="mt-0" :disabled="blockedsettings.includes('parkhead')"></v-switch>
                </settings-row>
                <template v-if="parkhead">
                    <v-divider class="my-2"></v-divider>
                    <settings-row :title="$t('Settings.TimelapseTab.Parkpos')" :sub-title="$t('Settings.TimelapseTab.ParkposDescription')">
                        <v-select v-model="parkpos" :items="parkposOptions" hide-details outlined dense :disabled="blockedsettings.includes('parkposOptions')"></v-select>
                    </settings-row>
                    <template v-if="parkpos === 'custom'">
                        <v-divider class="my-2"></v-divider>
                        <settings-row :title="$t('Settings.TimelapseTab.PosX')" :sub-title="$t('Settings.TimelapseTab.PosXDescription')">
                            <v-text-field v-model="park_custom_pos_x" type="number" suffix="mm" hide-details="auto" outlined dense :disabled="blockedsettings.includes('park_custom_pos_x')"></v-text-field>
                        </settings-row>
                        <v-divider class="my-2"></v-divider>
                        <settings-row :title="$t('Settings.TimelapseTab.PosY')" :sub-title="$t('Settings.TimelapseTab.PosYDescription')">
                            <v-text-field v-model="park_custom_pos_y" type="number" suffix="mm" hide-details="auto" outlined dense :disabled="blockedsettings.includes('park_custom_pos_y')"></v-text-field>
                        </settings-row>
                        <v-divider class="my-2"></v-divider>
                        <settings-row :title="$t('Settings.TimelapseTab.PosDZ')" :sub-title="$t('Settings.TimelapseTab.PosDZDescription')">
                            <v-text-field v-model="park_custom_pos_dz" type="number" suffix="mm" hide-details="auto" outlined dense :disabled="blockedsettings.includes('park_custom_pos_dz')"></v-text-field>
                        </settings-row>
                    </template>
                    <v-divider class="my-2"></v-divider>
                    <settings-row :title="$t('Settings.TimelapseTab.TravelSpeed')" :sub-title="$t('Settings.TimelapseTab.TravelSpeedDescription')">
                        <v-text-field v-model="park_travel_speed" type="number" suffix="mm/s" hide-details="auto" outlined dense :disabled="blockedsettings.includes('park_travel_speed')"></v-text-field>
                    </settings-row>
                    <v-divider class="my-2"></v-divider>
                    <settings-row :title="$t('Settings.TimelapseTab.RetractSpeed')" :sub-title="$t('Settings.TimelapseTab.RetractSpeedDescription')">
                        <v-text-field v-model="park_retract_speed" type="number" suffix="mm/s" hide-details="auto" outlined dense :disabled="blockedsettings.includes('park_retract_speed')"></v-text-field>
                    </settings-row>
                    <v-divider class="my-2"></v-divider>
                    <settings-row :title="$t('Settings.TimelapseTab.RetractDistance')" :sub-title="$t('Settings.TimelapseTab.RetractDistanceDescription')">
                        <v-text-field v-model="park_retract_distance" type="number" suffix="mm" hide-details="auto" outlined dense :disabled="blockedsettings.includes('park_retract_distance')"></v-text-field>
                    </settings-row>
                    <v-divider class="my-2"></v-divider>
                    <settings-row :title="$t('Settings.TimelapseTab.ExtractSpeed')" :sub-title="$t('Settings.TimelapseTab.ExtractSpeedDescription')">
                        <v-text-field v-model="park_extrude_speed" type="number" suffix="mm/s" hide-details="auto" outlined dense :disabled="blockedsettings.includes('park_extrude_speed')"></v-text-field>
                    </settings-row>
                    <v-divider class="my-2"></v-divider>
                    <settings-row :title="$t('Settings.TimelapseTab.ExtractDistance')" :sub-title="$t('Settings.TimelapseTab.ExtractDistanceDescription')">
                        <v-text-field v-model="park_extrude_distance" type="number" suffix="mm" hide-details="auto" outlined dense :disabled="blockedsettings.includes('park_extrude_distance')"></v-text-field>
                    </settings-row>
                </template>
                <v-divider class="my-2"></v-divider>
                <h3 class="text-h5 mt-6 mb-3">{{ $t('Settings.TimelapseTab.RenderingOptions') }}</h3>
                <settings-row :title="$t('Settings.TimelapseTab.VariableFps')" :sub-title="$t('Settings.TimelapseTab.VariableFpsDescription')" :dynamicSlotWidth="true">
                    <v-switch v-model="variable_fps" hide-details class="mt-0" :disabled="blockedsettings.includes('variable_fps')"></v-switch>
                </settings-row>
                <template v-if="variable_fps">
                    <v-divider class="my-2"></v-divider>
                    <settings-row :title="$t('Settings.TimelapseTab.Targetlength')" :sub-title="$t('Settings.TimelapseTab.TargetlengthDescription')">
                        <v-text-field v-model="targetlength" type="number" suffix="s" hide-details="auto" outlined dense :disabled="blockedsettings.includes('targetlength')"></v-text-field>
                    </settings-row>
                    <v-divider class="my-2"></v-divider>
                    <settings-row :title="$t('Settings.TimelapseTab.VariableFpsMin')" :sub-title="$t('Settings.TimelapseTab.VariableFpsMinDescription')">
                        <v-text-field v-model="variable_fps_min" type="number" suffix="frames" hide-details="auto" outlined dense :disabled="blockedsettings.includes('variable_fps_min')"></v-text-field>
                    </settings-row>
                    <v-divider class="my-2"></v-divider>
                    <settings-row :title="$t('Settings.TimelapseTab.VariableFpsMax')" :sub-title="$t('Settings.TimelapseTab.VariableFpsMaxDescription')">
                        <v-text-field v-model="variable_fps_max" type="number" suffix="frames" hide-details="auto" outlined dense :disabled="blockedsettings.includes('variable_fps_max')"></v-text-field>
                    </settings-row>
                </template>
                <template v-else>
                    <v-divider class="my-2"></v-divider>
                    <settings-row :title="$t('Settings.TimelapseTab.OutputFramerate')" :sub-title="$t('Settings.TimelapseTab.OutputFramerateDescription')">
                        <v-text-field v-model="output_framerate" type="number" suffix="frames" hide-details="auto" outlined dense :disabled="blockedsettings.includes('output_framerate')"></v-text-field>
                    </settings-row>
                </template>
                <v-divider class="my-2"></v-divider>
                <settings-row :title="$t('Settings.TimelapseTab.Rotation')" :sub-title="$t('Settings.TimelapseTab.RotationDescription')">
                    <v-text-field v-model="rotation" type="number" hide-details="auto" outlined dense :disabled="blockedsettings.includes('rotation')"></v-text-field>
                </settings-row>
                <v-divider class="my-2"></v-divider>
                <settings-row :title="$t('Settings.TimelapseTab.duplicatelastframe')" :sub-title="$t('Settings.TimelapseTab.duplicatelastframeDescription')">
                    <v-text-field v-model="duplicatelastframe" type="number" hide-details="auto" outlined dense :disabled="blockedsettings.includes('duplicatelastframe')"></v-text-field>
                </settings-row>
                <v-divider class="my-2"></v-divider>
                <settings-row :title="$t('Settings.TimelapseTab.ConstantRateFactor')" :sub-title="$t('Settings.TimelapseTab.ConstantRateFactorDescription')">
                    <v-text-field v-model="constant_rate_factor" type="number" hide-details="auto" outlined dense :disabled="blockedsettings.includes('constant_rate_factor')"></v-text-field>
                </settings-row>
                <v-divider class="my-2"></v-divider>
                <settings-row :title="$t('Settings.TimelapseTab.Pixelformat')" :sub-title="$t('Settings.TimelapseTab.PixelformatDescription')">
                    <v-text-field v-model="pixelformat" type="text" hide-details="auto" outlined dense :disabled="blockedsettings.includes('pixelformat')"></v-text-field>
                </settings-row>
                <v-divider class="my-2"></v-divider>
                <settings-row :title="$t('Settings.TimelapseTab.TimeFormatCode')" :sub-title="$t('Settings.TimelapseTab.TimeFormatCodeDescription')">
                    <v-text-field v-model="time_format_code" type="text" hide-details="auto" outlined dense :disabled="blockedsettings.includes('time_format_code')"></v-text-field>
                </settings-row>
                <v-divider class="my-2"></v-divider>
                <settings-row :title="$t('Settings.TimelapseTab.Extraoutputparams')" :sub-title="$t('Settings.TimelapseTab.ExtraoutputparamsDescription')" >
                    <v-text-field v-model="extraoutputparams" type="text" hide-details="auto" outlined dense :disabled="blockedsettings.includes('extraoutputparams')"></v-text-field>
                </settings-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import { Mixins } from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'
import SettingsRow from '@/components/settings/SettingsRow.vue'
import {caseInsensitiveSort} from '@/plugins/helpers'
import {GuiWebcamStateWebcam} from '@/store/gui/webcams/types'
@Component({
    components: {SettingsRow}
})
export default class SettingsTimelapseTab extends Mixins(BaseMixin) {
    private modeOptions = [
        {
            text: 'layermacro',
            value: 'layermacro'
        },
        {
            text: 'hyperlapse',
            value: 'hyperlapse'
        }
    ]

    private parkposOptions = [
        {
            text: 'center',
            value: 'center'
        },
        {
            text: 'front_left',
            value: 'front_left'
        },
        {
            text: 'front_right',
            value: 'front_right'
        },
        {
            text: 'back_left',
            value: 'back_left'
        },
        {
            text: 'back_right',
            value: 'back_right'
        },
        {
            text: 'custom',
            value: 'custom'
        }
    ]

    get cameraOptions() {
        const webcams = this.$store.getters['gui/webcams/getWebcams']
        const output: any = []

        webcams.filter((webcam: GuiWebcamStateWebcam) => webcam.urlSnapshot !== '').forEach((webcam: GuiWebcamStateWebcam) => {
            output.push({
                text: webcam.name,
                value: webcam.id
            })
        })

        return caseInsensitiveSort(output, 'text')
    }

    get blockedsettings() {
        return this.$store.state.server.timelapse.settings.blockedsettings ?? []
    }

    get enabled() {
        return this.$store.state.server.timelapse.settings.enabled
    }

    set enabled(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { enabled: newVal })
    }

    get mode() {
        return this.$store.state.server.timelapse.settings.mode
    }

    set mode(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { mode: newVal })
    }

    get hyperlapseCycle() {
        return this.$store.state.server.timelapse.settings.hyperlapse_cycle
    }  

    set hyperlapseCycle(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { hyperlapse_cycle: newVal })
    }

    get autorender() {
        return this.$store.state.server.timelapse.settings.autorender
    }

    set autorender(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { autorender: newVal })
    }

    get saveframes() {
        return this.$store.state.server.timelapse.settings.saveframes
    }

    set saveframes(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { saveframes: newVal })
    }

    get previewimage() {
        return this.$store.state.server.timelapse.settings.previewimage
    }

    set previewimage(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { previewimage: newVal })
    }

    get gcode_verbose() {
        return this.$store.state.server.timelapse.settings.gcode_verbose
    }

    set gcode_verbose(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { gcode_verbose: newVal })
    }

    get parkhead() {
        return this.$store.state.server.timelapse.settings.parkhead
    }

    set parkhead(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { parkhead: newVal })
    }

    get parkpos() {
        return this.$store.state.server.timelapse.settings.parkpos
    }

    set parkpos(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { parkpos: newVal })
    }

    get park_custom_pos_x() {
        return this.$store.state.server.timelapse.settings.park_custom_pos_x
    }

    set park_custom_pos_x(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { park_custom_pos_x: newVal })
    }

    get park_custom_pos_y() {
        return this.$store.state.server.timelapse.settings.park_custom_pos_y
    }

    set park_custom_pos_y(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { park_custom_pos_y: newVal })
    }

    get park_custom_pos_dz() {
        return this.$store.state.server.timelapse.settings.park_custom_pos_dz
    }

    set park_custom_pos_dz(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { park_custom_pos_dz: newVal })
    }

    get park_travel_speed() {
        return this.$store.state.server.timelapse.settings.park_travel_speed
    }

    set park_travel_speed(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { park_travel_speed: newVal })
    }

    get park_retract_speed() {
        return this.$store.state.server.timelapse.settings.park_retract_speed
    }

    set park_retract_speed(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { park_retract_speed: newVal })
    }

    get park_extrude_speed() {
        return this.$store.state.server.timelapse.settings.park_extrude_speed
    }

    set park_extrude_speed(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { park_extrude_speed: newVal })
    }

    get park_retract_distance() {
        return this.$store.state.server.timelapse.settings.park_retract_distance
    }

    set park_retract_distance(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { park_retract_distance: newVal })
    }

    get park_extrude_distance() {
        return this.$store.state.server.timelapse.settings.park_extrude_distance
    }

    set park_extrude_distance(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { park_extrude_distance: newVal })
    }

    get constant_rate_factor() {
        return this.$store.state.server.timelapse.settings.constant_rate_factor
    }

    set constant_rate_factor(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { constant_rate_factor: newVal })
    }

    get output_framerate() {
        return this.$store.state.server.timelapse.settings.output_framerate
    }

    set output_framerate(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { output_framerate: newVal })
    }

    get pixelformat() {
        return this.$store.state.server.timelapse.settings.pixelformat
    }

    set pixelformat(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { pixelformat: newVal })
    }

    get extraoutputparams() {
        return this.$store.state.server.timelapse.settings.extraoutputparams
    }

    set extraoutputparams(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { extraoutputparams: newVal })
    }

    get variable_fps() {
        return this.$store.state.server.timelapse.settings.variable_fps
    }

    set variable_fps(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { variable_fps: newVal })
    }

    get targetlength() {
        return this.$store.state.server.timelapse.settings.targetlength
    }

    set targetlength(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { targetlength: newVal })
    }

    get variable_fps_min() {
        return this.$store.state.server.timelapse.settings.variable_fps_min
    }

    set variable_fps_min(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { variable_fps_min: newVal })
    }

    get variable_fps_max() {
        return this.$store.state.server.timelapse.settings.variable_fps_max
    }

    set variable_fps_max(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { variable_fps_max: newVal })
    }

    get rotation() {
        return this.$store.state.server.timelapse.settings.rotation
    }

    set rotation(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { rotation: newVal })
    }

    get duplicatelastframe() {
        return this.$store.state.server.timelapse.settings.duplicatelastframe
    }

    set duplicatelastframe(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { duplicatelastframe: newVal })
    }

    get camera() {
        return this.$store.state.server.timelapse.settings.camera
    }

    set camera(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { camera: newVal })
    }

    get time_format_code() {
        return this.$store.state.server.timelapse.settings.time_format_code
    }

    set time_format_code(newVal) {
        this.$store.dispatch('server/timelapse/saveSetting', { time_format_code: newVal })
    }
}
</script>
