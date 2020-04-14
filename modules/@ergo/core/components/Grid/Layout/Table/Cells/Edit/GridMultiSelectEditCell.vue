/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <GridActivatorEditCell>
        <TranslationSelect
            :style="{ width: `${width}px`, height: `${height}px` }"
            v-model="localValue"
            :autofocus="true"
            :solid="true"
            :small="true"
            :clearable="true"
            :multiselect="true"
            :options="mappedOptions"
            :error-messages="errorMessages"
            @focus="onFocus" />
    </GridActivatorEditCell>
</template>

<script>
import GridActivatorEditCell from '@Core/components/Grid/Layout/Table/Cells/Edit/GridActivatorEditCell';
import TranslationSelect from '@Core/components/Inputs/Select/TranslationSelect';
import { arraysAreEqual } from '@Core/models/arrayWrapper';

export default {
    name: 'GridMultiSelectEditCell',
    inject: ['setEditingCellCoordinates'],
    components: {
        GridActivatorEditCell,
        TranslationSelect,
    },
    props: {
        value: {
            type: Array,
            default: () => [],
        },
        options: {
            type: Object,
            default: () => ({}),
        },
        languageCode: {
            type: String,
            default: 'EN',
        },
        errorMessages: {
            type: String,
            default: '',
        },
        width: {
            type: Number,
            default: 0,
        },
        height: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            localValue: this.value.map(option => ({
                id: option,
                key: this.options[option].code,
                value: this.options[option].label,
                hint: this.options[option].label
                    ? `#${this.options[option].code} ${this.languageCode}`
                    : '',
            })),
        };
    },
    computed: {
        mappedOptions() {
            const optionKeys = Object.keys(this.options);

            return optionKeys.map(key => ({
                id: key,
                key: this.options[key].code,
                value: this.options[key].label,
                hint: this.options[key].label
                    ? `#${this.options[key].code} ${this.languageCode}`
                    : '',
            }));
        },
    },
    beforeDestroy() {
        const optionIds = this.localValue.map(option => option.id);

        if (!arraysAreEqual(optionIds, this.value.map(option => option.id))) {
            this.$emit('input', optionIds);
        }
    },
    methods: {
        onFocus(isFocused) {
            if (!isFocused) {
                this.setEditingCellCoordinates();
            }
        },
    },
};
</script>