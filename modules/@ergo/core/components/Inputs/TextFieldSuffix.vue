/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template functional>
    <span
        class="suffix"
        v-text="props.suffix" />
</template>

<script>
export default {
    name: 'TextFieldSuffix',
    props: {
        suffix: {
            type: String,
            default: '',
        },
    },
};
</script>

<style lang="scss" scoped>
    .suffix {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        color: $GRAPHITE_DARK;
        font: $FONT_MEDIUM_14_20;
        margin-right: 4px;
        white-space: nowrap;
    }
</style>
