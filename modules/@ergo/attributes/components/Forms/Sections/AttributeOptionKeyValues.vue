/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <FormListSection
        data-cy="attribute-add-options"
        :disabled="disabled"
        add-list-title="ADD OPTION KEY"
        @add="addOptionKey">
        <FormListSubsection>
            <FormListElementField
                v-for="(fieldKey, i) in optionIndexes"
                :key="fieldKey"
                :field-key="fieldKey"
                :disabled="disabled"
                @remove="removeAttribute">
                <FormValidatorField :field-key="`option_${fieldKey}`">
                    <template #validator="{ errorMessages }">
                        <TextField
                            :data-cy="dataCyGenerator(i)"
                            :value="options[fieldKey].key"
                            solid
                            required
                            small
                            :disabled="disabled"
                            label="Option code"
                            :error-messages="errorMessages"
                            @input="value => updateAttributeOptionKey({
                                index: fieldKey,
                                id: options[fieldKey].id,
                                key: value,
                            })" />
                    </template>
                </FormValidatorField>
            </FormListElementField>
        </FormListSubsection>
    </FormListSection>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { getUUID } from '@Core/models/stringWrapper';
import FormValidatorField from '@Core/components/Form/Field/FormValidatorField';
import FormListElementField from '@Core/components/Form/Field/FormListElementField';
import FormListSection from '@Core/components/Form/Section/FormListSection';
import FormListSubsection from '@Core/components/Form/Subsection/FormListSubsection';

export default {
    name: 'AttributeOptionKeyValues',
    components: {
        FormValidatorField,
        FormListElementField,
        FormListSection,
        FormListSubsection,
        TextField: () => import('@Core/components/Inputs/TextField'),
    },
    props: {
        disabled: {
            type: Boolean,
            required: true,
        },
    },
    computed: {
        ...mapState('attribute', {
            options: state => state.options,
        }),
        ...mapState('authentication', {
            userLanguageCode: state => state.user.language,
        }),
        optionIndexes() {
            return Object.keys(this.options);
        },
    },
    methods: {
        ...mapActions('attribute', [
            'addAttributeOptionKey',
            'removeAttributeOptionKey',
            'updateAttributeOptionKey',
        ]),
        ...mapActions('translations', [
            'addMultilingualOptionTranslation',
        ]),
        removeAttribute(fieldKey) {
            this.removeAttributeOptionKey({ index: fieldKey, id: this.options[fieldKey].id });
        },
        addOptionKey() {
            this.addAttributeOptionKey(getUUID());
        },
        dataCyGenerator(key) {
            return `attribute-option-${key}`;
        },
    },
};
</script>
