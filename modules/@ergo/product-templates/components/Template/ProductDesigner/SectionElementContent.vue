/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <ElementContentBase
        :disabled="disabled"
        @mouseover.native="onMouseOver"
        @mouseout.native="onMouseOut">
        <div class="element-content__icon">
            <IconFontSize />
        </div>
        <div class="vertical-wrapper">
            <span
                class="element-content__header"
                v-text="element.type" />
            <span
                class="element-content__subheader"
                v-text="element.label" />
        </div>
        <div
            v-if="!disabled"
            :class="['element-content__contextual-menu', contextualMenuHoveStateClasses]">
            <ActionIconButton
                :theme="secondaryTheme"
                :size="tinySize"
                :options="contextualMenuItems"
                @input="onSelectValue"
                @focus="onSelectFocus">
                <template #icon="{ color }">
                    <IconDots :fill-color="color" />
                </template>
            </ActionIconButton>
        </div>
    </ElementContentBase>
</template>

<script>
import { mapActions } from 'vuex';
import { SIZE, THEME } from '@Core/defaults/theme';
import ElementContentBase from '@Templates/components/Template/ProductDesigner/ElementContentBase';
import IconFontSize from '@Core/components/Icons/Editor/IconFontSize';
import ActionIconButton from '@Core/components/Buttons/ActionIconButton';
import IconDots from '@Core/components/Icons/Others/IconDots';

export default {
    name: 'SectionElementContent',
    components: {
        IconFontSize,
        ActionIconButton,
        IconDots,
        ElementContentBase,
    },
    props: {
        index: {
            type: Number,
            required: true,
        },
        disabled: {
            type: Boolean,
            required: true,
        },
        element: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            isContextualMenuActive: false,
            contextualMenuItems: ['Edit title', 'Remove'],
            isHovered: false,
        };
    },
    computed: {
        tinySize() {
            return SIZE.TINY;
        },
        secondaryTheme() {
            return THEME.SECONDARY;
        },
        contextualMenuHoveStateClasses() {
            return { 'element-content__contextual-menu--hovered': this.isHovered };
        },
    },
    methods: {
        ...mapActions('templateDesigner', [
            'removeLayoutElementAtIndex',
        ]),
        onSelectFocus(isFocused) {
            if (!isFocused) this.isHovered = false;

            this.isContextualMenuActive = isFocused;
        },
        onSelectValue(value) {
            switch (value) {
            case 'Remove':
                this.removeLayoutElementAtIndex(this.index);
                break;
            case 'Edit title':
                this.$emit('editTitle', this.index);
                break;
            default: break;
            }
        },
        onMouseOver() {
            if (!this.isHovered) this.isHovered = true;
        },
        onMouseOut() {
            if (!this.isContextualMenuActive) this.isHovered = false;
        },
    },
};
</script>

<style lang="scss" scoped>
    .element-content {
        .vertical-wrapper {
            display: flex;
            flex: 1;
            flex-direction: column;
            padding: 6px 8px;
        }

        &__icon {
            display: flex;
            padding-top: 10px;
        }

        &__header {
            letter-spacing: 0.5px;
            color: $GRAPHITE_LIGHT;
            font: $FONT_SEMI_BOLD_12_16;
        }

        &__subheader {
            height: 20px;
            color: $GRAPHITE_DARK;
            font: $FONT_MEDIUM_14_20;
        }

        &__header, &__subheader {
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
        }

        &__contextual-menu {
            flex: 0;
            align-items: flex-start;
            padding: 12px 0;
            opacity: 0;

            &--hovered {
                opacity: 1;
            }
        }
    }
</style>
