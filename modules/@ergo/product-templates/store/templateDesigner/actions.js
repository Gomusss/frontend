/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
import {
    getMappedLayoutElements,
    getMappedLayoutElement,
    getMappedLayoutSectionElement,
} from '@Templates/models/templateMapper';
import { SYSTEM_TYPES } from '@Attributes/defaults/attributes';
import { SKU_MODEL_ID } from '@Templates/defaults/product';
import { types } from './mutations';

export default {
    getTemplateByID(
        {
            commit, dispatch, state, rootState,
        },
        { path },
    ) {
        return this.app.$axios.$get(path).then(({
            name,
            image_id: imageID,
            default_label: defaultLabel,
            default_image: defaultImage,
            elements,
        }) => {
            const { language: languageCode } = rootState.authentication.user;
            // TODO: BE has no filter via ID's - we gonna wait for them
            // const attributesId = elements.map(el => el.properties.attribute_id);
            const params = {
                // filter: `id=${attributesId.join(',')}`,
                view: 'list',
            };

            commit(types.SET_DEFAULT_TEXT_ATTRIBUTE, defaultLabel || SKU_MODEL_ID);
            commit(types.SET_DEFAULT_IMAGE_ATTRIBUTE, defaultImage);

            return Promise.all([
                this.app.$axios.$get(`${languageCode}/attributes`, { params }).then(({ collection }) => {
                    const elementsDescription = collection.map(
                        ({ id, code, label }) => ({ id, code, label }),
                    );
                    const layoutElements = getMappedLayoutElements(
                        elements,
                        elementsDescription,
                        state.types,
                    );

                    for (let i = layoutElements.length - 1; i > -1; i -= 1) {
                        const { id } = layoutElements[i];
                        dispatch('list/setDisabledElement', { languageCode, elementId: id, disabled: true }, { root: true });
                    }

                    commit(types.INITIALIZE_LAYOUT_ELEMENTS, layoutElements);
                    commit(types.SET_TEMPLATE_DESIGNER_TITLE, name);
                    commit(types.SET_TEMPLATE_DESIGNER_IMAGE, imageID);
                }),
            ]);
        });
    },
    async updateTemplateDesigner(
        { rootState },
        {
            id,
            data,
            onSuccess,
            onError,
        },
    ) {
        const { language: userLanguageCode } = rootState.authentication.user;

        await this.$setLoader('footerButton');
        await this.app.$axios.$put(`${userLanguageCode}/templates/${id}`, data).then(() => onSuccess()).catch(e => onError(e.data));
        await this.$removeLoader('footerButton');
    },
    getTypes({ commit }, {
        path,
    }) {
        return this.app.$axios.$get(path).then(({ collection }) => {
            commit(types.SET_TYPES, collection);
        });
    },
    addListElementToLayout({
        commit, dispatch, rootState, state,
    }, position) {
        const { draggedElement } = rootState.draggable;
        const [value, languageCode] = draggedElement.split(':');
        const params = {
            limit: 1,
            offset: 0,
            filter: `code=${value}`,
            field: 'code',
            order: 'ASC',
        };
        this.app.$axios.$get(`${languageCode}/attributes`, { params }).then(({ collection }) => {
            const [element] = collection;

            const layoutElement = getMappedLayoutElement(
                element.id,
                state.types.find(attributeType => attributeType.type === element.type),
                element.label || element.code,
                position,
            );

            dispatch('list/setDisabledElement', { languageCode, elementId: element.id, disabled: true }, { root: true });
            commit(types.ADD_ELEMENT_TO_LAYOUT, layoutElement);
        });
    },
    addSectionElementToLayout: ({
        commit, state,
    }, { row, column, title }) => {
        const layoutElement = getMappedLayoutSectionElement(
            title,
            state.types.find(attributeType => attributeType.type === SYSTEM_TYPES.SECTION),
            { row, column },
        );

        commit(types.ADD_ELEMENT_TO_LAYOUT, layoutElement);
    },
    updateLayoutElementBounds: ({ commit }, bounds) => {
        commit(types.UPDATE_LAYOUT_ELEMENT_BOUNDS, bounds);
    },
    updateLayoutElementPosition: ({ commit }, position) => {
        commit(types.UPDATE_LAYOUT_ELEMENT_POSITION, position);
    },
    updateSectionElementTitle: ({ commit }, title) => {
        commit(types.UPDATE_SECTION_ELEMENT_TITLE, title);
    },
    removeLayoutElementAtIndex: ({
        commit, dispatch, state, rootState,
    }, index) => {
        const { layoutElements } = state;
        const { user } = rootState.authentication;
        dispatch('list/removeDisabledElement', { languageCode: user.language, elementId: layoutElements[index].id }, { root: true });
        commit(types.REMOVE_LAYOUT_ELEMENT_AT_INDEX, index);
    },
    setTitle: ({ commit }, title) => {
        commit(types.SET_TEMPLATE_DESIGNER_TITLE, title);
    },
    setImage: ({ commit }, image) => {
        commit(types.SET_TEMPLATE_DESIGNER_IMAGE, image);
    },
    setDefaultTextAttribute: ({ commit }, defaultTextAttribute) => {
        commit(types.SET_DEFAULT_TEXT_ATTRIBUTE, defaultTextAttribute);
    },
    setDefaultImageAttribute: ({ commit }, defaultImageAttribute) => {
        commit(types.SET_DEFAULT_IMAGE_ATTRIBUTE, defaultImageAttribute);
    },
    setLayoutElementRequirement: ({ commit }, payload) => {
        commit(types.SET_LAYOUT_ELEMENT_REQUIREMENT, payload);
    },
    removeTemplate({ rootState }, { id, onSuccess }) {
        const { language: userLanguageCode } = rootState.authentication.user;
        return this.app.$axios.$delete(`${userLanguageCode}/templates/${id}`).then(() => onSuccess());
    },
    clearStorage: ({ commit }) => commit(types.CLEAR_STATE),
};
