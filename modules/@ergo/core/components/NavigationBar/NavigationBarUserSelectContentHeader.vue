/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <div class="header">
        <UserAvatar
            :image-id="avatarId"
            :name="initials"
            :avatar-size="64" />
        <span
            class="header__initials"
            v-text="initials" />
        <span
            class="header__email"
            v-text="email" />
    </div>
</template>

<script>
import { GRAPHITE } from '@Core/assets/scss/_js-variables/colors.scss';

export default {
    name: 'NavigationBarUserSelectContentHeader',
    components: {
        UserAvatar: () => import('@Core/components/Multimedia/UserAvatar'),
    },
    props: {
        initials: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        avatarId: {
            type: String,
            default: '',
        },
    },
    computed: {
        graphiteColor() {
            return GRAPHITE;
        },
    },
};
</script>

<style lang="scss" scoped>
    .header {
        display: grid;
        grid-template-columns: 72px auto;
        grid-column-gap: 24px;
        align-items: center;
        margin: 24px;

        &__initials, &__email {
            grid-column: 2;
            text-align: left;
        }

        &__initials {
            grid-row: 1;
            align-self: flex-end;
            color: $GRAPHITE_DARK;
            letter-spacing: 0.1px;
            font: $FONT_MEDIUM_16_24;
        }

        &__email {
            grid-row: 2;
            align-self: flex-start;
            color: $GREY_DARK;
            font: $FONT_MEDIUM_12_16;
        }

        .user-avatar {
            grid-row: 1 / 3;
        }
    }
</style>
