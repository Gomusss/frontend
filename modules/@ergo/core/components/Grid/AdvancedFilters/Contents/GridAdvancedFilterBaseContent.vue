/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <div class="filter-content">
        <GridAdvancedFilterShowOnly
            :value="isEmptyRecord"
            @input="onValueChange" />
        <Divider />
        <slot v-if="!isEmptyRecord" />
    </div>
</template>

<script>
import GridAdvancedFilterShowOnly from '@Core/components/Grid/AdvancedFilters/GridAdvancedFilterShowOnly';
import Divider from '@Core/components/Dividers/Divider';

export default {
    name: 'GridAdvancedFilterBaseContent',
    components: {
        GridAdvancedFilterShowOnly,
        Divider,
    },
    props: {
        isEmptyRecord: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        onValueChange() {
            this.$emit('input', !this.isEmptyRecord);
        },
    },
};
</script>

<style lang="scss" scoped>
    .filter-content {
        display: flex;
        flex-direction: column;
        overflow: auto;
    }
</style>
