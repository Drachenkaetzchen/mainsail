<style lang="scss" scoped>

</style>

<template>
    <div>
        <template v-for="object in printing_objects">
            <v-row v-bind:key="'div_'+object.name" class="py-3 d-flex" @mouseover="mouseOverObject(object.name)" @mouseleave="mouseOverObject('')">
                <v-col class="py-2 subtitle-2 text--disabled text-truncate">
                    {{ object.name }}
                </v-col>
                <v-col class="col-auto py-2">
                    <v-chip pill small class="text--disabled" v-if="excluded_objects.includes(object.name)">{{ $t('Panels.StatusPanel.ExcludeObject.Excluded') }}</v-chip>
                    <v-icon class="text--disabled cursor-pointer" @click="openExcludeObjectDialog(object.name)" small v-else>mdi-close-circle</v-icon>
                </v-col>
            </v-row>
            <v-divider v-bind:key="'divider_'+object.name" ></v-divider>
        </template>
    </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import {Mixins} from 'vue-property-decorator'
import BaseMixin from '@/components/mixins/base'

@Component
export default class StatusPanelObjectsDialogList extends Mixins(BaseMixin) {
    get printing_objects() {
        return this.$store.state.printer.exclude_object?.objects ?? []
    }

    get current_object() {
        return this.$store.state.printer.exclude_object?.current_object ?? null
    }

    get excluded_objects() {
        return this.$store.state.printer.exclude_object?.excluded_objects ?? []
    }

    openExcludeObjectDialog(name: string) {
        this.$emit('update:name', name)
        this.$emit('update:bool', true)
    }

    mouseOverObject(name: string) {
        this.$emit('update:hoverName', name)
    }
}
</script>